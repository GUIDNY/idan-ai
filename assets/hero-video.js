document.addEventListener("DOMContentLoaded", () => {
  const video = document.getElementById("hero-video");
  const still = document.getElementById("hero-video-still");
  if (!video || !still) return;

  const SEEN_KEY = "aidanHeroIntroSeen";
  const isMobile = window.matchMedia("(max-width: 800px)").matches;

  function showStillInstantly() {
    still.style.transition = "none";
    still.classList.add("visible");
    video.style.display = "none";
    video.removeAttribute("autoplay");
  }

  let alreadySeen = false;
  try { alreadySeen = localStorage.getItem(SEEN_KEY) === "true"; } catch (e) {}

  // Mobile autoplay is unreliable across browsers/data-saver modes, so we
  // skip the video entirely there and always show the crisp still image.
  if (isMobile || alreadySeen) {
    showStillInstantly();
    return;
  }

  video.addEventListener("ended", () => {
    still.classList.add("visible");
    video.classList.add("faded-out");
    try { localStorage.setItem(SEEN_KEY, "true"); } catch (e) {}
  });
});
