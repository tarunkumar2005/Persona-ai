export interface ChatMessage {
  id: string;
  text: string;
  sender: "user" | "ai";
  timestamp: number;
  type?: "start" | "thinking" | "output" | "complete";
}

interface SessionData {
  messages: ChatMessage[];
  lastActivity: number;
  persona: string;
}

export class SessionManager {
  private static readonly STORAGE_KEY_PREFIX = "chat_session_";
  private static readonly MAX_SESSIONS = 10;
  private static readonly SESSION_TIMEOUT = 24 * 60 * 60 * 1000; // 24 hours

  static saveSession(sessionId: string, messages: ChatMessage[]): void {
    if (typeof window === "undefined") return;

    try {
      const sessionData: SessionData = {
        messages,
        lastActivity: Date.now(),
        persona: sessionId.split("-")[0], // Extract persona from sessionId
      };

      localStorage.setItem(
        `${this.STORAGE_KEY_PREFIX}${sessionId}`,
        JSON.stringify(sessionData)
      );

      // Clean up old sessions
      this.cleanupOldSessions();
    } catch (error) {
      console.error("Error saving session:", error);
    }
  }

  static loadSession(sessionId: string): ChatMessage[] {
    if (typeof window === "undefined") return [];

    try {
      const stored = localStorage.getItem(
        `${this.STORAGE_KEY_PREFIX}${sessionId}`
      );
      if (stored) {
        const sessionData = JSON.parse(stored) as SessionData;

        // Check if session is still valid
        if (Date.now() - sessionData.lastActivity < this.SESSION_TIMEOUT) {
          return sessionData.messages;
        } else {
          // Remove expired session
          this.removeSession(sessionId);
        }
      }
    } catch (error) {
      console.error("Error loading session:", error);
    }

    return [];
  }

  static getAllSessions(): Array<{ sessionId: string; data: SessionData }> {
    if (typeof window === "undefined") return [];

    const sessions: Array<{ sessionId: string; data: SessionData }> = [];

    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith(this.STORAGE_KEY_PREFIX)) {
          const sessionId = key.replace(this.STORAGE_KEY_PREFIX, "");
          const stored = localStorage.getItem(key);
          if (stored) {
            const sessionData = JSON.parse(stored) as SessionData;

            // Only include valid sessions
            if (Date.now() - sessionData.lastActivity < this.SESSION_TIMEOUT) {
              sessions.push({ sessionId, data: sessionData });
            } else {
              localStorage.removeItem(key);
            }
          }
        }
      }
    } catch (error) {
      console.error("Error getting all sessions:", error);
    }

    // Sort by last activity (most recent first)
    return sessions.sort((a, b) => b.data.lastActivity - a.data.lastActivity);
  }

  static removeSession(sessionId: string): void {
    if (typeof window === "undefined") return;

    try {
      localStorage.removeItem(`${this.STORAGE_KEY_PREFIX}${sessionId}`);
    } catch (error) {
      console.error("Error removing session:", error);
    }
  }

  static clearAllSessions(): void {
    if (typeof window === "undefined") return;

    try {
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith(this.STORAGE_KEY_PREFIX)) {
          keysToRemove.push(key);
        }
      }

      keysToRemove.forEach((key) => localStorage.removeItem(key));
    } catch (error) {
      console.error("Error clearing all sessions:", error);
    }
  }

  private static cleanupOldSessions(): void {
    const sessions = this.getAllSessions();

    // Remove sessions beyond the limit
    if (sessions.length > this.MAX_SESSIONS) {
      const sessionsToRemove = sessions.slice(this.MAX_SESSIONS);
      sessionsToRemove.forEach(({ sessionId }) => {
        this.removeSession(sessionId);
      });
    }
  }
}
