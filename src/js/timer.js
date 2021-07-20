import { helpers } from './helpers.js';
/*
* Timer container
*
*/
export const Timer = {};

// Array to handle multiple timers
Timer.timers = [];

// default settings
Timer.settings = {
  timers: {
    pomodoro: 25,
    short_break: 5,
    long_break: 10,
  },
  auto_start_pomodoros: false,
  auto_start_breaks: false,
  long_break_interval: 6,
  sound: false
};
// Control state of the application
Timer.controls = {
  paused: false,
  running: false,
  loop: false,
  loop_count: 0,
  on_break: false
};

// handle settings 
Timer.saveSettings = function (formData) {
  let pomodoro = formData.get('pomodoro');
  let short_break = formData.get('short_break');
  let long_break = formData.get('long_break');
  let auto_start_breaks = formData.get('auto_start_breaks');
  let auto_start_pomodoros = formData.get('auto_start_pomodoros');
  let long_break_intervals = formData.get('long_break_intervals');
  let sound = formData.get('sound');

  // TODO: validate all inputs

  Timer.settings.timers = {
    pomodoro, short_break, long_break
  };
  Timer.settings.auto_start_pomodoros = auto_start_pomodoros;
  Timer.settings.auto_start_breaks = auto_start_breaks;
  Timer.settings.long_break_interval = parseInt(long_break_intervals, 10);
  Timer.settings.sound = sound;
  localStorage.setItem('pomowatch_settings', JSON.stringify(Timer.settings));

  // update the timer time if not running
  if (!Timer.controls.running) {
    const $pomodoroTime = document.getElementById('timer');
    let time = Timer.settings.timers.pomodoro * 60;
    let mins = Math.floor(time / 60) < 10 ? "0" + Math.floor(time / 60) : Math.floor(time / 60);
    let secs = (time % 60) < 10 ? "0" + (time % 60) : time % 60;
    // update timer
    $pomodoroTime.innerHTML = `${mins}:${secs}`;
  }

};

// Function to clear all timers
Timer.clearTimers = function () {
  // clear all timers first
  if (Timer.timers.length > 0) {
    for (var i = 0; i < Timer.timers.length; i++) {
      clearInterval(Timer.timers[i]);
    }
  }
};

// Function to start the timer
Timer.startTimer = function (tab) {
  let time = (tab == "pomodoro") ? Timer.settings.timers.pomodoro : tab == 'short' ? Timer.settings.timers.short_break : Timer.settings.timers.long_break;
  time = time * 60;
  if (tab == 'pomodoro' && Timer.settings.auto_start_breaks == "true") {
    Timer.controls.on_break = true;
  } else {
    Timer.controls.on_break = false;
  };

  const $pomodoroTime = document.getElementById('timer');
  const $startStopBtn = document.getElementById('start-stop-button');
  // Check settings


  let finishAudio = new Audio("../../assets/audios/door-bell.mp3");
  let tickAudio = new Audio("../../assets/audios/clock-tick.mp3");

  // clear all timers first
  if (Timer.timers.length > 0) {
    for (var i = 0; i < Timer.timers.length; i++) {
      clearInterval(Timer.timers[i]);
    }
  }
  const timer = setInterval(() => {
    let mins = Math.floor(time / 60) < 10 ? "0" + Math.floor(time / 60) : Math.floor(time / 60);
    let secs = (time % 60) < 10 ? "0" + (time % 60) : time % 60;
    // update timer
    $pomodoroTime.innerHTML = `${mins}:${secs}`;
    // update title
    document.title = `${mins}:${secs}`;
    if (Timer.settings.sound == 'true' && !Timer.controls.paused) {
      tickAudio.currentTime = 0;
      tickAudio.play();
    }
    if (time <= 0) {
      clearInterval(timer);
      $startStopBtn.innerText = "START";
      Timer.controls.running = false;
      finishAudio.play();
      if (Timer.controls.loop) {
        Timer.timerLoop(false);
      }
    };
    if (!Timer.controls.paused) time--;
  }, 1000);
  Timer.timers.push(timer);
  $startStopBtn.innerText = "STOP";
  Timer.controls.running = true;
};

// function to set up a loop
Timer.timerLoop = function (reload) {
  if (Timer.settings.auto_start_pomodoros == 'true') {
    Timer.controls.loop = true;
  }
  if (!Timer.controls.on_break) {
    if (!reload) Timer.controls.loop_count++;
    Timer.startTimer('pomodoro');
    helpers.updateDisplay('pomodoro');
  } else {
    if (Timer.controls.loop_count !== 0 && Timer.controls.loop_count % Timer.settings.long_break_interval == 0) {
      Timer.startTimer('long');
      helpers.updateDisplay('long');
    } else {
      helpers.updateDisplay('short');
      Timer.startTimer('short');
    }
  }
};