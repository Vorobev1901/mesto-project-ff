// Функция клонирования шаблона

function getCardTemplate(template) {
  const card = template.querySelector(".card").cloneNode(true);
  return card;
}

// Функция создания карточки

function createCard(template, cardData, deleteCard, addLike, openPopupImg) {
  const card = getCardTemplate(template);
  const cardImage = card.querySelector(".card__image");
  const cardTitle = card.querySelector(".card__title");
  const buttonDelete = card.querySelector(".card__delete-button");
  const likeButton = card.querySelector(".card__like-button");

  cardImage.src = cardData.link;
  cardImage.alt = cardData.name;
  cardTitle.textContent = cardData.name;
  buttonDelete.addEventListener("click", () => deleteCard(card));
  likeButton.addEventListener("click", () => addLike(likeButton));
  cardImage.addEventListener("click", () => openPopupImg(cardImage, cardTitle));
  return card;
}

// Функция удаления карточки

const deleteCard = (card) => {
  card.remove();
};

// Функция обработчика "лайка"

const toggleLike = (likeBtn) => {
  likeBtn.classList.toggle("card__like-button_is-active");
};

export { createCard, deleteCard, toggleLike };
