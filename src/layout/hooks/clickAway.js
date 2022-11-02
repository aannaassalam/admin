export default function clickAway(func, passive) {
  window.addEventListener(
    "click",
    func,
    passive
      ? {
          passive: true,
        }
      : true
  );
}
