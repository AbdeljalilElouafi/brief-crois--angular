import { createAction, props } from '@ngrx/store';
import { Favorite } from '../../core/services/favorites.service';
import { Job } from '../../core/services/job.service';

export const loadFavorites = createAction('[Favorites] Load Favorites');
export const loadFavoritesSuccess = createAction('[Favorites] Load Favorites Success', props<{ favorites: Favorite[] }>());
export const loadFavoritesFailure = createAction('[Favorites] Load Favorites Failure', props<{ error: any }>());

export const addFavorite = createAction('[Favorites] Add Favorite', props<{ job: Job }>());
export const addFavoriteSuccess = createAction('[Favorites] Add Favorite Success', props<{ favorite: Favorite }>());
export const addFavoriteFailure = createAction('[Favorites] Add Favorite Failure', props<{ error: any }>());

export const removeFavorite = createAction('[Favorites] Remove Favorite', props<{ favoriteId: number }>());
export const removeFavoriteSuccess = createAction('[Favorites] Remove Favorite Success', props<{ favoriteId: number }>());
export const removeFavoriteFailure = createAction('[Favorites] Remove Favorite Failure', props<{ error: any }>());
