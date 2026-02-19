import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Application, ApplicationStatus, ApplicationsService } from '../../../core/services/applications.service';
import { loadApplications } from '../../../store/applications/applications.actions';
import { selectAllApplications, selectApplicationsLoading } from '../../../store/applications/applications.selectors';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-applications',
  standalone: true,
  imports: [CommonModule, HeaderComponent, LoaderComponent, FormsModule],
  templateUrl: './applications.component.html'
})
export class ApplicationsComponent implements OnInit {
  private store = inject(Store);
  private applicationsService = inject(ApplicationsService);

  applications$: Observable<Application[]> = this.store.select(selectAllApplications);
  loading$: Observable<boolean> = this.store.select(selectApplicationsLoading);

  applications: Application[] = [];

  statuses: ApplicationStatus[] = ['en_attente', 'accepté', 'refusé'];

  ngOnInit() {
    this.store.dispatch(loadApplications());
    this.applications$.subscribe(apps => {
      this.applications = JSON.parse(JSON.stringify(apps));
    });
  }



  updateStatus(app: Application, status: ApplicationStatus) {
    const updatedApp = { ...app, status };
    this.applicationsService.updateApplication(updatedApp).subscribe({
      next: () => {

        this.store.dispatch(loadApplications());
      },
      error: (err) => alert('Failed to update status')
    });
  }

  updateNotes(app: Application) {
    this.applicationsService.updateApplication(app).subscribe({
      next: () => {
      },
      error: (err) => alert('Failed to save notes')
    });
  }

  deleteApplication(id: number) {
    if (!confirm('Are you sure you want to remove this application?')) return;

    this.applicationsService.deleteApplication(id).subscribe({
      next: () => {
        this.store.dispatch(loadApplications());
      },
      error: (err) => alert('Failed to delete application')
    });
  }

  getStatusClass(status: ApplicationStatus): string {
    switch (status) {
      case 'accepté': return 'bg-green-100 text-green-800';
      case 'refusé': return 'bg-red-100 text-red-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  }
}
