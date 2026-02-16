import { Component, Input, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Job } from '../../../core/services/job.service';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { Store } from '@ngrx/store';
import { addFavorite, removeFavorite } from '../../../store/favorites/favorites.actions';
import { isFavorite, selectAllFavorites } from '../../../store/favorites/favorites.selectors';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Favorite } from '../../../core/services/favorites.service';
import { ApplicationsService } from '../../../core/services/applications.service';

@Component({
  selector: 'app-job-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './job-card.component.html',
  styles: []
})
export class JobCardComponent implements OnInit {
  @Input() job!: Job;
  applicationsService = inject(ApplicationsService); // Added injection

  trackApplication(job: Job) {
    if (!confirm('Add this job to your applications list?')) return;

    this.applicationsService.addApplication(job).subscribe({
      next: () => alert('Application added to tracking!'),
      error: (err) => alert('Failed to add application.')
    });
  }
  authService = inject(AuthService);
  store = inject(Store);

  isFavorite$!: Observable<boolean>;
  favoriteId$!: Observable<number | undefined>;

  get isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  ngOnInit() {
    // Check if favorite
    // We need to know the favorite ID to remove it.
    // The selector could return the Favorite object or null.
    // Let's rely on selectAllFavorites and find the one matching offerId.

    this.isFavorite$ = this.store.select(selectAllFavorites).pipe(
      map(favorites => favorites.some(f => f.offerId === this.job.id))
    );

    this.favoriteId$ = this.store.select(selectAllFavorites).pipe(
      map(favorites => favorites.find(f => f.offerId === this.job.id)?.id)
    );
  }

  toggleFavorite() {
    this.store.select(selectAllFavorites).pipe(
      map(favorites => favorites.find(f => f.offerId === this.job.id))
    ).subscribe(existingFavorite => {
      // Create a one-time subscription or just take(1) if we were using RxJS operators here, 
      // but inside the subscribe we can dispatch. 
      // Ideally we use a click handler that doesn't subscribe but takes latest value? 
      // Actually with async pipe in template it's cleaner to just pass the favorite object or ID to the handler if possible, 
      // but here we are in the component. 
      // Let's just subscribe once.
    }).unsubscribe();

    // Better approach:
    // We can't easily get the value synchronously without a snapshot or subscription.
    // Let's just subscribe and take 1.
    // However, I will implement explicit methods for Add and Remove if I can get the ID in the template.
    // But I don't have the ID in the template easily without async pipe unwrapping.

    // Simplest: Subscribe to snapshot in the handler.
    this.store.select(selectAllFavorites).pipe(
      map(favorites => favorites.find(f => f.offerId === this.job.id))
    ).subscribe(fav => {
      if (fav && fav.id) {
        this.store.dispatch(removeFavorite({ favoriteId: fav.id }));
      } else {
        this.store.dispatch(addFavorite({ job: this.job }));
      }
    }).unsubscribe();
  }
}
