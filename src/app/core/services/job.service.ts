import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, map, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface Job {
    id: string;
    title: string;
    company: string;
    location: string;
    date: string;
    url: string;
    description: string;
    source: 'The Muse' | 'Arbeitnow';
    salary?: string;
}

@Injectable({
    providedIn: 'root'
})
export class JobService {
    private http = inject(HttpClient);

    // APIs
    private museApiUrl = 'https://www.themuse.com/api/public/jobs';
    private arbeitnowApiUrl = 'https://www.arbeitnow.com/api/job-board-api';

    constructor() { }

    searchJobs(keyword: string, location: string, page: number = 1): Observable<Job[]> {
        return forkJoin({
            muse: this.searchMuse(keyword, location, page),
            arbeitnow: this.searchArbeitnow(keyword, location, page)
        }).pipe(
            map(results => {
                // Interleave or just concat results
                return [...results.muse, ...results.arbeitnow];
            })
        );
    }

    private searchMuse(keyword: string, location: string, page: number): Observable<Job[]> {


        let params: any = { page: page };
        if (location) params.location = location;


        return this.http.get<any>(this.museApiUrl, { params }).pipe(
            map(response => {
                return response.results.map((item: any) => ({
                    id: item.id.toString(),
                    title: item.name,
                    company: item.company.name,
                    location: item.locations[0]?.name || 'Unknown',
                    date: item.publication_date,
                    url: item.refs.landing_page,
                    description: item.contents,
                    source: 'The Muse' as const
                })).filter((job: Job) => {
                    if (!keyword) return true;
                    return job.title.toLowerCase().includes(keyword.toLowerCase());
                });
            }),
            catchError(() => of([]))
        );
    }

    private searchArbeitnow(keyword: string, location: string, page: number): Observable<Job[]> {

        return this.http.get<any>(this.arbeitnowApiUrl, { params: { page } }).pipe(
            map(response => {
                return response.data.map((item: any) => ({
                    id: item.slug,
                    title: item.title,
                    company: item.company_name,
                    location: item.location,
                    date: new Date(item.created_at).toISOString(),
                    url: item.url,
                    description: item.description,
                    source: 'Arbeitnow' as const
                })).filter((job: Job) => {
                    const matchKeyword = !keyword || job.title.toLowerCase().includes(keyword.toLowerCase());
                    const matchLocation = !location || job.location.toLowerCase().includes(location.toLowerCase());
                    return matchKeyword && matchLocation;
                });
            }),
            catchError(() => of([]))
        );
    }
}
