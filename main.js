"use strict";

// Selecting all the elements

const spinner = document.querySelector(".spinner");
const navigation = document.querySelector(".navigation");
const categoryContainer = document.querySelector(".category");
const card = document.querySelectorAll(".card");
const startBtn = document.querySelector(".start-quiz-button");
const quiz = document.querySelector(".quiz-section");
const timerSection = document.querySelector(".time-left");
const rightAudio = document.querySelector(".right-audio");
const wrongAudio = document.querySelector(".wrong-audio");
const timeAudio = document.querySelector(".time-audio");
const winnerAudio = document.querySelector(".winner-audio");
const highAudio = document.querySelector(".high-audio");
const answerAll = document.querySelectorAll(".answer");
const instructionModal = document.querySelector(".instr-window");
const exitBtn = document.querySelector(".exit");
const continueBtn = document.querySelector(".continue");
const nextBtn = document.querySelector(".next");
const scoreSection = document.querySelector(".score-section");
const scoreMiddle = document.querySelector(".score-middle-section");
const scoreExit = document.querySelector(".score-exit");
const replay = document.querySelector(".score-replay");
const checkHighScore = document.querySelector(".check-highScore");
const highScoreModal = document.querySelector(".highscoreModal");
const highscoreGif = document.querySelector(".animation");

//All global variables

let correct_answer;

let timer;

let nextClick = 0;

let valueOfCard;

let score = 0;

let highScore = 0;

let highscoreStorage;

let answerArray = [];

let num1, num2, num3, num4;

//Required functions

// Executing the timer function of 20second countdown

const timerContainer = function () {
  let seconds = 20;
  const countdown = function () {
    seconds--;
    const html = `<p>Time Left : ${seconds}</p>`;

    document.querySelector(".time-left").innerHTML = "";
    document.querySelector(".time-left").insertAdjacentHTML("beforeend", html);

    if (seconds === 0) {
      changeQuestion(valueOfCard);
      clearInterval(timer);
    }
  };
  timer = setInterval(countdown, 1000);
  return timer;
};

const blurIn = function () {
  navigation.style.filter = "blur(10px)";
  categoryContainer.style.filter = "blur(10px)";
  startBtn.style.filter = "blur(10px)";
  quiz.style.filter = "blur(10px)";
  highScoreModal.style.filter = "blur(10px)";
};

const blurOut = function () {
  navigation.style.filter = "blur(0px)";
  categoryContainer.style.filter = "blur(0px)";
  startBtn.style.filter = "blur(0px)";
  quiz.style.filter = "blur(0px)";
  highScoreModal.style.filter = "blur(0px)";
};

const showInstruction = function () {
  instructionModal.classList.remove("modal-hidden");
  blurIn();
};

const loadSpinner = function () {
  spinner.classList.remove("spinner-hidden");
  blurIn();

  setTimeout(function () {
    spinner.classList.add("spinner-hidden");
    blurOut();
  }, 1500);
};

//Playing audio

const playRightAudio = function () {
  rightAudio.load();
  rightAudio.play();
};

const playWrongAudio = function () {
  wrongAudio.load();
  wrongAudio.play();
};

const playTimeAudio = function () {
  timeAudio.load();
  timeAudio.currentTime = 3;
  timeAudio.play();
};

const playWinnerAudio = function () {
  winnerAudio.load();
  winnerAudio.play();
};

const playHighAudio = function () {
  highAudio.load();
  highAudio.play();
};

const pauseRightAudio = function () {
  rightAudio.pause();
};

const pauseWrongAudio = function () {
  wrongAudio.pause();
};

const pauseTimeAudio = function () {
  timeAudio.pause();
};

const pauseWinnerAudio = function () {
  winnerAudio.pause();
};

const pauseHighAudio = function () {
  highAudio.pause();
};

//Contine and exist button functionality

const continueGame = function () {
  instructionModal.classList.toggle("modal-hidden");
  blurOut();
  check();
  getAPi(valueOfCard);
  playTimeAudio();
};

continueBtn.addEventListener("click", continueGame);

exitBtn.addEventListener("click", function () {
  instructionModal.classList.toggle("modal-hidden");
  blurOut();
});

//Generating the score

const generateHighscore = function () {
  const html = ` <p>Your HighScore is ${highScore}</p>`;

  highScoreModal.innerHTML = "";
  highScoreModal.insertAdjacentHTML("beforeend", html);
};

const generatorScore = function () {
  const html = ` <p>Congratulations🎉You have scored ${score} out of 10</p>`;
  scoreMiddle.innerHTML = "";
  scoreMiddle.insertAdjacentHTML("beforeend", html);
  generateHighscore();
};

//Generating a general quiz html on the basis of response gotten

const generateHtml = function (data) {
  const html = ` <div class="upper-section">
    <h3>Quiz Hub</h3>

    <div class="time-left">
    <p>Time Left : 20</p>
    </div>
  </div>

  <div class="main-section">
    <p class="question">${nextClick + 1}.${data.results[0].question}</p>

    <p class="answer answer-1">${answerArray[0]}</p>
    <p class="answer answer-2">${answerArray[1]}</p>
    <p class="answer answer-3">${answerArray[2]}</p>
    <p class="answer answer-4">${answerArray[3]}</p>
  </div>

  <div class="bottom-section">
    <p>${nextClick + 1} of 10 Questions</p>
    <button class="next">Next</button>
  </div>`;

  quiz.innerHTML = "";
  quiz.insertAdjacentHTML("beforeend", html);
};

//Getting the api with the value of the category so if randomly then random otherwise with the value of selected category

const getAPi = async function (value) {
  const repsonse = await fetch(
    `https://opentdb.com/api.php?amount=1&category=${value}&difficulty=easy&type=multiple`
  );

  const data = await repsonse.json();

  answerArray = [
    data.results[0].incorrect_answers[0],
    data.results[0].correct_answer,
    data.results[0].incorrect_answers[1],
    data.results[0].incorrect_answers[2],
  ];

  randomize(answerArray);
  console.log(data);

  generateHtml(data);

  correct_answer = data.results[0].correct_answer;

  answerchecker();

  //clearing the existing timer if exist bcz if we login in different accounts simanteosuly then 2 timers runs at same time

  if (timer) clearInterval(timer);

  timerContainer();
};

//////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////

//1.Page Load feature

window.addEventListener("load", function () {
  loadSpinner();
  getData();
});

//2.Cateogory Section feature

//Checking the value of category

const check = function () {
  if (valueOfCard) {
    card.forEach(function (e) {
      e.addEventListener("click", function (eve) {
        valueOfCard = eve.target.closest(".card").getAttribute("value");
      });
    });
  } else valueOfCard = 0;
};

//Getting the targeted card clicked and then getting the value of that card and then calling the api

card.forEach(function (e) {
  e.addEventListener("click", function (eve) {
    valueOfCard = eve.target.closest(".card").getAttribute("value");
    showInstruction();
    blurIn;
  });
});

//3.Start quiz button feature

startBtn.addEventListener("click", function () {
  showInstruction();
  blurIn();
});

//4.Answer selection after

//Getting the targeted clicked answe and then changing the background

const answerchecker = function () {
  document.querySelectorAll(".answer").forEach(function (e) {
    e.addEventListener("click", function (eve) {
      const target = eve.target;

      if (target.textContent === correct_answer) {
        playRightAudio();
        pauseTimeAudio();
        target.style.border = "2px solid green";
        // nextFeature();
        score++;
        clearInterval(timer);
        setTimeout(function () {
          changeQuestion(valueOfCard);
        }, 1500);
      }
      if (target.textContent !== correct_answer) {
        playWrongAudio();
        pauseTimeAudio();
        target.style.border = "2px solid red";
        // nextFeature();

        //First the auido plays for 1.5sec and then the question chnages

        setTimeout(function () {
          changeQuestion(valueOfCard);
        }, 1500);
        clearInterval(timer);
      }

      console.log(target.innerHTML);
    });
  });
};

//5.Next button feature

const changeQuestion = function (value) {
  if (nextClick >= 9) {
    if (score > highScore) {
      highScore = score;
      highscoreMusic();
      highscoreStorage = highScore;
      storeData();
    }
    generatorScore();
    displayScore();
    blurIn();
  } else {
    getAPi(value);
    nextClick++;
    pauseRightAudio();
    pauseWrongAudio();
    playTimeAudio();
  }
};

const nextFeature = function () {
  document.querySelector(".next").addEventListener("click", function () {
    changeQuestion(valueOfCard);
    pauseRightAudio();
    pauseWrongAudio();
  });
};

//6.Score modal feature

const displayScore = function () {
  scoreSection.classList.remove("modal-hidden");
  blurIn();
};

replay.addEventListener("click", function () {
  scoreSection.classList.toggle("modal-hidden");
  blurOut();
  nextClick = 0;
  valueOfCard = 0;
  score = 0;
  quiz.innerHTML = "";
  highscoreGif.classList.add("modal-hidden");
  pauseHighAudio();
});

scoreExit.addEventListener("click", function () {
  scoreSection.classList.toggle("modal-hidden");
  blurOut();
  nextClick = 0;
  valueOfCard = 0;
  score = 0;
  highscoreGif.classList.add("modal-hidden");
  pauseHighAudio();
});

//7.Highscore feature

//When check winner button is clicked

checkHighScore.addEventListener("click", function () {
  spinner.classList.remove("spinner-hidden");
  blurIn();

  setTimeout(function () {
    spinner.classList.add("spinner-hidden");
    blurOut();

    highScoreModal.classList.remove("modal-hidden");
    blurIn();
    highScoreModal.style.filter = "blur(0px)";
    playWinnerAudio();
  }, 2000);

  setTimeout(function () {
    highScoreModal.classList.add("modal-hidden");
    blurOut();
    pauseWinnerAudio();
  }, 6000);
});

const highscoreMusic = function () {
  highscoreGif.classList.remove("modal-hidden");
  playHighAudio();
};

//Storing the highscore in the localstorage

const storeData = function () {
  localStorage.setItem("high", JSON.stringify(highscoreStorage));
};

const getData = function () {
  const data = JSON.parse(localStorage.getItem("high"));

  if (!data) return;

  highScore = data;

  generateHighscore();
};

//Randomising the answer

const randomize = function (array) {
  for (let i = array.length - 1; i > 0; i--) {
    // Generate random number
    let j = Math.floor(Math.random() * (i + 1));

    let temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }

  return array;
};