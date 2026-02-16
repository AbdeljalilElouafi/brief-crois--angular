import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, map, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface Job {
    id: string;
    title: string;
    company: string;
    location: string;
    date: string; // ISO string
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
        // The Muse allows filtering by 'category', 'location', 'level'. 'page'.
        // Not directly by keyword in the same way, but let's see. 
        // Docs say: category=Software%20Engineer usually works.
        // If exact keyword search isn't supported, we might need to filter client side or use a different parameter.
        // Let's assume standard params for now and refine.
        // Actually, The Muse API doesn't have a 'q' or 'keyword' param documented in my research.
        // It has 'category' and 'level'.
        // Arbeitnow has `search` or `tags`?

        let params: any = { page: page };
        if (location) params.location = location;
        // For keyword, we might need to rely on client filtering if API doesn't support it.
        // However, let's try to pass it? No, strict APIs typically ignore or error.
        // Let's fetch and filter client side for The Muse if needed, or just use what we can.

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
        // Arbeitnow doesn't seem to have a search endpoint with q param in the simple docs I found.
        // It lists all jobs at /job-board-api.
        // Let's check if there is a search param.
        // Assuming we fetch list and filter.
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
