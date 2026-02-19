import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { Job } from './job.service';

export type ApplicationStatus = 'en_attente' | 'accepté' | 'refusé';

export interface Application {
    id?: number;
    userId: number | string;
    offerId: string;
    apiSource: 'The Muse' | 'Arbeitnow';
    title: string;
    company: string;
    location: string;
    url: string;
    status: ApplicationStatus;
    notes: string;
    dateAdded: string;
    jobObject: Job;
}

@Injectable({
    providedIn: 'root'
})
export class ApplicationsService {
    private http = inject(HttpClient);
    private authService = inject(AuthService);
    private apiUrl = 'http://localhost:3000/applications';

    getApplications(): Observable<Application[]> {
        const user = this.authService.currentUser();
        if (!user || !user.id) return new Observable(obs => obs.next([]));
        return this.http.get<Application[]>(`${this.apiUrl}?userId=${user.id}`);
    }

    addApplication(job: Job): Observable<Application> {
        const user = this.authService.currentUser();
        if (!user || !user.id) throw new Error('User not authenticated');

        const app: Application = {
            userId: user.id,
            offerId: job.id,
            apiSource: job.source,
            title: job.title,
            company: job.company,
            location: job.location,
            url: job.url,
            status: 'en_attente',
            notes: '',
            dateAdded: new Date().toISOString(),
            jobObject: job
        };
        return this.http.post<Application>(this.apiUrl, app);
    }

    updateApplication(application: Application): Observable<Application> {
        return this.http.put<Application>(`${this.apiUrl}/${application.id}`, application);
    }

    deleteApplication(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}
