# Mantine v7 Compatibility Fixes

## Issue
The frontend was using Mantine v6 APIs which are not compatible with Mantine v7:
- `Header` and `Navbar` components are no longer exported directly
- `position` prop in `Group` is now `justify`
- `weight` prop in `Text` is now `fw`

## Fixes Applied

### 1. Layout Components
- **Layout.jsx**: Changed from `<Header>` to `<AppShell.Header>`
- **AdminLayout.jsx**: Changed from `<Header>` and `<Navbar>` to `<AppShell.Header>` and `<AppShell.Navbar>`

### 2. Group Components
Changed `position` prop to `justify`:
- `position="apart"` → `justify="space-between"`
- `position="center"` → `justify="center"`

### 3. Text Components
Changed `weight` prop to `fw`:
- `weight={700}` → `fw={700}`
- `weight={500}` → `fw={500}`

## Files Updated
1. `frontend/src/layouts/Layout.jsx`
2. `frontend/src/layouts/AdminLayout.jsx`
3. `frontend/src/pages/ListingDetailPage.jsx`
4. `frontend/src/pages/MyListingsPage.jsx`
5. `frontend/src/pages/AdminDashboard.jsx`
6. `frontend/src/components/ListingCard.jsx`
7. `frontend/src/components/ImageUploader.jsx`
8. `frontend/src/pages/ListingEditorPage.jsx`
9. `frontend/src/pages/AdminModerationPage.jsx`

## Testing
After applying these fixes:
1. Restart the frontend server
2. Clear browser cache (Ctrl+Shift+R)
3. Verify the page loads without errors
4. Check that all components render correctly

## Mantine v7 Migration Guide
For more information on migrating to Mantine v7, see:
https://mantine.dev/changelog/7-0-0/


