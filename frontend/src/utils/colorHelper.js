export const colorMap = {
  'black': '#000000',
  'white': '#ffffff',
  'navy': '#000080',
  'beige': '#f5f5dc',
  'olive green': '#556b2f',
  'olive': '#808000',
  'red': '#ff0000',
  'blue': '#0000ff',
  'green': '#008000',
  'yellow': '#ffff00',
  'gray': '#808080',
  'grey': '#808080',
  'brown': '#a52a2a',
  'pink': '#ffc0cb',
  'purple': '#800080',
  'orange': '#ffa500',
  'gold': '#ffd700',
  'silver': '#c0c0c0',
  'maroon': '#800000',
  'teal': '#008080',
  'mustard': '#ffdb58',
  'burgundy': '#800020',
  'khaki': '#f0e68c',
  'cream': '#fffdd0',
  'light blue': '#add8e6',
  'dark blue': '#00008b',
  'sage green': '#9dc183',
  'pastel pink': '#ffd1dc'
};

export const getColorCode = (colorName) => {
  if (!colorName) return '#ccc';
  const normalized = colorName.toLowerCase().trim();
  return colorMap[normalized] || normalized.replace(/\s+/g, '');
};
