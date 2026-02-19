import { createAction, props } from '@ngrx/store';
import { Application } from '../../core/services/applications.service';
import { Job } from '../../core/services/job.service';

export const loadApplications = createAction('[Applications] Load Applications');
export const loadApplicationsSuccess = createAction('[Applications] Load Applications Success', props<{ applications: Application[] }>());
export const loadApplicationsFailure = createAction('[Applications] Load Applications Failure', props<{ error: any }>());

export const addApplication = createAction('[Applications] Add Application', props<{ job: Job }>());
export const addApplicationSuccess = createAction('[Applications] Add Application Success', props<{ application: Application }>());
export const addApplicationFailure = createAction('[Applications] Add Application Failure', props<{ error: any }>());
