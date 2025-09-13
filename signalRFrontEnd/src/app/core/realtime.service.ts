import { Injectable, NgZone, inject } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { Subject } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from '../../environment.development';

@Injectable({ providedIn: 'root' })
export class RealtimeService {
  private hub?: signalR.HubConnection;
  private notificationsSubject = new Subject<any>();
  notifications$ = this.notificationsSubject.asObservable();

  private auth = inject(AuthService);
  private zone = inject(NgZone);

  async connect() {
    if (this.hub && (this.hub.state === signalR.HubConnectionState.Connecting || this.hub.state === signalR.HubConnectionState.Connected)) return;

    this.hub = new signalR.HubConnectionBuilder()
      .withUrl(environment.apiUrl + '/hubs/notifications', {
        accessTokenFactory: async () => {
          if(this.auth.token) {
            return this.auth.token;
          }

          await this.auth.reLogin();
          return this.auth.token || '';
        },
        transport: signalR.HttpTransportType.WebSockets | signalR.HttpTransportType.ServerSentEvents,
        skipNegotiation: false,
        timeout: 30000,
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .withAutomaticReconnect([0, 2000, 10000, 30000])
      .configureLogging(signalR.LogLevel.Information)
      .withHubProtocol(new signalR.JsonHubProtocol())
      .build();

    this.hub.on('notification', (payload) => {
      console.log('Notification received from SignalR:', payload);
      this.zone.run(() => this.notificationsSubject.next(payload));
    });

    this.hub.onreconnecting(() => {
      console.log('SignalR reconnecting...');
    });

    this.hub.onreconnected(() => {
      console.log('SignalR reconnected');
    });

    this.hub.onclose((error) => {
      console.log('SignalR connection closed:', error);
    });

    try {
      await this.hub.start();
      console.log('SignalR connection started successfully');
    } catch (error) {
      console.error('Failed to start SignalR connection:', error);
      throw error;
    }
  }

  async stop() {
    await this.hub?.stop();
  }

  async start() {
    await this.hub?.start();
  }

  async trigger(message: string, from: string) {
    await this.hub?.invoke('TriggerNotification', message, from);
  }
}
