export enum MediaType {
	MOVIE = 'movie',
	TV = 'tv',
}

export enum MVWatchStatus {
	UNWATCHED = 'Unwatched',
	PLANTOWATCH = 'Plan to watch',
	WATCHING = 'Watching',
	COMPLETED = 'Completed',
}

export enum TVWatchStatus {
	UNWATCHED = 'Unwatched',
	PLANTOWATCH = 'Plan to watch',
	WATCHING = 'Watching',
	ONHOLD = 'On Hold',
	DROPPED = 'Dropped',
	COMPLETED = 'Completed',
}

// custom interface that condenses mv entry and tv entry into one
export interface SearchEntry {
	title: string;
	overview: string;
	backdrop_path: string | null;
	poster_path: string | null;
	type: MediaType;
	mediaId: number;
	date: string | null;
	genres: string[] | null;
}

export interface TVSearchResponse {
	page: number;
	results: TVEntry[];
	total_pages: number;
	total_results: number;
}

export interface MVSearchResponse {
	page: number;
	results: MVEntry[];
	total_pages: number;
	total_results: number;
}

export interface MVEntry {
	adult: boolean;
	backdrop_path: string | null;
	genre_ids: number[];
	id: number;
	original_language: string;
	original_title: string;
	overview: string;
	popularity: number;
	poster_path: string;
	release_date: string;
	title: string;
	video: boolean;
	vote_average: number;
	vote_count: number;
}

export interface TVEntry {
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

export interface MediaGenre {
	id: number;
	name: string;
}

interface MediaSeason {
	air_date: string;
	episode_count: number;
	id: number;
	name: string;
	overview: string;
	poster_path: string;
	season_number: number;
	vote_average: number;
}

/**
 * Type for response recieved when we fetch detials for a tv-show
 * Does not contain all fields from response, only that I though necessary for application
 */
export interface MediaTVDetailsResponse {
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
	status: string;
	tagline: string;
	type: string;
	vote_average: number;
	vote_count: number;
}

export interface MediaMVCollection {
	id: number;
	name: string;
	poster_path: string;
	backdrop_path: string;
}

export interface MediaMVDetailsResponse {
	adult: boolean;
	backdrop_path: string;
	belongs_to_collection: MediaMVCollection;
	budget: number;
	genres: MediaGenre[];
	homepage: string;
	id: number;
	imdb_id: string;
	origin_country: string[];
	original_language: string;
	original_title: string;
	overview: string;
	popularity: number;
	poster_path: string;
	release_date: string;
	revenue: number;
	runtime: number;
	status: string;
	tagline: string;
	title: string;
	video: boolean;
	vote_average: number;
	vote_count: number;
}

export interface MediaTVEpisode {
	air_date: string;
	episode_number: number;
	episode_type: string;
	id: number;
	name: string;
	overview: string;
	production_code: string;
	runtime: number;
	season_number: number;
	show_id: number;
	still_path: string;
	vote_average: number;
	vote_count: number;
}

export interface MediaTVSeasonResponse {
	_id: string;
	air_date: string;
	episodes: MediaTVEpisode[];
	name: string;
	overview: string;
	id: string;
	poster_path: string;
	season_number: number;
	vote_average: number;
}

export interface CastEntry {
	adult: boolean;
	gender: number;
	id: number;
	known_for_department: string;
	name: string;
	original_name: string;
	popularity: number;
	profile_path: string;
	character: string;
	credit_id: string;
	order: number;
}

export interface CrewEntry {
	adult: boolean;
	gender: number;
	id: number;
	known_for_department: string;
	name: string;
	original_name: string;
	popularity: number;
	profile_path: string | null;
	credit_id: string;
	department: string;
	job: string;
}

export interface MediaCreditsResponse {
	cast: CastEntry[];
	crew: CrewEntry[];
}

export interface MediaTVImage {
	aspect_ratio: number;
	height: number;
	iso_639_1: string;
	file_path: string;
	vote_average: number;
	vote_count: number;
	width: number;
}

export interface MediaTVImagesResponse {
	backdrops: MediaTVImage[];
	logos: MediaTVImage[];
	posters: MediaTVImage[];
	id: number;
}

export interface MediaTVVideo {
	iso_639_1: string;
	iso_3166_1: string;
	name: string;
	key: string;
	site: string;
	size: string;
	type: string;
	official: boolean;
	published_at: string;
	id: string;
}

export interface MediaTVVideosResponse {
	id: number;
	results: MediaTVVideo[];
}

export interface GenreResponse {
	genres: MediaGenre[];
}
