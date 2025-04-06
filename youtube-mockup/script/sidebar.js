export function setupSidebarToggle(menuIcon, sidebar) {
  menuIcon.addEventListener("click", () => {
    sidebar.classList.toggle("show");
  });
}
