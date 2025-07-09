import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <div class="app-wrapper">
      <header class="app-header">
        <div class="header-content">
          <div class="logo-container">
            <svg class="logo-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" stroke="url(#gradient)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M9 22V12h6v10" stroke="url(#gradient)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <defs>
                <linearGradient id="gradient" x1="3" y1="2" x2="21" y2="22" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stop-color="#ff5f6d"/>
                  <stop offset="100%" stop-color="#ffc371"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
          <nav class="main-nav">
            <a routerLink="/biens" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}" class="nav-link">Listings</a>
            <a routerLink="/biens/new" routerLinkActive="active" class="nav-link">Add Listing</a>
          </nav>
          <div class="language-selector">
            <button class="lang-btn">
              EN <i class="bi bi-chevron-down"></i>
            </button>
          </div>
        </div>
      </header>
      <div class="app-container">
        <router-outlet></router-outlet>
      </div>
    </div>
  `,
  styles: [`
    :host {
      --primary-gradient: linear-gradient(to right, #ff5f6d, #ffc371);
      --dark-bg: #0f1116;
      --dark-card-bg: #1a1d24;
      --text-light: #ffffff;
      --text-muted: #a0a0a0;
      --border-radius: 12px;
      --transition-speed: 0.3s;
    }

    .app-wrapper {
      min-height: 100vh;
      background: var(--dark-bg);
      color: var(--text-light);
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }

    .app-header {
      background-color: rgba(26, 29, 36, 0.95);
      backdrop-filter: blur(10px);
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
      position: sticky;
      top: 0;
      z-index: 1000;
      padding: 15px 0;
    }

    .header-content {
      display: flex;
      align-items: center;
      justify-content: space-between;
      max-width: 80%;
      margin: 0 auto;
      padding: 0 20px;
    }

    .logo-container {
      display: flex;
      align-items: center;
    }

    .logo-icon {
      height: 32px;
      width: 32px;
    }

    .main-nav {
      display: flex;
      gap: 20px;
    }

    .nav-link {
      color: var(--text-light);
      text-decoration: none;
      font-weight: 500;
      padding: 8px 12px;
      border-radius: 20px;
      transition: all var(--transition-speed);
    }

    .nav-link:hover, .nav-link.active {
      background: var(--primary-gradient);
      color: white;
      box-shadow: 0 4px 15px rgba(255, 95, 109, 0.4);
    }

    .language-selector {
      position: relative;
    }

    .lang-btn {
      background: transparent;
      border: 1px solid rgba(255, 255, 255, 0.2);
      color: var(--text-light);
      padding: 6px 12px;
      border-radius: 20px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 5px;
      transition: all var(--transition-speed);
    }

    .lang-btn:hover {
      background-color: rgba(255, 255, 255, 0.1);
    }

    .app-container {
      padding: 30px 20px;
      max-width: 80%;
      margin: 0 auto;
    }

    @media (max-width: 768px) {
      .header-content, .app-container {
        max-width: 95%;
        padding: 0 10px;
      }

      .app-container {
        padding: 20px 10px;
      }

      .main-nav {
        gap: 10px;
      }
    }
  `]
})
export class AppComponent {
  title = 'Property Listings';
}
