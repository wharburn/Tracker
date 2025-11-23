const express = require('express');
const path = require('path');
const WebSocket = require('ws');
const http = require('http');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Store active tracking sessions in memory
// In production, you'd use a database like PostgreSQL or MongoDB
const trackingSessions = new Map();
const locationHistory = new Map();

app.use(express.json());
app.use(express.static('public'));

// Generate unique tracking ID
function generateTrackingId() {
  return Math.random().toString(36).substr(2, 9);
}

// Create new tracking session
app.post('/api/sessions', (req, res) => {
  const trackingId = generateTrackingId();
  const session = {
    id: trackingId,
    name: req.body.name || 'Anonymous',
    createdAt: new Date(),
    active: true,
    currentLocation: null
  };
  
  trackingSessions.set(trackingId, session);
  locationHistory.set(trackingId, []);
  
  res.json({
    trackingId,
    trackingUrl: `/track/${trackingId}`
  });
});

// Get tracking session info
app.get('/api/sessions/:id', (req, res) => {
  const session = trackingSessions.get(req.params.id);
  if (!session) {
    return res.status(404).json({ error: 'Session not found' });
  }
  res.json(session);
});

// Get all active sessions (for admin dashboard)
app.get('/api/sessions', (req, res) => {
  const sessions = Array.from(trackingSessions.values());
  res.json(sessions);
});

// Update location
app.post('/api/location/:id', (req, res) => {
  const { id } = req.params;
  const { latitude, longitude, accuracy, timestamp } = req.body;
  
  const session = trackingSessions.get(id);
  if (!session) {
    return res.status(404).json({ error: 'Session not found' });
  }
  
  const location = {
    latitude,
    longitude,
    accuracy,
    timestamp: timestamp || new Date().toISOString()
  };
  
  // Update current location
  session.currentLocation = location;
  session.lastUpdate = new Date();
  
  // Add to history
  const history = locationHistory.get(id) || [];
  history.push(location);
  
  // Keep only last 1000 locations to prevent memory issues
  if (history.length > 1000) {
    history.shift();
  }
  locationHistory.set(id, history);
  
  // Broadcast to all connected WebSocket clients watching this session
  broadcastLocationUpdate(id, location);
  
  res.json({ success: true });
});

// Get location history
app.get('/api/location/:id/history', (req, res) => {
  const history = locationHistory.get(req.params.id) || [];
  res.json(history);
});

// Stop tracking session
app.post('/api/sessions/:id/stop', (req, res) => {
  const session = trackingSessions.get(req.params.id);
  if (!session) {
    return res.status(404).json({ error: 'Session not found' });
  }
  
  session.active = false;
  res.json({ success: true });
});

// WebSocket connection for real-time updates
wss.on('connection', (ws, req) => {
  console.log('WebSocket client connected');
  
  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      
      if (data.type === 'subscribe') {
        ws.trackingId = data.trackingId;
        console.log(`Client subscribed to tracking ID: ${data.trackingId}`);
        
        // Send current location immediately
        const session = trackingSessions.get(data.trackingId);
        if (session && session.currentLocation) {
          ws.send(JSON.stringify({
            type: 'location',
            data: session.currentLocation
          }));
        }
      }
    } catch (error) {
      console.error('WebSocket message error:', error);
    }
  });
  
  ws.on('close', () => {
    console.log('WebSocket client disconnected');
  });
});

// Broadcast location update to all clients watching this session
function broadcastLocationUpdate(trackingId, location) {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN && client.trackingId === trackingId) {
      client.send(JSON.stringify({
        type: 'location',
        data: location
      }));
    }
  });
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Location Tracker API is running',
    timestamp: new Date().toISOString()
  });
});

// Serve HTML pages
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/track/:id', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'tracker.html'));
});

app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

app.get('/admin/view/:id', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

app.get('/whatsapp', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'whatsapp.html'));
});

const PORT = process.env.PORT || 3000;

// 404 handler - must be last
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Not Found',
    path: req.path,
    method: req.method,
    message: 'The requested resource was not found. Available routes: /, /track/:id, /admin, /admin/view/:id, /whatsapp, /api/sessions, /health'
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
