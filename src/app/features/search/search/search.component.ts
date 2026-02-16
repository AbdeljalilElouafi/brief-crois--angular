import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { JobService, Job } from '../../../core/services/job.service';
import { JobListComponent } from '../job-list/job-list.component';
import { debounceTime, distinctUntilChanged, switchMap, tap, finalize } from 'rxjs/operators';
import { HeaderComponent } from '../../../shared/components/header/header.component';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, JobListComponent, HeaderComponent],
  templateUrl: './search.component.html'
})
export class SearchComponent {
  private fb = inject(FormBuilder);
  private jobService = inject(JobService);

  searchForm = this.fb.group({
    keyword: [''],
    location: ['']
  });

  jobs: Job[] = [];
  loading = false;
  page = 1;

  constructor() {
    // Initial search or setup reactive listeners if desired.
    // For now, let's trigger search on submit or debounce.
    this.onSearch();
  }

  onSearch() {
    this.page = 1;
    this.searchJobs();
  }

  loadMore() {
    this.page++;
    this.searchJobs(true);
  }

  private searchJobs(append: boolean = false) {
    const { keyword, location } = this.searchForm.value;
    this.loading = true;

    this.jobService.searchJobs(keyword || '', location || '', this.page)
      .pipe(finalize(() => this.loading = false))
      .subscribe(jobs => {
        if (append) {
          this.jobs = [...this.jobs, ...jobs];
        } else {
          this.jobs = jobs;
        }
      });
  }
}
