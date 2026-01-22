import React, { useState, FormEvent, ChangeEvent } from "react";
import { navigate } from "gatsby";
import * as styles from "./SearchBox.css";


interface SearchBoxProps {
  initialValue?: string;
}

function SearchBox({ initialValue = "" }: SearchBoxProps) {
  const [searchTerm, setSearchTerm] = useState<string>(initialValue);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmedSearchTerm = searchTerm.trim();
    
    if (trimmedSearchTerm) {
      navigate(`/?search=${encodeURIComponent(trimmedSearchTerm)}`);
    } else {
      navigate(`/`);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className={styles.searchBoxWrapper}>
      <form onSubmit={handleSubmit} style={{ display: "flex", width: "100%" }}>
        <input
          type="text"
          className={styles.searchInput}
          placeholder="포스트 제목, 요약으로 검색..."
          value={searchTerm}
          onChange={handleChange}
        />
        <button type="submit" className={styles.searchButton}>
          검색
        </button>
      </form>
    </div>
  );
}

export default SearchBox;
