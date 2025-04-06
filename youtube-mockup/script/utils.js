export function formatViewCount(viewCount) {
  if (viewCount >= 1000000) {
    return (viewCount / 1000000).toFixed(1) + "M views";
  } else if (viewCount >= 1000) {
    return (viewCount / 1000).toFixed(1) + "K views";
  } else {
    return viewCount + " views";
  }
}
