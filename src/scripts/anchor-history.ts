document.addEventListener("click", (e) => {
  if (
    e.defaultPrevented ||
    e.button !== 0 ||
    e.metaKey ||
    e.ctrlKey ||
    e.shiftKey ||
    e.altKey
  )
    return;
  const anchor = (e.target as Element).closest?.<HTMLAnchorElement>('a[href^="#"]');
  if (!anchor) return;
  const target = document.getElementById(decodeURIComponent(anchor.hash.slice(1)));
  if (!target) return;
  e.preventDefault();
  target.scrollIntoView();
  history.replaceState(history.state, "", anchor.hash);
});
