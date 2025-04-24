import { Component, computed, inject, Signal, signal } from '@angular/core';
import { OrderBookService } from '../order-book.service';
import { OrderBookChartComponent } from '../order-book-chart/order-book-chart.component';
import { CommonModule, DatePipe, NgIf } from '@angular/common';
import { transformRawSnapshot } from '../order-book.utils';
import { OrderBookSnapshot } from '../order-book.models';
import gsap from 'gsap';
import { ButtonComponent } from '@app/shared/components/button/button.component';

@Component({
  selector: 'app-order-book-page',
  standalone: true,
  imports: [CommonModule, NgIf, DatePipe, ButtonComponent, OrderBookChartComponent],
  templateUrl: './order-book-page.component.html',
  styleUrls: ['./order-book-page.component.scss'],
})
export class OrderBookPageComponent {
  private orderBookService = inject(OrderBookService);
  private timeline: gsap.core.Timeline | null = null;
  private replayInterval: any = null;
  private currentStepDuration = 1000; // ms

  readonly snapshots = signal<OrderBookSnapshot[]>([]);
  readonly selectedIndex = signal(0);
  readonly replayRemaining = signal(0);

  readonly dashArray = 2 * Math.PI * 45; // obwód koła (r=45)
  readonly dashOffset = computed(() => ((this.replayRemaining() / this.currentStepDuration) * this.dashArray).toFixed(2));

  readonly selectedSnapshot = computed(() => {
    const list = this.snapshots();
    const index = this.selectedIndex();
    return list.length > 0 ? list[index] : null;
  });

  readonly controls = [
    {
      icon: 'step-backward',
      action: () => this.prevSnapshot(),
      tooltip: 'common.buttons.prev',
      active: signal(false),
    },
    {
      icon: 'step-forward',
      action: () => this.nextSnapshot(),
      tooltip: 'common.buttons.next',
      active: signal(false),
    },
    {
      icon: 'caret-right',
      action: () => this.replay(),
      tooltip: 'common.buttons.replay',
      active: computed(() => this.replayRemaining() > 0),
    },
    {
      icon: 'stop',
      action: () => this.stopReplay(),
      tooltip: 'common.buttons.stop',
      active: computed(() => this.replayRemaining() === 0),
    },
  ];

  constructor() {
    this.orderBookService.getOrderBook().subscribe(raw => {
      const parsed = raw?.map(transformRawSnapshot) ?? [];
      this.snapshots.set(parsed);
    });
    console.log(this.controls);
  }

  nextSnapshot(): void {
    const next = this.selectedIndex() + 1;
    if (next < this.snapshots().length) this.selectedIndex.set(next);
  }

  prevSnapshot(): void {
    const prev = this.selectedIndex() - 1;
    if (prev >= 0) this.selectedIndex.set(prev);
  }

  replay(): void {
    const snapshots = this.snapshots();
    if (snapshots.length < 2) return;

    this.stopReplay(); // zatrzymaj poprzedni replay

    let i = 0;
    const nextStep = () => {
      i = (i + 1) % snapshots.length;
      this.selectedIndex.set(i);
      this.currentStepDuration = 30_000;
      const start = Date.now();

      this.replayRemaining.set(this.currentStepDuration);
      clearInterval(this.replayInterval);

      this.replayInterval = setInterval(() => {
        const elapsed = Date.now() - start;
        const remaining = Math.max(this.currentStepDuration - elapsed, 0);
        this.replayRemaining.set(remaining);

        if (remaining === 0) {
          clearInterval(this.replayInterval);
          nextStep(); // przejście do następnego snapshotu
        }
      }, 100);
    };

    nextStep();
  }

  stopReplay(): void {
    this.timeline?.kill();
    this.timeline = null;
    clearInterval(this.replayInterval);
    this.replayRemaining.set(0);
  }

  onSliderChange(event: Event): void {
    const index = +(event.target as HTMLInputElement).value;
    this.selectedIndex.set(index);
  }

  readonly spread = computed(() => {
    const s = this.selectedSnapshot();
    if (!s) return null;
    return (s.asks[0]?.price ?? 0) - (s.bids[0]?.price ?? 0);
  });

  readonly volumeStats = computed(() => {
    const s = this.selectedSnapshot();
    if (!s) return null;
    return {
      bid: s.bids.reduce((sum, b) => sum + b.volume, 0),
      ask: s.asks.reduce((sum, a) => sum + a.volume, 0),
    };
  });

  resolveActive(active: boolean | Signal<boolean>): boolean {
    return typeof active === 'function' ? active() : active;
  }
}
