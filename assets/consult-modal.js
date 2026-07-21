document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("consult-modal");
  const openBtn = document.getElementById("consult-open");
  const closeBtn = document.getElementById("consult-close");
  const backdrop = document.getElementById("consult-backdrop");
  if (!modal || !openBtn) return;

  function open() {
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function close() {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  openBtn.addEventListener("click", open);
  if (closeBtn) closeBtn.addEventListener("click", close);
  if (backdrop) backdrop.addEventListener("click", close);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("open")) close();
  });
});
