import keysData from './keysData.mjs';

const specialKeys = [
  'Backspace',
  'Tab',
  'Enter',
  'CapsLock',
  'ShiftLeft',
  'ShiftRight',
  'AltLeft',
  'AltRight',
  'ControlLeft',
  'ControlRight',
  'Lang',
  'Delete',
  'ArrowLeft',
  'ArrowUp',
  'ArrowDown',
  'ArrowRight',
];

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
langInstruction.innerHTML = 'To switch the languge press <strong>LeftCtrl + LeftShift</strong>';
wrapper.append(langInstruction);

function activate(event) {
  event.preventDefault();
  if (event.code !== 'CapsLock') document.querySelector(`.${event.code}`).classList.add('keyboard__key_active');
}

function deactivate(event) {
  event.preventDefault();
  if (event.code !== 'CapsLock') document.querySelector(`.${event.code}`).classList.remove('keyboard__key_active');
}
function addCharacter(event) {
  const cursorPosition = textArea.selectionStart;
  if ((event.target !== textArea
    && !specialKeys.some((key) => event.target.classList.contains(key)))
  || (event.target === textArea && !specialKeys.some((key) => document.querySelector(`.${event.code}`).classList.contains(key)))) {
    textArea.value = textArea.value.substring(0, cursorPosition)
    + (event.target.textContent || document.querySelector(`.${event.code}`).textContent)
    + textArea.value.substring(cursorPosition);
    textArea.selectionStart = cursorPosition + 1;
    textArea.selectionEnd = textArea.selectionStart;
  }
  textArea.scrollTop = textArea.scrollHeight;
}

function moveCursorLeft() {
  const currentPosition = textArea.selectionStart;
  if (currentPosition > 0) {
    textArea.setSelectionRange(currentPosition - 1, currentPosition - 1);
  }
}
const keyArrowLeft = document.querySelector('.ArrowLeft');
keyArrowLeft.addEventListener('click', moveCursorLeft);
document.addEventListener('keydown', (event) => {
  if (event.code === 'ArrowLeft') moveCursorLeft();
});

function moveCursorRight() {
  const currentPosition = textArea.selectionStart;
  textArea.setSelectionRange(currentPosition + 1, currentPosition + 1);
}
const keyArrowRight = document.querySelector('.ArrowRight');
keyArrowRight.addEventListener('click', moveCursorRight);
document.addEventListener('keydown', (event) => {
  if (event.code === 'ArrowRight') moveCursorRight();
});

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

function moveCursorDovn() {
  const currentCursorPosition = textArea.selectionEnd;
  const currentLineEndPosition = textArea.value.indexOf('\n', currentCursorPosition);
  const nextLineEndPosition = textArea.value.indexOf('\n', currentLineEndPosition + 1);
  const newCursorPosition = Math.min(textArea.value.length, currentCursorPosition
  + (nextLineEndPosition - currentLineEndPosition));
  textArea.selectionStart = newCursorPosition;
  textArea.selectionEnd = newCursorPosition;
}

const arrowUpKey = document.querySelector('.ArrowUp');
const arrowDownKey = document.querySelector('.ArrowDown');
arrowUpKey.addEventListener('click', moveCursorUp);
arrowDownKey.addEventListener('click', moveCursorDovn);
function emulateEnterKey() {
  const cursorPosition = textArea.selectionStart;
  textArea.value = `${textArea.value.substring(0, cursorPosition)}\n${textArea.value.substring(cursorPosition)}`;
  textArea.selectionStart = cursorPosition + 1;
  textArea.selectionEnd = textArea.selectionStart;
}
const keyEnter = document.querySelector('.Enter');
keyEnter.addEventListener('click', emulateEnterKey);
document.addEventListener('keydown', (event) => {
  if (event.code === 'Enter') emulateEnterKey();
});

function emulateBackspaseKey() {
  const cursorPosition = textArea.selectionStart;
  if (cursorPosition > 0) {
    textArea.value = textArea.value.slice(0, textArea.selectionStart - 1)
    + textArea.value.slice(textArea.selectionStart);
    textArea.selectionStart = cursorPosition - 1;
    textArea.selectionEnd = textArea.selectionStart;
  }
}
const keyBackspase = document.querySelector('.Backspace');
keyBackspase.addEventListener('click', emulateBackspaseKey);
document.addEventListener('keydown', (event) => {
  if (event.code === 'Backspace') emulateBackspaseKey();
});
document.addEventListener('keydown', addCharacter);

function emulateDeleteKey() {
  const cursorPosition = textArea.selectionStart;
  textArea.value = textArea.value.slice(0, textArea.selectionStart)
  + textArea.value.slice(textArea.selectionStart + 1);
  textArea.selectionStart = cursorPosition;
  textArea.selectionEnd = textArea.selectionStart;
}
const keyDel = document.querySelector('.Delete');
keyDel.addEventListener('click', emulateDeleteKey);

function emulateTabKey() {
  const cursorPosition = textArea.selectionStart;
  textArea.value = `${textArea.value.substring(0, cursorPosition)}  ${textArea.value.substring(cursorPosition)}`;
  textArea.selectionStart = cursorPosition + 2;
  textArea.selectionEnd = textArea.selectionStart;
}
const keyTab = document.querySelector('.Tab');
keyTab.addEventListener('click', emulateTabKey);

function toggleLang() {
  lang = lang === 'eng' ? 'rus' : 'eng';
  for (let i = 0; i < keysData.length; i += 1) {
    for (let j = 0; j < keysData[i].length; j += 1) {
      document.querySelectorAll('.keyboard__row')[i].querySelectorAll('.keyboard__key')[j].textContent = keysData[i][j][`${lang}`][keyCase];
    }
  }
  localStorage.setItem('lang', lang);
}

const langKey = document.querySelector('.Lang');
langKey.addEventListener('click', toggleLang);

const rightShift = document.querySelector('.ShiftRight');
const leftShift = document.querySelector('.ShiftLeft');
const capsKey = document.querySelector('.CapsLock');

function toggleShift(event) {
  // console.log('in: ', keyCase);
  if (event.target === leftShift || event.target === rightShift) {
    event.target.classList.toggle('keyboard__key_active');
  }
  if (keyCase === 'caseUp') {
    rightShift.classList.remove('keyboard__key_active');
    leftShift.classList.remove('keyboard__key_active');
  }
  if (keyCase === 'caseDown') {
    keyCase = 'caseUp';
  } else if (capsKey.classList.contains('keyboard__key_active') && keyCase !== 'shiftCaps') {
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
  // console.log('out: ', keyCase);
}

function emulateCapsKey(event) {
  if (event.target === capsKey) event.target.classList.toggle('keyboard__key_active');
  if (event.code === 'CapsLock') capsKey.classList.toggle('keyboard__key_active');
  if (keyCase !== 'caps' && !(leftShift.classList.contains('keyboard__key_active') || leftShift.classList.contains('keyboard__key_active'))) {
    keyCase = 'caps';
  } else if (keyCase !== 'caps' && (leftShift.classList.contains('keyboard__key_active') || leftShift.classList.contains('keyboard__key_active'))) {
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
capsKey.addEventListener('click', emulateCapsKey);

document.addEventListener('keydown', (event) => {
  if (event.code === 'ShiftLeft' || event.code === 'ShiftRight') {
    toggleShift(event);
  }
});
document.addEventListener('keydown', (event) => {
  if (event.code === 'CapsLock') {
    emulateCapsKey(event);
  }
});
window.addEventListener('keyup', (event) => {
  if (event.code === 'ShiftLeft' || event.code === 'ShiftRight') {
    if (keyCase === 'caseUp' || keyCase === 'shiftCaps') toggleShift(event);
  }
});

rightShift.addEventListener('click', toggleShift);
leftShift.addEventListener('click', toggleShift);

document.querySelectorAll('.keyboard__key').forEach((key) => key.addEventListener('click', addCharacter));
document.addEventListener('keydown', activate);
document.addEventListener('keyup', deactivate);
document.addEventListener('click', () => textArea.focus());
document.addEventListener('keydown', (event) => {
  if (event.ctrlKey && event.shiftKey) {
    toggleLang();
  }
});
