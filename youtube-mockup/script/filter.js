export function setupCategoryFilter(allVideos, renderVideos) {
  const categoryButtons = document.querySelectorAll(".category-btn");

  categoryButtons.forEach((button) => {
    button.addEventListener("click", () => {
      // 모든 버튼 active 제거
      categoryButtons.forEach((btn) => btn.classList.remove("active"));
      // 클릭한 버튼 active 추가
      button.classList.add("active");

      const selectedCategory = button.dataset.category;

      if (selectedCategory === "전체") {
        renderVideos(allVideos);
      } else {
        const filtered = allVideos.filter((video) => {
          const title = video.snippet.title || "";
          const description = video.snippet.description || "";
          return (
            title.includes(selectedCategory) ||
            description.includes(selectedCategory)
          );
        });
        renderVideos(filtered);
      }
    });
  });
}
