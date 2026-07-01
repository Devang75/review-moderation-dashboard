# Review Moderation Dashboard (RMD)

A MERN stack application for moderating product reviews with automated risk scoring and flagging.

## Prerequisites

- **Node.js** >= 18
- **MongoDB** running locally on default port (27017) or a remote URI
- **npm** or **yarn**

## Project Structure

```
RMD/
├── backend/          # Express + Mongoose API
│   ├── src/
│   │   ├── config/       # Swagger, DB config
│   │   ├── controllers/  # Route handlers
│   │   ├── middlewares/   # Validation, error handling
│   │   ├── models/       # Mongoose schemas
│   │   ├── routes/       # Express routers
│   │   ├── services/     # Business logic, risk scoring
│   │   ├── utils/        # ApiResponse, ApiError, asyncHandler
│   │   ├── validations/  # Zod schemas
│   │   ├── app.ts        # Express app setup
│   │   └── index.ts      # Server entry point
│   ├── .env
│   └── package.json
└── frontend/         # React + Vite + Redux Toolkit
    ├── src/
    │   ├── components/   # ReviewCard, modals, pagination, etc.
    │   ├── services/     # Axios API client
    │   ├── store/        # Redux slices
    │   ├── validations/  # Yup schemas
    │   ├── types.ts      # Shared TypeScript interfaces
    │   └── App.tsx       # Root component
    ├── .env
    └── package.json
```

## Backend Setup

```bash
cd backend
npm install
```

Create `backend/.env` (or copy from `.env.example`):

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/rmd
CORS_ORIGIN=http://localhost:5173
NODE_ENV=development
```

Start the development server:

```bash
npm run dev
```

The API will be available at `http://localhost:5000/api`.  
Swagger docs at `http://localhost:5000/api-docs`.

### Backend Scripts

| Command           | Description                  |
| ----------------- | ---------------------------- |
| `npm run dev`     | Start with hot reload (tsx)  |
| `npm run build`   | Compile TypeScript           |
| `npm start`       | Run compiled JS              |
| `npm run typecheck` | TypeScript type checking  |

## Frontend Setup

```bash
cd frontend
npm install
```

Create `frontend/.env` (or copy from `.env.example`):

```env
VITE_API_URL=http://localhost:5000/api
VITE_DEV=true
```

Start the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

### Frontend Scripts

| Command          | Description                |
| ---------------- | -------------------------- |
| `npm run dev`    | Start Vite dev server      |
| `npm run build`  | Production build           |
| `npm run preview`| Preview production build   |
| `npm run lint`   | Run ESLint                 |

## API Endpoints

| Method | Path                      | Description                      |
| ------ | ------------------------- | -------------------------------- |
| GET    | `/api/reviews`            | List reviews (paginated)         |
| POST   | `/api/reviews`            | Create a review                  |
| GET    | `/api/reviews/flagged`    | Get flagged reviews by risk score|
| GET    | `/api/reviews/:id`        | Get a single review              |
| PUT    | `/api/reviews/:id`        | Update a review                  |
| DELETE | `/api/reviews/:id`        | Delete a review                  |
| POST   | `/api/reviews/:id/approve`| Approve a pending review         |
| POST   | `/api/reviews/:id/reject` | Reject a review with reason      |

### Query Parameters

- **`GET /api/reviews`** — `?page=1&limit=10`
- **`GET /api/reviews/flagged`** — `?scoreGt=60` (returns reviews with `riskScore >= scoreGt`, default 60, sorted by highest risk first)

## Tech Stack

- **Frontend:** React 19, TypeScript, Vite, Redux Toolkit, Formik, Yup, Axios, Tailwind CSS 4
- **Backend:** Node.js, Express, TypeScript, Mongoose, Zod, Swagger, Helmet, Morgan
- **Database:** MongoDB
