const COLOURS = [
  "#fa6800",
  "#708090",
  "#ffe4c4",
  "#647687",
  "#bc8f8f",
  "#cd853f",
  "#8b4513",
  "#800000",
  "#dc143c",
  "#8b0000",
  "#ff69b4",
  "#ff1493",
  "#ff4500",
  "#20b2aa",
  "#008b8b",
  "#ff00ff",
  "#4169e1",
  "#1e90ff",
];

function generateRandomArrayIndex(array = COLOURS) {
  const randomArrayIndex = Math.floor(Math.random() * array.length);
  return randomArrayIndex;
}

function selectRandomColourAsTarget(colours = COLOURS) {
  return colours[generateRandomArrayIndex()];
}

function pushUniqueItemIntoArray(array, colours = COLOURS) {
  const randomIndex = generateRandomArrayIndex();
  // if array already includes the colour at randomIndex, recall the function hence generating a new randomIndex.
  array.includes(colours[randomIndex])
    ? pushUniqueItemIntoArray(array)
    : array.push(colours[randomIndex]);
}

function generateRandomArrayOf5Colours() {
  const randomArrayOf5Colours = [];
  for (let i = 0; i < 5; i++) {
    pushUniqueItemIntoArray(randomArrayOf5Colours);
  }
  return randomArrayOf5Colours;
}

function shuffleAll6Colours(targetColor) {
  const arrayOf6Colours = [...generateRandomArrayOf5Colours(), targetColor];
  //array must be shuffled otherwise the target colour will always be at the same position.

  // use array.sort method to shuffle the array based on the result of the computation which either gives a negative -1 or 0. Each result will affect the position of each item.
  arrayOf6Colours.sort((a, b) => Math.round(Math.random()) - 1);
  return arrayOf6Colours;
}
