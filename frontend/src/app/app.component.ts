import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
      <div class="app-container">
        <router-outlet></router-outlet>
      </div>
  `,
  styles: [`
    .app-container {
      padding: 20px;
      max-width: 80%;
      margin: 0 auto;
    }
  `]
})
export class AppComponent {
  title = 'immo-frontend';
}
