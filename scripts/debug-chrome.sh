#!/bin/bash

# Chrome Extension Debug Helper
# This script launches Chrome with remote debugging enabled

CHROME_DEBUG_PORT=9222
EXTENSION_DIR="$(pwd)/dist"
CHROME_PROFILE_DIR="$(pwd)/.vscode/chrome-debug-profile"

echo "🔧 Starting Chrome with debugging enabled..."
echo "📁 Extension directory: $EXTENSION_DIR"
echo "🔌 Debug port: $CHROME_DEBUG_PORT"
echo "👤 Profile directory: $CHROME_PROFILE_DIR"

# Create profile directory if it doesn't exist
mkdir -p "$CHROME_PROFILE_DIR"

# Detect Chrome executable based on OS
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    CHROME_EXEC="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    # Linux
    CHROME_EXEC="google-chrome"
elif [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
    # Windows
    CHROME_EXEC="chrome.exe"
else
    echo "❌ Unsupported OS: $OSTYPE"
    exit 1
fi

# Check if Chrome executable exists
if [[ ! -f "$CHROME_EXEC" && "$OSTYPE" == "darwin"* ]]; then
    echo "❌ Chrome not found at $CHROME_EXEC"
    echo "💡 Please install Google Chrome or update the path in this script"
    exit 1
fi

echo "🚀 Launching Chrome..."

# Launch Chrome with debugging and extension
"$CHROME_EXEC" \
    --remote-debugging-port=$CHROME_DEBUG_PORT \
    --user-data-dir="$CHROME_PROFILE_DIR" \
    --load-extension="$EXTENSION_DIR" \
    --disable-extensions-except="$EXTENSION_DIR" \
    --no-first-run \
    --no-default-browser-check \
    chrome://extensions/ &

echo "✅ Chrome launched with debugging enabled"
echo "🔗 Debug URL: http://localhost:$CHROME_DEBUG_PORT"
echo "🎯 You can now attach VS Code debugger or use Chrome DevTools"
echo ""
echo "📝 To debug:"
echo "   1. Open VS Code"
echo "   2. Go to Run and Debug (Ctrl+Shift+D)"
echo "   3. Select 'Attach to Chrome Extension'"
echo "   4. Press F5 to start debugging" 