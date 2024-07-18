package main

import (
	"encoding/json"
	"fmt"
	"os"
)

const DATA_FILE_PATH = "./rigel-data.json"

type TVShow struct {
	Id   string `json:"id"`
	Name string `json:"name"`
}

type Movie struct {
	Id   string `json:"id"`
	Name string `json:"name"`
}

type WatchList struct {
	Name    string   `json:"name"`
	Movies  []Movie  `json:"movies"`
	TVShows []TVShow `json:"tvshows"`
}

/**
 * Reads the json data present in the data file
 * If file is not present creates the file and writes empty data to the file
 * and returns emtpy lists
 *
 */
func ReadLists() []WatchList {

	lists := []WatchList{}

	file, err := os.Open(DATA_FILE_PATH)
	if err != nil {
		fmt.Println("ERROR could not open file: ", err)
		if os.IsNotExist(err) {
			defaultLists := getDefaultLists()
			createNewDataFile(defaultLists)
			return defaultLists
		}
	}

	defer file.Close()

	decoder := json.NewDecoder(file)
	if err := decoder.Decode(&lists); err != nil {
		fmt.Println("ERROR decoding file: ", err)
	}

	fmt.Println("lists: ", lists)
	return lists
}

func createNewDataFile(lists []WatchList) {

	fmt.Println("Creating new data file")

	createdFile, err := os.Create(DATA_FILE_PATH)
	if err != nil {
		fmt.Println("ERROR Could not create file for data: ", err)
	}
	defer createdFile.Close()

	encoder := json.NewEncoder(createdFile)
	if err := encoder.Encode(lists); err != nil {
		fmt.Println("ERROR could not encode data: ", err)
	}
}

func getDefaultLists() []WatchList {
	defaultLists := []WatchList{
		{Name: "Plan to Watch", Movies: []Movie{}, TVShows: []TVShow{}},
		{Name: "Watching", Movies: []Movie{}, TVShows: []TVShow{}},
		{Name: "On Hold", Movies: []Movie{}, TVShows: []TVShow{}},
		{Name: "Dropped", Movies: []Movie{}, TVShows: []TVShow{}},
		{Name: "Completed", Movies: []Movie{}, TVShows: []TVShow{}},
	}

	return defaultLists
}

func WriteLists(lists []WatchList) {
	file, err := os.Create(DATA_FILE_PATH)
	if err != nil {
		fmt.Println("ERROR: ", err)
	}
	defer file.Close()

	encoder := json.NewEncoder(file)
	if err := encoder.Encode(lists); err != nil {
		fmt.Println("ERROR: ", err)
	}
}
