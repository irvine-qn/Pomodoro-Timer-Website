const STUDY_TIME = 25;
const SHORT_BREAK_TIME = 5;
const LONG_BREAK_TIME = 15;

let countdownInterval = null;
let remainingSeconds = 0;
let isRunning = false;

const path = window.location.pathname;
const isStudyPage = path.includes("study_session.html");
const isShortPage = path.includes("short_break.html");
const isLongPage = path.includes("long_break.html");

window.addEventListener("DOMContentLoaded", () => {
  setupTime();
  setupButtons();
  updateDisplay();

  if (localStorage.getItem("autoStart") === "true") {
    startTimer();
  }
});

function ToPage(page) {
  const basePath = window.location.pathname.includes("/pages/") ? "../" : "";
  window.location.href = basePath + page;
}

function setupTime() {
  if (isStudyPage) remainingSeconds = STUDY_TIME * 60;
  else if (isShortPage) remainingSeconds = SHORT_BREAK_TIME * 60;
  else if (isLongPage) remainingSeconds = LONG_BREAK_TIME * 60;
  else remainingSeconds = 25 * 60;
}

function setupButtons() {
  const buttons = document.querySelectorAll(".buttons button");

  if (buttons[0]) {
    buttons[0].onclick = function () {
      startTimer();
    };
  }
  if (buttons[1]) {
    buttons[1].onclick = function () {
      stopTimer();
    };
  }

  if (buttons[2]) {
    buttons[2].onclick = function () {
      timerComplete();
    };
  }
}

function startTimer() {
  if (isRunning) return;

  isRunning = true;

  localStorage.setItem("autoStart", "true");

  countdownInterval = setInterval(() => {
    remainingSeconds--;
    updateDisplay();

    if (remainingSeconds <= 0) {
      timerComplete();
    }
  }, 1000);
}

function stopTimer() {
  clearInterval(countdownInterval);
  isRunning = false;
  localStorage.setItem("autoStart", "false");
}

function updateDisplay() {
  const display = document.querySelector(".timer-display h1");
  if (!display) return;

  let minutes = Math.floor(remainingSeconds / 60);
  let seconds = remainingSeconds % 60;

  minutes = minutes < 10 ? "0" + minutes : minutes;
  seconds = seconds < 10 ? "0" + seconds : seconds;

  display.innerText = `${minutes}:${seconds}`;

  document.title = `${minutes}:${seconds} - Pomodoro`;
}

function timerComplete() {
  stopTimer();
  let shortBreakCount = parseInt(localStorage.getItem("shortBreakCount")) || 0;

  if (isStudyPage) {
    if (shortBreakCount >= 3) {
      alert("Great job! Time for a Long Break.");
      localStorage.setItem("shortBreakCount", "0");
      localStorage.setItem("autoStart", "true");
      ToPage("long_break.html");
    } else {
      alert("Session done! Take a Short Break.");
      localStorage.setItem("autoStart", "true");
      ToPage("short_break.html");
    }
  } else if (isShortPage) {
    shortBreakCount++;
    localStorage.setItem("shortBreakCount", shortBreakCount);

    alert("Break over! Back to work.");
    localStorage.setItem("autoStart", "true");
    ToPage("study_session.html");
  } else if (isLongPage) {
    alert("Long break over! Let's start a new cycle.");
    localStorage.setItem("autoStart", "true");
    ToPage("study_session.html");
  }
}
