import { Routes } from '@angular/router';
import { PokedexComponent } from './pokedex/pages/pokedex/pokedex.component';

export const routes: Routes = [
    {
        path: '',
        component: PokedexComponent,
    },
    {
        path: '**',
        redirectTo: '',
    }
];
