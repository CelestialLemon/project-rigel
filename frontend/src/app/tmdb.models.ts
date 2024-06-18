export interface DiscoverTVResponse {
  page: number;
  results: DiscoverTVEntry[];
  total_pages: number;
  total_results: number;
}

export interface DiscoverTVEntry {
  adult: boolean;
  backdrop_path: string | null;
  first_air_date: string;
  genre_ids: number[];
  id: number;
  name: string;
  origin_country: string[];
  original_language: string;
  original_name: string;
  overview: string;
  popularity: number;
  poster_path: string;
  vote_average: number;
  vote_count: number;
}

interface MediaGenre {
  id: number;
  name: string;
}

interface MediaSeason {
    "air_date": string,
    "episode_count": number,
    "id": number,
    "name": string,
    "overview": string,
    "poster_path": string,
    "season_number": number,
    "vote_average": number
}

/**
 * Type for response recieved when we fetch detials for a tv-show
 * Does not contain all fields from response, only that I though necessary for application
 */
export interface MediaDetailsResponse {
  adult: boolean;
  backdrop_path: string;
  episode_run_time: number[];
  first_air_date: string;
  genres: MediaGenre[];
  homepage: string;
  id: number;
  in_production: boolean;
  languages: string[];
  last_air_date: string;
  name: string;
  number_of_episodes: number;
  number_of_seasons: number;
  origin_country: string[];
  original_language: string;
  original_name: string;
  overview: string;
  popularity: number;
  poster_path: string;
  seasons: MediaSeason[];
  status: string,
  tagline: string,
  type: string,
  vote_average: number,
  vote_count: number
}
