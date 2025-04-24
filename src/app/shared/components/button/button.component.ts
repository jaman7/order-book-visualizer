import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzIconModule } from 'ng-zorro-antd/icon';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule, TranslateModule, NzToolTipModule, NzIconModule],
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
})
export class ButtonComponent {
  @Input() id: string | number;
  @Input() name = '';
  @Input() icon = '';
  @Input() disabled = false;
  @Input() type = '';
  @Input() isRound = false;
  @Input() isActive = false;
  @Input() customClass: string | string[] = '';
  @Input() tooltipTitle: string = '';
  @Input() tooltipPlacement: 'top' | 'bottom' | 'left' | 'right' = 'top';
  @Input() tooltipClassName: 'tooltip-btn-top' | 'tooltip-btn-bottom';

  @Output() btnClick: EventEmitter<MouseEvent> = new EventEmitter();
  @Output() btnClickId: EventEmitter<string | number> = new EventEmitter();

  onClickButton(event: MouseEvent, id?: string): void {
    this.btnClick.emit(event);
    this.btnClickId.emit(id ?? this.id ?? null);
  }

  get combinedClasses(): string {
    return ['default-button', ...[].concat(this.customClass || []), this.isRound ? 'round' : '', this.isActive ? 'active' : '']
      .filter(Boolean)
      .join(' ');
  }

  get ariaLabel(): string {
    return this.name || 'button';
  }
}
