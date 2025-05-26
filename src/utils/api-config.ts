// API configuration utilities
export interface ApiConfig {
  apiKey: string;
  model: string;
  maxTokens: number;
}

export interface UserPreferences {
  explanationLevel: 'beginner' | 'intermediate' | 'advanced';
  focusArea: 'general' | 'technical' | 'business' | 'academic' | 'creative';
  outputFormat: 'structured' | 'conversational' | 'bullet-points';
}

export class ApiConfigManager {
  private static readonly STORAGE_KEY = 'chatgpt_api_config';
  private static readonly PREFERENCES_KEY = 'user_preferences';
  private static readonly DEFAULT_MODEL = 'gpt-3.5-turbo';
  private static readonly DEFAULT_MAX_TOKENS = 1500; // Increased for more detailed responses

  static async saveApiKey(apiKey: string): Promise<void> {
    try {
      await chrome.storage.local.set({
        [this.STORAGE_KEY]: {
          apiKey: apiKey,
          model: this.DEFAULT_MODEL,
          maxTokens: this.DEFAULT_MAX_TOKENS
        }
      });
      console.log('API key saved successfully');
    } catch (error) {
      console.error('Error saving API key:', error);
      throw error;
    }
  }

  static async getApiConfig(): Promise<ApiConfig | null> {
    try {
      const result = await chrome.storage.local.get([this.STORAGE_KEY]);
      return result[this.STORAGE_KEY] || null;
    } catch (error) {
      console.error('Error getting API config:', error);
      return null;
    }
  }

  static async hasApiKey(): Promise<boolean> {
    const config = await this.getApiConfig();
    return config && config.apiKey && config.apiKey.trim().length > 0;
  }

  static async clearApiKey(): Promise<void> {
    try {
      await chrome.storage.local.remove([this.STORAGE_KEY]);
      console.log('API key cleared successfully');
    } catch (error) {
      console.error('Error clearing API key:', error);
      throw error;
    }
  }

  static async saveUserPreferences(preferences: Partial<UserPreferences>): Promise<void> {
    try {
      const currentPrefs = await this.getUserPreferences();
      const updatedPrefs = { ...currentPrefs, ...preferences };
      
      await chrome.storage.local.set({
        [this.PREFERENCES_KEY]: updatedPrefs
      });
      console.log('User preferences saved successfully');
    } catch (error) {
      console.error('Error saving user preferences:', error);
      throw error;
    }
  }

  static async getUserPreferences(): Promise<UserPreferences> {
    try {
      const result = await chrome.storage.local.get([this.PREFERENCES_KEY]);
      return result[this.PREFERENCES_KEY] || {
        explanationLevel: 'intermediate',
        focusArea: 'general',
        outputFormat: 'structured'
      };
    } catch (error) {
      console.error('Error getting user preferences:', error);
      return {
        explanationLevel: 'intermediate',
        focusArea: 'general',
        outputFormat: 'structured'
      };
    }
  }
} 