import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

import { routes } from './app.routes';

import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { favoritesReducer } from './store/favorites/favorites.reducer';
import { FavoritesEffects } from './store/favorites/favorites.effects';
import { applicationsReducer } from './store/applications/applications.reducer';
import { ApplicationsEffects } from './store/applications/applications.effects';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    provideStore({ favorites: favoritesReducer, applications: applicationsReducer }),
    provideEffects([FavoritesEffects, ApplicationsEffects]),
    provideStoreDevtools({ maxAge: 25, logOnly: false })
  ]
};
