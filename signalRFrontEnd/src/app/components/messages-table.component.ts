import { Component, OnInit, OnDestroy, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { RealtimeService } from '../core/realtime.service';
import { Subscription } from 'rxjs';
import { trigger, state, style, transition, animate } from '@angular/animations'; 

interface MessageRow {
  message: string;
  ts: string;
  by?: string;
}

@Component({
  selector: 'app-messages-table',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatCardModule], // Ensure BrowserAnimationsModule is imported here or in app.config.ts if needed
  template: `
    <div class="min-h-screen bg-gray-50 flex items-start justify-center p-6">
      <mat-card class="w-full max-w-4xl">
        <mat-card-header>
          <div class="text-xl font-semibold">Notificações em tempo real ({{ rows.length }})</div>
        </mat-card-header>
        <mat-card-content>
          <div *ngIf="rows.length === 0" class="text-center py-8 text-gray-500">
            Aguardando notificações...
          </div>
          <table mat-table [dataSource]="rows" class="w-full" *ngIf="rows.length > 0">
            <ng-container matColumnDef="ts">
              <th mat-header-cell *matHeaderCellDef>Timestamp</th>
              <td mat-cell *matCellDef="let r">{{ r.ts }}</td>
            </ng-container>
            <ng-container matColumnDef="message">
              <th mat-header-cell *matHeaderCellDef>Mensagem</th>
              <td mat-cell *matCellDef="let r">{{ r.message }}</td>
            </ng-container>
            <ng-container matColumnDef="by">
              <th mat-header-cell *matHeaderCellDef>De</th>
              <td mat-cell *matCellDef="let r">{{ r.by || '-' }}</td>
            </ng-container>
            <tr mat-header-row *matHeaderRowDef="displayed"></tr>
            <tr mat-row *matRowDef="let row; columns: displayed" @rowAnimation></tr>
            <!-- Add @rowAnimation here -->
          </table>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  animations: [
    // Add this animations array to the component decorator
    trigger('rowAnimation', [
      transition(':enter', [
        // Triggers when a row enters (is added)
        style({ opacity: 0, transform: 'translateY(-10px)' }), // Start state: invisible and slightly above
        animate('300ms ease-in', style({ opacity: 1, transform: 'translateY(0)' })), // End state: visible and in place
      ]),
    ]),
  ],
})
export class MessagesTableComponent implements OnInit, OnDestroy {
  private realtime = inject(RealtimeService);
  private cdr = inject(ChangeDetectorRef);
  private subscription?: Subscription;

  private guids = new Set<string>();

  rows: MessageRow[] = [];
  displayed = ['ts', 'message', 'by'];

  ngOnInit() {
    console.log('MessagesTableComponent initialized, subscribing to notifications...');
    this.subscription = this.realtime.notifications$.subscribe((p) => {
      console.log('Notification received in component:', p);

      if (this.guids.has(p.id)) {
        console.log('Duplicate message ignored:', p.id);
        return;
      }

      this.guids.add(p.id);

      this.rows = [
        {
          message: p.message,
          ts: p.createdAt || new Date().toLocaleString(),
          by: p.from || p.by,
        },
        ...this.rows,
      ];

      if (this.rows.length > 100) {
        this.rows = this.rows.slice(0, 100);
      }

      this.cdr.detectChanges();

      console.log('Updated rows count:', this.rows.length);
    });
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }
}
