import React from "react";
import styles from "./Playlist.module.css";
import TrackList from "../TrackList/TrackList";

function Playlist({playlistName, playlistTracks}) {
    return (
        <div className={styles.Playlist}>
            <input value={playlistName} />
            <TrackList tracks={playlistTracks} isRemoval={true} />
            <button className={styles.SaveButton}>Save to Spotify</button>
        </div>
    );
}

export default Playlist;