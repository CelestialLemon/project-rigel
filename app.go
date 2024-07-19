package main

import (
	"context"
	"encoding/json"
	"fmt"
	"os"

	"github.com/wailsapp/wails/v2/pkg/runtime"
)

// App struct
type App struct {
	isDataSaved bool
	userData    UserData
	ctx         context.Context
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
	a.userData = ReadDataFromFile()
}

func (a *App) beforeClose(ctx context.Context) bool {
	// write the data to file before shutting down
	WriteUserData(a.userData)
	return false
}

// Greet returns a greeting for the given name
func (a *App) Greet(name string) string {
	return fmt.Sprintf("Hello %s, It's show time!", name)
}

func (a *App) GetUserData() UserData {
	runtime.LogDebug(a.ctx, "Backend call | Get user data")
	fmt.Println("user data: ", a.userData)
	return a.userData
}

func (a *App) SetUserData(newUserData UserData) {
	runtime.LogDebug(a.ctx, "Backend call | Set user data")
	fmt.Println("new user data: ", newUserData)
	a.userData = newUserData
}

// #pragma region user data functions

const DATA_FILE_PATH = "./rigel-data.json"

type TVShow struct {
	Id   string `json:"id"`
	Name string `json:"name"`
}

type Movie struct {
	Id   string `json:"id"`
	Name string `json:"name"`
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

/**
 * Reads the json data present in the data file
 * If file is not present creates the file and writes empty data to the file
 * and returns emtpy lists
 *
 */
func ReadDataFromFile() UserData {

	userData := UserData{}

	file, err := os.Open(DATA_FILE_PATH)
	if err != nil {
		fmt.Println("ERROR could not open file: ", err)
		if os.IsNotExist(err) {
			defaultUserData := getDefaultUserData()
			createNewDataFile(defaultUserData)
			return defaultUserData
		}
	}

	defer file.Close()

	decoder := json.NewDecoder(file)
	if err := decoder.Decode(&userData); err != nil {
		fmt.Println("ERROR decoding file: ", err)
	}

	fmt.Println("userData: ", userData)
	return userData
}

func createNewDataFile(userData UserData) {

	fmt.Println("Creating new data file")

	createdFile, err := os.Create(DATA_FILE_PATH)
	if err != nil {
		fmt.Println("ERROR Could not create file for data: ", err)
	}
	defer createdFile.Close()

	encoder := json.NewEncoder(createdFile)
	if err := encoder.Encode(userData); err != nil {
		fmt.Println("ERROR could not encode data: ", err)
	}
}

func getDefaultUserData() UserData {

	defaultTVLists := []TVWatchList{
		{Name: "Plan to Watch", Items: []TVShow{}},
		{Name: "Watching", Items: []TVShow{}},
		{Name: "On Hold", Items: []TVShow{}},
		{Name: "Dropped", Items: []TVShow{}},
		{Name: "Completed", Items: []TVShow{}},
	}

	defaultMVLists := []MVWatchList{
		{Name: "Plan to Watch", Items: []Movie{}},
		{Name: "Watching", Items: []Movie{}},
		{Name: "Completed", Items: []Movie{}},
	}

	defaultData := UserData{
		TVLists: defaultTVLists,
		MVLists: defaultMVLists,
	}

	return defaultData
}

func WriteUserData(userData UserData) {
	file, err := os.Create(DATA_FILE_PATH)
	if err != nil {
		fmt.Println("ERROR: ", err)
	}
	defer file.Close()

	encoder := json.NewEncoder(file)
	if err := encoder.Encode(userData); err != nil {
		fmt.Println("ERROR: ", err)
	}
}
