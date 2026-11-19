import React, { useState } from "react";
import styles from "./SearchBar.module.css";

function SearchBar({ onSearch }) {
    const [term, setTerm] = useState("");

    const handleTermChange = (e) => {
        setTerm(e.target.value);
    };

    const handleSearch = () => {
        onSearch(term);
    };

    return (
        <div className={styles.SearchBar}>
            <input
                placeholder="Enter A Song, Album, or Artist"
                value={term}
                onChange={handleTermChange}
            />
            <button className={styles.SearchButton} onClick={handleSearch}>
                SEARCH
            </button>
        </div>
    );
}

export default SearchBar;