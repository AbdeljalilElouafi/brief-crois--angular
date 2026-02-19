import { createReducer, on } from '@ngrx/store';
import * as ApplicationsActions from './applications.actions';
import { Application } from '../../core/services/applications.service';

export interface ApplicationsState {
    applications: Application[];
    loading: boolean;
    error: any;
}

export const initialState: ApplicationsState = {
    applications: [],
    loading: false,
    error: null
};

export const applicationsReducer = createReducer(
    initialState,
    on(ApplicationsActions.loadApplications, state => ({ ...state, loading: true })),
    on(ApplicationsActions.loadApplicationsSuccess, (state, { applications }) => ({ ...state, loading: false, applications })),
    on(ApplicationsActions.loadApplicationsFailure, (state, { error }) => ({ ...state, loading: false, error })),

    on(ApplicationsActions.addApplicationSuccess, (state, { application }) => ({ ...state, applications: [...state.applications, application] }))
);
