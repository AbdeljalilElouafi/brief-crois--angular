import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './header.component.html',
  styles: []
})
export class HeaderComponent {
  authService = inject(AuthService);

  // Use a computed signal or just method access in template
  // authService.currentUser is a signal

  logout() {
    this.authService.logout();
  }
}
