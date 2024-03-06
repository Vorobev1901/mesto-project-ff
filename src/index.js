import './pages/index.css';
import { createCard, deleteCard, changeLike } from './scripts/card.js';
import { closePopup, openPopup } from './scripts/modal.js';
import { renderLoading } from './scripts/loading.js';
import { enableValidation, clearValidation } from './scripts/validation.js';
import { getInitialCards, getUser, editUser, addCard, deleteCardById, putLikeCard, deleteLikeCard, editAvatar } from './scripts/api.js';

// Темплейт и контейнер для карточки

const cardTemplate = document.querySelector('#card-template').content;
const cardsContainer = document.querySelector('.places__list');

// Получение мадальных окон в DOM

const popupTypeEditProfile = document.querySelector('.popup_type_edit');
const popupTypEditAvatar = document.querySelector('.popup_type_edit_avatar');
const popupTypeNewCard = document.querySelector('.popup_type_new-card');
const popupTypeDeleteCard = document.querySelector('.popup_type_delete_card'); // ПОПАП
const popupTypeImage = document.querySelector('.popup_type_image');

// Находим формы в DOM

const formEditProfile = popupTypeEditProfile.querySelector('.popup__form');
const formDeleteCard = popupTypeDeleteCard.querySelector('.popup__form');
const formEditAvatar = popupTypEditAvatar.querySelector('.popup__form');
const formNewCard = popupTypeNewCard.querySelector('.popup__form');

// Нахидим DOM модального онка картинки

const image = popupTypeImage.querySelector('.popup__image');
const caption = popupTypeImage.querySelector('.popup__caption ');

// Находим поля формы AddCard в DOM

const titleInput = formNewCard.querySelector('.popup__input_type_card-name');
const urlInput = formNewCard.querySelector('.popup__input_type_url');

// Находим поля формы EditProfile в DOM

const nameInput = formEditProfile.querySelector('.popup__input_type_name');
const jobInput = formEditProfile.querySelector('.popup__input_type_description');

// Находим поля формы EditAvatar в DOM

const avatarInput = formEditAvatar.querySelector('.popup__input_type_avatar');

// Нахидим DOM элементы

const profileTitle = document.querySelector('.profile__title');
const profileDescription = document.querySelector('.profile__description');
const profileImage = document.querySelector('.profile__image');

// Получение кнопок

const profileEditButton = document.querySelector('.profile__edit-button');
const addCardButton = document.querySelector('.profile__add-button');

// Конфигурация валидаций

const validationEnableConfig = {
  formSelector: '.popup__form',
  inputSelector: '.popup__input',
  submitButtonSelector: '.popup__button',
  inactiveButtonClass: 'popup__button_inactive',
  inputErrorClass: 'popup__input_type_error',
  errorClass: 'popup__input-error_visible',
};

const validationClearConfig = {
  inputSelector: '.popup__input',
  submitButtonSelector: '.popup__button',
  inactiveButtonClass: 'popup__button_inactive',
  inputErrorClass: 'popup__input_type_error',
  errorClass: 'popup__input-error_visible',
};

// Переменные с id пользователем и id выбранной карточки

let userId = '';
let currentCardId = '';
let cardElement = null;

// Получение карточек и пользователя, вывод их на страницу

Promise.all([getInitialCards(), getUser()])
  .then((data) => {
    const cards = data[0];
    const user = data[1];
    userId = user._id;
    renderUser(user);
    renderCards(cardTemplate, cards, createCard);
  })
  .catch((err) => {
    console.log(`Ошибка: ${err}`);
  })
  .finally(() => {
    console.log('Загрузка данных завершена.');
  });

// Инициализация полей формы

const renderUser = (user) => {
  profileTitle.textContent = user.name;
  profileDescription.textContent = user.about;
  profileImage.setAttribute('style', `background-image: url('${user.avatar}');`);
};

// Функция вывода карточек

const renderCards = (template, cards, createCard) => {
  cards.forEach((card) => {
    const newCard = createCard(template, card, handlePopupTypeImage, userId, handleLikeCard, handlePopupTypeDeleteCard);
    cardsContainer.append(newCard);
  });
};

// Открытие модальных окон по клику

profileEditButton.addEventListener('click', () => {
  nameInput.value = profileTitle.textContent;
  jobInput.value = profileDescription.textContent;
  clearValidation(formEditProfile, validationClearConfig);
  openPopup(popupTypeEditProfile);
});

addCardButton.addEventListener('click', () => {
  clearValidation(formNewCard, validationClearConfig);
  openPopup(popupTypeNewCard);
});

profileImage.addEventListener('click', () => {
  clearValidation(formEditAvatar, validationClearConfig);
  openPopup(popupTypEditAvatar);
});

// Обработчики «отправки» формы

const handleFormDeleteCardSubmit = (evt) => {
  evt.preventDefault();
  const formBtn = formDeleteCard.querySelector('.popup__button');
  renderLoading(formBtn, 'Удаление...');
  deleteCardById(currentCardId)
    .then(() => {
      closePopup(popupTypeDeleteCard);
      deleteCard(cardElement);
      currentCardId = '';
      cardElement = null;
    })
    .catch((err) => {
      console.log(`Ошибка: ${err}`);
    })
    .finally(() => {
      renderLoading(formBtn, 'Да');
    });
};

function handleFormEditProfileSubmit(evt) {
  evt.preventDefault();
  const btnSave = popupTypeEditProfile.querySelector('.popup__button');
  const user = {
    name: nameInput.value,
    about: jobInput.value,
  };
  // Запрос на изменение профиля пользователя
  renderLoading(btnSave, 'Сохранение...');
  editUser(user)
    .then((data) => {
      profileTitle.textContent = data.name;
      profileDescription.textContent = data.about;
      closePopup(popupTypeEditProfile);
    })
    .catch((err) => {
      console.log(`Ошибка: ${err}`);
    })
    .finally(() => {
      renderLoading(btnSave, 'Сохранить');
    });
}

function handleFormNewCardSubmit(evt) {
  evt.preventDefault();
  const btnCreate = popupTypeNewCard.querySelector('.popup__button');
  const title = titleInput.value;
  const url = urlInput.value;
  const card = {
    name: title,
    link: url,
    likes: [],
  };
  // Запрос на создание новой карточки
  renderLoading(btnCreate, 'Создание...');
  addCard(card)
    .then((data) => {
      const card = data;
      const newCard = createCard(cardTemplate, card, handlePopupTypeImage, userId, handleLikeCard, handlePopupTypeDeleteCard);
      cardsContainer.prepend(newCard);
      formNewCard.reset();
      closePopup(popupTypeNewCard);
    })
    .catch((err) => {
      console.log(`Ошибка: ${err}`);
    })
    .finally(() => {
      renderLoading(btnCreate, 'Создать');
    });
}

function handleFormEditAvatarSubmit(evt) {
  evt.preventDefault();
  const avatar = avatarInput.value;
  const btnSave = popupTypEditAvatar.querySelector('.popup__button');
  // Запрос на изменение профиля пользователя
  renderLoading(btnSave, 'Сохранение...');
  editAvatar(avatar)
    .then((data) => {
      console.log(data);
      profileImage.setAttribute('style', `background-image: url('${avatar}');`);
      formEditAvatar.reset();
      closePopup(popupTypEditAvatar);
    })
    .catch((err) => {
      console.log(`Ошибка: ${err}`);
    })
    .finally(() => {
      renderLoading(btnSave, 'Сохранить');
    });
}

// Обработчик открытия модального окна картинки

function handlePopupTypeImage(cardImage, cardTitle) {
  openPopup(popupTypeImage);
  image.src = cardImage.src;
  image.alt = cardTitle.textContent;
  caption.textContent = cardTitle.textContent;
}

// Обработчик открытия попап у удаления карточки

function handlePopupTypeDeleteCard(cardElem, cardId) {
  openPopup(popupTypeDeleteCard);
  currentCardId = cardId;
  cardElement = cardElem;
}

// Обработчик клика like карточки

function handleLikeCard(checkStatusLike, cardData, counterLike, buttonLike) {
  const status = checkStatusLike(cardData, userId);
  !status
    ? putLikeCard(cardData._id)
        .then((res) => changeLike(res, counterLike, buttonLike, cardData, userId))
        .catch((err) => {
          console.log(`Ошибка: ${err}`);
        })
    : deleteLikeCard(cardData._id)
        .then((res) => changeLike(res, counterLike, buttonLike, cardData, userId))
        .catch((err) => {
          console.log(`Ошибка: ${err}`);
        });
}
// Вызов обработчиков модальных форм

formNewCard.addEventListener('submit', handleFormNewCardSubmit);
formEditProfile.addEventListener('submit', handleFormEditProfileSubmit);
formEditAvatar.addEventListener('submit', handleFormEditAvatarSubmit);
formDeleteCard.addEventListener('submit', handleFormDeleteCardSubmit);

// Включение всех форм на странице

enableValidation(validationEnableConfig);
