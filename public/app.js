// Configuration
const CONFIG = {
    // Load from environment variables
    GOOGLE_CLIENT_ID: window.ENV?.GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com',
    // Use local function for development, production URL for deployment
    CLOUD_FUNCTION_URL: window.location.hostname === 'localhost'
        ? 'http://localhost:8081'
        : (window.ENV?.CLOUD_FUNCTION_URL || 'https://YOUR_REGION-YOUR_PROJECT_ID.cloudfunctions.net/workoutData'),
    // Google Fit API scopes
    SCOPES: 'https://www.googleapis.com/auth/fitness.activity.read https://www.googleapis.com/auth/fitness.body.read'
};

let currentUser = null;
let accessToken = null;

// Initialize Google Sign-In
function initializeGoogleAuth() {
    google.accounts.id.initialize({
        client_id: CONFIG.GOOGLE_CLIENT_ID,
        callback: handleCredentialResponse
    });

    // Render the sign-in button
    google.accounts.id.renderButton(
        document.getElementById('signInDiv'),
        {
            theme: 'outline',
            size: 'large',
            text: 'signin_with',
            width: 250
        }
    );

    // Check if user is already signed in
    const savedToken = localStorage.getItem('google_access_token');
    if (savedToken) {
        accessToken = savedToken;
        showSignedInState();
        loadWorkoutData();
    }
}

// Handle Google Sign-In response
function handleCredentialResponse(response) {
    // Decode JWT token to get user info
    const userInfo = parseJWT(response.credential);
    currentUser = userInfo;

    // Now we need to get an access token for API calls
    requestAccessToken();
}

// Request access token for Google Fit API
function requestAccessToken() {
    const client = google.accounts.oauth2.initTokenClient({
        client_id: CONFIG.GOOGLE_CLIENT_ID,
        scope: CONFIG.SCOPES,
        callback: (response) => {
            if (response.access_token) {
                accessToken = response.access_token;
                localStorage.setItem('google_access_token', accessToken);
                showSignedInState();
                loadWorkoutData();
            } else {
                showError('Failed to get access token for Google Fit API');
            }
        }
    });

    client.requestAccessToken();
}

// Show signed-in state
function showSignedInState() {
    document.getElementById('signInDiv').style.display = 'none';
    document.getElementById('signOutButton').style.display = 'block';

    // Add sign out functionality
    document.getElementById('signOutButton').onclick = signOut;
}

// Sign out function
function signOut() {
    google.accounts.id.disableAutoSelect();
    localStorage.removeItem('google_access_token');
    accessToken = null;
    currentUser = null;

    document.getElementById('signInDiv').style.display = 'block';
    document.getElementById('signOutButton').style.display = 'none';
    document.getElementById('timeline-container').style.display = 'none';
    document.getElementById('no-data').style.display = 'none';
    document.getElementById('error').style.display = 'none';
}

// Load workout data from Cloud Function
async function loadWorkoutData() {
    if (!accessToken) {
        showError('No access token available');
        return;
    }

    showLoading(true);

    try {
        const response = await fetch(CONFIG.CLOUD_FUNCTION_URL, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.success && data.workouts) {
            if (data.workouts.length > 0) {
                displayWorkouts(data.workouts);
            } else {
                showNoData();
            }
        } else {
            throw new Error('Invalid response format from server');
        }
    } catch (error) {
        console.error('Error loading workout data:', error);
        showError(`Failed to load workout data: ${error.message}`);
    } finally {
        showLoading(false);
    }
}

// Display workouts in timeline
function displayWorkouts(workouts) {
    const timelineContainer = document.getElementById('timeline-container');
    const timeline = document.getElementById('timeline');

    // Clear previous content
    timeline.innerHTML = '';

    // Calculate stats
    updateStats(workouts);

    // Group workouts by date
    const workoutsByDate = groupWorkoutsByDate(workouts);

    // Create timeline items
    Object.keys(workoutsByDate).sort((a, b) => new Date(b) - new Date(a)).forEach(date => {
        const dateGroup = createDateGroup(date, workoutsByDate[date]);
        timeline.appendChild(dateGroup);
    });

    timelineContainer.style.display = 'block';
}

// Group workouts by date
function groupWorkoutsByDate(workouts) {
    const groups = {};

    workouts.forEach(workout => {
        const date = new Date(parseInt(workout.startTime)).toDateString();
        if (!groups[date]) {
            groups[date] = [];
        }
        groups[date].push(workout);
    });

    return groups;
}

// Create date group element
function createDateGroup(date, workouts) {
    const dateGroup = document.createElement('div');
    dateGroup.className = 'date-group';

    const dateHeader = document.createElement('div');
    dateHeader.className = 'date-header';
    dateHeader.innerHTML = `
        <h3>${formatDate(new Date(date))}</h3>
        <span class="workout-count">${workouts.length} workout${workouts.length !== 1 ? 's' : ''}</span>
    `;

    const workoutsList = document.createElement('div');
    workoutsList.className = 'workouts-list';

    workouts.forEach(workout => {
        const workoutItem = createWorkoutItem(workout);
        workoutsList.appendChild(workoutItem);
    });

    dateGroup.appendChild(dateHeader);
    dateGroup.appendChild(workoutsList);

    return dateGroup;
}

// Create individual workout item
function createWorkoutItem(workout) {
    const startTime = new Date(parseInt(workout.startTime));
    const duration = formatDuration(parseInt(workout.duration));

    const item = document.createElement('div');
    item.className = 'workout-item';
    item.innerHTML = `
        <div class="workout-icon">${getWorkoutIcon(workout.name)}</div>
        <div class="workout-details">
            <div class="workout-name">${workout.name}</div>
            <div class="workout-time">${startTime.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}</div>
            <div class="workout-duration">${duration}</div>
            ${workout.description ? `<div class="workout-description">${workout.description}</div>` : ''}
        </div>
        <div class="workout-app">${workout.application}</div>
    `;

    return item;
}

// Update statistics
function updateStats(workouts) {
    const totalWorkouts = workouts.length;
    const totalTime = workouts.reduce((sum, workout) => sum + parseInt(workout.duration), 0);
    const totalHours = Math.round(totalTime / (1000 * 60 * 60) * 10) / 10;

    // Find most active day
    const dayCount = {};
    workouts.forEach(workout => {
        const day = new Date(parseInt(workout.startTime)).toLocaleDateString('en-US', { weekday: 'long' });
        dayCount[day] = (dayCount[day] || 0) + 1;
    });

    const mostActiveDay = Object.keys(dayCount).reduce((a, b) => dayCount[a] > dayCount[b] ? a : b, '-');

    document.getElementById('total-workouts').textContent = totalWorkouts;
    document.getElementById('total-time').textContent = totalHours + 'h';
    document.getElementById('most-active-day').textContent = mostActiveDay;
}

// Utility functions
function formatDate(date) {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
        return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
        return 'Yesterday';
    } else {
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }
}

function formatDuration(milliseconds) {
    const minutes = Math.floor(milliseconds / (1000 * 60));
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    if (hours > 0) {
        return `${hours}h ${remainingMinutes}m`;
    } else {
        return `${remainingMinutes}m`;
    }
}

function getWorkoutIcon(activityName) {
    const icons = {
        'Running': '🏃‍♀️',
        'Walking': '🚶‍♀️',
        'Biking': '🚴‍♀️',
        'Swimming': '🏊‍♀️',
        'Yoga': '🧘‍♀️',
        'Weightlifting': '🏋️‍♀️',
        'Basketball': '⛹️‍♀️',
        'Tennis': '🎾',
        'Golf': '⛳',
        'Dancing': '💃',
        'Boxing': '🥊',
        'Climbing': '🧗‍♀️',
        'Cycling': '🚴‍♀️',
        'Hiking': '🥾',
        'Skiing': '⛷️',
        'Surfing': '🏄‍♀️'
    };

    // Find matching icon or use default
    const matchingKey = Object.keys(icons).find(key =>
        activityName.toLowerCase().includes(key.toLowerCase())
    );

    return icons[matchingKey] || '🏃‍♀️';
}

function parseJWT(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(c =>
        '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
    ).join(''));

    return JSON.parse(jsonPayload);
}

function showLoading(show) {
    document.getElementById('loading').style.display = show ? 'flex' : 'none';
}

function showError(message) {
    document.getElementById('error-message').textContent = message;
    document.getElementById('error').style.display = 'block';
    document.getElementById('loading').style.display = 'none';
    document.getElementById('timeline-container').style.display = 'none';
    document.getElementById('no-data').style.display = 'none';
}

function showNoData() {
    document.getElementById('no-data').style.display = 'block';
    document.getElementById('loading').style.display = 'none';
    document.getElementById('timeline-container').style.display = 'none';
    document.getElementById('error').style.display = 'none';
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    // Check if Google Client ID is configured
    if (CONFIG.GOOGLE_CLIENT_ID === 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com') {
        showError('Please configure your Google Client ID in .env file');
        return;
    }

    initializeGoogleAuth();
});