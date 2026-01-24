import React from "react";
import { Link } from "gatsby";
import * as styles from "./CategoryList.css";

export interface CategoryListProps {
  selectedCategory: string;
  categoryList: {
    [key: string]: number;
  };
}

function CategoryList({ selectedCategory, categoryList }: CategoryListProps) {
  return (
    <div className={styles.categoryListWrapper}>
      {Object.entries(categoryList).map(([name, count]) => (
        <Link
          to={`/post?category=${name}`}
          className={`${styles.categoryItem} ${
            name === selectedCategory ? styles.categoryItemActive : ""
          }`}
          key={name}
        >
          #{name}({count})
        </Link>
      ))}
    </div>
  );
}

export default CategoryList;
