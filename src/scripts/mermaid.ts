interface Diagram {
  source: string;
  pre: HTMLPreElement;
  host: HTMLElement | null;
}

const pres = document.querySelectorAll<HTMLPreElement>(
  ".markdown-content pre.language-mermaid",
);

if (pres.length > 0) {
  const diagrams: Diagram[] = Array.from(pres, (pre) => ({
    source: (pre.querySelector("code") ?? pre).textContent ?? "",
    pre,
    host: null,
  }));

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

    const withTheme = (source: string) => {
      if (source.includes("%%{init")) return source;
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
            return;
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

    window.addEventListener("themechange", (event) => {
      isDark = (event as CustomEvent<{ theme: string }>).detail?.theme === "dark";
      void renderAll();
    });
  })();
}
