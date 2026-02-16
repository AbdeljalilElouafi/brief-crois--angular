import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Observable, map } from 'rxjs';
import { Job } from '../../../core/services/job.service';
import { Favorite } from '../../../core/services/favorites.service';
import { loadFavorites } from '../../../store/favorites/favorites.actions';
import { selectAllFavorites, selectFavoritesLoading } from '../../../store/favorites/favorites.selectors';
import { JobCardComponent } from '../../../shared/components/job-card/job-card.component';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';
import { HeaderComponent } from '../../../shared/components/header/header.component';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule, JobCardComponent, LoaderComponent, HeaderComponent],
  templateUrl: './favorites.component.html'
})
export class FavoritesComponent implements OnInit {
  private store = inject(Store);

  favorites$: Observable<Favorite[]> = this.store.select(selectAllFavorites);
  loading$: Observable<boolean> = this.store.select(selectFavoritesLoading);

  // Map favorites back to Job objects if JobCard expects Job
  favoriteJobs$: Observable<Job[]> = this.favorites$.pipe(
    map(favorites => favorites.map(f => f.jobObject))
  );

  ngOnInit() {
    this.store.dispatch(loadFavorites());
  }
}
