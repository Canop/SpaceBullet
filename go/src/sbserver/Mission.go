package main

type Position struct {
	X float32
	Y float32
}

type Gun struct {
	Position
	R        float32
	ShowPath bool
	Lines    [][]Position
}

type Planet struct {
	Position
	R     float32
	Fixed bool
}

type Station Position

type Mission struct {
	Guns        []Gun
	Planets     []Planet
	Stations    []Station
	Name        string
	Author      string
	Description string
}

// returns "" or an error message
func (m *Mission) Check() string {
	if m == nil {
		return "mission is missing"
	}
	if len(m.Stations) == 0 {
		return "no destination station"
	}
	return ""
}
