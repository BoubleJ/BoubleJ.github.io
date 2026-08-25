// src/scripts/code-copy.ts — PostContent.tsx의 복사 버튼 로직 바닐라 이식 (React/createRoot 의존 제거)
// SVG는 기존 src/components/icon/CopyIcon.tsx / CheckIcon.tsx의 path를 그대로 옮김
const COPY_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" role="img" aria-label="복사"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>`;
const CHECK_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" role="img" aria-label="확인"><path d="M20 6L9 17l-5-5"></path></svg>`;

const root = document.querySelector(".markdown-content");
if (root) {
  root.querySelectorAll("pre").forEach((pre) => {
    if (pre.querySelector(".code-copy-button")) return;

    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "code-copy-button";
    btn.setAttribute("aria-label", "코드 복사");

    const icon = document.createElement("span");
    icon.className = "code-copy-icon";
    icon.setAttribute("aria-hidden", "true");
    icon.innerHTML = COPY_SVG;
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
        icon.innerHTML = CHECK_SVG;
      } catch {
        btn.setAttribute("aria-label", "복사 실패");
      }
      setTimeout(() => {
        if (!btn.isConnected) return;
        btn.classList.remove("copied");
        btn.setAttribute("aria-label", "코드 복사");
        icon.innerHTML = COPY_SVG;
      }, 1500);
    });

    pre.appendChild(btn);
  });
}
