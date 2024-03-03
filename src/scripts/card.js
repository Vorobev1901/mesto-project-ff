// Функция клонирования шаблона

function getCardTemplate(template) {
  const card = template.querySelector('.card').cloneNode(true);
  return card;
}

// Функция создания карточки
function createCard(template, cardData, toggleLike, handlePopupTypeImage, userId, addLikeById, deleteLikeById, handlePopupTypeDeleteCard) {
  const card = getCardTemplate(template);
  const cardImage = card.querySelector('.card__image');
  const cardTitle = card.querySelector('.card__title');
  const buttonDelete = card.querySelector('.card__delete-button');
  const likeButton = card.querySelector('.card__like-button');
  const likeCounter = card.querySelector('.card__like-counter');

  card.dataset.cardId = cardData._id;
  card.dataset.ownerId = userId;
  cardImage.src = cardData.link;
  cardImage.alt = cardData.name;
  cardTitle.textContent = cardData.name;
  likeCounter.textContent = cardData.likes.length;
  likeButton.addEventListener('click', () => toggleLike(cardData, likeButton, addLikeById, deleteLikeById, likeCounter));
  cardImage.addEventListener('click', () => handlePopupTypeImage(cardImage, cardTitle));

  cardData.likes.forEach((like) => {
    if (like._id === userId) {
      likeButton.classList.add('card__like-button_is-active');
    }
  });

  if (cardData.owner._id === userId) {
    buttonDelete.setAttribute('style', 'display: block;');
    buttonDelete.addEventListener('click', (evt) => handlePopupTypeDeleteCard(evt));
  }

  return card;
}

// Функция удаления карточки

const deleteCard = (card) => {
  card.remove();
};

// Функция обработчика "лайка"

const toggleLike = (card, likeBtn, addLikeById, deleteLikeById, likeCounter) => {
  if (likeBtn.closest('.card__like-button_is-active')) {
    deleteLikeById(card._id).then((data) => {
      likeCounter.textContent = data.likes.length;
    });
    likeBtn.classList.remove('card__like-button_is-active');
  } else {
    addLikeById(card._id).then((data) => {
      likeCounter.textContent = data.likes.length;
    });
    likeBtn.classList.add('card__like-button_is-active');
  }
};

export { createCard, deleteCard, toggleLike };
