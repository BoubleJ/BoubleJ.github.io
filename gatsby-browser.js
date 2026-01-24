// Gatsby browser API
import "prism-themes/themes/prism-ghcolors.min.css";
import Layout from "./src/components/Common/Layout";

export const wrapPageElement = ({ element, props }) => {
    return <Layout {...props}>{element}</Layout>;
};