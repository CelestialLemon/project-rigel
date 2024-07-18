export namespace main {
	
	export class Movie {
	    id: string;
	
	    static createFrom(source: any = {}) {
	        return new Movie(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.id = source["id"];
	    }
	}
	export class TVShow {
	    id: string;
	
	    static createFrom(source: any = {}) {
	        return new TVShow(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.id = source["id"];
	    }
	}
	export class WatchList {
	    name: string;
	    movies: Movie[];
	    tvshows: TVShow[];
	
	    static createFrom(source: any = {}) {
	        return new WatchList(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.name = source["name"];
	        this.movies = this.convertValues(source["movies"], Movie);
	        this.tvshows = this.convertValues(source["tvshows"], TVShow);
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

