import React from "react";
import styles from "./Playlist.module.css";
import TrackList from "../TrackList/TrackList";

function Playlist({playlistName, playlistTracks, onRemove, onNameChange}) {

    const handleNameChange = (event) => {
        onNameChange(event.target.value);
    }

    return (
        <div className={styles.Playlist}>
            <input 
                value={playlistName} 
                onChange={handleNameChange} 
            />
            <TrackList tracks={playlistTracks} isRemoval={true} onRemove={onRemove} />
            <button className={styles.SaveButton}>Save to Spotify</button>
        </div>
    );
}

export default Playlist;