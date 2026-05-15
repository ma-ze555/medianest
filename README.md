# MediaNest

Your personal media diary — track anime, movies, series, music, and novels all in one place.

## Tech Stack

- **Frontend:** React + Vite + Tailwind CSS + Zustand
- **Backend:** Node.js + Express
- **Database:** MongoDB (via Mongoose)
- **Auth:** JWT

## Project Structure

```
medianest/
├── backend/        # Express API
│   ├── config/     # DB connection
│   ├── controllers/
│   ├── middleware/ # JWT auth
│   ├── models/     # Mongoose schemas
│   ├── routes/
│   └── server.js
└── frontend/       # React app
    └── src/
        ├── api/    # Axios instance
        ├── components/
        ├── pages/
        └── store/  # Zustand state
```

## Setup

### 1. Backend

```bash
cd backend
npm install
```

Create a `.env` file (already created — fill in your values):
```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=any_random_secret_string
TMDB_API_KEY=your_tmdb_api_key
```

Run the backend:
```bash
npm run dev
```

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

## API Keys needed

| Service | Purpose | Free? |
|---------|---------|-------|
| [MongoDB Atlas](https://cloud.mongodb.com) | Database | Yes |
| [TMDB](https://www.themoviedb.org/settings/api) | Movies & Series search | Yes |
| Jikan API | Anime search | Yes (no key needed) |
| Google Books API | Novel search | Yes (no key needed) |
