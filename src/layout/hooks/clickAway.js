export default function clickAway(func) {
  window.addEventListener("click", func, {
    passive: true,
  });
}
