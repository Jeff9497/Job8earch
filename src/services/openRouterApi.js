import axios from 'axios';

/**
 * OpenRouter API service for AI chat functionality
 * Using free models available on OpenRouter
 */
class OpenRouterService {
  constructor() {
    this.apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;
    this.defaultModel = import.meta.env.VITE_OPENROUTER_MODEL || 'deepseek/deepseek-v3-base:free';
    this.baseURL = 'https://openrouter.ai/api/v1';

    // Updated available free models (verified as of January 2025)
    this.availableModels = [
      { id: 'google/gemma-3n-e2b-it:free', name: 'Google: Gemma 3n 2B (Free)' },
      { id: 'tencent/hunyuan-a13b-instruct:free', name: 'Tencent: Hunyuan A13B (Free)' },
      { id: 'tngtech/deepseek-r1t2-chimera:free', name: 'TNG: DeepSeek R1T2 Chimera (Free)' },
      { id: 'openrouter/cypher-alpha:free', name: 'Cypher Alpha (Free)' },
      { id: 'mistralai/mistral-small-3.2-24b-instruct:free', name: 'Mistral: Small 3.2 24B (Free)' }
    ];

    this.client = axios.create({
      baseURL: this.baseURL,
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': window.location.origin || 'https://job8earch.com',
        'X-Title': 'Job8earch'
      }
    });


  }

  /**
   * Get available models
   * @returns {Array} List of available models
   */
  getAvailableModels() {
    return this.availableModels;
  }

  /**
   * Test API connection and fetch available models from OpenRouter
   * @returns {Promise} API test result
   */
  async testConnection() {
    try {
      const response = await this.client.get('/models');

      if (response.data && response.data.data) {
        const freeModels = response.data.data.filter(model =>
          model.pricing &&
          model.pricing.prompt === '0' &&
          model.pricing.completion === '0'
        );

        return {
          success: true,
          totalModels: response.data.data.length,
          freeModels: freeModels.length,
          freeModelsList: freeModels.map(m => ({ id: m.id, name: m.name }))
        };
      } else {
        throw new Error('Invalid models response format');
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error?.message || error.message
      };
    }
  }

  /**
   * Send a chat message to OpenRouter
   * @param {string} message - User message
   * @param {string} systemPrompt - Optional system prompt
   * @param {string} model - Model to use (optional)
   * @returns {Promise} AI response
   */
  async chat(message, systemPrompt = '', model = null) {
    try {
      // Validate API key
      if (!this.apiKey) {
        throw new Error('OpenRouter API key is not configured');
      }

      const messages = [];

      if (systemPrompt) {
        messages.push({
          role: 'system',
          content: systemPrompt
        });
      }

      messages.push({
        role: 'user',
        content: message
      });

      const requestData = {
        model: model || this.defaultModel,
        messages: messages,
        temperature: 0.7,
        max_tokens: 2000
      };

      const response = await this.client.post('/chat/completions', requestData);

      if (response.data && response.data.choices && response.data.choices[0]) {
        return {
          success: true,
          content: response.data.choices[0].message.content,
          model: response.data.model || requestData.model
        };
      } else {
        throw new Error('Invalid response format from OpenRouter API');
      }
    } catch (error) {

      let errorMessage = 'Failed to get AI response';

      // Handle specific OpenRouter errors
      if (error.response?.data?.error?.message) {
        const apiError = error.response.data.error.message;

        if (apiError.includes('data policy')) {
          errorMessage = '🔒 Privacy Settings Issue: Please visit https://openrouter.ai/settings/privacy and enable prompt training to use free models.';
        } else if (apiError.includes('No endpoints found')) {
          errorMessage = '❌ Model not available. The selected model may not be accessible with your current settings.';
        } else if (apiError.includes('rate limit')) {
          errorMessage = '⏱️ Rate limit exceeded. Please wait a moment before trying again.';
        } else if (apiError.includes('insufficient credits')) {
          errorMessage = '💳 Insufficient credits. Please add credits to your OpenRouter account.';
        } else {
          errorMessage = `API Error: ${apiError}`;
        }
      } else if (error.response?.status === 401) {
        errorMessage = '🔑 Invalid API key. Please check your OpenRouter API key configuration.';
      } else if (error.response?.status === 404) {
        errorMessage = '🔍 API endpoint not found. Please check your OpenRouter configuration.';
      }

      return {
        success: false,
        error: errorMessage
      };
    }
  }

  /**
   * Analyze job skills requirements
   * @param {string} jobTitle - Job title to analyze
   * @param {string} jobDescription - Optional job description
   * @returns {Promise} Skills analysis
   */
  async analyzeJobSkills(jobTitle, jobDescription = '') {
    const systemPrompt = `You are a career advisor and skills analyst. Provide comprehensive, practical advice about job requirements and career development.`;
    
    const userMessage = `Analyze the skills required for the job title: "${jobTitle}"
    ${jobDescription ? `\nJob Description: ${jobDescription}` : ''}
    
    Please provide a comprehensive breakdown including:
    1. Essential Technical Skills (must-have)
    2. Preferred Technical Skills (nice-to-have)
    3. Soft Skills
    4. Experience Level Required
    5. Typical Career Path
    6. Learning Resources/Certifications
    
    Format the response in a clear, structured way that's easy to read.`;

    const response = await this.chat(userMessage, systemPrompt);
    
    if (response.success) {
      return {
        success: true,
        analysis: response.content,
        jobTitle
      };
    } else {
      return {
        success: false,
        error: response.error,
        fallback: this.getFallbackSkills(jobTitle)
      };
    }
  }

  /**
   * Get interview preparation guidance
   * @param {string} jobTitle - Job title for interview prep
   * @param {string} company - Company name (optional)
   * @param {string} experience - User's experience level
   * @returns {Promise} Interview preparation guidance
   */
  async getInterviewPrep(jobTitle, company = '', experience = 'mid-level') {
    const systemPrompt = `You are an experienced career coach specializing in interview preparation. Provide practical, actionable advice.`;
    
    const userMessage = `Help me prepare for a ${jobTitle} interview${company ? ` at ${company}` : ''}.
    My experience level: ${experience}
    
    Please provide:
    1. Common interview questions for this role
    2. Technical questions I should expect
    3. How to showcase relevant skills
    4. Questions I should ask the interviewer
    5. Tips for demonstrating cultural fit
    6. Salary negotiation advice for this role
    
    Make it practical and actionable.`;

    const response = await this.chat(userMessage, systemPrompt);
    
    if (response.success) {
      return {
        success: true,
        guidance: response.content,
        jobTitle,
        company
      };
    } else {
      return {
        success: false,
        error: response.error
      };
    }
  }

  /**
   * General chat with AI
   * @param {string} message - User's message/question
   * @param {string} context - Optional context
   * @param {string} model - Model to use (optional)
   * @returns {Promise} AI response
   */
  async chatWithAI(message, context = '', model = null) {
    const systemPrompt = context || `You are a helpful AI assistant. Provide clear, accurate, and helpful responses.`;

    const response = await this.chat(message, systemPrompt, model);

    if (response.success) {
      return {
        success: true,
        response: response.content,
        model: response.model,
        timestamp: new Date().toISOString()
      };
    } else {
      return {
        success: false,
        error: response.error
      };
    }
  }

  /**
   * Analyze a job posting
   * @param {Object} job - Job object
   * @returns {Promise} Job analysis
   */
  async analyzeJobPosting(job) {
    const systemPrompt = `You are a career advisor and job market analyst. Provide honest, practical assessments of job opportunities.`;
    
    const userMessage = `Analyze this job posting and provide insights:
    
    Job Title: ${job.jobTitle}
    Company: ${job.employerName}
    Location: ${job.locationName}
    Salary: ${job.minimumSalary ? `£${job.minimumSalary}` : 'Not specified'} - ${job.maximumSalary ? `£${job.maximumSalary}` : 'Not specified'}
    Job Type: ${job.jobType || 'Not specified'}
    Description: ${job.jobDescription}
    
    Please provide:
    1. Key skills and qualifications needed
    2. Career level this role is suitable for
    3. Growth opportunities this role might offer
    4. Red flags or concerns (if any)
    5. How competitive this role might be
    6. Tips for standing out as a candidate
    
    Be honest and practical in your assessment.`;

    const response = await this.chat(userMessage, systemPrompt);
    
    if (response.success) {
      return {
        success: true,
        analysis: response.content,
        job: job
      };
    } else {
      return {
        success: false,
        error: response.error
      };
    }
  }

  /**
   * Fallback skills data when API is unavailable
   * @param {string} jobTitle - Job title
   * @returns {string} Basic skills information
   */
  getFallbackSkills(jobTitle) {
    const skillsMap = {
      'software developer': 'Programming languages (JavaScript, Python, Java), Version control (Git), Problem-solving, Testing, Debugging',
      'data scientist': 'Python/R, SQL, Machine Learning, Statistics, Data Visualization, Critical thinking',
      'product manager': 'Strategic thinking, User research, Analytics, Communication, Project management, Market analysis',
      'ux designer': 'Design tools (Figma, Sketch), User research, Prototyping, Usability testing, Visual design',
      'marketing manager': 'Digital marketing, Analytics, Content creation, Campaign management, SEO/SEM, Communication'
    };

    const key = jobTitle.toLowerCase();
    return skillsMap[key] || 'Skills analysis unavailable. Please try again or contact support.';
  }
}

// Export singleton instance
export default new OpenRouterService();
