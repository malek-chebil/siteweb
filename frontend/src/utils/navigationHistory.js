/**
 * Utilitaires pour gérer l'historique de navigation (annonces consultées)
 */
import { setCookieJSON, getCookieJSON } from './cookies'

const MAX_HISTORY_ITEMS = 10
const COOKIE_NAME = 'recent_views'
const COOKIE_EXPIRY_DAYS = 7 // 7 jours

/**
 * Ajouter une annonce à l'historique de navigation
 * @param {number} listingId - ID de l'annonce
 * @param {object} listingData - Données de l'annonce (optionnel, pour éviter les requêtes)
 */
export function addToHistory(listingId, listingData = null) {
  try {
    const history = getHistory()
    
    // Retirer l'annonce si elle existe déjà (pour la remettre au début)
    const filteredHistory = history.filter(item => item.id !== listingId)
    
    // Ajouter au début avec timestamp
    const newItem = {
      id: listingId,
      viewedAt: new Date().toISOString(),
      ...(listingData && { title: listingData.title, image: listingData.media?.[0]?.url })
    }
    
    const updatedHistory = [newItem, ...filteredHistory].slice(0, MAX_HISTORY_ITEMS)
    
    setCookieJSON(COOKIE_NAME, updatedHistory, COOKIE_EXPIRY_DAYS)
    
    return updatedHistory
  } catch (error) {
    console.error('Error adding to history:', error)
    return []
  }
}

/**
 * Obtenir l'historique de navigation
 * @returns {array} - Liste des annonces récemment consultées
 */
export function getHistory() {
  try {
    const history = getCookieJSON(COOKIE_NAME) || []
    // Filtrer les entrées expirées (plus de 7 jours)
    const now = new Date()
    return history.filter(item => {
      const viewedAt = new Date(item.viewedAt)
      const daysDiff = (now - viewedAt) / (1000 * 60 * 60 * 24)
      return daysDiff <= COOKIE_EXPIRY_DAYS
    })
  } catch (error) {
    console.error('Error getting history:', error)
    return []
  }
}

/**
 * Vérifier si une annonce est dans l'historique
 * @param {number} listingId - ID de l'annonce
 * @returns {boolean}
 */
export function isInHistory(listingId) {
  const history = getHistory()
  return history.some(item => item.id === listingId)
}

/**
 * Supprimer une annonce de l'historique
 * @param {number} listingId - ID de l'annonce
 */
export function removeFromHistory(listingId) {
  try {
    const history = getHistory()
    const updatedHistory = history.filter(item => item.id !== listingId)
    setCookieJSON(COOKIE_NAME, updatedHistory, COOKIE_EXPIRY_DAYS)
  } catch (error) {
    console.error('Error removing from history:', error)
  }
}

/**
 * Vider l'historique
 */
export function clearHistory() {
  try {
    setCookieJSON(COOKIE_NAME, [], COOKIE_EXPIRY_DAYS)
  } catch (error) {
    console.error('Error clearing history:', error)
  }
}

/**
 * Obtenir le nombre d'annonces dans l'historique
 * @returns {number}
 */
export function getHistoryCount() {
  return getHistory().length
}


