import chokidar from 'chokidar';
import { WebSocketServer } from 'ws';

const RELOAD_PORT = 8080;

let error = false;

// Create WebSocket server for communication with extension
try {
  const wss = new WebSocketServer({ port: RELOAD_PORT });

  console.log(`🔄 Extension auto-reload server started on port ${RELOAD_PORT}`);
  console.log('📁 Watching dist/ folder for changes...');

  // Watch the dist folder for changes
  const watcher = chokidar.watch('dist/**/*', {
    ignored: /node_modules/,
    persistent: true,
    ignoreInitial: true,
  });

  watcher.on('change', path => {
    console.log(`📝 File changed: ${path}`);

    // Broadcast reload message to all connected clients
    wss.clients.forEach(client => {
      if (client.readyState === 1) {
        // WebSocket.OPEN
        client.send(JSON.stringify({ type: 'RELOAD' }));
      }
    });

    console.log('🔄 Reload signal sent to extension');
  });

  wss.on('connection', ws => {
    console.log('🔌 Extension connected to reload server');

    ws.on('close', () => {
      console.log('🔌 Extension disconnected from reload server');
    });
  });

  // Handle process termination
  process.on('SIGINT', () => {
    console.log('\n👋 Shutting down reload server...');
    watcher.close();
    wss.close();
    process.exit(0);
  });
} catch (error) {
  console.error('Error starting reload server:', error);
  error = true;
}
