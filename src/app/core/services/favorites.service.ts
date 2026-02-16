import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Job } from './job.service';
import { AuthService } from './auth.service';

export interface Favorite {
    id?: number; // JSON Server auto-id
    userId: number | string;
    offerId: string;
    title: string;
    company: string;
    location: string;
    jobObject: Job; // Store the whole object for easy display? Or just fields. Requirement says: title, company, location. But we need URL etc for "Voir l'offre".
    // Requirement example:
    // "id": 1, "userId": 2, "offerId": 101, "title": "...", "company": "...", "location": "..."
    // It doesn't explicitly ban other fields. Storing full Job object is safer for display.
}

@Injectable({
    providedIn: 'root'
})
export class FavoritesService {
    private http = inject(HttpClient);
    private authService = inject(AuthService);
    private apiUrl = 'http://localhost:3000/favoritesOffers';

    getFavorites(): Observable<Favorite[]> {
        const user = this.authService.currentUser();
        if (!user || !user.id) return new Observable(observer => observer.next([])); // Or error
        return this.http.get<Favorite[]>(`${this.apiUrl}?userId=${user.id}`);
    }

    addFavorite(job: Job): Observable<Favorite> {
        const user = this.authService.currentUser();
        if (!user || !user.id) throw new Error('User not authenticated');

        const favorite: Favorite = {
            userId: user.id,
            offerId: job.id,
            title: job.title,
            company: job.company,
            location: job.location,
            jobObject: job
        };
        return this.http.post<Favorite>(this.apiUrl, favorite);
    }

    removeFavorite(favoriteId: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${favoriteId}`);
    }

    // Helper to check if job is favorite? 
    // We can handle this in NgRx selector.
}
