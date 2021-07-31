
/*
* Timer container
*
*/
export const helpers = {};

// Array to handle multiple timers
helpers.updateDisplay = function (current_tab) {
  const $pomodoroTabs = Array.prototype.slice.call(document.querySelectorAll('#togglePomodoro li'), 0);
  const heroSection = document.querySelector('.hero');
  const currentStatusTag = document.getElementById('current-status');

  $pomodoroTabs.forEach(function (el) {
    el.classList.remove('is-active');
  });
  heroSection.classList.remove('is-primary');
  heroSection.classList.remove('is-info');
  heroSection.classList.remove('is-success');
  if (current_tab == 'pomodoro') {
    $pomodoroTabs[0].classList.add('is-active');
    heroSection.classList.add('is-primary');
    currentStatusTag.innerText = 'Time to work!';
  } else if (current_tab == 'short') {
    $pomodoroTabs[1].classList.add('is-active');
    heroSection.classList.add('is-success');
    currentStatusTag.innerText = 'Time to take a short break!';
  } else {
    $pomodoroTabs[2].classList.add('is-active');
    heroSection.classList.add('is-info');
    currentStatusTag.innerText = 'Time to take a long break!';
  }
};