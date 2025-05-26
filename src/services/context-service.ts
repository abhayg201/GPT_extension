export interface PageContext {
  pageTitle: string;
  pageUrl: string;
  domain: string;
  surroundingText: string;
  pageType: string;
  selectedText: string;
}

export interface UserPreferences {
  explanationLevel: 'beginner' | 'intermediate' | 'advanced';
  focusArea: 'general' | 'technical' | 'business' | 'academic' | 'creative';
  outputFormat: 'structured' | 'conversational' | 'bullet-points';
}

export class ContextService {
  static getContextualInfo(selectedText: string): PageContext {
    const selection = window.getSelection();
    let surroundingText = '';
    
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const container = range.commonAncestorContainer;
      const paragraph = container.nodeType === Node.TEXT_NODE 
        ? container.parentElement 
        : container as HTMLElement;
      
      if (paragraph && paragraph.textContent) {
        surroundingText = paragraph.textContent
          .substring(0, 1000) // Limit context length
          .replace(selectedText, `**${selectedText}**`); // Highlight selection
      }
    }
    
    return {
      pageTitle: document.title,
      pageUrl: window.location.href,
      domain: window.location.hostname,
      surroundingText: surroundingText,
      pageType: this.detectPageType(),
      selectedText: selectedText
    };
  }

  private static detectPageType(): string {
    const url = window.location.href;
    const content = document.body.textContent?.toLowerCase() || '';
    
    if (url.includes('github.com') || url.includes('stackoverflow.com')) return 'technical';
    if (url.includes('wikipedia.org')) return 'encyclopedia';
    if (url.includes('news') || document.querySelector('article')) return 'article';
    if (document.querySelector('code, pre')) return 'documentation';
    if (url.includes('linkedin.com') || url.includes('business')) return 'business';
    
    return 'general';
  }

  static generateEnhancedAgenticPrompt(selectedText: string, context: PageContext, userPrefs?: Partial<UserPreferences>): { systemPrompt: string, userPrompt: string } {
    const prefs: UserPreferences = {
      explanationLevel: 'intermediate',
      focusArea: 'general',
      outputFormat: 'structured',
      ...userPrefs
    };
  
    const systemPrompt = `
  You are an intelligent, proactive, agentic AI assistant embedded in a browser extension.
  Your goal is to help the user deeply understand a selected piece of text from a web page using all available context.
  Take initiative to clarify, elaborate, and surface important relationships, patterns, or consequences.
  You are capable of analyzing technical, legal, editorial, and code-based content.
  Be concise but insightful, and adapt based on user preferences and page context.
    `.trim();
  
    let levelInstruction = '';
    switch (prefs.explanationLevel) {
      case 'beginner':
        levelInstruction = 'Explain as if I\'m new to this topic. Use simple language and provide background context.';
        break;
      case 'advanced':
        levelInstruction = 'Provide a detailed, technical explanation. Assume I have relevant background knowledge.';
        break;
      default:
        levelInstruction = 'Provide a balanced explanation with moderate technical detail.';
    }
  
    const focusAnalysis = prefs.focusArea !== 'general'
      ? `6. **${prefs.focusArea.charAt(0).toUpperCase() + prefs.focusArea.slice(1)} Perspective**: Analyze from a ${prefs.focusArea} viewpoint`
      : '';
  
    const userPrompt = `
  **Selected Text:**
  "${selectedText}"
  
  **Context Information:**
  - Source: ${context.pageTitle} (${context.domain})
  - Content type: ${context.pageType}
  - Surrounding text: "${context.surroundingText}"
  
  **User Preference:**
  ${levelInstruction}
  
  **Please provide the following:**
  1. **Main Points**: What are the 2-3 most important ideas here?
  2. **Technical Details**: Key implementation specifics, algorithms, or methods mentioned
  3. **Key Terms**: Define any specialized vocabulary or concepts
  4. **Connections**: How does this relate to the larger topic or field?
  ${focusAnalysis}
  
  Format your response clearly and concisely. Use structured sections. Add examples or analogies if helpful.
    `.trim();
  
    return { systemPrompt, userPrompt };
  }
  
  
} 