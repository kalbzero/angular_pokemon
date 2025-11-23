import { Component, input } from '@angular/core';

@Component({
  selector: 'app-tooltip',
  imports: [],
  standalone: true,
  templateUrl: './tooltip.component.html',
  styleUrl: './tooltip.component.scss'
})
export class TooltipComponent {
  text = input<string>('');
}
