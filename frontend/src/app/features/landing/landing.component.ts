import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-landing',
  standalone: false,
  templateUrl: './landing.component.html',
  styles: [`
    :host {
      display: block;
      background-color: #020617; /* slate-950 */
      overflow-x: hidden;
    }
    
    .text-brutal {
      font-size: clamp(3rem, 15vw, 12rem);
      line-height: 0.85;
      letter-spacing: -0.05em;
    }

    .border-technical {
      border-image: linear-gradient(to right, transparent, #10b981, transparent) 1;
    }
  `]
})
export class LandingComponent implements OnInit {
  constructor() { }
  ngOnInit(): void { }
}
