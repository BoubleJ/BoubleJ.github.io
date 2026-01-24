import React from "react";
import Layout from "@/components/Layout";

export const wrapPageElement = ({ element, props }) => {
    return React.createElement(Layout, props, element);
};
