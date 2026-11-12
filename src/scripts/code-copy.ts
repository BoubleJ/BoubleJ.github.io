const iconTemplate = (id: string) =>
  document.getElementById(id) as HTMLTemplateElement | null;
const copyIcon = iconTemplate("icon-copy");
const checkIcon = iconTemplate("icon-check");

const paintIcon = (host: HTMLElement, template: HTMLTemplateElement | null) => {
  if (!template) return;
  host.replaceChildren(template.content.cloneNode(true));
};

const root = document.querySelector(".markdown-content");
if (root) {
  root.querySelectorAll("pre:not(.language-mermaid)").forEach((pre) => {
    if (pre.querySelector(".code-copy-button")) return;

    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "code-copy-button";
    btn.setAttribute("aria-label", "코드 복사");

    const icon = document.createElement("span");
    icon.className = "code-copy-icon";
    icon.setAttribute("aria-hidden", "true");
    paintIcon(icon, copyIcon);
    btn.appendChild(icon);

    btn.addEventListener("click", async () => {
      const text = pre.querySelector("code")?.textContent ?? pre.textContent ?? "";
      try {
        if (navigator.clipboard?.writeText) {
          await navigator.clipboard.writeText(text);
        } else {
          const ta = document.createElement("textarea");
          ta.value = text;
          ta.style.position = "fixed";
          ta.style.left = "-9999px";
          document.body.appendChild(ta);
          ta.focus();
          ta.select();
          document.execCommand("copy");
          ta.remove();
        }
        btn.classList.add("copied");
        btn.setAttribute("aria-label", "복사 완료");
        paintIcon(icon, checkIcon);
      } catch {
        btn.setAttribute("aria-label", "복사 실패");
      }
      setTimeout(() => {
        if (!btn.isConnected) return;
        btn.classList.remove("copied");
        btn.setAttribute("aria-label", "코드 복사");
        paintIcon(icon, copyIcon);
      }, 1500);
    });

    pre.appendChild(btn);
  });
}
