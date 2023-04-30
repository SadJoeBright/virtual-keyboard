import { keysData, specialKeys } from './keysData.mjs';

let lang = localStorage.getItem('lang') || 'eng';
let keyCase = 'caseDown';
const wrapper = document.createElement('div');
wrapper.classList.add('keyboard-wrapper');
document.body.prepend(wrapper);

const title = document.createElement('h1');
title.classList.add('title');
title.innerText = 'RSS Virtual keyboard';
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
description.innerHTML = 'The keyboard was created in <strong>Windows</strong><br>To switch the languge press <strong>LeftCtrl + ShiftLeft</strong>';
wrapper.append(description);

const keyBackspase = document.querySelector('.Backspace');
const keyTab = document.querySelector('.Tab');
const keyDel = document.querySelector('.Delete');
const keyCaps = document.querySelector('.CapsLock');
const keyEnter = document.querySelector('.Enter');
const keyShiftLeft = document.querySelector('.ShiftLeft');
const keyShiftRight = document.querySelector('.ShiftRight');
const keyArrowLeft = document.querySelector('.ArrowLeft');
const keyArrowRight = document.querySelector('.ArrowRight');
const keyArrowUp = document.querySelector('.ArrowUp');
const keyArrowDown = document.querySelector('.ArrowDown');
const langKey = document.querySelector('.Lang');

function activate(event) {
  event.preventDefault();
  if (event.code !== 'CapsLock' && (keysData.flat().some((key) => event.code === key.className))) {
    document.querySelector(`.${event.code}`).classList.add('keyboard__key_active');
  }
}

function deactivate(event) {
  event.preventDefault();
  if (event.code !== 'CapsLock' && (keysData.flat().some((key) => event.code === key.className))) {
    document.querySelector(`.${event.code}`).classList.remove('keyboard__key_active');
  }
}

function addCharacter(event) {
  const cursorPosition = textArea.selectionStart;
  if (keysData.flat().some((key) => event.code === key.className)) {
    if ((event.target !== textArea
      && !specialKeys.some((key) => event.target.classList.contains(key)))
    || (event.target === textArea && !specialKeys.some((key) => document.querySelector(`.${event.code}`).classList.contains(key)))) {
      textArea.value = textArea.value.substring(0, cursorPosition)
      + (event.target.textContent || document.querySelector(`.${event.code}`).textContent)
      + textArea.value.substring(cursorPosition);
      textArea.selectionStart = cursorPosition + 1;
      textArea.selectionEnd = textArea.selectionStart;
    }
  }
  textArea.scrollTop = textArea.scrollHeight;
}

function emulateBackspaseKey() {
  const cursorPosition = textArea.selectionStart;
  if (cursorPosition > 0) {
    textArea.value = textArea.value.slice(0, textArea.selectionStart - 1)
    + textArea.value.slice(textArea.selectionStart);
    textArea.selectionStart = cursorPosition - 1;
    textArea.selectionEnd = textArea.selectionStart;
  }
}

function emulateTabKey() {
  const cursorPosition = textArea.selectionStart;
  textArea.value = `${textArea.value.substring(0, cursorPosition)}  ${textArea.value.substring(cursorPosition)}`;
  textArea.selectionStart = cursorPosition + 2;
  textArea.selectionEnd = textArea.selectionStart;
}

function emulateDeleteKey() {
  const cursorPosition = textArea.selectionStart;
  textArea.value = textArea.value.slice(0, textArea.selectionStart)
  + textArea.value.slice(textArea.selectionStart + 1);
  textArea.selectionStart = cursorPosition;
  textArea.selectionEnd = textArea.selectionStart;
}

function emulatekeyCaps(event) {
  if (event.target === keyCaps) event.target.classList.toggle('keyboard__key_active');
  if (event.code === 'CapsLock') keyCaps.classList.toggle('keyboard__key_active');
  if (keyCase !== 'caps' && !(keyShiftLeft.classList.contains('keyboard__key_active') || keyShiftLeft.classList.contains('keyboard__key_active'))) {
    keyCase = 'caps';
  } else if (keyCase !== 'caps' && (keyShiftLeft.classList.contains('keyboard__key_active') || keyShiftLeft.classList.contains('keyboard__key_active'))) {
    keyCase = 'shiftCaps';
  } else {
    keyCase = 'caseDown';
  }
  for (let i = 0; i < keysData.length; i += 1) {
    for (let j = 0; j < keysData[i].length; j += 1) {
      document.querySelectorAll('.keyboard__row')[i].querySelectorAll('.keyboard__key')[j].textContent = keysData[i][j][`${lang}`][keyCase];
    }
  }
}

function emulateEnterKey() {
  const cursorPosition = textArea.selectionStart;
  textArea.value = `${textArea.value.substring(0, cursorPosition)}\n${textArea.value.substring(cursorPosition)}`;
  textArea.selectionStart = cursorPosition + 1;
  textArea.selectionEnd = textArea.selectionStart;
}

function emulateShiftKey(event) {
  if (event.target === keyShiftLeft || event.target === keyShiftRight) {
    event.target.classList.toggle('keyboard__key_active');
  }
  if (keyCase === 'caseUp') {
    keyShiftRight.classList.remove('keyboard__key_active');
    keyShiftLeft.classList.remove('keyboard__key_active');
  }
  if (keyCase === 'caseDown') {
    keyCase = 'caseUp';
  } else if (keyCaps.classList.contains('keyboard__key_active') && keyCase !== 'shiftCaps') {
    keyCase = 'shiftCaps';
  } else if (keyCase === 'shiftCaps') {
    keyCase = 'caps';
  } else if (keyCase === 'caseUp') {
    keyCase = 'caseDown';
  }

  for (let i = 0; i < keysData.length; i += 1) {
    for (let j = 0; j < keysData[i].length; j += 1) {
      document.querySelectorAll('.keyboard__row')[i].querySelectorAll('.keyboard__key')[j].textContent = keysData[i][j][`${lang}`][keyCase];
    }
  }
}

function moveCursorLeft() {
  const currentPosition = textArea.selectionStart;
  if (currentPosition > 0) {
    textArea.setSelectionRange(currentPosition - 1, currentPosition - 1);
  }
}

function moveCursorRight() {
  const currentPosition = textArea.selectionStart;
  textArea.setSelectionRange(currentPosition + 1, currentPosition + 1);
}

function moveCursorUp() {
  const currentCursorPosition = textArea.selectionStart;
  const currentLineStartPosition = textArea.value.lastIndexOf('\n', currentCursorPosition - 1) + 1;
  const previousLineStartPosition = textArea.value.lastIndexOf('\n', currentLineStartPosition - 2) + 1;
  const previousLineEndPosition = textArea.value.indexOf('\n', previousLineStartPosition);
  const newCursorPosition = Math.min(previousLineEndPosition, currentCursorPosition
  - (currentLineStartPosition - previousLineStartPosition));
  textArea.selectionStart = newCursorPosition;
  textArea.selectionEnd = newCursorPosition;
}

function moveCursorDown() {
  const currentCursorPosition = textArea.selectionEnd;
  const currentLineStartPosition = textArea.value.lastIndexOf('\n', currentCursorPosition) + 1;
  const nextLineEndPosition = textArea.value.indexOf('\n', currentCursorPosition);
  if (nextLineEndPosition === -1) return;
  const newCursorPosition = Math.min(currentCursorPosition
  + (nextLineEndPosition - currentLineStartPosition) + 1, textArea.value.length);
  textArea.selectionStart = newCursorPosition;
  textArea.selectionEnd = newCursorPosition;
}

function toggleLang() {
  lang = lang === 'eng' ? 'rus' : 'eng';
  for (let i = 0; i < keysData.length; i += 1) {
    for (let j = 0; j < keysData[i].length; j += 1) {
      document.querySelectorAll('.keyboard__row')[i].querySelectorAll('.keyboard__key')[j].textContent = keysData[i][j][`${lang}`][keyCase];
    }
  }
  if (lang === 'eng') {
    title.innerText = 'RSS Virtual keyboard';
    description.innerHTML = 'The keyboard was created in <strong>Windows</strong><br>To switch the languge press <strong>LeftCtrl + ShiftLeft</strong>';
  } else {
    title.innerText = 'RSS Виртуальная клавиатура';
    description.innerHTML = 'Клавиатура создана в опреационной системе <strong>Windows</strong><br>Для смены языка нажмите <strong>LeftCtrl + ShiftLeft</strong>';
  }
  localStorage.setItem('lang', lang);
}

document.addEventListener('click', () => textArea.focus());
document.querySelectorAll('.keyboard__key').forEach((key) => key.addEventListener('click', addCharacter));
keyBackspase.addEventListener('click', emulateBackspaseKey);
keyTab.addEventListener('click', emulateTabKey);
keyDel.addEventListener('click', emulateDeleteKey);
keyCaps.addEventListener('click', emulatekeyCaps);
keyEnter.addEventListener('click', emulateEnterKey);
keyShiftLeft.addEventListener('click', emulateShiftKey);
keyShiftRight.addEventListener('click', emulateShiftKey);
keyArrowLeft.addEventListener('click', moveCursorLeft);
keyArrowRight.addEventListener('click', moveCursorRight);
keyArrowUp.addEventListener('click', moveCursorUp);
keyArrowDown.addEventListener('click', moveCursorDown);
langKey.addEventListener('click', toggleLang);

document.addEventListener('keydown', addCharacter);
document.addEventListener('keydown', activate);
document.addEventListener('keyup', deactivate);
document.addEventListener('keydown', (event) => {
  if (event.code === 'Backspace') emulateBackspaseKey();
  if (event.code === 'Tab') emulateTabKey();
  if (event.code === 'Delete') emulateDeleteKey();
  if (event.code === 'CapsLock') emulatekeyCaps(event);
  if (event.code === 'Enter') emulateEnterKey();
  if (event.code === 'ShiftLeft' || event.code === 'ShiftRight') emulateShiftKey(event);
  if (event.code === 'ArrowLeft') moveCursorLeft();
  if (event.code === 'ArrowRight') moveCursorRight();
  if (event.code === 'ArrowUp') moveCursorUp();
  if (event.code === 'ArrowDown') moveCursorDown();
});
document.addEventListener('keyup', (event) => {
  if (event.code === 'ShiftLeft' || event.code === 'ShiftRight') {
    if (keyCase === 'caseUp' || keyCase === 'shiftCaps') emulateShiftKey(event);
  }
});
document.addEventListener('keydown', (event) => {
  if (event.ctrlKey && event.shiftKey) {
    toggleLang();
  }
});
