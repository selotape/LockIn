const express = require('express');
const path = require('path');
const fs = require('fs');

// Load environment variables from .env file
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8080;

// Serve static files (CSS, JS, images) from public directory
// This replaces what http-server was doing
app.use(express.static('public', {
    // Don't serve index.html as static - we'll handle it with templating
    index: false
}));

// Handle the root route - inject env vars into HTML
app.get('/', (req, res) => {
    // Read the HTML file
    const htmlPath = path.join(__dirname, 'public', 'index.html');
    let html = fs.readFileSync(htmlPath, 'utf8');

    // Create JavaScript that sets window.ENV
    const envScript = `
        <script>
            window.ENV = {
                GOOGLE_CLIENT_ID: '${process.env.GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com'}',
                CLOUD_FUNCTION_URL: '${process.env.CLOUD_FUNCTION_URL || 'https://YOUR_REGION-YOUR_PROJECT_ID.cloudfunctions.net/workoutData'}'
            };
        </script>
    `;

    // Inject the script BEFORE the closing </head> tag
    html = html.replace('</head>', `${envScript}</head>`);

    // Send the modified HTML
    res.send(html);
});

// Start the server
app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
    console.log(`📁 Serving static files from 'public' directory`);
    console.log(`🔑 Google Client ID: ${process.env.GOOGLE_CLIENT_ID ? 'Loaded' : 'Not configured'}`);
});