import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AgentSessionService {
  private readonly KEY = 'baill_agent_sid';

  getSessionId(): string {
    const stored = globalThis?.sessionStorage?.getItem(this.KEY);
    if (stored) return stored;
    const id = 'sess_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 9);
    globalThis?.sessionStorage?.setItem(this.KEY, id);
    return id;
  }

  clear(): void {
    globalThis?.sessionStorage?.removeItem(this.KEY);
  }
}
