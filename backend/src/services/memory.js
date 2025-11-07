import { createClient } from 'redis';

class MemoryService {
  constructor(redisClient) {
    this.redis = redisClient;
    this.SHORT_TERM_TTL = 3600; // 1 hour
    this.LONG_TERM_TTL = 30 * 24 * 3600; // 30 days
  }

  // Short-term memory (last 5 interactions)
  async getShortTermMemory(sessionId) {
    if (!this.redis) return [];
    
    try {
      const key = `memory:short:${sessionId}`;
      const data = await this.redis.get(key);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting short-term memory:', error);
      return [];
    }
  }

  async addShortTermMemory(sessionId, interaction) {
    if (!this.redis) return;
    
    try {
      const key = `memory:short:${sessionId}`;
      const memory = await this.getShortTermMemory(sessionId);
      
      // Keep last 5 interactions
      const updated = [...memory, interaction].slice(-5);
      
      await this.redis.setEx(key, this.SHORT_TERM_TTL, JSON.stringify(updated));
    } catch (error) {
      console.error('Error adding short-term memory:', error);
    }
  }

  // Long-term memory (user preferences)
  async getLongTermMemory(userId) {
    if (!this.redis) return {};
    
    try {
      const key = `memory:long:${userId}`;
      const data = await this.redis.get(key);
      return data ? JSON.parse(data) : {};
    } catch (error) {
      console.error('Error getting long-term memory:', error);
      return {};
    }
  }

  async updateLongTermMemory(userId, preferences) {
    if (!this.redis) return;
    
    try {
      const key = `memory:long:${userId}`;
      const current = await this.getLongTermMemory(userId);
      const updated = { ...current, ...preferences, updatedAt: new Date().toISOString() };
      
      await this.redis.setEx(key, this.LONG_TERM_TTL, JSON.stringify(updated));
    } catch (error) {
      console.error('Error updating long-term memory:', error);
    }
  }

  // Format memory for LLM prompt
  formatMemoryForLLM(shortTerm, longTerm) {
    let context = '';
    
    if (shortTerm.length > 0) {
      context += 'RECENT CONVERSATION:\n';
      shortTerm.forEach((interaction, idx) => {
        context += `${idx + 1}. User: ${interaction.userMessage}\n`;
        context += `   You: ${interaction.assistantResponse}\n`;
      });
    }
    
    if (Object.keys(longTerm).length > 0) {
      context += '\nUSER PREFERENCES:\n';
      Object.entries(longTerm).forEach(([key, value]) => {
        if (key !== 'updatedAt') {
          context += `- ${key}: ${value}\n`;
        }
      });
    }
    
    return context || 'No previous conversation context.';
  }
}

export default MemoryService;

