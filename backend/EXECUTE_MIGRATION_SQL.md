# Exécuter la Migration SQL Manuellement

Le pooler Supabase a atteint sa limite de connexions. Vous pouvez exécuter la migration directement via SQL.

## Option 1 : Via Supabase SQL Editor (Recommandé)

1. Allez sur votre **Supabase Dashboard**
2. Cliquez sur **SQL Editor** dans le menu de gauche
3. Ouvrez le fichier `migration_009_listing_type.sql` dans ce dossier
4. Copiez tout le contenu du fichier
5. Collez-le dans l'éditeur SQL de Supabase
6. Cliquez sur **Run** ou appuyez sur `Ctrl+Enter`

## Option 2 : Attendre et réessayer avec Alembic

Le pooler se libère automatiquement. Attendez 5-10 minutes et réessayez :

```powershell
# Dans le dossier backend, avec l'environnement virtuel activé
.\venv\Scripts\Activate.ps1
alembic upgrade head
```

## Option 3 : Utiliser la connexion directe

Modifiez temporairement votre `DATABASE_URL` dans `.env` :
- Remplacez `pooler.supabase.com` par `db.VOTRE_PROJECT_REF.supabase.co`
- Exécutez la migration
- Remettez l'URL du pooler

## Vérification

Après avoir exécuté la migration, vérifiez que la colonne existe :

```sql
SELECT column_name, data_type, column_default
FROM information_schema.columns 
WHERE table_name = 'listings' 
AND column_name = 'listing_type';
```

Vous devriez voir :
- `column_name`: listing_type
- `data_type`: USER-DEFINED (listingtype)
- `column_default`: 'personal'::listingtype

