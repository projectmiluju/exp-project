export function setupCategoryFilter(getAllVideos, renderVideos) {
  const categoryButtons = document.querySelectorAll(".category-btn");

  categoryButtons.forEach((button) => {
    button.addEventListener("click", () => {
      categoryButtons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");

      const selectedCategory = button.dataset.category;
      const allVideos = getAllVideos(); // 🔥 최신 영상 가져오기

      if (selectedCategory === "all") {
        renderVideos(allVideos);
      } else {
        const filteredVideos = allVideos.filter((video) => {
          const videoCategoryId = video.snippet.categoryId;
          return videoCategoryId == selectedCategory; // **숫자로 비교**
        });
        renderVideos(filteredVideos);
      }
    });
  });
}
