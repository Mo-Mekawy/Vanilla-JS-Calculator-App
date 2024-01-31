export default function scrollOnChange(el) {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === "childList") el.scrollTo({ left: el.scrollWidth });
    });
  });
  observer.observe(el, { childList: true });

  // return the observer so it can disconnect if needed
  return observer;
}
