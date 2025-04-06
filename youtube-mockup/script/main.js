const API_KEY = "AIzaSyAKa5v6A7j6q-BmU2DxfnZ_G9OUPD1OFVg";

import { fetchTrendingVideos } from "./fetchTrending.js";
import { fetchVideos } from "./search.js";
import { setupSidebarToggle } from "./sidebar.js";
import { setupInfiniteScroll } from "./infiniteScroll.js";
import { formatViewCount } from "./utils.js";

const videoContainer = document.getElementById("video-container");
const searchInput = document.getElementById("search-input");
const searchBtn = document.getElementById("search-btn");
const sidebar = document.getElementById("sidebar");
const menuIcon = document.getElementById("menu-icon");

let currentQuery = "";
let nextPageToken = "";

function renderVideos(videos) {
  videos.forEach((video) => {
    const { title, channelTitle, thumbnails } = video.snippet;
    const viewCount = video.statistics
      ? formatViewCount(video.statistics.viewCount)
      : "No views";
    videoContainer.innerHTML += `
      <div class="card">
        <img src="${thumbnails.medium.url}" alt="Video Thumbnail">
        <div class="card-body">
          <h3>${title}</h3>
          <p>${channelTitle}</p>
          <p>${viewCount}</p>
        </div>
      </div>
    `;
  });
}

async function loadTrendingVideos() {
  const data = await fetchTrendingVideos(API_KEY, nextPageToken);
  nextPageToken = data.nextPageToken;
  renderVideos(data.items);
}

async function loadSearchVideos() {
  const data = await fetchVideos(API_KEY, currentQuery, nextPageToken);
  nextPageToken = data.nextPageToken;
  renderVideos(data.items);
}

searchBtn.addEventListener("click", () => {
  currentQuery = searchInput.value;
  videoContainer.innerHTML = "";
  loadSearchVideos();
});

searchInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    currentQuery = searchInput.value;
    videoContainer.innerHTML = "";
    loadSearchVideos();
  }
});

setupSidebarToggle(menuIcon, sidebar);

setupInfiniteScroll(() => {
  if (currentQuery) {
    loadSearchVideos();
  } else {
    loadTrendingVideos();
  }
});

loadTrendingVideos();

// 유튜브 추천어 가져오기
// let activeSuggestionIndex = -1;
// async function fetchSuggestions(query) {
//   const proxyUrl = "https://cors-anywhere.herokuapp.com/";
//   const realUrl = `https://suggestqueries.google.com/complete/search?client=firefox&ds=yt&q=${query}`;
//   try {
//     const response = await fetch(proxyUrl + realUrl, {
//       headers: {
//         "X-Requested-With": "XMLHttpRequest",
//       },
//     });
//     const data = await response.json();
//     return data[1];
//   } catch (error) {
//     console.error("자동완성 API 실패:", error);
//     return [];
//   }
// }

// 추천어 리스트 보여주기
// async function showSuggestions() {
//   const query = searchInput.value.toLowerCase();
//   if (!query) {
//     suggestionsBox.style.display = "none";
//     return;
//   }
//   const suggestions = await fetchSuggestions(query);
//   suggestionsBox.innerHTML = "";
//   suggestions.forEach((suggestion, index) => {
//     const div = document.createElement("div");
//     div.classList.add("suggestion-item");
//     div.innerText = suggestion;
//     div.addEventListener("click", () => {
//       searchInput.value = suggestion;
//       suggestionsBox.style.display = "none";
//       currentQuery = suggestion;
//       videoContainer.innerHTML = "";
//       fetchVideos(currentQuery);
//     });
//     suggestionsBox.appendChild(div);
//   });
//   suggestionsBox.style.display = suggestions.length > 0 ? "block" : "none";
// }

// function updateActiveSuggestion(items) {
//   items.forEach((item) => item.classList.remove("active"));
//   if (items[activeSuggestionIndex]) {
//     items[activeSuggestionIndex].classList.add("active");
//   }
// }

// searchInput.addEventListener("keydown", (e) => {
//   const items = suggestionsBox.querySelectorAll(".suggestion-item");
//   if (e.key === "ArrowDown") {
//     activeSuggestionIndex++;
//     if (activeSuggestionIndex >= items.length) activeSuggestionIndex = 0;
//     updateActiveSuggestion(items);
//   } else if (e.key === "ArrowUp") {
//     activeSuggestionIndex--;
//     if (activeSuggestionIndex < 0) activeSuggestionIndex = items.length - 1;
//     updateActiveSuggestion(items);
//   } else if (e.key === "Enter") {
//     if (activeSuggestionIndex >= 0 && items[activeSuggestionIndex]) {
//       searchInput.value = items[activeSuggestionIndex].innerText;
//       suggestionsBox.style.display = "none";
//       currentQuery = searchInput.value;
//       videoContainer.innerHTML = "";
//       fetchVideos(currentQuery);
//     } else {
//       currentQuery = searchInput.value;
//       videoContainer.innerHTML = "";
//       fetchVideos(currentQuery);
//     }
//   }
// });
// searchInput.addEventListener("input", showSuggestions);
