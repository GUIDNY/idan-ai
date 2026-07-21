document.addEventListener("DOMContentLoaded", () => {
  const video = document.getElementById("hero-video");
  const still = document.getElementById("hero-video-still");
  if (!video || !still) return;

  const SEEN_KEY = "aidanHeroIntroSeen";

  let alreadySeen = false;
  try { alreadySeen = localStorage.getItem(SEEN_KEY) === "true"; } catch (e) {}

  if (alreadySeen) {
    still.style.transition = "none";
    still.style.opacity = "0.4";
    video.style.display = "none";
    video.removeAttribute("autoplay");
    return;
  }

  video.addEventListener("ended", () => {
    still.classList.add("visible");
    video.classList.add("faded-out");
    try { localStorage.setItem(SEEN_KEY, "true"); } catch (e) {}
  });
});
