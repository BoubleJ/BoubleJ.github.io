import React from "react";
import * as styles from "./Sidebar.css";

export default function Sidebar() {
  const categories = [
    {
      title: "Language",
      path: "/language",
    },
    {
      title: "Style Sheet",
      path: "/style",
    },
    {
      title: "Framework / Library",
      path: "/library",
    },
    {
      title: "Platform",
      path: "/platform",
    },
    {
      title: "Computer Science",
      path: "/cs",
    },
    {
      title: "Programming",
      path: "/prgramming",
    },
  ];

  return (
    <div className={styles.wrap}>
      {categories.map((category, index) => {
        return (
          <div key={index}>
            <a href={category.path}>{category.title}</a>
          </div>
        );
      })}
    </div>
  );
}
