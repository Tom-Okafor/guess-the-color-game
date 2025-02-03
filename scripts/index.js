const COLOURS = [
  "#fa6800",
  "#b388ff",
  "#00796b",
  "#647687",
  "#bc8f8f",
  "#cd853f",
  "#8b4513",
  "#ffb7ad",
  "#dc143c",
  "#8b0000",
  "#ad1457",
  "#ff1493",
  "#ff4500",
  "#20b2aa",
  "#008b8b",
  "#ff00ff",
  "#4169e1",
  "#1e90ff",
  "#00cc6a",
  "#34495e",
  "#1abc9c",
  "#abcdef",
  "#fedcba",
  "#ffd700",
];

function generateRandomArrayIndex(array = COLOURS) {
  const randomArrayIndex = Math.floor(Math.random() * array.length);
  return randomArrayIndex;
}

function selectRandomColourAsTarget(colours = COLOURS) {
  return colours[generateRandomArrayIndex()];
}

function pushUniqueItemIntoArray(array, targetColor, colours = COLOURS) {
  const randomIndex = generateRandomArrayIndex();
  // if array already includes the colour at randomIndex or the target colour, recall the function hence generating a new randomIndex.
  if (
    targetColor === colours[randomIndex] ||
    array.includes(colours[randomIndex])
  ) {
    pushUniqueItemIntoArray(array, targetColor);
  } else {
    array.push(colours[randomIndex]);
  }
}

function generateRandomArrayOf5Colours(targetColor) {
  const randomArrayOf5Colours = [];
  for (let i = 0; i < 5; i++) {
    pushUniqueItemIntoArray(randomArrayOf5Colours, targetColor);
  }
  return randomArrayOf5Colours;
}

function shuffleAll6Colours(targetColor) {
  const arrayOf6Colours = [
    ...generateRandomArrayOf5Colours(targetColor),
    targetColor,
  ];
  //array must be shuffled otherwise the target colour will always be at the same position.

  // use array.sort method to shuffle the array based on the result of the computation which either gives a negative -1 or 0. Each result will affect the position of each item.
  arrayOf6Colours.sort((a, b) => Math.round(Math.random()) - 1);
  return arrayOf6Colours;
}

class GameController {
  constructor(targetColor) {
    this.score = 0;
    this.targetColor = targetColor;
    this.colorOptions = shuffleAll6Colours(targetColor);
  }
  //find the target color position in the color options array.
  targetColorPosition() {
    const position = this.colorOptions.findIndex(
      (elem) => elem === this.targetColor
    );
    this.targetColorPosition = position;
  }

  // set the id that will be used to match with the color options buttons to find the button with the accurate colour
  setTargetColorId() {
    this.targetColorId = `color-${this.targetColorPosition + 1}`;
  }

  // set the background colour of the target color div element to the target colour
  setTargetBackgroundColor() {
    const target = document.querySelector(".color-box");
    target.style.backgroundColor = this.targetColor;
  }

  // using the colorOptions array, set individual colours for the color options buttons.
  setColorOptionsBackgroundColors() {
    const colorOptionButtons = document.querySelectorAll(
      ".color-options > button"
    );
    colorOptionButtons.forEach(
      (eachButton, index) =>
        (eachButton.style.backgroundColor = this.colorOptions[index])
    );
  }
}

const a = new GameController(selectRandomColourAsTarget());
console.log(a);
a.targetColorPosition();
a.setTargetColorId();
a.setTargetBackgroundColor();
a.setColorOptionsBackgroundColors();
