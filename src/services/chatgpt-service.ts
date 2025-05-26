import { ApiConfigManager } from '../utils/api-config';
import { ContextService, UserPreferences } from './context-service';

export interface ChatGPTResponse {
  success: boolean;
  response?: string;
  error?: string;
}

export class ChatGPTService {
  private static readonly API_URL = 'https://api.openai.com/v1/chat/completions';

  static async sendMessage(selectedText: string, prompt?: string): Promise<ChatGPTResponse> {
    try {
      const config = await ApiConfigManager.getApiConfig();
      if (!config || !config.apiKey) {
        return {
          success: false,
          error: 'API key not configured. Please set your OpenAI API key in the extension settings.'
        };
      }
  
      let systemPrompt: string;
      let userPrompt: string;
  
      if (prompt) {
        // Use a simple fallback behavior
        systemPrompt = 'You are an expert assistant that explains selected text clearly and concisely.';
        userPrompt = `${prompt}\n\n"${selectedText}"`;
      } else {
        // Use enhanced prompt and system message
        const context = ContextService.getContextualInfo(selectedText);
        const userPrefs = await this.getUserPreferences();
        const { systemPrompt: sys, userPrompt: user } = ContextService.generateEnhancedAgenticPrompt(selectedText, context, userPrefs);
        systemPrompt = sys;
        userPrompt = user;
      }
  
      const requestBody = {
        model: config.model,
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: userPrompt
          }
        ],
        max_tokens: config.maxTokens,
        temperature: 0.7
      };
  
      console.log('Sending request to ChatGPT API...');
  
      const response = await fetch(this.API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.apiKey}`
        },
        body: JSON.stringify(requestBody)
      });
  
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('API request failed:', response.status, errorData);
  
        if (response.status === 401) {
          return {
            success: false,
            error: 'Invalid API key. Please check your OpenAI API key in the extension settings.'
          };
        } else if (response.status === 429) {
          return {
            success: false,
            error: 'Rate limit exceeded. Please try again later.'
          };
        } else {
          return {
            success: false,
            error: `API request failed: ${response.status} ${response.statusText}`
          };
        }
      }
  
      const data = await response.json();
  
      if (data.choices && data.choices.length > 0) {
        const aiResponse = data.choices[0].message.content.trim();
        console.log('ChatGPT response received successfully');
        return {
          success: true,
          response: aiResponse
        };
      } else {
        return {
          success: false,
          error: 'No response received from ChatGPT'
        };
      }
  
    } catch (error) {
      console.error('Error calling ChatGPT API:', error);
      return {
        success: false,
        error: `Network error: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }
  

  private static async getUserPreferences(): Promise<Partial<UserPreferences>> {
    try {
      const result = await chrome.storage.local.get(['userPreferences']);
      return result.userPreferences || {};
    } catch (error) {
      console.error('Error getting user preferences:', error);
      return {};
    }
  }

  static async saveUserPreferences(prefs: Partial<UserPreferences>): Promise<void> {
    try {
      await chrome.storage.local.set({ userPreferences: prefs });
    } catch (error) {
      console.error('Error saving user preferences:', error);
    }
  }
} 