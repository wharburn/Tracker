# 📍 Real-Time Location Tracker

A web-based real-time location tracking application that allows you to monitor devices continuously. Perfect for delivery tracking, field service management, or any use case requiring live location updates.

## Features

- ✅ **Real-time location tracking** via browser geolocation API
- ✅ **WebSocket updates** for instant location changes
- ✅ **Admin dashboard** to create and manage tracking sessions
- ✅ **Interactive maps** with location history
- ✅ **Mobile-friendly** interface
- ✅ **No app installation required** - works in any modern browser
- ✅ **HTTPS ready** for production deployment

## How It Works

1. **Admin creates a tracking session** and gets a unique tracking link
2. **Share the link** via WhatsApp, SMS, email, or any messaging platform
3. **Recipient opens the link** on their phone and allows location access
4. **Location updates continuously** while the page is open
5. **Admin monitors** in real-time on the dashboard

## Quick Start (Local Development)

```bash
# Install dependencies
npm install

# Start the server
npm start

# Server runs on http://localhost:3000
```

Visit:
- `http://localhost:3000` - Admin dashboard (create tracking sessions)
- `http://localhost:3000/track/{id}` - Tracking page (for users to share location)
- `http://localhost:3000/admin/view/{id}` - Real-time monitoring page

## Deploy to Render

### Method 1: Deploy from GitHub (Recommended)

1. **Push this code to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/location-tracker.git
   git push -u origin main
   ```

2. **Create a new Web Service on Render**
   - Go to https://render.com and sign in
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Configure:
     - **Name**: `location-tracker` (or your preferred name)
     - **Environment**: `Node`
     - **Build Command**: `npm install`
     - **Start Command**: `npm start`
     - **Plan**: Free (or paid for production use)

3. **Deploy**
   - Click "Create Web Service"
   - Render will automatically deploy your app
   - Your app will be live at `https://your-app-name.onrender.com`

### Method 2: Deploy via Render Dashboard (No Git Required)

1. Go to https://render.com and sign in
2. Click "New +" → "Web Service"
3. Choose "Public Git repository" and paste your repo URL, OR choose "Upload a folder"
4. If uploading, create a zip of your project folder
5. Configure the same settings as Method 1
6. Deploy

## Environment Variables

No environment variables are required for basic operation. The app uses in-memory storage by default.

For production, you may want to add:
- `PORT` - Server port (default: 3000, Render sets this automatically)
- Database connection strings (if you implement persistent storage)

## Production Recommendations

### 1. Add Database (Important for Production)

The current implementation uses in-memory storage, which means data is lost when the server restarts. For production, add a database:

**PostgreSQL Example:**
```javascript
// Install: npm install pg
const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});
```

### 2. Enable HTTPS

Geolocation API requires HTTPS. Render provides this automatically.

### 3. Add Authentication

Consider adding authentication to the admin dashboard:
```javascript
// Add basic auth middleware
app.use('/admin', (req, res, next) => {
  const auth = req.headers.authorization;
  // Verify credentials
  next();
});
```

### 4. Rate Limiting

Add rate limiting to prevent abuse:
```javascript
// Install: npm install express-rate-limit
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

### 5. Enable CORS (if needed for external APIs)

```javascript
// Install: npm install cors
const cors = require('cors');
app.use(cors());
```

## Usage Examples

### 1. Delivery Tracking
Create a tracking session for each delivery driver. Share the tracking link with drivers at the start of their shift.

### 2. Field Service
Monitor field technicians in real-time. Know when they're en route, on-site, or available.

### 3. Event Coordination
Track event staff or volunteers during large events.

### 4. Fleet Management
Monitor company vehicles by having drivers open the tracking link on their phones.

## WhatsApp Integration

To send tracking links via WhatsApp using Green API or similar:

```javascript
// Example: Send tracking link via WhatsApp
async function sendTrackingLink(phoneNumber, trackingUrl) {
  const message = `
📍 Location Tracking Request

Please click the link below to share your location:
${trackingUrl}

Keep the page open to continue sharing your location.
  `;
  
  // Send via Green API
  const response = await fetch('https://api.green-api.com/waInstance{ID}/sendMessage/{token}', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chatId: phoneNumber + '@c.us',
      message: message
    })
  });
}
```

## API Endpoints

### Sessions
- `POST /api/sessions` - Create new tracking session
- `GET /api/sessions` - Get all sessions
- `GET /api/sessions/:id` - Get specific session
- `POST /api/sessions/:id/stop` - Stop tracking session

### Location
- `POST /api/location/:id` - Update location
- `GET /api/location/:id/history` - Get location history

### WebSocket
- Connect to `/` for real-time updates
- Send: `{"type": "subscribe", "trackingId": "xxx"}`
- Receive: `{"type": "location", "data": {...}}`

## File Structure

```
location-tracker/
├── server.js                 # Express server & API
├── package.json             # Dependencies
├── public/
│   ├── index.html          # Admin dashboard
│   ├── tracker.html        # User tracking page
│   └── admin.html          # Real-time monitoring
└── README.md
```

## Browser Compatibility

- ✅ Chrome/Edge (recommended)
- ✅ Firefox
- ✅ Safari (iOS 13+)
- ✅ Mobile browsers (Android/iOS)

**Note**: Geolocation requires HTTPS in production. Some browsers may require additional permissions.

## Troubleshooting

### Location not updating
- Ensure HTTPS is enabled (required for geolocation)
- Check browser permissions for location access
- Keep the tracking page open and active
- Check if device GPS is enabled

### WebSocket connection fails
- Verify Render's WebSocket support is enabled
- Check firewall settings
- Ensure proper protocol (ws:// for HTTP, wss:// for HTTPS)

### Session data lost on restart
- Implement database storage for persistence
- Use Redis or PostgreSQL

## Performance Optimization

- Location updates are throttled (typically every 5-10 seconds)
- History is limited to last 1000 points per session
- WebSocket connections are automatically reconnected on disconnect
- Wake lock keeps screen active during tracking

## Security Considerations

- ⚠️ Add authentication for production use
- ⚠️ Implement rate limiting
- ⚠️ Sanitize all user inputs
- ⚠️ Use environment variables for sensitive data
- ⚠️ Enable CORS only for trusted domains
- ⚠️ Add session expiration

## License

MIT

## Support

For issues or questions:
- Check the troubleshooting section
- Review browser console for errors
- Ensure all dependencies are installed

## Future Enhancements

- [ ] PostgreSQL/MongoDB integration
- [ ] User authentication system
- [ ] SMS notifications for tracking events
- [ ] Geofencing alerts
- [ ] Export location history (CSV/GPX)
- [ ] Multiple simultaneous tracking
- [ ] Battery optimization modes
- [ ] Offline location queuing

---

**Built with:**
- Node.js & Express
- WebSocket (ws)
- Leaflet.js (mapping)
- HTML5 Geolocation API

**Ready to deploy and track! 🚀**
