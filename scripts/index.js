const COLOURS = [
  "#fa6800",
  "#b388ff",
  "#b0c9ab",
  "#647687",
  "#bc8f8f",
  "#cd853f",
  "#804513",
  "#ffb7ad",
  "#dc143c",
  "#8b0000",
  "#ad1457",
  "#ff1493",
  "#ffc500",
  "#a0b2aa",
  "#008b8b",
  "#a9c1ff",
  "#4169e1",
  "#1e90ff",
  "#00cc6a",
  "#34495e",
  "#1abc9c",
  "#abcdef",
  "#cc0fa2",
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

  // using array.sort method to shuffle the array based on the result of the computation which either gives a -1 or 0. Each result will affect the position of each item. Shuffle it twice for efficient scattering.
  arrayOf6Colours
    .sort(() => Math.round(Math.random()) - 1)
    .sort(() => Math.round(Math.random()) - 1);
  return arrayOf6Colours;
}

class GameController {
  constructor(targetColor) {
    this.score = 0;
    this.targetColor = targetColor;
    this.colorOptions = shuffleAll6Colours(targetColor);
    this.colorChoice = null;
  }
  //find the target color position in the color options array.
  setTargetColorPosition() {
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

  setPlayerColorChoice(choice) {
    this.colorChoice = choice;
  }

  compareColorChoiceAndTargetColor() {
    return this.colorChoice === this.targetColorId;
  }

  setNewColourGroup() {
    this.targetColor = selectRandomColourAsTarget();
    this.colorOptions = shuffleAll6Colours(this.targetColor);
    this.setUpGame();
  }
  restartGame() {
    this.score = 0;
    this.setNewColourGroup();
  }

  setUpGame() {
    this.setTargetColorPosition();
    this.setTargetBackgroundColor();
    this.setTargetColorId();
    this.setColorOptionsBackgroundColors();
    this.setScore();
  }

  playAudio(src) {
    const audio = new Audio(src);
    audio.play();
  }

  setScore() {
    const score = document.getElementById("score");
    score.innerText = this.score;
  }

  handleColorOptionButtonClick() {
    const colorOptionButtons = document.querySelectorAll(
      ".color-options > button"
    );
    colorOptionButtons.forEach((colorButton) => {
      const colorId = colorButton.id;
      colorButton.addEventListener("click", () => {
        this.setPlayerColorChoice(colorId);
        this.playAudio("assets/sounds/select.mp3");
      });
    });
  }

  handleConfirmChoiceButtonClick() {
    const confirmChoiceButton = document.getElementById("confirm");
    confirmChoiceButton.addEventListener("click", () => {
      this.colorChoice
        ? this.compareColorChoiceAndTargetColor()
          ? this.playerMadeRightChoice()
          : this.playerMadeWrongChoice()
        : this.sendErrorMessage();
    });
  }

  playerMadeRightChoice() {
    this.incrementScore();
    this.setScore();
    this.showChoiceVerdict("--congratulations");
    this.displayGameStatus("Way to go Eyes! CORRECT!");
    this.playAudio("assets/sounds/applause.mp3");
  }

  playerMadeWrongChoice() {
    this.showChoiceVerdict("--wrong");
    this.displayGameStatus("Now why would you flop that? WRONG!");
    this.playAudio("assets/sounds/boo.mp3");
  }

  showChoiceVerdict(imageVar) {
    const statusImageHolder = document.querySelector(".displayStatusImage");
    statusImageHolder.style.backgroundImage = `var(${imageVar})`;
    statusImageHolder.classList.add("shown");
    setTimeout(() => {
      this.setNewColourGroup();
      statusImageHolder.classList.remove("shown");
      statusImageHolder.style.backgroundImage = "";
      this.colorChoice = null;
    }, 2500);
  }

  sendErrorMessage() {
    const errorMessage = "Hey! You have to select a colour before you confirm.";
    const errorMessageElem = document.getElementById("errorMessage");
    errorMessageElem.innerText = errorMessage;
    this.playAudio("assets/sounds/error.mp3");
    setTimeout(() => {
      errorMessageElem.innerText = "";
    }, 2000);
  }

  displayGameStatus(message) {
    const gameStatusElement = document.querySelector(".status");
    gameStatusElement.innerText = message;
    gameStatusElement.classList.add("shown");
    setTimeout(() => {
      gameStatusElement.classList.remove("shown");
      gameStatusElement.innerText = "";
    }, 2500);
  }

  incrementScore() {
    this.score = ++this.score;
  }

  addClickEventToRestartButton() {
    const restartGameButton = document.getElementById("restart");
    restartGameButton.addEventListener("click", () => {
      this.playAudio("assets/sounds/click.mp3");
      this.openRestartWarningBox();
      this.cancelRestart();
      this.confirmRestart();
    });
  }

  openRestartWarningBox() {
    const restartGameWarning = document.querySelector(".warning");
    restartGameWarning.style.display = "block";
  }

  confirmRestart() {
    const confirmRestartBtn = document.getElementById("confirmRestart");
    confirmRestartBtn.onclick = () => {
      this.restartGame();
      this.closeRestartWarningBox();
    };
  }
  cancelRestart() {
    const cancelRestartBtn = document.getElementById("cancelRestart");
    cancelRestartBtn.onclick = () => {
      this.closeRestartWarningBox();
    };
  }
  closeRestartWarningBox() {
    const restartGameWarning = document.querySelector(".warning");
    restartGameWarning.style.display = "none";
  }
}

const game = () => {
  const newGame = new GameController(selectRandomColourAsTarget());
  newGame.setUpGame();
  newGame.handleColorOptionButtonClick();
  newGame.handleConfirmChoiceButtonClick();
  newGame.addClickEventToRestartButton();
};

game();
