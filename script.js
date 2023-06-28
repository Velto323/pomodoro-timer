const progressBar = document.querySelector(".progress-bar");
const clock = document.querySelector(".clock");
const startButton = document.querySelector("#start-timer-button");
const mainPage = document.querySelector(".main-page");
const timerPage = document.querySelector(".timer-body");
const modeDescription = document.querySelector(".mode-description");
const pauseButton = document.querySelector(".pause-button");
const resumeButton = document.querySelector(".resume-button");
const testButton = document.querySelector(".test-button");
const alert1 = new Audio("gagri.mp3");
const finishAlert = new Audio("finish.wav");

let targetIntervals;
let intervals = 0;
let mode;
let userWantAlarm = false;
let timeElapsed;

function timer(firstTime, firstTimeRelative, min, sec = 0) {
  console.log(`Time of starting timer first time: ${firstTime}`);
  let time = min * 60 + sec;
  // const firstTimeRelative = time;

  //Pause button handler
  pauseButton.addEventListener("click", pauseTimer);

  //Resume button handler
  resumeButton.addEventListener("click", function () {
    console.log("resume");
    resumeTimer();
    // pauseResumeTimer("resume", firstTime, timeElapsed); //"pause", firstTime, Date.now
  });

  const count = setInterval(function () {
    //stoping timer when it gets to 0
    stopTimerIfZero(time, count);

    //Converting seconds to minutes and seconds
    min = Math.floor(time / 60);
    sec = time % 60;
    // console.log(min, sec);
    time--;

    //Rendering timer tick
    updateTimer(min, sec);

    //Progress bar animation
    const computedStyle = getComputedStyle(progressBar);
    const width = parseFloat(computedStyle.getPropertyValue("--width")) || 0;
    console.log(
      width,
      time,
      firstTimeRelative,
      ((firstTimeRelative - time) / firstTimeRelative) * 100
    );
    progressBar.style.setProperty(
      "--width",
      ((firstTimeRelative - time) / firstTimeRelative) * 100
    );
  }, 1000);

  function pauseTimer() {
    // console.log(time);
    clearInterval(count);
  }

  function resumeTimer() {
    timer(firstTime, firstTimeRelative, Math.floor(time / 60), time % 60);
  }
}

function renderTimer() {
  // console.log(timerPage.classList);
  timerPage.classList.remove("hidden");
}

function updateTimer(min, sec) {
  clock.textContent = `${min}:${sec}`;
}

function stopTimerIfZero(time, fn) {
  if (time === 0) {
    clearInterval(fn);
    console.log(intervals, targetIntervals, mode);
    if (intervals === targetIntervals) {
      finishAlert.play();
      clearInterval(fn);
      // console.log("Here should we go back to main page");
      renderMainPage();
    } else {
      if (alertToggledOn) {
        alert.play();
      }
      if (mode === "work") {
        freeTime();
      } else if (mode === "break") {
        workTime();
      }
    }
  }
}

function freeTime() {
  const firstTime = getFirstTime();
  getFirstTime();
  mode = "break";
  renderTimer();
  changeBackground(mode);
  timer(firstTime, minFreeTime * 60, minFreeTime);
}

function workTime() {
  const firstTime = getFirstTime();
  console.log(getFirstTime());
  intervals++;
  mode = "work";
  renderTimer();
  changeBackground(mode);
  timer(firstTime, minWorkTime * 60, minWorkTime);
}

function renderMainPage() {
  timerPage.classList.add("hidden");
  mainPage.classList.remove("hidden");
  clearVariables();
}

function clearVariables() { }

function changeBackground(mode) {
  if (mode === "break") {
    modeDescription.textContent = "Enjoy the break";
    document.body.style.backgroundColor = "#14213D";
    document.body.style.color = "#E5E5E5";
    progressBar.classList.add("special");
  } else if (mode === "work") {
    modeDescription.textContent = "Time to work";
    document.body.style.backgroundColor = "#fca311";
    document.body.style.color = "black";
    progressBar.classList.remove("special");
  }
}


function getAlert(id) {
  switch (id) {
    case "1":
      return new Audio("alarm1.mp3");
    case "2":
      return new Audio("alarm2.mp3");
    case "3":
      return new Audio("finish.wav");
  }
}

function getFirstTime(isFirstTime) {
  return Date.now();
}

startButton.addEventListener("click", function () {
  targetIntervals = Number(document.querySelector("#intervals-input").value);
  minWorkTime = document.querySelector("#work-time-input").value;
  minFreeTime = document.querySelector("#break-time-input").value;
  alertToggledOn = document.querySelector(".switch").checked;
  alertId = document.querySelector(".radio-alert-sound:checked").value;
  alert = getAlert(alertId);

  console.log(alertToggledOn, alertId);
  console.log(targetIntervals);
  mainPage.classList.add("hidden");
  workTime();
});
