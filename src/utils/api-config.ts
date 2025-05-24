// API configuration utilities
export interface ApiConfig {
  apiKey: string;
  model: string;
  maxTokens: number;
}

export class ApiConfigManager {
  private static readonly STORAGE_KEY = 'chatgpt_api_config';
  private static readonly DEFAULT_MODEL = 'gpt-3.5-turbo';
  private static readonly DEFAULT_MAX_TOKENS = 150;

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
} 