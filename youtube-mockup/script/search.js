import { formatViewCount } from "./utils.js";

export async function fetchVideos(apiKey, query, nextPageToken = "") {
  let url = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=50&type=video&key=${apiKey}&q=${query}`;
  if (nextPageToken) url += `&pageToken=${nextPageToken}`;

  const response = await fetch(url);
  const data = await response.json();
  const videoIds = data.items.map((item) => item.id.videoId).join(",");
  const videosUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${videoIds}&key=${apiKey}`;
  const videosResponse = await fetch(videosUrl);
  const videosData = await videosResponse.json();
  return videosData;
}
