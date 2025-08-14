interface RateLimitData {
  count: number
  resetTime: number
}

export class RateLimiter {
  private static readonly STORAGE_KEY = "mindbridge_chat_limit"
  private static readonly MAX_CHATS = 10
  private static readonly WINDOW_HOURS = 1

  static canSendMessage(): { allowed: boolean; remaining: number; resetTime: number } {
    if (typeof window === "undefined") {
      return { allowed: true, remaining: this.MAX_CHATS, resetTime: 0 }
    }

    const now = Date.now()
    const stored = localStorage.getItem(this.STORAGE_KEY)

    let data: RateLimitData = {
      count: 0,
      resetTime: now + this.WINDOW_HOURS * 60 * 60 * 1000,
    }

    if (stored) {
      try {
        data = JSON.parse(stored)
      } catch (e) {
        // Reset if corrupted
        localStorage.removeItem(this.STORAGE_KEY)
      }
    }

    // Reset if window has passed
    if (now >= data.resetTime) {
      data = {
        count: 0,
        resetTime: now + this.WINDOW_HOURS * 60 * 60 * 1000,
      }
    }

    const remaining = Math.max(0, this.MAX_CHATS - data.count)
    const allowed = remaining > 0

    return { allowed, remaining, resetTime: data.resetTime }
  }

  static recordMessage(): void {
    if (typeof window === "undefined") return

    const { allowed, resetTime } = this.canSendMessage()
    if (!allowed) return

    const stored = localStorage.getItem(this.STORAGE_KEY)
    let data: RateLimitData = {
      count: 0,
      resetTime,
    }

    if (stored) {
      try {
        data = JSON.parse(stored)
      } catch (e) {
        // Reset if corrupted
      }
    }

    data.count += 1
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data))
  }

  static getRemainingTime(): string {
    const { resetTime } = this.canSendMessage()
    const now = Date.now()
    const remaining = Math.max(0, resetTime - now)

    const minutes = Math.ceil(remaining / (1000 * 60))

    if (minutes < 60) {
      return `${minutes} minute${minutes !== 1 ? "s" : ""}`
    }

    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60

    if (remainingMinutes === 0) {
      return `${hours} hour${hours !== 1 ? "s" : ""}`
    }

    return `${hours}h ${remainingMinutes}m`
  }
}
