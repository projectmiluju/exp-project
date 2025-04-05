const API_KEY = "AIzaSyCNF_xYxweA3f0UTodoLIXDy-BGqLDnCQQ";

const videoContainer = document.getElementById("video-container");
const searchInput = document.getElementById("search-input");
const searchBtn = document.getElementById("search-btn");
const suggestionsBox = document.getElementById("suggestions");
const sidebar = document.getElementById("sidebar");
const menuIcon = document.getElementById("menu-icon");

let nextPageToken = "";
let currentQuery = "";

// 조회수 포맷 함수
function formatViewCount(viewCount) {
  if (viewCount >= 1000000) {
    return (viewCount / 1000000).toFixed(1) + "M views";
  } else if (viewCount >= 1000) {
    return (viewCount / 1000).toFixed(1) + "K views";
  } else {
    return viewCount + " views";
  }
}

// 영상 가져오기
async function fetchTrendingVideos(pageToken = "") {
  let url = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&chart=mostPopular&regionCode=KR&maxResults=50&key=${API_KEY}`;
  if (pageToken) url += `&pageToken=${pageToken}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    nextPageToken = data.nextPageToken;
    renderVideos(data.items);
    autoLoadIfNeeded();
  } catch (error) {
    console.error("트렌딩 비디오 API 호출 실패:", error);
  }
}

// 검색 결과 가져오기
async function fetchVideos(query = "", pageToken = "") {
  let url = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=50&type=video&key=${API_KEY}&q=${query}`;
  if (pageToken) url += `&pageToken=${pageToken}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    nextPageToken = data.nextPageToken;
    const videoIds = data.items.map((item) => item.id.videoId).join(",");
    const videosUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${videoIds}&key=${API_KEY}`;
    const videosResponse = await fetch(videosUrl);
    const videosData = await videosResponse.json();
    renderVideos(videosData.items);
    autoLoadIfNeeded();
  } catch (error) {
    console.error("검색 비디오 API 호출 실패:", error);
  }
}

// 영상 카드 추가
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

// 무한 스크롤
window.addEventListener("scroll", () => {
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
    if (nextPageToken) {
      if (currentQuery) {
        fetchVideos(currentQuery, nextPageToken);
      } else {
        fetchTrendingVideos(nextPageToken);
      }
    }
  }
});

// 스크롤 부족 시 자동 추가 로딩
function autoLoadIfNeeded() {
  if (window.innerHeight >= document.body.scrollHeight - 100) {
    if (nextPageToken) {
      if (currentQuery) {
        fetchVideos(currentQuery, nextPageToken);
      } else {
        fetchTrendingVideos(nextPageToken);
      }
    }
  }
}

// 검색 버튼 클릭
searchBtn.addEventListener("click", () => {
  currentQuery = searchInput.value;
  videoContainer.innerHTML = "";
  fetchVideos(currentQuery);
});

// 엔터 키로 검색
searchInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    currentQuery = searchInput.value;
    videoContainer.innerHTML = "";
    fetchVideos(currentQuery);
  }
});

// 햄버거 메뉴 클릭
menuIcon.addEventListener("click", () => {
  sidebar.classList.toggle("show");
});

fetchTrendingVideos();

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
