import { ApiConfigManager } from "../utils/api-config";
import { ChatGPTService } from "../services/chatgpt-service";

document.addEventListener('DOMContentLoaded', async function() {
    const apiKeyInput = document.getElementById('apiKey') as HTMLInputElement;
    const modelSelect = document.getElementById('model') as HTMLSelectElement;
    const saveBtn = document.getElementById('saveBtn') as HTMLElement;
    const clearBtn = document.getElementById('clearBtn') as HTMLElement;
    const testBtn = document.getElementById('testBtn') as HTMLElement;
    const status = document.getElementById('status') as HTMLElement;

    // Load existing settings
    const config = await ApiConfigManager.getApiConfig();
    if (config) {
        apiKeyInput.value = config.apiKey ? '••••••••••••••••' : '';
        modelSelect.value = config.model || 'gpt-3.5-turbo';
    }

    function showStatus(message: string, type: string) {
        status.textContent = message;
        status.className = `status ${type}`;
        status.style.display = 'block';
        setTimeout(() => {
            status.style.display = 'none';
        }, 5000);
    }

    saveBtn.addEventListener('click', async function() {
        const apiKey = apiKeyInput.value.trim();
        
        if (!apiKey || apiKey === '••••••••••••••••') {
            showStatus('Please enter a valid API key', 'error');
            return;
        }

        if (!apiKey.startsWith('sk-')) {
            showStatus('API key should start with "sk-"', 'error');
            return;
        }

        try {
            await ApiConfigManager.saveApiKey(apiKey);
            showStatus('Settings saved successfully!', 'success');
            apiKeyInput.value = '••••••••••••••••';
        } catch (error) {
            showStatus(`Error saving settings: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error');
        }
    });

    clearBtn.addEventListener('click', async function() {
        if (confirm('Are you sure you want to clear your API key?')) {
            try {
                await ApiConfigManager.clearApiKey();
                apiKeyInput.value = '';
                showStatus('API key cleared successfully', 'success');
            } catch (error) {
                showStatus(`Error clearing API key: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error');
            }
        }
    });

    testBtn.addEventListener('click', async function() {
        showStatus('Testing connection...', 'info');
        
        try {
            const result = await ChatGPTService.sendMessage('Hello', 'whats your name nigga.');
            
            if (result.success) {
                showStatus('Connection test successful!', 'success');
            } else {
                showStatus(`Connection test failed: ${result.error}`, 'error');
            }
        } catch (error) {
            showStatus(`Connection test failed: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error');
        }
    });
}); 