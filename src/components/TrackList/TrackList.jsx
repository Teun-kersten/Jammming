import React from "react";
import styles from "./TrackList.module.css";
import Track from "../Track/Track";

function TrackList({tracks, isRemoval, onAdd, onRemove}) {
    return (
        <div className={styles.TrackList}>
            {tracks.map((track) => (
                <Track 
                key={track.id} 
                track={track} 
                isRemoval={isRemoval} 
                onAdd={onAdd}
                onRemove={onRemove}
                 />
            ))}
        </div>
    );
}

export default TrackList;