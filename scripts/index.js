// @todo: Темплейт карточки

const cardTemplate = document.querySelector("#card-template").content;

// @todo: DOM узлы

const placesList = document.querySelector(".places__list");

// @todo: Функция создания карточки

function createCard(cardImage, cardTitle, deleteCard) {
  const card = cardTemplate.querySelector(".card").cloneNode(true);
  card.querySelector(".card__image").src = cardImage;
  card.querySelector(".card__title").alt = cardTitle;
  card.querySelector(".card__title").textContent = cardTitle;
  card.querySelector(".card__delete-button").addEventListener("click", deleteCard);
  return card;
}

// @todo: Функция удаления карточки

const deleteCard = (event) => {
  const placesItem = event.target.closest(".places__item");
  placesItem.remove();
};

// @todo: Вывести карточки на страницу

initialCards.forEach((item) => {
  const card = createCard(item.link, item.name, deleteCard);
  placesList.append(card);
});
