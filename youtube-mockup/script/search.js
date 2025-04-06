import { formatViewCount } from "./utils.js";

export async function fetchVideos(apiKey, query) {
  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=50&q=${query}&regionCode=KR&key=${apiKey}`;
  const response = await fetch(url);
  return response.json();
}
