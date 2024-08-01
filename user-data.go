package main

import "fmt"

// -------------------------------------------------------------------------------------------
// user data utility functions

const DATA_FILE_PATH = "./rigel-data.json"

const (
	UNWATCHED string = "Unwatched"
	PLANTOWATCH string = "Plan to watch"
	WATCHING string = "Watching"
	ONHOLD string = "On Hold"
	DROPPED string = "Dropped"
	COMPLETED string = "Completed"
);

var MVWatchStatus = []string{
	UNWATCHED,
	PLANTOWATCH,
	WATCHING,
	COMPLETED,
}

var TVWatchStatus = []string{
	UNWATCHED,
	PLANTOWATCH,
	WATCHING,
	ONHOLD,
	DROPPED,
	COMPLETED,
}

type Movie struct {
	Id         uint `json:"id"`
	Name       string `json:"name"`
	PosterPath string `json:"poster_path"`
	WatchStatus string `json:"watch_status"`
	// name of custom lists the item is part of
	// using a map with bool instead of set
	// because set doesn't exist in go 
	Lists map[string]bool `json:"lists"`
}

type MovieList struct {
	Name string `json:"name"`
	Items []Movie `json:"items"`
}

func (m *Movie) updateWatchStatus(newWatchStatus string) {
	isValid := false;
	for _, ws := range MVWatchStatus {
		if (ws == newWatchStatus) {
			isValid = true;
		}
	}

	if (!isValid) {
		fmt.Println("New media watch status is not valid for movies. Status passed ", newWatchStatus);
		return;
	}

	m.WatchStatus = newWatchStatus;
}

func (m *Movie) addList(listName string) {
	_, exists := m.Lists[listName];

	if exists {
		fmt.Println("List already exists for movie: ", m);
	} else {
		m.Lists[listName] = true;
	}
}

type TVShow struct {
	Id         uint `json:"id"`
	Name       string `json:"name"`
	PosterPath string `json:"poster_path"`
	WatchStatus string `json:"watch_status"`
	// name of custom lists the item is part of
	// using a map with bool instead of set
	// because set doesn't exist in go 
	Lists map[string]bool `json:"lists"`
}

type TVShowList struct {
	Name string `json:"name"`
	Items []TVShow `json:"items"`
}

func (t *TVShow) updateWatchStatus(newWatchStatus string) {
	isValid := false;
	for _, ws := range TVWatchStatus {
		if (ws == newWatchStatus) {
			isValid = true;
		}
	}

	if (!isValid) {
		fmt.Println("New media watch status is not valid for movies. Status passed ", newWatchStatus);
		return;
	}

	t.WatchStatus = newWatchStatus;
}

func (t *TVShow) addList(listName string) {
	_, exists := t.Lists[listName];

	if exists {
		fmt.Println("List already exists for movie: ", t);
	} else {
		t.Lists[listName] = true;
	}
}


type UserData struct {
	TVShows map[uint]TVShow `json:"tv_shows"`
	Movies map[uint]Movie `json:"movies"`
	// custom lists created by user
	MoviesLists map[string]bool `json:"movies_lists`
	TVShowsLists map[string]bool `json:"tv_shows_lists`
}

func (ud *UserData) UpdateMovieWatchStatus(movie Movie, newWatchStatus string) {
	movie.updateWatchStatus(newWatchStatus);
	// if item exists update else creates new item
	ud.Movies[movie.Id] = movie;

	WriteUserData(*ud);
}

func (ud *UserData) UpdateTVShowWatchStatus(tvShow TVShow, newWatchStatus string) {
	tvShow.updateWatchStatus(newWatchStatus);
	// if item exists update else creates new item
	ud.TVShows[tvShow.Id] = tvShow;

	WriteUserData(*ud);
}

func (ud *UserData) GetMovieWatchStatus(movieId uint) (string) {
	movie, exists := ud.Movies[movieId];

	if exists {
		return movie.WatchStatus;
	} else {
		return UNWATCHED;
	}
}

func (ud *UserData) GetTVShowWatchStatus(tvShowId uint) (string) {
	tvShow, exists := ud.TVShows[tvShowId];

	if exists {
		return tvShow.WatchStatus;
	} else {
		return UNWATCHED;
	}
}

func (ud *UserData) AddMovieToList(movie Movie, listName string) {
	movie.addList(listName);
	ud.MoviesLists[listName] = true;
	WriteUserData(*ud);
}

func (ud *UserData) AddTVShowToList(tvShow TVShow, listName string) {
	tvShow.addList(listName);
	ud.TVShowsLists[listName] = true;
	WriteUserData(*ud);
}


func (ud *UserData) GetMoviesStatusLists()([]MovieList) {
	lists := []MovieList {
		{ Name: PLANTOWATCH, Items: []Movie{} },
		{ Name: WATCHING, Items: []Movie{} },
		{ Name: COMPLETED, Items: []Movie{} },
	}

	for _, movie := range ud.Movies {
		for i, list := range lists {
			if (list.Name == movie.WatchStatus) {
				lists[i].Items = append(lists[i].Items, movie);
			}
		}
	}

	return lists;
}

func (ud *UserData) GetTVShowsStatusLists()([]TVShowList) {
	lists := []TVShowList {
		{ Name: PLANTOWATCH, Items: []TVShow{} },
		{ Name: WATCHING, Items: []TVShow{} },
		{ Name: ONHOLD, Items: []TVShow{} },
		{ Name: DROPPED, Items: []TVShow{} },
		{ Name: COMPLETED, Items: []TVShow{} },
	}
	
	for _, tvShow := range ud.TVShows {
		for i, list := range lists {
			if (list.Name == tvShow.WatchStatus) {
				lists[i].Items = append(lists[i].Items, tvShow);
			}
		}
	}

	return lists;
}