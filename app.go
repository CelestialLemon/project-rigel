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
	userData UserData
	ctx      context.Context
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

	// TODO: Remove this later
	WriteUserData(newUserData)
}

func (a *App) SaveUserData() {
	runtime.LogDebug(a.ctx, "Backend call | SaveUserData")
	WriteUserData(a.userData)
}

// -------------------------------------------------------------------------------------------
// user data file utility functions

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

/**
 * Creates new data file and writes the provided user data to it
 */
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

/**
 * Default configuration of the user data file for a new user
 */
func getDefaultUserData() UserData {

	defaultTVShows := make(map[uint]TVShow);
	defaultMVLists := make(map[uint]Movie);
	defaultData := UserData{
		TVShows: defaultTVShows,
		Movies: defaultMVLists,
	}

	return defaultData
}

/**
 * Writes the given user dat to file
 */
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
