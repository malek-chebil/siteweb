# Frontend - Classifieds Platform

React frontend for the classifieds web platform.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```bash
cp .env.example .env
```

3. Update `.env` with your Supabase and API credentials.

4. Start development server:
```bash
npm run dev
```

## Build

```bash
npm run build
```

## Preview Production Build

```bash
npm run preview
```

## Environment Variables

- `VITE_SUPABASE_URL` - Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Supabase anonymous key
- `VITE_API_URL` - Backend API URL

## Features

- User authentication (Supabase Auth)
- Listing management (CRUD)
- Image upload (Supabase Storage)
- Search and filters
- Multi-language support (French, Arabic)
- Admin panel
- Responsive design

