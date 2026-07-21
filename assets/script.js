document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.querySelector(".menu-toggle");
  const links = document.querySelector(".nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", () => {
      const open = links.style.display === "flex";
      links.style.display = open ? "none" : "flex";
      links.style.flexDirection = "column";
      links.style.position = "absolute";
      links.style.top = "64px";
      links.style.insetInlineEnd = "20px";
      links.style.background = "#12151f";
      links.style.border = "1px solid #262b3a";
      links.style.borderRadius = "12px";
      links.style.padding = "16px 24px";
    });
  }
});
