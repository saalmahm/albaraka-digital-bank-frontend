import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * SharedModule
 * - Regroupe les composants, directives et pipes réutilisables.
 * - Ne contient pas de services avec état global.
 */
@NgModule({
  declarations: [
    // À compléter plus tard : composants partagés, directives, pipes...
  ],
  imports: [
    CommonModule
  ],
  exports: [
    CommonModule
    // + futurs composants/directives/pipes partagés
  ]
})
export class SharedModule {}