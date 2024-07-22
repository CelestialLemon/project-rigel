# Project Rigel

![Angular](https://img.shields.io/badge/angular-%23DD0031.svg?style=for-the-badge&logo=angular&logoColor=white)
![Go](https://img.shields.io/badge/go-%2300ADD8.svg?style=for-the-badge&logo=go&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)

Rigel is a desktop application that helps you keep track of the movies and tv shows you watch.

### Features

1. Discover new media to watch
2. Search for media
3. Add your media to status lists like `Plan to watch`, `Watching` and `Completed`.
4. See your media in one place on the lists page
5. The data is saved only on your device and is never sent anywhere.

## Building

### Prerequisites

1. [NodeJS](https://nodejs.org/en)
2. [Go](https://go.dev/)
3. [Wails CLI](https://wails.io/)
4. [Angular CLI](https://angular.dev/)

#### Step 1: Create constants file

In the `project-rigel > frontend > src > app ` folder create a file `constants.ts`

Paste the following content into the file

```typescript
export const TMDB_API_BASE_URL = "https://api.themoviedb.org/3";
export const TMDB_IMAGE_ORIGINAL_BASE_URL =
  "https://image.tmdb.org/t/p/original";
export const TMDB_IMAGE_W500_BASE_URL = "https://image.tmdb.org/t/p/w500";
export const TMDB_API_KEY = "<TMDB_API_KEY>";
```

#### Step 2: Get a TMDB API key

Sign up on [TMDB](https://www.themoviedb.org/) and create an API key. Paste that API key at the `<TMDB_API_KEY>` placeholder in the `constants.ts` file.

#### Step 3: Run and build

Run the following commands

```bash
wails dev   # run development server
wails build # build executable
```
