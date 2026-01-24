// Gatsby browser API
import "prism-themes/themes/prism-ghcolors.min.css";
import React from "react";
import Layout from "@/components/Layout";

export const wrapPageElement = ({ element, props }) => {
    return React.createElement(Layout, props, element);
};