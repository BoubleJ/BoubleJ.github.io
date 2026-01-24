// Gatsby browser API
import "prism-themes/themes/prism-ghcolors.min.css";
import React from "react";
import Layout from "./src/components/Common/Layout";

export const wrapPageElement = ({ element, props }) => {
    return React.createElement(Layout, props, element);
};