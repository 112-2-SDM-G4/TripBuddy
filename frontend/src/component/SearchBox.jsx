import React, {useState} from "react";
import { IoSearch } from "react-icons/io5";

import style from "./SearchBox.module.css";

function SearchBox({ onSearch }) {
    const [query, setQuery] = useState('');

    const handleChange = (event) => {
        setQuery(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        onSearch(query);
    };

    return (
        <form onSubmit={handleSubmit} className={style.container}>
            <input
            type="text"
            value={query}
            onChange={handleChange}
            placeholder="Search..."
            className={style.input}
            />
            <button type="submit" className={style.button}>
                <IoSearch size={17}/>
            </button>
      </form>
    );
}

export default SearchBox;
