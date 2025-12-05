# Workout Timeline App

A single-page web application that displays your Google Health Connect workout data in a beautiful timeline interface.

## Features

- 🔐 Google OAuth authentication
- 📊 Workout data from Google Fit API (last 300 days)
- 📈 Statistics summary (total workouts, time, most active day)
- 📱 Responsive design with cute timeline interface
- ☁️ GCP serverless backend

## Setup Instructions

### 1. Google Cloud Project Setup

1. Create a new Google Cloud Project
2. Enable the following APIs:
   - Google Fitness API
   - Cloud Functions API
   - Cloud Build API

### 2. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to "APIs & Services" > "Credentials"
3. Create OAuth 2.0 Client ID:
   - Application type: Web application
   - Authorized JavaScript origins: Add your domain (e.g., `https://your-app.appspot.com`)
   - Authorized redirect URIs: Add your domain
4. Copy the Client ID

### 3. Configuration

1. Update `public/app.js`:
   ```javascript
   const CONFIG = {
       GOOGLE_CLIENT_ID: 'YOUR_ACTUAL_CLIENT_ID.apps.googleusercontent.com',
       CLOUD_FUNCTION_URL: 'https://YOUR_REGION-YOUR_PROJECT_ID.cloudfunctions.net/workoutData',
       SCOPES: 'https://www.googleapis.com/auth/fitness.activity.read https://www.googleapis.com/auth/fitness.body.read'
   };
   ```

### 4. Deployment

#### Deploy Cloud Function
```bash
cd functions
npm install
cd ..
npm run deploy-function
```

#### Deploy Frontend (App Engine)
```bash
gcloud app deploy app.yaml
```

#### Or serve locally for development
```bash
npm install
npm start
```

## Project Structure

```
├── functions/
│   ├── index.js          # Cloud Function for Google Fit API
│   └── package.json      # Function dependencies
├── public/
│   ├── index.html        # Main HTML file
│   ├── app.js           # Frontend JavaScript
│   └── styles.css       # CSS styling
├── app.yaml             # App Engine configuration
├── package.json         # Project dependencies
└── README.md           # This file
```

## Usage

1. Open the deployed app in your browser
2. Click "Sign in with Google"
3. Grant permissions for Google Fit data access
4. View your workout timeline for the last 300 days!

## Troubleshooting

- **No workouts showing**: Make sure you have fitness apps connected to Google Fit and have recorded workouts in the past 300 days
- **Authentication errors**: Verify your OAuth Client ID is correctly configured
- **API errors**: Ensure Google Fitness API is enabled in your GCP project

## Development

To run locally:
```bash
npm install
npm run dev  # Starts both frontend and function framework
```

## License

MIT License