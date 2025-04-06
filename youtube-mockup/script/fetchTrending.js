export async function fetchTrendingVideos(apiKey) {
  const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&chart=mostPopular&regionCode=KR&maxResults=50&key=${apiKey}`;
  const response = await fetch(url);
  return response.json();
}
