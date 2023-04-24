import keysData from './keysData.mjs';

function initDomStructure() {
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
      keyboardKey.innerText = keysData[i][j].eng.caseDown;
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
}

window.addEventListener('load', initDomStructure);
