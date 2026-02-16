# JobFinder

## Overview
JobFinder is an Angular SPA that allows users to search for jobs, save favorites, and track applications. It uses JSON Server as a mock backend.

## Prerequisites
- Node.js (v18+)
- NPM

## Installation
1. Navigate to the project directory:
   ```bash
   cd job-finder
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

## Running the Application
You need to run both the JSON Server (backend) and the Angular app (frontend).

### 1. Start Backend (JSON Server)
Open a terminal and run:
```bash
npm run start:api
```
This will start the mock database at `http://localhost:3000`.

### 2. Start Frontend (Angular)
Open a new terminal and run:
```bash
npm start
```
Navigate to `http://localhost:4200` in your browser.

## Features Guide

### Authentication
- **Sign Up**: Create a new account. Data is saved to `db.json`.
- **Log In**: Access your account. Authentication state is persisted (localStorage).

### Job Search
- **Search**: Enter keywords (e.g., "Angular") and location (e.g., "Remote").
- **Results**: Browse jobs from The Muse and Arbeitnow APIs.

### Favorites (Auth Required)
- **Add**: Click "Favorite" on any job card.
- **View**: Go to "Favorites" in the navigation bar to see saved jobs.
- **Remove**: Click "Saved" to remove from favorites.

### Applications (Auth Required)
- **Track**: Click "Track" on a job card to add it to your applications board.
- **Manage**: Go to "Applications" to view status, add notes, or delete applications.
- **Status**: Update status (En attente, Accepté, Refusé).

## Architecture
- **Frontend**: Angular 17+ (Standalone Components), Tailwind CSS.
- **State Management**: NgRx (for Favorites).
- **Backend Service**: JSON Server.
- **Data Persistence**: `db.json` file.
