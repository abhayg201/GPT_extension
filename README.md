# Chrome Extension with TypeScript & Vite

A Chrome extension built with TypeScript and Vite that allows users to select text on any webpage and view it in a popup interface.

## Features

- **Text Selection Detection**: Automatically detects when text is selected on any webpage
- **Interactive Icon**: Shows a clickable icon near selected text
- **Text Container**: Displays selected text in a styled popup container
- **TypeScript**: Full TypeScript support with proper types
- **Modern Build System**: Uses Vite for fast builds and development

## Project Structure

```
src/
├── manifest.json          # Extension manifest
├── background.ts          # Background service worker
├── content-script.ts      # Main content script with all logic
├── popup/
│   ├── popup.html        # Extension popup HTML
│   ├── popup.ts          # Popup TypeScript
│   └── popup.css         # Popup styles
├── components/
│   ├── Icon.ts           # Selection icon component
│   └── Container.ts      # Text container component
├── utils/
│   └── template-utils.ts # Template loading utilities
├── templates/
│   ├── icon.html         # Icon template
│   └── container.html    # Container template
└── styles/
    └── components.css    # Component styles
```

## Development

### Prerequisites

- Node.js (v16 or higher)
- npm

### Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Build the extension:
   ```bash
   npm run build
   ```

3. For development with auto-rebuild:
   ```bash
   npm run dev
   ```

4. For development with auto-rebuild AND auto-reload:
   ```bash
   npm run dev:reload
   ```

5. For debugging with VS Code:
   ```bash
   npm run build:debug
   ./scripts/debug-chrome.sh
   ```

### Loading in Chrome

1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode" in the top right
3. Click "Load unpacked" and select the `dist` folder
4. The extension will be loaded and ready to use

## How It Works

1. **Content Script**: Runs on all web pages and detects text selection
2. **Icon Component**: Shows a clickable icon near selected text
3. **Container Component**: Displays the selected text in a popup
4. **Background Script**: Handles communication and storage
5. **Popup**: Shows stored selected text when clicking the extension icon

## Usage

1. Select any text on a webpage
2. A small icon (💬) will appear near your selection
3. Click the icon to view the selected text in a popup container
4. The selected text is also stored and can be viewed via the extension popup

## Build Process

The build process:
1. Compiles TypeScript files to JavaScript
2. Copies HTML templates and CSS files
3. Copies the manifest to the dist folder
4. Makes templates and styles web-accessible

## Technologies Used

- **TypeScript**: For type safety and modern JavaScript features
- **Vite**: For fast builds and development
- **Chrome Extension Manifest V3**: Latest extension format
- **ES6 Modules**: Modern module system

## Development Tips

- Use `npm run dev` for development with auto-rebuild
- Use `npm run dev:reload` for development with auto-rebuild AND auto-reload
- The extension loads the `dist` folder, not `src`
- Templates and styles are web-accessible resources
- All TypeScript files are compiled to ES2020 JavaScript
- Auto-reload connects via WebSocket on port 8080

## Auto-Reload Feature

The `npm run dev:reload` command starts both:
1. **Vite watcher** - Rebuilds when source files change
2. **Reload server** - Automatically reloads the extension in Chrome

### How it works:
1. You edit a TypeScript file
2. Vite automatically rebuilds to `dist/`
3. Reload server detects the change
4. Extension automatically reloads in Chrome
5. No manual reload needed! 🎉

## VS Code Debugging

Full debugging support with breakpoints, variable inspection, and step-through debugging.

### Setup:
1. **Build with source maps**: `npm run build:debug`
2. **Launch Chrome with debugging**: `./scripts/debug-chrome.sh`
3. **Attach VS Code debugger**: Press `F5` or use Run and Debug panel

### Debug Configurations:
- **Debug Chrome Extension** - Launch Chrome with extension loaded
- **Attach to Chrome Extension** - Attach to running Chrome instance
- **Debug Extension Background Script** - Debug background service worker
- **Debug Extension Content Script** - Debug content scripts on web pages

### Features:
- ✅ **TypeScript source maps** - Debug original TypeScript code
- ✅ **Breakpoints** - Set breakpoints in VS Code
- ✅ **Variable inspection** - Hover over variables to see values
- ✅ **Call stack** - See function call hierarchy
- ✅ **Console integration** - View console.log output in VS Code
- ✅ **Hot reload compatible** - Works with auto-reload system 