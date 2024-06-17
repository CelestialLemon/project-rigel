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
