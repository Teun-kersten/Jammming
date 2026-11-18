import React from "react";
import styles from "./Track.module.css";

function Track({track, isRemoval, onAdd, onRemove}) {

    const handleAdd = () => {
        onAdd(track);
    };

    const handleRemove = () => {
        onRemove(track);
    };

    return (
        <div className={styles.Track}>
            <div className={styles.TrackInformation}>
                <h3>{track.name}</h3>
                <p>{track.artist} | {track.album}</p>
            </div>
            {isRemoval ? (
                <button className={styles.Remove} onClick={handleRemove}>-</button>
            ) : (
                <button className={styles.Add} onClick={handleAdd}>+</button>
            )}
        </div>
    );
}

export default Track;