import { createRef, useEffect } from "react";
import * as styles from "./CommentWidget.css";

const src = "https://utteranc.es/client.js";
const repo = "BoubleJ/BoubleJ.github.io";

type UtterancesAttributesType = {
  src: string;
  repo: string;
  "issue-term": string;
  label: string;
  theme: string;
  crossorigin: string;
  async: string;
};

export default function CommentWidget() {
  const element = createRef<HTMLDivElement>();

  useEffect(() => {
    if (element.current === null) return;

    const utterances: HTMLScriptElement = document.createElement("script");

    const attributes: UtterancesAttributesType = {
      src,
      repo,
      "issue-term": "pathname",
      label: "Comment",
      theme: `github-light`,
      crossorigin: "anonymous",
      async: "true",
    };

    Object.entries(attributes).forEach(([key, value]) => {
      utterances.setAttribute(key, value);
    });

    element.current.appendChild(utterances);
  }, [element.current]);

  return <div className={styles.utterancesWrapper} ref={element} />;
}
