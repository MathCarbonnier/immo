import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <div class="container mt-4">
      <router-outlet></router-outlet>
    </div>
  `,
  styles: []
})
export class AppComponent {
  title = 'immo-frontend';
}