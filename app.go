package main

import (
	"context"
	"fmt"

	"github.com/wailsapp/wails/v2/pkg/runtime"
)

// App struct
type App struct {
	isDataSaved bool
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
	a.isDataSaved = false
}

func (a *App) beforeClose(ctx context.Context) bool {
	// if data is not saved emit event and don't close
	// frontend will call the save data function and call quit again

	// next time isDataSaved will be true and application will quit normally
	if !a.isDataSaved {
		runtime.LogDebug(ctx, "Emitting event")
		runtime.EventsEmit(ctx, "before-close")
		return true
	} else {
		return false
	}
}

// Greet returns a greeting for the given name
func (a *App) Greet(name string) string {
	return fmt.Sprintf("Hello %s, It's show time!", name)
}

func (a *App) ReadData() []WatchList {
	runtime.LogDebug(a.ctx, "reading data from disk")
	res := ReadLists()
	fmt.Println("Reading data: ", res)
	return res
}

func (a *App) WriteDataAndQuit(lists []WatchList) {
	WriteLists(lists)
	a.isDataSaved = true
	runtime.Quit(a.ctx)
}
