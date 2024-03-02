import "./pages/index.css";
import { createCard, toggleLike } from "./scripts/card.js";
import { closePopup, openPopup } from "./scripts/modal.js";
import { renderSaveLoading, renderCreateLoading, renderDeleteLoading} from "./scripts/loading.js";
import { hideInputError, setEventListeners, toggleButtonState } from "./scripts/validation.js";
import { getInitialCards, getUser, editUser, addCard, deleteCardById, addLikeById, deleteLikeById, editAvatar} from "./scripts/api.js";

// Темплейт и контейнер для карточки

const cardTemplate = document.querySelector("#card-template").content;
const cardsContainer = document.querySelector(".places__list");

// Получение мадальных окон в DOM

const popupTypeEditProfile = document.querySelector(".popup_type_edit");
const popupTypEditAvatar = document.querySelector(".popup_type_edit_avatar");
const popupTypeNewCard = document.querySelector(".popup_type_new-card");
const popupTypeDeleteCard = document.querySelector(".popup_type_delete_card"); // ПОПАП
const popupTypeImage = document.querySelector(".popup_type_image");

// Находим формы в DOM

const formEditProfile = popupTypeEditProfile.querySelector(".popup__form");
const formDeleteCard = popupTypeDeleteCard.querySelector(".popup__form"); 
const formEditAvatar = popupTypEditAvatar.querySelector(".popup__form");
const formNewCard = popupTypeNewCard.querySelector(".popup__form");

// Нахидим DOM модального онка картинки

const image = popupTypeImage.querySelector(".popup__image");
const caption = popupTypeImage.querySelector(".popup__caption ");

// Находим поля формы AddCard в DOM

const titleInput = formNewCard.querySelector(".popup__input_type_card-name");
const urlInput = formNewCard.querySelector(".popup__input_type_url");

// Находим поля формы EditProfile в DOM

const nameInput = formEditProfile.querySelector(".popup__input_type_name");
const jobInput = formEditProfile.querySelector(".popup__input_type_description");

// Находим поля формы EditAvatar в DOM

const avatarInput = formEditAvatar.querySelector(".popup__input_type_avatar");

// Нахидим DOM элементы

const profileTitle = document.querySelector(".profile__title");
const profileDescription = document.querySelector(".profile__description");
const profileImage = document.querySelector(".profile__image");

// Получение кнопок

const profileEditButton = document.querySelector(".profile__edit-button");
const addCardButton = document.querySelector(".profile__add-button");

// Передаём массив с промисами методу Promise.all

Promise.all([getInitialCards(), getUser()])
.then(data => { 
  const cards = data[0];
  const user = data[1];
  renderUser(user);
  renderCards(cardTemplate, cards, createCard, deleteCard, toggleLike, handlePopupTypeImage, user._id);
})
.catch(err => {
  console.log(err);
})
.finally(() => {
  console.log('ok');
})

// Инициализация полей формы

const renderUser = (user) => {
  profileTitle.textContent = user.name;
  profileDescription.textContent = user.about;
  profileImage.setAttribute('style', `background-image: url('${user.avatar}');`);
};

// Функция вывода карточек

const renderCards = (template, cards, createCard, deleteCard, toggleLike, openPopupImg, userId) => {
  cards.forEach((card) => {
    const newCard = createCard(template, card, deleteCard, toggleLike, openPopupImg, userId, addLikeById, deleteLikeById, deleteCardById);
    cardsContainer.append(newCard);
  });
};

const deleteCard = () => {
  
}

// Открытие модальных окон по клику

profileEditButton.addEventListener("click", () => {
  nameInput.value = profileTitle.textContent;
  jobInput.value = profileDescription.textContent;
  clearValidation(formEditProfile);
  openPopup(popupTypeEditProfile);
});

addCardButton.addEventListener("click", () => {
  clearValidation(formNewCard);
  openPopup(popupTypeNewCard);
});

profileImage.addEventListener('click', () => {
  clearValidation(formEditAvatar);
  openPopup(popupTypEditAvatar);
});

// Обработчик открытия попал у удаления карточки

cardsContainer.addEventListener('click', (evt) => {
  if(evt.target.closest(".card__delete-button")) {
    const formBtn = formDeleteCard.querySelector('.popup__button');
    const btnDelete = evt.target.closest(".card__delete-button");
    const card = btnDelete.closest(".card");
    const cardId = card.dataset.id;
    openPopup(popupTypeDeleteCard);
    formBtn.dataset.currentId = cardId;
    formDeleteCard.addEventListener('submit', deleteCardSubmitHandler);
  }
});

const deleteCardSubmitHandler = (evt) => {
  evt.preventDefault();
  const formBtn = formDeleteCard.querySelector('.popup__button');
  const cardId = formBtn.dataset.currentId;
  const elem = document.querySelector(`[data-id="${cardId}"]`);
  renderDeleteLoading(true, formBtn);
  deleteCardById(cardId).then(()  => {
    closePopup(popupTypeDeleteCard);
    formDeleteCard.removeEventListener('submit', deleteCardSubmitHandler);
    elem.remove();
  }).catch(err => {
    console.log(err);
  }).finally(() => {
    renderDeleteLoading(false, formBtn);
  });
}

// Обработчики «отправки» формы

function handleFormEditProfileSubmit(evt) {
  evt.preventDefault();
  const btnSave = popupTypeEditProfile.querySelector('.popup__button');
  const user = {
    name: nameInput.value,
    about: jobInput.value
  }

  // Запрос на изменение профиля пользователя
  renderSaveLoading(true, btnSave);
  editUser(user).then(data => {
    profileTitle.textContent = data.name;
    profileDescription.textContent = data.about;
  }).catch(err => {
    console.log(err);
  }).finally(() => {
    renderSaveLoading(false, btnSave);
    closePopup(popupTypeEditProfile);
  })
}

function handleFormNewCardSubmit(evt) {
  evt.preventDefault();
  const btnCreate = popupTypeNewCard.querySelector('.popup__button');
  const title = titleInput.value;
  const url = urlInput.value;
  const card = {
    name: title,
    link: url,
    likes: []
  };

 // Запрос на создание новой карточки
 
  renderCreateLoading(true, btnCreate);
  Promise.all([addCard(card), getUser()])
    .then(data => { 
      const card = data[0];
      const user = data[1];
      const newCard = createCard(cardTemplate, card, deleteCard, toggleLike, handlePopupTypeImage, user._id, addLikeById, deleteLikeById, deleteCardById);
      cardsContainer.prepend(newCard);
    })
    .catch(err => {
      console.log(err);
    })
    .finally(() => {
      renderCreateLoading(false, btnCreate);
      formNewCard.reset();
      closePopup(popupTypeNewCard);
    })
}

function handleFormEditAvatarSubmit(evt) {
  evt.preventDefault();
  
  const avatar = avatarInput.value;
  const btnSave = popupTypEditAvatar.querySelector('.popup__button');

  profileImage.setAttribute('style', `background-image: url('${avatar}');`);
  // Запрос на изменение профиля пользователя
  renderSaveLoading(true, btnSave);
  editAvatar(avatar).then(data => {
    console.log(data);
  }).catch(err => {
    console.log(err);
  }).finally(() => {
    renderSaveLoading(false, btnSave);
    formEditAvatar.reset();
    closePopup(popupTypEditAvatar);
  })
}

// Обработчик модального окна картинки

function handlePopupTypeImage(cardImage, cardTitle) {
  openPopup(popupTypeImage);
  image.src = cardImage.src;
  image.alt = cardTitle.textContent;
  caption.textContent = cardTitle.textContent;
}

// Вызов обработчиков модальных форм

formNewCard.addEventListener("submit", handleFormNewCardSubmit);
formEditProfile.addEventListener("submit", handleFormEditProfileSubmit);
formEditAvatar.addEventListener("submit", handleFormEditAvatarSubmit);
// formDeleteCard.addEventListener("submit", handlePopupDeleteCard);

// Включение всех форм на странице

const enableValidation = () => {
  const formList = Array.from(document.querySelectorAll(".popup__form"));
  formList.forEach((form) => {
    setEventListeners(form);
  });
};

// Очистка ошибок у полей формы

const clearValidation = (formElement) => {
  const inputList = Array.from(formElement.querySelectorAll(".popup__input"));
  const buttonElement = formElement.querySelector(".popup__button");
  inputList.forEach((input) => {
    input.setCustomValidity("");
    hideInputError(formElement, input);
  });
  toggleButtonState(inputList, buttonElement);
};

// Включение всех форм на странице

enableValidation();


