// src/scripts/mermaid.ts — ```mermaid 코드블록을 다이어그램으로 교체한다.
// 렌더러가 붙기 전에는 Prism이 색만 입힌 코드 텍스트로 노출됐다.
//
// 두 가지를 지킨다.
// 1. 다이어그램이 없는 글은 mermaid 번들을 아예 내려받지 않는다 (동적 import).
// 2. 렌더에 실패하면 원래 코드블록을 그대로 남긴다 (기존 동작으로 폴백).

interface Diagram {
  source: string;
  pre: HTMLPreElement;
  host: HTMLElement | null; // 렌더에 성공한 뒤에야 만들어진다
}

const pres = document.querySelectorAll<HTMLPreElement>(
  ".markdown-content pre.language-mermaid",
);

if (pres.length > 0) {
  // 복사 버튼이 pre 안에 들어와 있으므로 code의 텍스트만 읽는다
  const diagrams: Diagram[] = Array.from(pres, (pre) => ({
    source: (pre.querySelector("code") ?? pre).textContent ?? "",
    pre,
    host: null,
  }));

  // 테마 판정은 CommentWidget.astro와 같은 방식이다.
  // body의 테마 클래스명은 번들에 따라 다르게 해석돼서 비교 대상으로 쓸 수 없다.
  let isDark =
    localStorage.getItem("theme") === "dark" ||
    (!localStorage.getItem("theme") &&
      matchMedia("(prefers-color-scheme: dark)").matches);

  (async () => {
    const { default: mermaid } = await import("mermaid");

    mermaid.initialize({
      startOnLoad: false,
      fontFamily:
        '-apple-system, BlinkMacSystemFont, "Apple SD Gothic Neo", "Segoe UI", sans-serif',
    });

    // initialize()의 theme은 첫 렌더 이후 다시 불러도 바뀌지 않는다.
    // 그래서 테마는 다이어그램마다 init 지시자로 넘긴다 — 파싱할 때마다 새로 반영된다.
    const withTheme = (source: string) => {
      if (source.includes("%%{init")) return source; // 글이 직접 지정했으면 건드리지 않는다
      return `%%{init: {"theme": "${isDark ? "dark" : "default"}"}}%%\n${source}`;
    };

    let renderCount = 0;

    const renderAll = async () => {
      await Promise.all(
        diagrams.map(async (diagram) => {
          let svg: string;
          try {
            renderCount += 1;
            ({ svg } = await mermaid.render(
              `mermaid-${renderCount}`,
              withTheme(diagram.source),
            ));
          } catch {
            return; // 문법 오류면 코드블록을 그대로 둔다
          }

          if (!diagram.host) {
            const host = document.createElement("div");
            host.className = "mermaid-diagram";
            diagram.pre.replaceWith(host);
            diagram.host = host;
          }
          diagram.host.innerHTML = svg;
        }),
      );
    };

    await renderAll();

    // ThemeContext.setTheme이 쏘는 이벤트 — 다크모드로 바꾸면 다이어그램도 다시 그린다
    window.addEventListener("themechange", (event) => {
      isDark = (event as CustomEvent<{ theme: string }>).detail?.theme === "dark";
      void renderAll();
    });
  })();
}
