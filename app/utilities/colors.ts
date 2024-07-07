const colors = [
  "#FF6F61", // Coral
  "#6B5B95", // Purple Haze
  "#88B04B", // Greenery
  "#F7CAC9", // Rose Quartz
  "#92A8D1", // Serenity
  "#955251", // Marsala
  "#B565A7", // Orchid
  "#009B77", // Sea Green
  "#DD4124", // Red Orange
  "#45B8AC", // Mint
  "#EFC050", // Yellow Gold
  "#5B5EA6", // Royal Blue
  "#9B2335", // Dark Red
  "#DFCFBE", // Sand
  "#55B4B0", // Turquoise
  "#E15D44", // Burnt Orange
  "#7FCDCD", // Light Turquoise
  "#BC243C", // Crimson
  "#C3447A", // Fuchsia
  "#98B4D4", // Light Blue
];

// Function to pick a random color
export function getRandomColor() {
  const randomIndex = Math.floor(Math.random() * colors.length);
  return colors[randomIndex];
}
