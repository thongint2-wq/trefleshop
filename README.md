# Trefle Plant Shop

A plant shop project powered by the Trefle API.

## Features

- Search for plants by name
- Browse recommended flowers and care information
- View plant details
- Sort plant names from A to Z
- Add plants to favorites
- Remove plants from favorites

## Plant API

- `GET /api/plants/search?q=rose` searches Trefle for plants.
- `GET /api/plants/recommendations` returns recommended flowers, ranked by the completeness of their care information.
- `GET /api/plants/:id` retrieves plant details by ID or slug.
- `GET /api/favorites` returns the favorites list.
- `POST /api/favorites` adds a plant to favorites using a JSON request body.
- `GET /api/favorites/:slug` checks whether a plant is in favorites.
- `DELETE /api/favorites/:slug` removes a plant from favorites.
- Recommended flowers are cached for 30 minutes. Favorites are stored in memory and cleared when the server restarts.

## API Configuration

- Set `TREFLE_TOKEN` in a `.env` file before starting the server locally.
- When deploying to Vercel, add `TREFLE_TOKEN` under Project Settings > Environment Variables, then redeploy.
- If a plant search fails, the website displays the server message to help diagnose the issue.

## Development

- Run `npm run dev` to start the Vite frontend and Express API server.
- Run `npm run build` to create the production frontend in `dist`.
- Run `npm start` to serve the production build and API from Express.

## Frontend Structure

```text
src/
  components/   Shared React UI components (cards, sections, navigation, feedback)
  pages/        Home, favorites, history, and plant-detail page components
  services/     Frontend API client and Express API services
  utils/        Plant sorting, browser storage, and care-data helpers
  routes/       Express API routes
  main.jsx      React application entry point and route definitions
  styles.css    Shared application styles
```

All interactive frontend pages are rendered by React. The root `index.html` only
provides the mount point for the React application.

## DSA

- Insertion Sort
- Hash Table

## Technologies

- Node.js
- Express
- Trefle API
- React
- Vite
- HTML
- CSS
- JavaScript