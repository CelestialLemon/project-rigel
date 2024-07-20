package main

import "fmt"

// -------------------------------------------------------------------------------------------
// user data utility functions

const DATA_FILE_PATH = "./rigel-data.json"

type TVShow struct {
	Id         string `json:"id"`
	Name       string `json:"name"`
	PosterPath string `json:"poster_path"`
}

type Movie struct {
	Id         string `json:"id"`
	Name       string `json:"name"`
	PosterPath string `json:"poster_path"`
}

type TVWatchList struct {
	Name  string   `json:"name"`
	Items []TVShow `json:"items"`
}

type MVWatchList struct {
	Name  string  `json:"name"`
	Items []Movie `json:"items"`
}

type UserData struct {
	TVLists []TVWatchList `json:"tvlists"`
	MVLists []MVWatchList `json:"mvlists"`
}

func (ud *UserData) AddTVShowToList(listName string, tvShow TVShow) (success bool) {
	fmt.Println("Adding TV Show to list")
	fmt.Println("listName: ", listName, ", tvShow: ", tvShow)

	var listToAddTo *TVWatchList = nil

	for i, list := range ud.TVLists {
		if list.Name == listName {
			listToAddTo = &ud.TVLists[i]
		}
	}

	if listToAddTo == nil {
		fmt.Println("ERROR: List does not exist")
		return false
	}

	alreadyExists := false

	for _, item := range listToAddTo.Items {
		if item.Id == tvShow.Id {
			alreadyExists = true
		}
	}

	if alreadyExists {
		fmt.Println("ERROR: Show already exists in the list")
		return false
	}

	listToAddTo.Items = append(listToAddTo.Items, tvShow)

	return true
}

func (ud *UserData) RemoveTVShowFromList(listName string, tvShow TVShow) (success bool) {
	fmt.Println("RemoveTVShowFromList, listName: ", listName, " tvShow: ", tvShow)

	var listToRemoveFrom *TVWatchList = nil
	for i, list := range ud.TVLists {
		if list.Name == listName {
			listToRemoveFrom = &ud.TVLists[i]
			break
		}
	}
	if listToRemoveFrom == nil {
		fmt.Println("ERROR: Cannot find list: ", listName)
		return false
	}

	indexToRemove := -1
	for i, item := range listToRemoveFrom.Items {
		if item.Id == tvShow.Id {
			indexToRemove = i
			break
		}
	}
	if indexToRemove == -1 {
		fmt.Println("ERROR: Cannot find item in list: ", tvShow)
		return false
	}
	listToRemoveFrom.Items = append(
		listToRemoveFrom.Items[:indexToRemove],
		listToRemoveFrom.Items[indexToRemove+1:]...,
	)

	return true
}

func (ud *UserData) MoveTVShowToList(previousListName string, newListName string, tvShow TVShow) (success bool) {
	removeSuccess, addSuccess := false, false

	removeSuccess = ud.RemoveTVShowFromList(previousListName, tvShow)
	if removeSuccess {
		addSuccess = ud.AddTVShowToList(newListName, tvShow)
	}

	return removeSuccess && addSuccess
}

func (ud *UserData) AddMovieToList(listName string, movie Movie) (success bool) {
	fmt.Println("Adding Movie to list")
	fmt.Println("listName: ", listName, ", movie: ", movie)

	var listToAddTo *MVWatchList = nil

	for i, list := range ud.MVLists {
		if list.Name == listName {
			listToAddTo = &ud.MVLists[i]
		}
	}

	if listToAddTo == nil {
		fmt.Println("ERROR: List does not exist")
		return false
	}

	alreadyExists := false

	for _, item := range listToAddTo.Items {
		if item.Id == movie.Id {
			alreadyExists = true
		}
	}

	if alreadyExists {
		fmt.Println("ERROR: Show already exists in the list")
		return false
	}

	listToAddTo.Items = append(listToAddTo.Items, movie)
	return true
}

func (ud *UserData) RemoveMovieFromList(listName string, movie Movie) (success bool) {
	fmt.Println("RemoveMovieFromList, listName: ", listName, " movie: ", movie)

	var listToRemoveFrom *MVWatchList = nil
	for i, list := range ud.MVLists {
		if list.Name == listName {
			listToRemoveFrom = &ud.MVLists[i]
			break
		}
	}
	if listToRemoveFrom == nil {
		fmt.Println("ERROR: Cannot find list: ", listName)
		return false
	}

	indexToRemove := -1
	for i, item := range listToRemoveFrom.Items {
		if item.Id == movie.Id {
			indexToRemove = i
			break
		}
	}
	if indexToRemove == -1 {
		fmt.Println("ERROR: Cannot find item in list: ", movie)
		return false
	}
	listToRemoveFrom.Items = append(
		listToRemoveFrom.Items[:indexToRemove],
		listToRemoveFrom.Items[indexToRemove+1:]...,
	)

	return true
}

func (ud *UserData) MoveMovieToList(previousListName string, newListName string, movie Movie) (success bool) {
	removeSuccess, addSuccess := false, false

	removeSuccess = ud.RemoveMovieFromList(previousListName, movie)
	if removeSuccess {
		addSuccess = ud.AddMovieToList(newListName, movie)
	}

	return removeSuccess && addSuccess
}
