import './pages/index.css';
import { initialCards } from './scripts/cards.js'; 
import { createCard, deleteCard, addLike } from './scripts/card.js'; 
import { closePopup, openPopup } from './scripts/modal.js'; 

// Темплейт и контейнер для карточки

const cardTemplate = document.querySelector("#card-template").content;
const cardsContainer = document.querySelector(".places__list");

// Получение мадальных окон в DOM

const popupEdit = document.querySelector(".popup_type_edit");
const popupAddCard = document.querySelector(".popup_type_new-card");
const popupImage = document.querySelector(".popup_type_image");

// Находим формы в DOM

const formAddCard = popupAddCard.querySelector(".popup__form");
const formEditProfile = popupEdit.querySelector(".popup__form");

// Находим поля формы AddCard в DOM

const titleInput = formAddCard.querySelector('.popup__input_type_card-name');
const urlInput = formAddCard.querySelector('.popup__input_type_url');

// Находим поля формы EditProfile в DOM

const nameInput = formEditProfile.querySelector('.popup__input_type_name');
const jobInput = formEditProfile.querySelector('.popup__input_type_description');

// Нахидим

const title = document.querySelector('.profile__title');
const description = document.querySelector('.profile__description');

// Получение кнопок

const profileEditButton = document.querySelector(".profile__edit-button");
const addCardButton = document.querySelector(".profile__add-button");

// Открытие модальных окон по клику

profileEditButton.addEventListener("click", () => {
  openPopup(popupEdit);

  nameInput.value = title.textContent;
  jobInput.value = description.textContent;
});

addCardButton.addEventListener("click", () => {
  openPopup(popupAddCard);
});

// Функция добавлению новой карточки в форме

function addNewCard(){
  let title = titleInput.value;
  let url = urlInput.value;

  let card = {
    name: title,
    link: url
  };
  const newCard = createCard(cardTemplate, card, deleteCard, addLike, handlePopupImage);
  cardsContainer.prepend(newCard);
  
  titleInput.value = '';
  urlInput.value = '';
}

// Функция изменения данных в форме

function editProfile() {
  title.textContent = nameInput.value ;
  description.textContent = jobInput.value;
}

// Обработчик «отправки» формы

function handleFormSubmit(evt) {
  evt.preventDefault();
  const popup = evt.target.closest('.popup');
  if(popup.classList.contains('popup_type_new-card')){
    addNewCard();
  }
  else if(popup.classList.contains('popup_type_edit')){
    editProfile()
  }
  closePopup(popup);
}

// Обработчик модального окна картинки

function handlePopupImage(cardImage, cardTitle) {
  openPopup(popupImage);
  const image = popupImage.querySelector('.popup__image');
  const caption = popupImage.querySelector('.popup__caption ');
  image.src = cardImage.src;
  caption.textContent = cardTitle.textContent;
}

// Функция вывода карточек

const renderCards = ( template, cards, createCard, deleteCard, addLike, openPopup) => {
  cards.forEach((card) => {
    const newCard = createCard(template, card, deleteCard, addLike, openPopup);
    cardsContainer.append(newCard);
  });
}  

// Вывод карточек из массива

renderCards(cardTemplate, initialCards, createCard, deleteCard, addLike, handlePopupImage);

// Вызов обработчиков модальных форм

formAddCard.addEventListener('submit', handleFormSubmit);
formEditProfile.addEventListener('submit', handleFormSubmit);

