import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-forbidden',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="forbidden-page">
      <h1>403 - Accès interdit</h1>
      <p>Vous n'avez pas les droits nécessaires pour accéder à cette page.</p>
    </div>
  `
})
export class ForbiddenComponent {}