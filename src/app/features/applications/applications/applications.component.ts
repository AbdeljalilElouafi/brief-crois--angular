import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApplicationsService, Application, ApplicationStatus } from '../../../core/services/applications.service';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';
import { FormsModule } from '@angular/forms';
import { Observable, tap } from 'rxjs';

@Component({
  selector: 'app-applications',
  standalone: true,
  imports: [CommonModule, HeaderComponent, LoaderComponent, FormsModule],
  templateUrl: './applications.component.html'
})
export class ApplicationsComponent implements OnInit {
  private applicationsService = inject(ApplicationsService);

  applications: Application[] = [];
  loading = true;

  statuses: ApplicationStatus[] = ['en_attente', 'accepté', 'refusé'];

  ngOnInit() {
    this.loadApplications();
  }

  loadApplications() {
    this.loading = true;
    this.applicationsService.getApplications().subscribe({
      next: (apps) => {
        this.applications = apps;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      }
    });
  }

  updateStatus(app: Application, status: ApplicationStatus) {
    const updatedApp = { ...app, status };
    this.applicationsService.updateApplication(updatedApp).subscribe({
      next: () => {
        app.status = status;
      },
      error: (err) => alert('Failed to update status')
    });
  }

  updateNotes(app: Application) {
    this.applicationsService.updateApplication(app).subscribe({
      next: () => {
        // success feedback (optional)
      },
      error: (err) => alert('Failed to save notes')
    });
  }

  deleteApplication(id: number) {
    if (!confirm('Are you sure you want to remove this application?')) return;

    this.applicationsService.deleteApplication(id).subscribe({
      next: () => {
        this.applications = this.applications.filter(a => a.id !== id);
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
