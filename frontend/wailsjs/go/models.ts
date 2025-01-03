export namespace main {
	
	export class Movie {
	    id: number;
	    name: string;
	    poster_path: string;
	    watch_status: string;
	    lists: {[key: string]: boolean};
	
	    static createFrom(source: any = {}) {
	        return new Movie(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.id = source["id"];
	        this.name = source["name"];
	        this.poster_path = source["poster_path"];
	        this.watch_status = source["watch_status"];
	        this.lists = source["lists"];
	    }
	}
	export class MovieList {
	    name: string;
	    items: Movie[];
	
	    static createFrom(source: any = {}) {
	        return new MovieList(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.name = source["name"];
	        this.items = this.convertValues(source["items"], Movie);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class TVShow {
	    id: number;
	    name: string;
	    poster_path: string;
	    watch_status: string;
	    lists: {[key: string]: boolean};
	    watched_episodes: {[key: number]: number};
	
	    static createFrom(source: any = {}) {
	        return new TVShow(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.id = source["id"];
	        this.name = source["name"];
	        this.poster_path = source["poster_path"];
	        this.watch_status = source["watch_status"];
	        this.lists = source["lists"];
	        this.watched_episodes = source["watched_episodes"];
	    }
	}
	export class TVShowList {
	    name: string;
	    items: TVShow[];
	
	    static createFrom(source: any = {}) {
	        return new TVShowList(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.name = source["name"];
	        this.items = this.convertValues(source["items"], TVShow);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class UserData {
	    tv_shows: {[key: number]: TVShow};
	    movies: {[key: number]: Movie};
	    movies_lists: {[key: string]: boolean};
	    tv_shows_lists: {[key: string]: boolean};
	
	    static createFrom(source: any = {}) {
	        return new UserData(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.tv_shows = this.convertValues(source["tv_shows"], TVShow, true);
	        this.movies = this.convertValues(source["movies"], Movie, true);
	        this.movies_lists = source["movies_lists"];
	        this.tv_shows_lists = source["tv_shows_lists"];
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}

}

