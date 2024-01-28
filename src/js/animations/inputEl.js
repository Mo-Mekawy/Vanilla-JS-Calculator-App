const scrollToEnd = (el) => el.scrollTo({ left: el.scrollWidth });

export default function scrollOnChange(el) {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === "childList") scrollToEnd(el);
    });
  });
  observer.observe(el, { childList: true });
}
