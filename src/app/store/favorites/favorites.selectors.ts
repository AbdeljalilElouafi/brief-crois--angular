import { createFeatureSelector, createSelector } from '@ngrx/store';
import { FavoritesState } from './favorites.reducer';
import { Job } from '../../core/services/job.service';

export const selectFavoritesState = createFeatureSelector<FavoritesState>('favorites');

export const selectAllFavorites = createSelector(
    selectFavoritesState,
    (state) => state.favorites
);

export const selectFavoritesLoading = createSelector(
    selectFavoritesState,
    (state) => state.loading
);

export const isFavorite = (jobId: string) => createSelector(
    selectAllFavorites,
    (favorites) => favorites.some(f => f.offerId === jobId)
);
