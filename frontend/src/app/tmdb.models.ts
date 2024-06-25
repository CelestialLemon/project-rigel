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

export interface MediaTVEpisode {
  air_date: string,
  episode_number: number,
  episode_type: string,
  id: number,
  name: string,
  overview: string,
  production_code: string,
  runtime: number,
  season_number: number,
  show_id: number,
  still_path: string,
  vote_average: number,
  vote_count: number,
}

export interface MediaTVSeasonResponse {
  _id: string,
  air_date: string,
  episodes: MediaTVEpisode[];
  name: string,
  overview: string,
  id: string,
  poster_path: string,
  season_number: number,
  vote_average: number
};

export interface CastEntry {
  adult: boolean,
  gender: number,
  id: number,
  known_for_department: string,
  name: string,
  original_name: string,
  popularity: number,
  profile_path: string,
  character: string,
  credit_id: string,
  order: number
}

export interface CrewEntry {
  adult: boolean,
  gender: number,
  id: number,
  known_for_department: string,
  name: string,
  original_name: string,
  popularity: number,
  profile_path: string | null,
  credit_id: string,
  department: string,
  job: string
}

export interface MediaTVCreditsResponse {
  cast: CastEntry[];
  crew: CrewEntry[];
}

export interface MediaTVImage {
    aspect_ratio: number,
    height: number,
    iso_639_1: string,
    file_path: string,
    vote_average: number,
    vote_count: number,
    width: number
}

export interface MediaTVImagesResponse {
  backdrops: MediaTVImage[];
  logos: MediaTVImage[];
  posters: MediaTVImage[];
  id: number;
}
