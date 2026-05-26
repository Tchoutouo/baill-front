import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export type StreamEventType = 'token' | 'tool' | 'data' | 'error' | 'done';

export interface StreamEvent {
  event: StreamEventType;
  data: any;
}

export interface AnnonceCard {
  id: number;
  title: string;
  subtitle: string | null;
  price: number;
  location: string;
  country: string;
  contact: string;
  reference: string | null;
  is_forward: boolean;
  photo: string | null;
  categories: { id: number; title: string }[];
  link: string;
}

export interface DraftStatus {
  fields: Record<string, any>;
  missing_fields: string[];
  is_complete: boolean;
}

export interface SubmissionResult {
  id: number;
  title: string;
  reference: string;
  status: string;
}

export interface AgentData {
  annonces?: AnnonceCard[];
  annonce?: Record<string, any>;
  categories?: { id: number; title: string; title_en: string | null }[];
  abonnements?: { id: number; name: string; price: number; duree: string }[];
  draft?: DraftStatus;
  submission?: SubmissionResult;
}

export interface AgentResponse {
  session_id: string;
  message: string;
  data: AgentData | null;
}

@Injectable({ providedIn: 'root' })
export class AgentService {
  private readonly base = environment.apiUrl + 'agent/';

  constructor(private readonly http: HttpClient) {}

  chat(message: string, sessionId: string): Observable<AgentResponse> {
    return this.http.post<AgentResponse>(this.base + 'chat', {
      message,
      session_id: sessionId,
    });
  }

  clearSession(sessionId: string): Observable<{ cleared: boolean }> {
    return this.http.delete<{ cleared: boolean }>(this.base + 'session', {
      body: { session_id: sessionId },
    });
  }

  /** Streaming SSE via Fetch API (supporte les cookies Sanctum). */
  chatStream(message: string, sessionId: string): Observable<StreamEvent> {
    return new Observable<StreamEvent>(observer => {
      const controller = new AbortController();

      fetch(this.base + 'stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'text/event-stream' },
        credentials: 'include',
        body: JSON.stringify({ message, session_id: sessionId }),
        signal: controller.signal,
      }).then(async response => {
        if (!response.ok || !response.body) {
          observer.error(new Error(`Stream ${response.status}`));
          return;
        }

        const reader  = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer    = '';
        let eventName = '';

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop() ?? '';

            for (const line of lines) {
              if (line.startsWith('event: ')) {
                eventName = line.slice(7).trim();
              } else if (line.startsWith('data: ') && eventName) {
                try {
                  const data: unknown = JSON.parse(line.slice(6));
                  observer.next({ event: eventName as StreamEventType, data });
                  if (eventName === 'done') { observer.complete(); return; }
                } catch { /* ignore malformed JSON */ }
              } else if (line === '') {
                eventName = '';
              }
            }
          }
          observer.complete();
        } catch (err) {
          if ((err as Error).name !== 'AbortError') observer.error(err);
          else observer.complete();
        }
      }).catch(err => observer.error(err));

      return () => controller.abort();
    });
  }
}
