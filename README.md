# Gallop Ratings App

This repository now contains:

1. A **React Native + Expo + TypeScript** ratings app (feature-first architecture),
2. NativeWind/Tailwind styling system,
3. Existing Python ratings module (retained for compatibility and tests).

## React Native App (Expo)

### Tech stack
- Expo + React Native + TypeScript
- NativeWind + TailwindCSS
- React Navigation
- React Query data layer
- Jest + React Native Testing Library

### Run
```bash
npm install
npm run start
```

### Validate
```bash
npm run typecheck
npm test
```

### Build static web bundle (for Vercel)
```bash
npm run build:web
```
Output is generated in `dist/`.

Vercel is configured via `vercel.json` to:
- run `npm run build:web`
- publish `dist/`

If Vercel serves raw `index.js` source, it usually means the project was deployed without the web export build step/output directory.

### Optional Supabase configuration
If these env vars are set, the app uses Supabase repository; otherwise it falls back to in-memory repository:
- `EXPO_PUBLIC_SUPABASE_URL`
- `EXPO_PUBLIC_SUPABASE_ANON_KEY`

## Python Ratings Module

The previous Python ratings engine remains available under `ratings/`.

Run tests:
```bash
python3 -m pytest
```

Additional docs:
- `docs/RATINGS.md`
