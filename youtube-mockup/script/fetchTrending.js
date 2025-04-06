import { formatViewCount } from "./utils.js";

export async function fetchTrendingVideos(apiKey, nextPageToken = "") {
  let url = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&chart=mostPopular&regionCode=KR&maxResults=50&key=${apiKey}`;
  if (nextPageToken) url += `&pageToken=${nextPageToken}`;

  const response = await fetch(url);
  const data = await response.json();
  return data;
}
