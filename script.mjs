import keysData from './keysData.mjs';

let lang = localStorage.getItem('lang') || 'eng';
let keyCase = 'caseDown';
const wrapper = document.createElement('div');
wrapper.classList.add('keyboard-wrapper');
document.body.prepend(wrapper);

const title = document.createElement('h1');
title.classList.add('title');
title.innerText = 'RSS Virtual Keyboard';
wrapper.append(title);

const textArea = document.createElement('textarea');
textArea.classList.add('textarea');
textArea.setAttribute('autofocus', 'true');
textArea.setAttribute('cols', '50');
textArea.setAttribute('rows', '5');
wrapper.append(textArea);

const keyboard = document.createElement('div');
keyboard.classList.add('keyboard');
wrapper.append(keyboard);

for (let i = 0; i < keysData.length; i += 1) {
  const keyboardRow = document.createElement('div');
  keyboardRow.classList.add('keyboard__row');
  for (let j = 0; j < keysData[i].length; j += 1) {
    const keyboardKey = document.createElement('div');
    keyboardKey.classList.add('keyboard__key', keysData[i][j].className);
    keyboardKey.innerText = keysData[i][j][`${lang}`].caseDown;
    keyboardRow.append(keyboardKey);
  }
  keyboard.append(keyboardRow);
}

const description = document.createElement('p');
description.classList.add('description');
description.innerHTML = 'The keyboard was created in <strong>Windows</strong>';
wrapper.append(description);
const langInstruction = document.createElement('p');
langInstruction.classList.add('description');
langInstruction.innerHTML = 'To switch the languge press <strong>LeftAlt + LeftShift</strong>';
wrapper.append(langInstruction);

function activate(event) {
  // event.preventDefault();
  // if (event.code === )
  document.querySelector(`.${event.code}`).classList.add('keyboard__key_active');
  // textArea.value += event.key;
}
function deactivate(event) {
  // event.preventDefault();
  document.querySelector(`.${event.code}`).classList.remove('keyboard__key_active');
}

function printWithMouse(event) {
  textArea.value += event.target.innerHTML;
}

function toggleLang() {
  lang = lang === 'eng' ? 'rus' : 'eng';
  for (let i = 0; i < keysData.length; i += 1) {
    for (let j = 0; j < keysData[i].length; j += 1) {
      document.querySelectorAll('.keyboard__row')[i].querySelectorAll('.keyboard__key')[j].innerText = keysData[i][j][`${lang}`][keyCase];
    }
  }
  localStorage.setItem('lang', lang);
}

const rightShift = document.querySelector('.ShiftRight');
const leftShift = document.querySelector('.ShiftLeft');
function toggleShift(event) {
  if (event.target === leftShift || event.target === rightShift) {
    event.target.classList.toggle('keyboard__key_active');
  }
  keyCase = keyCase === 'caseDown' ? 'caseUp' : 'caseDown';
  for (let i = 0; i < keysData.length; i += 1) {
    for (let j = 0; j < keysData[i].length; j += 1) {
      document.querySelectorAll('.keyboard__row')[i].querySelectorAll('.keyboard__key')[j].innerText = keysData[i][j][`${lang}`][keyCase];
    }
  }
}
document.addEventListener('keydown', (event) => {
  if (event.code === 'ShiftLeft' || event.code === 'ShiftRight') {
    toggleShift(event);
  }
});
window.addEventListener('keyup', (event) => {
  if (event.code === 'ShiftLeft' || event.code === 'ShiftRight') {
    toggleShift(event);
  }
});

rightShift.addEventListener('click', toggleShift);
leftShift.addEventListener('click', toggleShift);

document.querySelector('.Space').addEventListener('click', toggleLang);

document.querySelectorAll('.keyboard__key').forEach((key) => key.addEventListener('click', printWithMouse));
document.addEventListener('keydown', activate);
document.addEventListener('keyup', deactivate);
document.addEventListener('click', () => textArea.focus());
