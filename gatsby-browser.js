// Gatsby browser API
import "prism-themes/themes/prism-ghcolors.min.css";
import React from "react";
import Layout from "./src/components/Layout";
import { ThemeProvider } from "./src/context/ThemeContext";

export const wrapRootElement = ({ element }) => <ThemeProvider>{element}</ThemeProvider>;

export const wrapPageElement = ({ element, props }) => (
  <Layout {...props}>{element}</Layout>
);
