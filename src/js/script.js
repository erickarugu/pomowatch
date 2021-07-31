import { Timer } from './timer.js';

document.addEventListener('DOMContentLoaded', () => {
  // Update time on timer to match the one in settings
  const $pomodoroTime = document.getElementById('timer');
  let time = Timer.settings.timers.pomodoro * 60;
  let mins = Math.floor(time / 60) < 10 ? "0" + Math.floor(time / 60) : Math.floor(time / 60);
  let secs = (time % 60) < 10 ? "0" + (time % 60) : time % 60;
  // update timer
  $pomodoroTime.innerHTML = `${mins}:${secs}`;

  const $navbarBurgers = Array.prototype.slice.call(document.querySelectorAll('.navbar-burger'), 0);
  if ($navbarBurgers.length > 0) {
    $navbarBurgers.forEach(el => {
      el.addEventListener('click', () => {
        const target = el.dataset.target;
        const $target = document.getElementById(target);
        el.classList.toggle('is-active');
        $target.classList.toggle('is-active');
      });
    });
  }

  const $pomodoroTabs = Array.prototype.slice.call(document.querySelectorAll('#togglePomodoro li'), 0);
  const heroSection = document.querySelector('.hero');
  const currentStatusTag = document.getElementById('current-status');
  $pomodoroTabs.forEach(tab => {
    tab.addEventListener('click', function (e) {
      $pomodoroTabs.forEach(function (el) {
        el.classList.remove('is-active');
      });
      this.classList.add('is-active');
      heroSection.classList.remove('is-primary');
      heroSection.classList.remove('is-info');
      heroSection.classList.remove('is-success');
      if (this === $pomodoroTabs[0]) {
        heroSection.classList.add('is-primary');
        currentStatusTag.innerText = 'Time to work';
        Timer.controls.paused = false;
        Timer.timerLoop(false);
      } else if (this === $pomodoroTabs[1]) {
        heroSection.classList.add('is-success');
        currentStatusTag.innerText = 'Time to take a short break';
        Timer.controls.paused = false;
        Timer.startTimer("short");
      } else {
        heroSection.classList.add('is-info');
        currentStatusTag.innerText = 'Time to take a long break';
        Timer.controls.paused = false;
        Timer.startTimer("long");
      }
    });
  });

  const $modalBtns = Array.prototype.slice.call(document.querySelectorAll('.modal-button'), 0);
  if ($modalBtns.length > 0) {
    $modalBtns.forEach(el => {
      el.addEventListener('click', () => {
        const target = el.dataset.target;
        const $target = document.getElementById(target);
        $target.classList.toggle('is-active');
      });
    });
  }

  // handle settings form
  const $settingsForm = document.getElementById('settingsForm');
  $settingsForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let formData = new FormData(settingsForm);


    Timer.saveSettings(formData);

  }, false);

  // handle pause and reload
  const $startPauseButton = document.getElementById('start-stop-button');
  $startPauseButton.addEventListener('click', () => {
    if (!Timer.controls.running) {
      let index = 0;
      $pomodoroTabs.forEach(tab => {
        if (tab.classList.contains('is-active')) {
          index = tab.dataset.tab;
        }
      });
      if (index == 0) {
        Timer.timerLoop(false);
      } else if (index == 1) {
        Timer.startTimer("short");
      } else {
        Timer.startTimer("long");
      }
    } else {
      Timer.controls.paused = !Timer.controls.paused;
    }
    $startPauseButton.innerText = Timer.controls.paused ? "START" : "STOP";
  }, false);
  // handle start and stop timer using spacebar
  document.onkeydown = function (e) {
    e.preventDefault();
    if (e.code === 'Space') {
      $startPauseButton.click(); // Trigger the click event on the startPauseButton
    }
  };

  // Handle reload button click
  const $reloadBtn = document.getElementById('reload-button');
  $reloadBtn.addEventListener('click', () => {
    let index = 0;
    // Check the index of the active tab
    $pomodoroTabs.forEach(tab => {
      if (tab.classList.contains('is-active')) {
        index = tab.dataset.tab;
      }
    });
    // Depending with the index call the timer
    if (index == 0) {
      Timer.timerLoop(true);
    } else if (index == 1) {
      Timer.startTimer("short");
    } else {
      Timer.startTimer("long");
    }
    $startPauseButton.innerText = Timer.controls.paused ? "START" : "STOP";
  }, false);
});