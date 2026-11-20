import React, { useState } from "react";
import styles from "./App.module.css";
import SearchBar from "./components/SearchBar/SearchBar";
import SearchResults from "./components/SearchResults/SearchResults";
import Playlist from "./components/Playlist/Playlist";
import Spotify from "./util/Spotify";

function App() {
    const [searchResults, setSearchResults] = useState([]);
    const [playlistName, setPlaylistName] = useState("My new playlist");
    const [playlistTracks, setPlaylistTracks] = useState([]);

    const search = async (term) => {
        const results = await Spotify.search(term);
        setSearchResults(results);
    }

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

    const savePlaylist = async () => {
        const trackURIs = playlistTracks.map((track) => track.uri);
        const saved = await Spotify.savePlaylist(playlistName, trackURIs);
        console.log(`Saving playlist: ${playlistName}`);
        console.log("Track URIs:", trackURIs);

        setPlaylistTracks([]);
        setPlaylistName("New Playlist");
    }

    const playlistTrackids = new Set(playlistTracks.map((track) => track.id));
    const filteredSearchResults = searchResults.filter(
        (track) => !playlistTrackids.has(track.id));

    return (
        <div>
            <h1>Let's Jammm!</h1>
            <div className={styles.App}>
                <SearchBar onSearch={search} />
                <div className={styles.AppPlaylists}>
                    <SearchResults searchResults={filteredSearchResults} onAdd={addTrack} />
                    <Playlist 
                    playlistName={playlistName} 
                    playlistTracks={playlistTracks}
                    onRemove={removeTrack} 
                    onNameChange={changePlaylistName}
                    onSave={savePlaylist}
                    />
                </div>
            </div>
        </div>
    );
}

export default App;
