import "./pages/index.css";
import { initialCards } from "./scripts/cards.js";
import { createCard, deleteCard, toggleLike } from "./scripts/card.js";
import { closePopup, openPopup } from "./scripts/modal.js";

// Темплейт и контейнер для карточки

const cardTemplate = document.querySelector("#card-template").content;
const cardsContainer = document.querySelector(".places__list");

// Получение мадальных окон в DOM

const popupTypeEditProfile = document.querySelector(".popup_type_edit");
const popupTypeNewCard = document.querySelector(".popup_type_new-card");
const popupTypeImage = document.querySelector(".popup_type_image");

// Находим формы в DOM

const formNewCard = popupTypeNewCard.querySelector(".popup__form");
const formEditProfile = popupTypeEditProfile.querySelector(".popup__form");

// Нахидим DOM модального онка картинки

const image = popupTypeImage.querySelector(".popup__image");
const caption = popupTypeImage.querySelector(".popup__caption ");

// Находим поля формы AddCard в DOM

const titleInput = formNewCard.querySelector(".popup__input_type_card-name");
const urlInput = formNewCard.querySelector(".popup__input_type_url");

// Находим поля формы EditProfile в DOM

const nameInput = formEditProfile.querySelector(".popup__input_type_name");
const jobInput = formEditProfile.querySelector(".popup__input_type_description");

// Нахидим DOM элементы

const title = document.querySelector(".profile__title");
const description = document.querySelector(".profile__description");

// Получение кнопок

const profileEditButton = document.querySelector(".profile__edit-button");
const addCardButton = document.querySelector(".profile__add-button");

// Открытие модальных окон по клику

profileEditButton.addEventListener("click", () => {
  openPopup(popupTypeEditProfile);
  nameInput.value = title.textContent;
  jobInput.value = description.textContent;
});

addCardButton.addEventListener("click", () => {
  openPopup(popupTypeNewCard);
});

// Обработчики «отправки» формы

function handleFormEditProfileSubmit(evt) {
  evt.preventDefault();
  const popup = evt.target.closest(".popup");
  title.textContent = nameInput.value;
  description.textContent = jobInput.value;
  closePopup(popup);
}

function handleFormNewCardSubmit(evt) {
  evt.preventDefault();
  const popup = evt.target.closest(".popup");
  const title = titleInput.value;
  const url = urlInput.value;
  const card = {
    name: title,
    link: url,
  };
  const newCard = createCard(cardTemplate, card, deleteCard, toggleLike, handlePopupTypeImage);
  cardsContainer.prepend(newCard);
  formNewCard.reset();
  closePopup(popup);
}

// Обработчик модального окна картинки

function handlePopupTypeImage(cardImage, cardTitle) {
  openPopup(popupTypeImage);
  image.src = cardImage.src;
  image.alt = cardTitle.textContent;
  caption.textContent = cardTitle.textContent;
}

// Функция вывода карточек

const renderCards = ( template, cards, createCard, deleteCard, toggleLike, openPopup) => {
  cards.forEach((card) => {
    const newCard = createCard(template, card, deleteCard, toggleLike, openPopup);
    cardsContainer.append(newCard);
  });
}

// Вывод карточек из массива

renderCards(cardTemplate, initialCards, createCard, deleteCard, toggleLike, handlePopupTypeImage);

// Вызов обработчиков модальных форм

formNewCard.addEventListener("submit", handleFormNewCardSubmit);
formEditProfile.addEventListener("submit", handleFormEditProfileSubmit);
