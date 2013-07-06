package main

type Position struct {
	X float32 "x"
	Y float32 "y"
}

type Gun struct {
	Position
	R        float32      "r"
	ShowPath bool         "showPath"
	Lines    [][]Position "lines"
}

type Planet struct {
	Position
	R     float32 "r"
	Fixed bool    "fixed"
}

type Station Position

type Mission struct {
	Guns        []Gun     "guns"
	Planets     []Planet  "planets"
	Stations    []Station "stations"
	Name        string    "name"
	Author      string    "author"
	Description string    "description"
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
