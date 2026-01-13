import { Component } from '@angular/core';
import { AuthService } from '../../../../core/services/auth.service';

/**
 * ClientDashboardComponent
 * - Présentera le solde et l'historique des opérations du client.
 * - Contient un bouton de déconnexion pour cette première version.
 */
@Component({
  selector: 'app-client-dashboard',
  templateUrl: './client-dashboard.component.html',
  styleUrls: ['./client-dashboard.component.css']
})
export class ClientDashboardComponent {
  constructor(public authService: AuthService) {}
}