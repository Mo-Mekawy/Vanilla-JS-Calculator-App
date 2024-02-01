/**
 * @module js/animations/scrollOnChange
 */

/**
 * @description make an elements last child always visible
 * by scrolling to the end when any child or text is added
 * @function scrollOnChange
 * @param {Element} el the element to observe
 * @returns {MutationObserver} observer so it can disconnect if needed
 */
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
