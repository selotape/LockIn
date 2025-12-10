# LockIn - Workout Timeline App

A single-page web application that displays your Google Health Connect workout data in a beautiful timeline interface. Built with Clean Architecture principles, TypeScript, and comprehensive testing.

## Features

- 🔐 Google OAuth authentication
- 📊 Workout data from Google Fit API (last 300 days)
- 📈 Statistics summary (total workouts, time, most active day)
- 📱 Responsive design with timeline interface
- ☁️ GCP serverless backend (Express API)
- 🎭 Mock mode for local development without Google APIs
- ✅ 95+ unit tests with Jest
- 📦 TypeScript for type safety
- 🏗️ Clean Architecture with dependency injection

## Architecture

This project follows Clean Architecture principles with clear separation of concerns:

### Backend (Express API)
- **Domain Layer**: Business logic, use cases, repositories
- **Service Layer**: Google Fit API integration, authentication
- **HTTP Layer**: REST API endpoints, middleware, error handling
- **Infrastructure**: Configuration, mappers, mock data

### Frontend (TypeScript SPA)
- **UI Layer**: Components, renderers, state management
- **Domain Layer**: Pure functions for statistics and grouping
- **Service Layer**: API client, authentication, storage
- **Utils**: Date formatting, duration formatting, icon mapping

### Key Design Patterns
- **Dependency Injection**: All services injected via constructor
- **Factory Pattern**: ServiceFactory switches between real/mock implementations
- **Observer Pattern**: State change listeners for UI updates
- **Repository Pattern**: Abstract data access layer

## Project Structure

```
LockIn/
├── src/
│   ├── backend/                    # Backend (Express API)
│   │   ├── server.ts               # Express server entry point
│   │   ├── routes/                 # API routes
│   │   ├── controllers/            # HTTP handlers
│   │   ├── services/               # Google API & mock services
│   │   ├── domain/                 # Use cases & repositories
│   │   ├── infrastructure/         # Config, mappers, mock data
│   │   └── middleware/             # CORS, auth, error handling
│   │
│   ├── frontend/                   # Frontend (TypeScript SPA)
│   │   ├── main.ts                 # Entry point
│   │   ├── config/                 # App configuration
│   │   ├── services/               # API, auth, storage services
│   │   ├── domain/                 # Calculators, groupers
│   │   ├── ui/                     # Components, renderers, state
│   │   ├── utils/                  # Formatters, icon mapper
│   │   └── data/                   # Mock workout data
│   │
│   └── shared/                     # Shared types & constants
│       ├── types/                  # Workout, User, API types
│       └── constants/              # Activity types, endpoints
│
├── tests/                          # Jest tests (95+ tests)
│   ├── unit/backend/               # Backend tests
│   ├── unit/frontend/              # Frontend tests
│   └── fixtures/                   # Test data
│
├── config/                         # Build configuration
│   ├── tsconfig.*.json             # TypeScript configs
│   ├── jest.config.*.js            # Jest configs
│   └── webpack.config.js           # Webpack config
│
├── public/                         # Static files
│   ├── index.html                  # HTML entry point
│   ├── styles.css                  # Styles
│   └── dist/bundle.js              # Compiled frontend (20KB)
│
└── dist/                           # Compiled backend
```

## Setup Instructions

### Prerequisites
- Node.js 18+ and npm
- Google Cloud Project (for production deployment)

### Installation

```bash
# Install dependencies
npm install

# Build everything
npm run build
```

## Development

### Mock Mode (Local Development)

The app supports a **mock mode** that allows development without Google APIs or backend deployment:

```bash
# Start both backend and frontend in mock mode
npm run dev

# Or start individually:
npm run dev:backend   # Backend on http://localhost:8081
npm run dev:frontend  # Frontend on http://localhost:8080
```

In mock mode:
- No Google sign-in required
- Returns 30 realistic mock workouts
- No network calls to Google APIs
- Ideal for UI development and testing

### Real Mode (with Google APIs)

To use real Google APIs:

1. Set up Google Cloud Project:
   - Enable Google Fitness API
   - Create OAuth 2.0 Client ID
   - Add `http://localhost:8080` to authorized origins

2. Configure environment:
   ```bash
   # Copy the template file
   cp .env.example .env.development

   # Edit .env.development and add your credentials:
   # USE_MOCKS=false
   # GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
   ```

3. Start the app:
   ```bash
   npm run dev
   ```

## Testing

```bash
# Run all tests
npm test

# Run backend tests only
npm run test:backend

# Run frontend tests only
npm run test:frontend

# Run tests in watch mode
npm run test:watch

# Check test coverage
npm run test:coverage
```

**Test Results:**
- Backend: 44 tests passing
- Frontend: 51 tests passing
- **Total: 95 tests passing**

## Code Quality

```bash
# Type check
npm run type-check

# Lint code
npm run lint

# Build for production
npm run build
```

## Production Deployment

### Deploy to Google Cloud Platform

1. Build the project:
   ```bash
   npm run build
   ```

2. Deploy backend (Cloud Functions):
   ```bash
   npm run deploy-function
   ```

3. Deploy frontend (App Engine):
   ```bash
   gcloud app deploy app.yaml
   ```

4. Update frontend config with production URLs in `public/index.html`

## Environment Variables

### Backend
- `USE_MOCKS`: Set to `'true'` for mock mode, `'false'` for real APIs
- `PORT`: Server port (default: 8080)
- `NODE_ENV`: `'development'` or `'production'`

### Frontend
- `USE_MOCKS`: Set to `'true'` for mock mode, `'false'` for real APIs
- `GOOGLE_CLIENT_ID`: OAuth 2.0 Client ID
- `API_BASE_URL`: Backend API URL

## Key Technologies

- **TypeScript**: Type-safe JavaScript
- **Express**: Backend API server
- **Webpack**: Frontend bundling
- **Jest**: Unit testing
- **Google APIs**: Fitness data & OAuth
- **Clean Architecture**: Maintainable code structure

## Performance

- **Bundle Size**: 20KB (gzipped)
- **Page Load**: < 2s
- **Tests**: Run in ~4 minutes
- **Build Time**: < 30 seconds

## Troubleshooting

### No workouts showing
- Make sure you have fitness apps connected to Google Fit
- Verify workouts were recorded in the last 300 days
- Check that you granted Fitness API permissions

### Authentication errors
- Verify OAuth Client ID is correct
- Check authorized origins include your domain
- Ensure Google Fitness API is enabled

### Build errors
- Run `npm install` to ensure all dependencies are installed
- Delete `node_modules` and `dist` folders, then reinstall
- Check Node.js version (18+ required)

## Contributing

This project follows Clean Architecture principles. When adding features:

1. Define interfaces in the appropriate service/domain layer
2. Implement both real and mock versions
3. Write unit tests with good coverage
4. Maintain separation of concerns
5. Use dependency injection

## License

MIT License

---

Built with ❤️ using Clean Architecture and TypeScript
