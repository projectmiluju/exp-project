export function setupInfiniteScroll(callback) {
  window.addEventListener("scroll", () => {
    if (
      window.innerHeight + window.scrollY >=
      document.body.offsetHeight - 100
    ) {
      callback();
    }
  });
}
