import { useState, useEffect } from 'react'
import { Group, Image, Text, Stack, ActionIcon, Paper, Loader, Center, SimpleGrid, Alert, FileInput } from '@mantine/core'
import { Dropzone, IMAGE_MIME_TYPE } from '@mantine/dropzone'
import { supabase } from '../lib/supabase.js'
import { useTranslation } from 'react-i18next'
import { showNotification } from '@mantine/notifications'
import { IconPhoto, IconX, IconUpload, IconAlertCircle } from '@tabler/icons-react'
import { useAuth } from '../context/AuthContext'

const ImageUploader = ({ value = [], onChange, maxImages = 10 }) => {
  const [uploading, setUploading] = useState(false)
  const [uploadingFiles, setUploadingFiles] = useState([])
  const [error, setError] = useState(null)
  const { t } = useTranslation()
  const { user, loading: authLoading } = useAuth()

  // Clean up preview URLs when component unmounts or value changes
  useEffect(() => {
    return () => {
      uploadingFiles.forEach(file => {
        if (file.preview) {
          URL.revokeObjectURL(file.preview)
        }
      })
    }
  }, [uploadingFiles])

  const normaliseFiles = (input) => {
    if (!input) return []
    if (Array.isArray(input)) return input
    if (input instanceof FileList) return Array.from(input)
    if (input instanceof File) return [input]
    return []
  }

  const handleUpload = async (filesFromEvent) => {
    const fileArray = normaliseFiles(filesFromEvent)
    if (!fileArray.length) {
      console.warn('handleUpload called with no files', filesFromEvent)
      return
    }

    console.log('Files received for upload:', fileArray)
    setError(null)
    
    if (authLoading) {
      const message = 'Chargement de la session... veuillez patienter une seconde et réessayer.'
      setError(message)
      showNotification({
        title: t('error'),
        message,
        color: 'yellow',
      })
      return
    }
    
    // Check if user is authenticated
    if (!user) {
      const errorMsg = 'Vous devez être connecté pour uploader des images. Veuillez vous connecter.'
      setError(errorMsg)
      showNotification({
        title: t('error'),
        message: errorMsg,
        color: 'red',
      })
      return
    }
    
    // Check total images
    if (value.length + fileArray.length > maxImages) {
      const errorMsg = `Maximum ${maxImages} images autorisées. Vous avez ${value.length} image(s) et vous essayez d'ajouter ${fileArray.length} de plus.`
      setError(errorMsg)
      showNotification({
        title: t('error'),
        message: errorMsg,
        color: 'red',
      })
      return
    }

    setUploading(true)
    
    // Create preview URLs for immediate display
    const filesWithPreview = fileArray.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      uploaded: false,
    }))
    
    setUploadingFiles(filesWithPreview)
    const uploadedUrls = []

    try {
      // Upload all files
      for (let i = 0; i < filesWithPreview.length; i++) {
        const { file } = filesWithPreview[i]
        
        // Validate file size
        if (file.size > 5 * 1024 * 1024) {
          throw new Error(`L'image "${file.name}" est trop grande (max 5MB)`)
        }
        
        // Generate unique filename with user ID for organization
        // Path is relative to bucket (listing-images), so don't include bucket name
        const fileExt = file.name.split('.').pop()
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}_${i}.${fileExt}`
        const filePath = `${user.id}/${fileName}`

        console.log('Uploading file:', filePath, 'Size:', file.size)

        // Upload to Supabase Storage
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('listing-images')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false,
          })

        if (uploadError) {
          console.error('Upload error details:', uploadError)
          
          // Provide helpful error messages
          let errorMessage = 'Échec de l\'upload de l\'image'
          if (uploadError.message.includes('The resource already exists')) {
            errorMessage = 'Cette image existe déjà. Veuillez réessayer.'
          } else if (uploadError.message.includes('new row violates row-level security policy')) {
            errorMessage = 'Permissions insuffisantes. Vérifiez les politiques de stockage Supabase.'
          } else if (uploadError.message.includes('Bucket not found')) {
            errorMessage = 'Le bucket "listing-images" n\'existe pas. Créez-le dans Supabase Storage.'
          } else {
            errorMessage = uploadError.message || errorMessage
          }
          
          throw new Error(errorMessage)
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('listing-images')
          .getPublicUrl(filePath)

        console.log('Upload successful, public URL:', publicUrl)
        uploadedUrls.push(publicUrl)
        
        // Update uploading files state to mark as uploaded
        setUploadingFiles(prev => prev.map((f, idx) => 
          idx === i ? { ...f, uploaded: true, url: publicUrl } : f
        ))
      }

      // Update form with all uploaded URLs at once
      onChange([...value, ...uploadedUrls])
      
      // Clear uploading files after a short delay to show success
      setTimeout(() => {
        filesWithPreview.forEach(f => {
          if (f.preview) {
            URL.revokeObjectURL(f.preview)
          }
        })
        setUploadingFiles([])
      }, 500)

      showNotification({
        title: t('success'),
        message: `${fileArray.length} image(s) uploadée(s) avec succès`,
        color: 'green',
      })
    } catch (error) {
      console.error('Upload error:', error)
      setError(error.message)
      
      // Clean up preview URLs on error
      filesWithPreview.forEach(f => {
        if (f.preview) {
          URL.revokeObjectURL(f.preview)
        }
      })
      setUploadingFiles([])
      
      showNotification({
        title: t('error'),
        message: error.message || 'Échec de l\'upload des images. Vérifiez votre connexion et réessayez.',
        color: 'red',
      })
    } finally {
      setUploading(false)
    }
  }

  const removeImage = (index) => {
    const newImages = value.filter((_, i) => i !== index)
    onChange(newImages)
  }

  const allImages = [
    ...value.map((url, idx) => ({ url, index: idx, uploaded: true })),
    ...uploadingFiles.map((f, idx) => ({ 
      url: f.uploaded ? f.url : f.preview, 
      index: value.length + idx, 
      uploaded: f.uploaded,
      uploading: !f.uploaded 
    }))
  ]

  return (
    <Stack gap="md">
      {error && (
        <Alert
          icon={<IconAlertCircle size={16} />}
          title="Erreur"
          color="red"
          onClose={() => setError(null)}
          withCloseButton
        >
          {error}
        </Alert>
      )}
      
      {!user && (
        <Alert
          icon={<IconAlertCircle size={16} />}
          title="Authentification requise"
          color="yellow"
        >
          Vous devez être connecté pour uploader des images.
        </Alert>
      )}
      
      <Dropzone
        onDrop={handleUpload}
        onReject={(fileRejections) => {
          console.warn('Files rejected:', fileRejections)
          setError('Certains fichiers ont été rejetés. Vérifiez la taille ou le type.')
        }}
        accept={IMAGE_MIME_TYPE}
        maxSize={5 * 1024 * 1024}
        loading={uploading}
        disabled={value.length >= maxImages || !user || authLoading}
        multiple
        radius="md"
        activateOnClick
      >
        <Group justify="center" gap="xl" style={{ minHeight: 100, pointerEvents: 'none' }}>
          <Dropzone.Accept>
            <IconUpload
              size={48}
              stroke={1.5}
              style={{ color: 'var(--mantine-color-blue-6)' }}
            />
          </Dropzone.Accept>
          <Dropzone.Reject>
            <IconX
              size={48}
              stroke={1.5}
              style={{ color: 'var(--mantine-color-red-6)' }}
            />
          </Dropzone.Reject>
          <Dropzone.Idle>
            <IconPhoto
              size={48}
              stroke={1.5}
              style={{ color: 'var(--mantine-color-dimmed)' }}
            />
          </Dropzone.Idle>

          <div style={{ textAlign: 'center' }}>
            <Text size="lg" fw={500}>
              {uploading ? 'Upload en cours...' : value.length > 0 ? 'Ajouter plus d\'images' : 'Glissez les images ici ou cliquez pour sélectionner'}
            </Text>
            <Text size="sm" c="dimmed" mt={5}>
              {value.length}/{maxImages} images • Max 5MB par image
            </Text>
            {value.length >= maxImages && (
              <Text size="sm" c="red" mt={5}>
                Limite atteinte
              </Text>
            )}
          </div>
        </Group>
      </Dropzone>

      <FileInput
        label="Sélectionner des images"
        placeholder="cliquer pour sélectionner des fichiers"
        accept="image/*"
        multiple
        disabled={value.length >= maxImages || !user || authLoading}
        onChange={(files) => {
          console.log('FileInput selected files:', files)
          handleUpload(files)
        }}
      />

      {allImages.length > 0 && (
        <Paper p="md" radius="md" withBorder style={{ backgroundColor: '#f8f9fa' }}>
          <Text size="sm" fw={500} mb="md">
            Images ({value.length} uploadée{value.length > 1 ? 's' : ''})
          </Text>
          <SimpleGrid
            cols={{ base: 2, sm: 3, md: 4, lg: 5 }}
            spacing="md"
          >
            {allImages.map((item, idx) => (
              <Paper
                key={`img-${item.index}`}
                p="xs"
                radius="md"
                withBorder
                style={{
                  position: 'relative',
                  backgroundColor: '#fff',
                  aspectRatio: '1',
                  overflow: 'hidden',
                  border: item.uploaded ? '2px solid #4caf50' : '2px solid #ffc300',
                }}
              >
                <Image
                  src={item.url}
                  alt={`Image ${idx + 1}`}
                  fit="cover"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                  onError={(e) => {
                    console.error('Image load error:', item.url)
                  }}
                />
                {item.uploading && (
                  <Center
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundColor: 'rgba(0, 0, 0, 0.6)',
                      zIndex: 5,
                    }}
                  >
                    <Loader color="white" size="md" />
                  </Center>
                )}
                {item.uploaded && (
                  <ActionIcon
                    size="lg"
                    color="red"
                    variant="filled"
                    radius="xl"
                    style={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      zIndex: 10,
                      boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                    }}
                    onClick={() => removeImage(item.index)}
                    title="Supprimer l'image"
                  >
                    <IconX size={18} />
                  </ActionIcon>
                )}
              </Paper>
            ))}
          </SimpleGrid>
        </Paper>
      )}
    </Stack>
  )
}

export default ImageUploader

