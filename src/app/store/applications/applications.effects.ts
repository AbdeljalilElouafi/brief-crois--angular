import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, mergeMap, catchError } from 'rxjs/operators';
import { ApplicationsService } from '../../core/services/applications.service';
import * as ApplicationsActions from './applications.actions';

@Injectable()
export class ApplicationsEffects {
    private actions$ = inject(Actions);
    private applicationsService = inject(ApplicationsService);

    loadApplications$ = createEffect(() => this.actions$.pipe(
        ofType(ApplicationsActions.loadApplications),
        mergeMap(() => this.applicationsService.getApplications().pipe(
            map(applications => ApplicationsActions.loadApplicationsSuccess({ applications })),
            catchError(error => of(ApplicationsActions.loadApplicationsFailure({ error })))
        ))
    ));

    addApplication$ = createEffect(() => this.actions$.pipe(
        ofType(ApplicationsActions.addApplication),
        mergeMap(action => this.applicationsService.addApplication(action.job).pipe(
            map(application => ApplicationsActions.addApplicationSuccess({ application })),
            catchError(error => of(ApplicationsActions.addApplicationFailure({ error })))
        ))
    ));
}
