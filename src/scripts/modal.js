const escKey = 27; // Клавиша ESC

// Закрытие по нажатию на close, esc, вне формы.

function closeBtn(evt) {
  if (evt.target.className == 'popup__close') {
    const popup = document.querySelector('.popup.popup_is-opened');
    closePopup(popup);
  }
}

function clickEsc(evt) {
  if (evt.keyCode === escKey) {
    const popup = document.querySelector('.popup.popup_is-opened');
    closePopup(popup);
  }
}

function clickOutsidePopup(evt) {
  if (!evt.target.closest('.popup__content')) {
    const popup = evt.target.closest('.popup.popup_is-opened');
    closePopup(popup);
  }
}

// Функция октрытия модального окна

function openPopup(popup) {
  popup.classList.add('popup_is-opened');
  popup.addEventListener('mousedown', clickOutsidePopup);
  popup.addEventListener('click', closeBtn);
  document.addEventListener('keydown', clickEsc);
}

// Функция закрытия модального окна

function closePopup(popup) {
  const formElement = popup.querySelector('.popup__form');
  formElement.reset();
  popup.classList.remove('popup_is-opened');
  popup.removeEventListener('mousedown', clickOutsidePopup);
  popup.removeEventListener('click', closeBtn);
  document.removeEventListener('keydown', clickEsc);
}

export { closePopup, openPopup };
