package main

type Message struct {
	Code    string // "save", "error", "ok"
	Text    string
	Mission *Mission
}
