import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MessagesTableComponent } from './messages-table.component';
import { AuthService } from '../core/auth.service';
import { RealtimeService } from '../core/realtime.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule, MatButtonModule, MatInputModule, MessagesTableComponent],
  template: `
    <div
      class="min-h-screen bg-gradient-to-br from-purple-600 to-indigo-700 text-white flex items-center justify-center p-6"
    >
      <div class="bg-white text-gray-900 rounded-2xl shadow-xl p-6 w-full max-w-3xl space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
          <input
            class="border rounded px-3 py-2 md:col-span-1"
            [(ngModel)]="username"
            placeholder="username"
          />
          <input
            class="border rounded px-3 py-2 md:col-span-1"
            [(ngModel)]="password"
            type="password"
            placeholder="password"
          />
          <button mat-raised-button color="primary" (click)="login()">Login</button>
        </div>

        <div class="flex gap-2 items-center">
          <input
            class="flex-1 border rounded px-3 py-2"
            [(ngModel)]="message"
            placeholder="mensagem para disparar"
          />
          <button mat-stroked-button [disabled]="!message" (click)="fetchRandomMessage()">
            New Message
          </button>
          <button mat-raised-button color="accent" [disabled]="!(message !== '')" (click)="emit()">Dispatch (Hub)</button>
          <button mat-stroked-button (click)="emitViaApi()">Dispatch (API)</button>
          <button mat-stroked-button (click)="stop()">Stop</button>
          <button mat-stroked-button (click)="start()">Start</button>
          <button mat-stroked-button (click)="reconnect()">Reconnect</button>
        </div>

        <app-messages-table></app-messages-table>
      </div>
    </div>
  `,
})
export class AppComponent implements OnInit {
  private auth = inject(AuthService);
  private rt = inject(RealtimeService);
  private snackBar = inject(MatSnackBar);
  private http = inject(HttpClient);
  private cdr = inject(ChangeDetectorRef);

  username = '';
  password = 'admin';
  message = 'Olá, mundo!';

  ngOnInit() {
    this.fetchRandomUsername();
    this.fetchRandomMessage();
  }

  async fetchRandomUsername() {
    try {
      const response = await this.http.get<any>('https://randomuser.me/api/').toPromise();
      this.username = response.results[0].name.first + ' ' + response.results[0].name.last;

      this.cdr.detectChanges();
    } catch (error) {
      this.username = 'user' + Math.floor(Math.random() * 1000); // Fallback to random number
    }
  }

  async fetchRandomMessage() {
    try {
      const response = await this.http.get<any>('http://api.quotable.io/random').toPromise();
      this.message = response.content;
      this.cdr.detectChanges();
    } catch (error) {
      this.message = 'Mensagem aleatória falhou'; // Fallback
    }
  }

  async login() {
    try {
      await this.auth.login(this.username, this.password);
      this.snackBar.open('Login realizado com sucesso!', 'Fechar', { duration: 3000 });
      await this.connect();
    } catch (error) {
      this.snackBar.open('Falha no login!', 'Fechar', { duration: 3000 });
    }
  }

  async connect() {
    try {
      await this.rt.connect();
      this.snackBar.open('Conexão realizada com sucesso!', 'Fechar', { duration: 3000 });
    } catch (err) {
      this.snackBar.open('Falha ao conectar ao Hub!', 'Fechar', { duration: 3000 });
    }
  }

  async emit() {
    await this.rt.trigger(this.message, this.username);
    this.message = '';
    this.fetchRandomMessage();
  }
  async emitViaApi() {
    try {
      // await this.rt.trigger(this.message, this.username);
    } catch (err) {
      alert('Falha ao emitir via API');
    }
  }

  async stop() {
    try {
      await this.rt.stop();
      this.snackBar.open('Conexão parada!', 'Fechar', { duration: 3000 });
    } catch (err) {
      this.snackBar.open('Falha ao parar conexão!', 'Fechar', { duration: 3000 });
    }
  }

  async start() {
    try {
      await this.rt.start();
      this.snackBar.open('Conexão iniciada!', 'Fechar', { duration: 3000 });
    } catch (err) {
      this.snackBar.open('Falha ao iniciar conexão!', 'Fechar', { duration: 3000 });
    }
  }

  async reconnect() {
    try {
      await this.rt.reconnect();
      this.snackBar.open('Reconectado!', 'Fechar', { duration: 3000 });
    } catch (err) {
      this.snackBar.open('Falha ao reconectar!', 'Fechar', { duration: 3000 });
    }
  }
}
