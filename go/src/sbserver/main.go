package main

import (
	"crypto/sha1"
	"encoding/base64"
	"encoding/json"
	"flag"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"strings"
)

const (
	HTTP_PORT = "8012"
)

var mimidir string // base directory for mission saving

func answer(w http.ResponseWriter, mess *Message) {
	b, err := json.Marshal(mess)
	if err != nil {
		log.Println("Encoding error : ", err)
		return
	}
	w.Write(b)
}

// saves the mission and returns the key
func save(mimi *Mission) (string, error) {
	b, _ := json.Marshal(mimi)
	hasher := sha1.New()
	hasher.Write(b)
	sha := base64.URLEncoding.EncodeToString(hasher.Sum(nil))
	if i := strings.Index(sha, "="); i != -1 { // removal of the trailing = (I thought base64.URLEncoding wasn't supposed to keep them ?)
		sha = sha[0:i]
	}
	path := filepath.Join(mimidir, string(sha[0]), string(sha[1]))
	os.MkdirAll(path, 0777)
	f, _ := os.Create(filepath.Join(path, sha))
	defer f.Close()
	f.Write(b)
	return sha, nil
}

func serveHTTP(w http.ResponseWriter, hr *http.Request) {
	defer hr.Body.Close()
	w.Header().Set("Access-Control-Allow-Origin", "*")                                               // TODO be more precise !
	w.Header().Set("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept") // vérifier X-Requested-With
	w.Header().Set("Access-Control-Request-Method", "POST")
	w.Header().Set("content-type", "application/x-javascript")
	in := new(Message)
	out := new(Message)
	defer answer(w, out)
	jd := json.NewDecoder(hr.Body)
	err := jd.Decode(in)

	switch in.Code {
	case "save":
		if errmess := in.Mission.Check(); errmess != "" {
			out.Code = "error"
			out.Text = "Invalid mission : " + errmess
			log.Println(out.Text)
			return
		}
		out.Text, err = save(in.Mission)
		if err != nil {
			out.Text = err.Error()
			log.Println(out.Text)
		} else {
			out.Code = "ok"
			log.Println(hr.RemoteAddr + " saved " + out.Text)
		}
	default:
		out.Code = "error"
		out.Text = "Non ho capito la richiesta"
		log.Println(out.Text)
	}
}

func main() {
	mimidirarg := flag.String("mimidir", "/var/www/spacebullet-missions", "Missions directory")
	flag.Parse()
	if *mimidirarg == "" {
		log.Fatal("Mission saving directory not provided")
	}
	mimidir = *mimidirarg
	log.Println("SpaceBulletServer starts on port", HTTP_PORT)
	http.HandleFunc("/", serveHTTP)
	err := http.ListenAndServe(":"+HTTP_PORT, nil)
	if err != nil {
		log.Println("HTTP server start error : ", err)
	}
}
