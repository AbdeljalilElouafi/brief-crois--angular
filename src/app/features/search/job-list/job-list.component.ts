import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Job } from '../../../core/services/job.service';
import { JobCardComponent } from '../../../shared/components/job-card/job-card.component';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';

@Component({
  selector: 'app-job-list',
  standalone: true,
  imports: [CommonModule, JobCardComponent, LoaderComponent],
  template: `
    <div *ngIf="loading" class="py-12">
      <app-loader></app-loader>
    </div>

    <div *ngIf="!loading && jobs.length === 0" class="text-center py-12 text-gray-500">
      No jobs found. Try adjusting your search criteria.
    </div>

    <div *ngIf="!loading && jobs.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <app-job-card *ngFor="let job of jobs" [job]="job"></app-job-card>
    </div>
  `
})
export class JobListComponent {
  @Input() jobs: Job[] = [];
  @Input() loading = false;
}
