import React, { useState } from "react";
import styles from "./App.module.css";
import SearchBar from "./components/SearchBar/SearchBar";
import SearchResults from "./components/SearchResults/SearchResults";
import Playlist from "./components/Playlist/Playlist";

function App() {
    const [searchResults, setSearchResults] = useState([
      {id: 1, name: "Chemical", artist: "Post Malone", album: "Austin"}, 
      {id: 2, name: "Money for Nothing", artist: "Dire Straits", album: "Brothers in Arms"}, 
      {id: 3, name: "Africa", artist: "Toto", album: "Toto IV"},
    ]);
    const [playlistName, setPlaylistName] = useState("My new playlist");
    const [playlistTracks, setPlaylistTracks] = useState([
      {id: 4, name: "Roxanne", artist: "The Police", album: "Outlandos d'Amour"},
    ]);

    const addTrack = (track) => {
        if (playlistTracks.some((savedTrack) => savedTrack.id === track.id)) {
            return;
        }
        setPlaylistTracks((prevTracks) => [...prevTracks, track]);
    }

    const removeTrack = (track) => {
        setPlaylistTracks((prevTracks) => 
            prevTracks.filter((savedTrack) => savedTrack.id !== track.id));
    }

    const changePlaylistName = (newName) => {
        setPlaylistName(newName);
    }

    return (
        <div>
            <h1>Let's Jammm!</h1>
            <div className={styles.App}>
                <SearchBar />
                <div className={styles.AppPlaylists}>
                    <SearchResults searchResults={searchResults} onAdd={addTrack} />
                    <Playlist 
                    playlistName={playlistName} 
                    playlistTracks={playlistTracks}
                    onRemove={removeTrack} 
                    onNameChange={changePlaylistName}
                    />
                </div>
            </div>
        </div>
    );
}

export default App;
