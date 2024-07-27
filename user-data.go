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

type TVShow struct {
	Id         uint `json:"id"`
	Name       string `json:"name"`
	PosterPath string `json:"poster_path"`
	WatchStatus string `json:"watch_status"`
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

type UserData struct {
	TVShows map[uint]TVShow `json:"tv_shows"`
	Movies map[uint]Movie `json:"movies"`
}

func (ud *UserData) UpdateMovieWatchStatus(movie Movie, newWatchStatus string) {
	movie.updateWatchStatus(newWatchStatus);
	ud.Movies[movie.Id] = movie;
}

func (ud *UserData) UpdateTVShowWatchStatus(tvShow TVShow, newWatchStatus string) {
	tvShow.updateWatchStatus(newWatchStatus);
	ud.TVShows[tvShow.Id] = tvShow;
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


// func (ud *UserData) AddTVShowToList(listName string, tvShow TVShow) (success bool) {
// 	fmt.Println("Adding TV Show to list")
// 	fmt.Println("listName: ", listName, ", tvShow: ", tvShow)

// 	var listToAddTo *TVWatchList = nil

// 	for i, list := range ud.TVLists {
// 		if list.Name == listName {
// 			listToAddTo = &ud.TVLists[i]
// 		}
// 	}

// 	if listToAddTo == nil {
// 		fmt.Println("ERROR: List does not exist")
// 		return false
// 	}

// 	alreadyExists := false

// 	for _, item := range listToAddTo.Items {
// 		if item.Id == tvShow.Id {
// 			alreadyExists = true
// 		}
// 	}

// 	if alreadyExists {
// 		fmt.Println("ERROR: Show already exists in the list")
// 		return false
// 	}

// 	listToAddTo.Items = append(listToAddTo.Items, tvShow)

// 	return true
// }

// func (ud *UserData) RemoveTVShowFromList(listName string, tvShow TVShow) (success bool) {
// 	fmt.Println("RemoveTVShowFromList, listName: ", listName, " tvShow: ", tvShow)

// 	var listToRemoveFrom *TVWatchList = nil
// 	for i, list := range ud.TVLists {
// 		if list.Name == listName {
// 			listToRemoveFrom = &ud.TVLists[i]
// 			break
// 		}
// 	}
// 	if listToRemoveFrom == nil {
// 		fmt.Println("ERROR: Cannot find list: ", listName)
// 		return false
// 	}

// 	indexToRemove := -1
// 	for i, item := range listToRemoveFrom.Items {
// 		if item.Id == tvShow.Id {
// 			indexToRemove = i
// 			break
// 		}
// 	}
// 	if indexToRemove == -1 {
// 		fmt.Println("ERROR: Cannot find item in list: ", tvShow)
// 		return false
// 	}
// 	listToRemoveFrom.Items = append(
// 		listToRemoveFrom.Items[:indexToRemove],
// 		listToRemoveFrom.Items[indexToRemove+1:]...,
// 	)

// 	return true
// }

// func (ud *UserData) MoveTVShowToList(previousListName string, newListName string, tvShow TVShow) (success bool) {
// 	removeSuccess, addSuccess := false, false

// 	removeSuccess = ud.RemoveTVShowFromList(previousListName, tvShow)
// 	if removeSuccess {
// 		addSuccess = ud.AddTVShowToList(newListName, tvShow)
// 	}

// 	return removeSuccess && addSuccess
// }

// func (ud *UserData) AddMovieToList(listName string, movie Movie) (success bool) {
// 	fmt.Println("Adding Movie to list")
// 	fmt.Println("listName: ", listName, ", movie: ", movie)

// 	var listToAddTo *MVWatchList = nil

// 	for i, list := range ud.MVLists {
// 		if list.Name == listName {
// 			listToAddTo = &ud.MVLists[i]
// 		}
// 	}

// 	if listToAddTo == nil {
// 		fmt.Println("ERROR: List does not exist")
// 		return false
// 	}

// 	alreadyExists := false

// 	for _, item := range listToAddTo.Items {
// 		if item.Id == movie.Id {
// 			alreadyExists = true
// 		}
// 	}

// 	if alreadyExists {
// 		fmt.Println("ERROR: Show already exists in the list")
// 		return false
// 	}

// 	listToAddTo.Items = append(listToAddTo.Items, movie)
// 	return true
// }

// func (ud *UserData) RemoveMovieFromList(listName string, movie Movie) (success bool) {
// 	fmt.Println("RemoveMovieFromList, listName: ", listName, " movie: ", movie)

// 	var listToRemoveFrom *MVWatchList = nil
// 	for i, list := range ud.MVLists {
// 		if list.Name == listName {
// 			listToRemoveFrom = &ud.MVLists[i]
// 			break
// 		}
// 	}
// 	if listToRemoveFrom == nil {
// 		fmt.Println("ERROR: Cannot find list: ", listName)
// 		return false
// 	}

// 	indexToRemove := -1
// 	for i, item := range listToRemoveFrom.Items {
// 		if item.Id == movie.Id {
// 			indexToRemove = i
// 			break
// 		}
// 	}
// 	if indexToRemove == -1 {
// 		fmt.Println("ERROR: Cannot find item in list: ", movie)
// 		return false
// 	}
// 	listToRemoveFrom.Items = append(
// 		listToRemoveFrom.Items[:indexToRemove],
// 		listToRemoveFrom.Items[indexToRemove+1:]...,
// 	)

// 	return true
// }

// func (ud *UserData) MoveMovieToList(previousListName string, newListName string, movie Movie) (success bool) {
// 	removeSuccess, addSuccess := false, false

// 	removeSuccess = ud.RemoveMovieFromList(previousListName, movie)
// 	if removeSuccess {
// 		addSuccess = ud.AddMovieToList(newListName, movie)
// 	}

// 	return removeSuccess && addSuccess
// }
