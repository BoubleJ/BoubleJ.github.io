---
date: "2024-02-20"
title: "[키워드 프로젝트] Redux 활용 전역 객체 관리"
categories:
  ["Keyword"]
summary: "redux toolkit을 활용했다."
thumbnail: "/image/redux.png"
---




redux toolkit을 활용했다.

```jsx
//CategoryFilter.tsx

import Dropdown from "react-bootstrap/Dropdown";
import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import data from "dummyData/CategoryList.json";
import { useDispatch } from "react-redux";
import { pathNameFetch } from "components/feature/FetchSlice";
import { Outlet } from "react-router-dom";

export default function CategoryFilter() {
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  console.log(pathname);

  useEffect(() => {
    setFirCateList(data.firstCategories);
  }, []);

  const [firCateList, setFirCateList] = useState([]);
  const [secCateList, setSecCateList] = useState([]);
  const [thrCateList, setThrCateList] = useState([]);

  const [isSecCateDisabled, setIsSecCateDisabled] = useState(true);
  const [isThrCateDisabled, setIsThrCateDisabled] = useState(true);

  const [firCateTitle, setFirCateTitle] = useState("1차분류");

  const [secCateTitle, setSecCateTitle] = useState("2차분류");

  const [thrCateTitle, setThrCateTitle] = useState("3차분류");

  const thrDropdownSelecthandle = (eventKey: string) => {
    setThrCateTitle(eventKey);
    dispatch(pathNameFetch(pathname));
  };

  const secDropdownSelecthandle = (eventKey: string) => {
    setSecCateTitle(eventKey);
    const List = secCateList.find((item) => item.name == eventKey);

    setIsThrCateDisabled(false);
    setThrCateList((prev) => (prev = List.thirdCategories));

    if (eventKey != secCateTitle) {
      setThrCateTitle("3차분류");
    }
    dispatch(pathNameFetch(pathname));
  };

  const firDropdownSelecthandle = (eventKey: string) => {
    setFirCateTitle(eventKey);
    const List = firCateList.find((item) => item.name == eventKey);

    setIsSecCateDisabled(false);
    setSecCateList((prev) => (prev = List.secondCategories));

    if (eventKey != firCateTitle) {
      setSecCateTitle("2차분류");
      setThrCateTitle("3차분류");
      setIsThrCateDisabled(true);
    }
    dispatch(pathNameFetch(pathname));
  };

  return (
    <>
      <div>
        <div>
          <Dropdown onSelect={firDropdownSelecthandle}>
            <Dropdown.Toggle variant="" id="dropdown-basic">
              {firCateTitle}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {firCateList.map((item, idx) => {
                return (
                  <Dropdown.Item
                    eventKey={item.name}
                    key={idx}
                    as={Link}
                    to={item.categoryId}
                  >
                    {item.name}
                  </Dropdown.Item>
                );
              })}
            </Dropdown.Menu>
          </Dropdown>
        </div>
        <div>
          <Dropdown onSelect={secDropdownSelecthandle}>
            <Dropdown.Toggle
              variant=""
              id="dropdown-basic"
              disabled={isSecCateDisabled}
            >
              {secCateTitle}
            </Dropdown.Toggle>

            <Dropdown.Menu>
              {secCateList.map((item, idx) => {
                return (
                  <Dropdown.Item
                    eventKey={item.name}
                    key={idx}
                    as={Link}
                    to={item.categoryId}
                  >
                    {item.name}
                  </Dropdown.Item>
                );
              })}
            </Dropdown.Menu>
          </Dropdown>
        </div>
        <div>
          <Dropdown onSelect={thrDropdownSelecthandle}>
            <Dropdown.Toggle
              variant=""
              id="dropdown-basic"
              disabled={isThrCateDisabled}
            >
              {thrCateTitle}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {thrCateList.map((item, idx) => {
                return (
                  <Dropdown.Item
                    eventKey={item.name}
                    key={idx}
                    as={Link}
                    to={item.categoryId}
                  >
                    {item.name}
                  </Dropdown.Item>
                );
              })}
            </Dropdown.Menu>
          </Dropdown>
        </div>
        <Outlet></Outlet>
      </div>
    </>
  );
}

```

```jsx
//KeywordInput.tsx

import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";

import { useDispatch } from "react-redux";
import { pathNameFetch } from "components/feature/FetchSlice";

export default function KeywordInput() {
  const keywordNameChange = (e) => {
    dispatch(pathNameFetch(e.target.value));
  };
  const dispatch = useDispatch();

  return (
    <div>
      <p>키워드 검색</p>

      <InputGroup className="mb-3">
        <Form.Control
          placeholder="키워드를 입력해보세요. 예) 원피스"
          aria-label="Recipient's username"
          aria-describedby="basic-addon2"
          onChange={keywordNameChange}
        />
        <Button variant="outline-secondary" id="button-addon2">
          Button
        </Button>
      </InputGroup>
    </div>
  );
}

```

```jsx

//store.tsx

import { configureStore } from "@reduxjs/toolkit";
import FetchSlice from "components/feature/FetchSlice";

export default configureStore({
  reducer: {
    queryString: FetchSlice
}});

```

```jsx

//FetchSlice.tsx

import { createSlice } from "@reduxjs/toolkit";

export const FetchSlice = createSlice({
  name: "queryString",
  initialState: {
    pathName: "",
  },
  reducers: {
    pathNameFetch: (state, action) => {
      state.pathName = action.payload;
    },
  },
});

export const { pathNameFetch } = FetchSlice.actions;

export default FetchSlice.reducer;

```