const COLOURS = [
  "#ef5350",
  "#d50000",
  "#f48fb1",
  "#880e4f",
  "#f50057",
  "#ce93d8",
  "#4a148c",
  "#651fff",
  "#8c9eff",
  "#82b1ff",
  "#006064",
  "#18ffff",
  "#00897b",
  "#66bb6a",
  "#64dd17",
  "#827717",
  "#ffd600",
  "#f57f17",
  "#e65100",
  "#d7ccc8",
  "#6d4c41",
  "#660f01",
  "#616161",
  "#d2b48c",
  "#bc8f8f",
  "#bdb76b",
  "#00fa9a",
  "#e6e6fa",
  "#76608a",
  "#34495e",
  "#cd5c5c",
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

  // Shuffle it twice using the array.sort helper for efficient scattering.
  arrayOf6Colours
    .sort(() => Math.round(Math.random()) - 1)
    .sort(() => Math.round(Math.random()) - 1);
  return arrayOf6Colours;
}

// one of these will be displayed each time the player chooses the right colour.
const correctStatuses = [
  "Way to go Eyes! CORRECT!",
  "Well, look at you, the color wizard! Nailed it!",
  "You must have x-ray vision! Spot on.",
  "Yup! Someone’s got an eye for colors.",
  "Colors bow down to you! Nice job.",
  "You’re like the Picasso of this game. Correct!",
  "Who knew you had a PhD in colorology? Correct!",
  "Absolutely, positively, indisputably correct!",
  "You’re practically a rainbow whisperer. Spot on!",
  "Guess who’s a color genius? Spoiler: It’s you.",
  "Phew! You created colours, Honey!",
  "Your eyes belong in a MUSEUM! CORRECT!",
  "Nah! You're just too good, fren.",
];

// one of these will be displayed each time the player chooses the wrong colour.
const wrongStatuses = [
  "Now why would you flop that? WRONG!",
  "Well, that’s a nope. Better luck next time!",
  "Oops, did your eyes take a nap? Try again.",
  "Nope, that color missed the memo.",
  "Your eyes are playing tricks on you. Try again.",
  "Gurl... Maybe you need glasses.",
  "Well, that was colorful… but wrong.",
  "Darling, that was... uhmm... un(colored)for",
  "Color blindness is real!",
  "Color fail of epic proportions!",
  "One more of this, and I'm calling the color Police. #WTF",
  "WELP! Even blind Barthimeus could've gotten that.",
  "Your eyes have to be decorative objects. Nah!",
  "I'm afraid nothing can be done for those eyes of yours boo. Sorry.",
];

function randomStatusMessage(category) {
  return category[generateRandomArrayIndex(category)];
}

// everything needed to successful run the game smoothly.
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

  // set a new target color along with the color options
  setNewColourGroup() {
    this.targetColor = selectRandomColourAsTarget();
    this.colorOptions = shuffleAll6Colours(this.targetColor);
    this.setUpGame();
  }

  // reset game to its original state
  restartGame() {
    this.score = 0;
    this.setNewColourGroup();
  }

  // set everything in place for each level
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

  // check for accuracy when the confirm button is clicked and respond with the accurate method.
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

  // if player makes the right choice then:
  playerMadeRightChoice() {
    this.incrementScore();
    this.setScore();
    this.showChoiceVerdict("--congratulations");
    this.displayGameStatus(randomStatusMessage(correctStatuses));
    this.playAudio("assets/sounds/applause.mp3");
  }

  // if player makes the wrong choice then:
  playerMadeWrongChoice() {
    this.showChoiceVerdict("--wrong");
    this.displayGameStatus(randomStatusMessage(wrongStatuses));
    this.playAudio("assets/sounds/boo.mp3");
  }

  // display an image that corresponds with the user's accuracy: right or wrong.
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

  // if the player tries to submit without choosing a color then:
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

  // show a warning box when player tries to restart
  openRestartWarningBox() {
    const restartGameWarning = document.querySelector(".warning");
    restartGameWarning.style.display = "block";
  }

  // if player really wants to restart then:
  confirmRestart() {
    const confirmRestartBtn = document.getElementById("confirmRestart");
    confirmRestartBtn.onclick = () => {
      this.restartGame();
      this.closeRestartWarningBox();
    };
  }

  // do not restart the game and remove the warning box
  cancelRestart() {
    const cancelRestartBtn = document.getElementById("cancelRestart");
    cancelRestartBtn.onclick = () => {
      this.closeRestartWarningBox();
    };
  }

  // close the warning box
  closeRestartWarningBox() {
    const restartGameWarning = document.querySelector(".warning");
    restartGameWarning.style.display = "none";
  }
}

// create an instance of the game controller and VIOLA!!
const game = () => {
  const newGame = new GameController(selectRandomColourAsTarget());
  newGame.setUpGame();
  newGame.handleColorOptionButtonClick();
  newGame.handleConfirmChoiceButtonClick();
  newGame.addClickEventToRestartButton();
};

game();

//phew, this was something! Thank you HNG!!!
