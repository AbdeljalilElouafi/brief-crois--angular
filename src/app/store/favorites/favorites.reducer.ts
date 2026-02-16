import { createReducer, on } from '@ngrx/store';
import * as FavoritesActions from './favorites.actions';
import { Favorite } from '../../core/services/favorites.service';

export interface FavoritesState {
    favorites: Favorite[];
    loading: boolean;
    error: any;
}

export const initialState: FavoritesState = {
    favorites: [],
    loading: false,
    error: null
};

export const favoritesReducer = createReducer(
    initialState,
    on(FavoritesActions.loadFavorites, state => ({ ...state, loading: true })),
    on(FavoritesActions.loadFavoritesSuccess, (state, { favorites }) => ({ ...state, loading: false, favorites })),
    on(FavoritesActions.loadFavoritesFailure, (state, { error }) => ({ ...state, loading: false, error })),

    on(FavoritesActions.addFavoriteSuccess, (state, { favorite }) => ({ ...state, favorites: [...state.favorites, favorite] })),
    on(FavoritesActions.removeFavoriteSuccess, (state, { favoriteId }) => ({ ...state, favorites: state.favorites.filter(f => f.id !== favoriteId) }))
);
