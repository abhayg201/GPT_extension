// Auto-reload client for development
// This file is only included in development builds

const RELOAD_PORT = 8080;
const WEBSOCKET_URL = `ws://localhost:${RELOAD_PORT}`;

let ws: WebSocket | null = null;
let reconnectAttempts = 0;
const maxReconnectAttempts = 5;

function connectToReloadServer() {
  try {
    ws = new WebSocket(WEBSOCKET_URL);
    
    ws.onopen = () => {
      console.log('🔄 Connected to auto-reload server');
      reconnectAttempts = 0;
    };
    
    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === 'RELOAD') {
        console.log('🔄 Reloading extension...');
        chrome.runtime.reload();
      }
    };
    
    ws.onclose = () => {
      console.log('🔌 Disconnected from auto-reload server');
      
      // Attempt to reconnect
      if (reconnectAttempts < maxReconnectAttempts) {
        reconnectAttempts++;
        console.log(`🔄 Attempting to reconnect (${reconnectAttempts}/${maxReconnectAttempts})...`);
        setTimeout(connectToReloadServer, 2000);
      }
    };
    
    ws.onerror = (error) => {
      console.log('❌ Auto-reload server connection error:', error);
    };
    
  } catch (error) {
    console.log('❌ Failed to connect to auto-reload server:', error);
  }
}

// Only connect in development mode

connectToReloadServer();
