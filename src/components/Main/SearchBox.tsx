import React, { useState, FormEvent, ChangeEvent } from "react";
import styled from "@emotion/styled";
import { navigate } from "gatsby";

const SearchBoxWrapper = styled.div`
  display: flex;
  width: 768px;
  margin: 50px auto 0;

  @media (max-width: 768px) {
    width: 100%;
    padding: 0 20px;
  }
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 12px 16px;
  font-size: 16px;
  border: 2px solid #e0e0e0;
  border-radius: 8px 0 0 8px;
  outline: none;
  transition: border-color 0.3s;

  &:focus {
    border-color: #485563;
  }

  &::placeholder {
    color: #999;
  }
`;

const SearchButton = styled.button`
  padding: 12px 24px;
  font-size: 16px;
  font-weight: 600;
  color: #ffffff;
  background-color: #485563;
  border: 2px solid #485563;
  border-radius: 0 8px 8px 0;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #29323c;
  }

  &:active {
    transform: scale(0.98);
  }
`;

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
    <SearchBoxWrapper>
      <form onSubmit={handleSubmit} style={{ display: "flex", width: "100%" }}>
        <SearchInput
          type="text"
          placeholder="포스트 제목, 요약으로 검색..."
          value={searchTerm}
          onChange={handleChange}
        />
        <SearchButton type="submit">검색</SearchButton>
      </form>
    </SearchBoxWrapper>
  );
}

export default SearchBox;
