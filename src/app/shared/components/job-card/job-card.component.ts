import { Component, Input, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Job } from '../../../core/services/job.service';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { Store } from '@ngrx/store';
import { addFavorite, removeFavorite } from '../../../store/favorites/favorites.actions';
import { isFavorite, selectAllFavorites } from '../../../store/favorites/favorites.selectors';
import { addApplication } from '../../../store/applications/applications.actions';
import { isApplied } from '../../../store/applications/applications.selectors';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { Favorite } from '../../../core/services/favorites.service';

@Component({
  selector: 'app-job-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './job-card.component.html',
  styles: []
})
export class JobCardComponent implements OnInit {
  @Input() job!: Job;

  authService = inject(AuthService);
  store = inject(Store);
  router = inject(Router);

  isFavorite$!: Observable<boolean>;
  isApplied$!: Observable<boolean>;
  favoriteId$!: Observable<number | undefined>;

  get isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  ngOnInit() {
    this.isFavorite$ = this.store.select(selectAllFavorites).pipe(
      map(favorites => favorites.some(f => f.offerId === this.job.id))
    );

    this.favoriteId$ = this.store.select(selectAllFavorites).pipe(
      map(favorites => favorites.find(f => f.offerId === this.job.id)?.id)
    );

    this.isApplied$ = this.store.select(isApplied(this.job.id));
  }

  apply() {
    if (!confirm('Apply to this job?')) return;

    this.store.dispatch(addApplication({ job: this.job }));
    this.router.navigate(['/applications']);
  }

  toggleFavorite() {
    this.store.select(selectAllFavorites).pipe(
      map(favorites => favorites.find(f => f.offerId === this.job.id)),
      take(1)
    ).subscribe(fav => {
      if (fav && fav.id) {
        this.store.dispatch(removeFavorite({ favoriteId: fav.id }));
      } else {
        this.store.dispatch(addFavorite({ job: this.job }));
      }
    });
  }
}
