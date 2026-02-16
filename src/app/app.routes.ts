import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: '', redirectTo: 'jobs', pathMatch: 'full' },
    // Lazy loaded features will go here
    {
        path: 'jobs',
        loadComponent: () => import('./features/search/search/search.component').then(m => m.SearchComponent)
    },
    {
        path: 'favorites',
        loadComponent: () => import('./features/favorites/favorites/favorites.component').then(m => m.FavoritesComponent),
        canActivate: [authGuard]
    },
    {
        path: 'applications',
        loadComponent: () => import('./features/applications/applications/applications.component').then(m => m.ApplicationsComponent),
        canActivate: [authGuard]
    }
];
