import { MDXProvider } from "@mdx-js/react";
import { forwardRef, type MutableRefObject, useEffect, useRef } from "react";
import { createRoot, type Root } from "react-dom/client";
import CheckIcon from "@/components/icon/CheckIcon";
import CopyIcon from "@/components/icon/CopyIcon";
import * as styles from "./PostContent.css";
import "@/styles/markdown.css";

const ICON_SIZE = 24;

interface PostContentProps {
  html?: string;
  body?: string;
}

const PostContent = forwardRef<HTMLDivElement, PostContentProps>(function PostContent(
  { html, body },
  ref,
) {
  const innerRef = useRef<HTMLDivElement | null>(null);

  const setRef = (node: HTMLDivElement | null) => {
    innerRef.current = node;
    if (typeof ref === "function") {
      ref(node);
    } else if (ref) {
      (ref as MutableRefObject<HTMLDivElement | null>).current = node;
    }
  };

  useEffect(() => {
    const root = innerRef.current;
    if (!root) return;

    const buttons: Array<{ button: HTMLButtonElement; iconRoot: Root }> = [];

    const pres = root.querySelectorAll<HTMLPreElement>("pre");

    pres.forEach((pre) => {
      if (pre.querySelector(".code-copy-button")) return;

      const button = document.createElement("button");
      button.type = "button";
      button.className = "code-copy-button";
      button.setAttribute("aria-label", "코드 복사");

      const iconContainer = document.createElement("span");
      iconContainer.className = "code-copy-icon";
      iconContainer.setAttribute("aria-hidden", "true");
      button.appendChild(iconContainer);

      const iconRoot = createRoot(iconContainer);
      iconRoot.render(<CopyIcon size={ICON_SIZE} />);
      buttons.push({ button, iconRoot });

      const handleClick = async () => {
        const code = pre.querySelector("code")?.textContent ?? pre.textContent ?? "";
        try {
          if (navigator.clipboard?.writeText) {
            await navigator.clipboard.writeText(code);
          } else {
            const textarea = document.createElement("textarea");
            textarea.value = code;
            textarea.style.position = "fixed";
            textarea.style.top = "-9999px";
            document.body.appendChild(textarea);
            textarea.focus();
            textarea.select();
            document.execCommand("copy");
            document.body.removeChild(textarea);
          }

          button.classList.add("copied");
          button.setAttribute("aria-label", "복사 완료");
          iconRoot.render(<CheckIcon size={ICON_SIZE} />);

          setTimeout(() => {
            if (!button.isConnected) return;
            button.classList.remove("copied");
            button.setAttribute("aria-label", "코드 복사");
            iconRoot.render(<CopyIcon size={ICON_SIZE} />);
          }, 1500);
        } catch {
          button.setAttribute("aria-label", "복사 실패");
          setTimeout(() => {
            if (!button.isConnected) return;
            button.setAttribute("aria-label", "코드 복사");
          }, 1500);
        }
      };

      button.addEventListener("click", handleClick);
      pre.appendChild(button);
    });

    return () => {
      buttons.forEach(({ button, iconRoot }) => {
        iconRoot.unmount();
        button.remove();
      });
    };
  }, [html, body, ref]);

  if (body) {
    return (
      <div ref={setRef} className={`${styles.markdownRenderer} markdown-content`}>
        <MDXProvider>{body}</MDXProvider>
      </div>
    );
  }

  return (
    <div
      ref={setRef}
      className={`${styles.markdownRenderer} markdown-content`}
      dangerouslySetInnerHTML={{ __html: html || "" }}
    />
  );
});

export default PostContent;
