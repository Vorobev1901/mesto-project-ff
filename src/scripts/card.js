// Функция клонирования шаблона

function getCardTemplate(template) {
  const card = template.querySelector('.card').cloneNode(true);
  return card;
}

// Функция создания карточки
function createCard(template, cardData, handlePopupTypeImage, userId, handleLikeCard, handlePopupTypeDeleteCard) {
  const card = getCardTemplate(template);
  const cardImage = card.querySelector('.card__image');
  const cardTitle = card.querySelector('.card__title');
  const buttonDelete = card.querySelector('.card__delete-button');
  const buttonLike = card.querySelector('.card__like-button');
  const counterLike = card.querySelector('.card__like-counter');

  cardImage.src = cardData.link;
  cardImage.alt = cardData.name;
  cardTitle.textContent = cardData.name;
  cardImage.addEventListener('click', () => handlePopupTypeImage(cardImage, cardTitle));

  changeLike(cardData, counterLike, buttonLike, cardData, userId);
  buttonLike.addEventListener('click', () => handleLikeCard(checkStatusLike, cardData, counterLike, buttonLike));

  const isVisible = checkVisibleDeleteButton(cardData, userId);
  if (isVisible) {
    changeVisibleDeleteButton(buttonDelete);
    buttonDelete.addEventListener('click', () => handlePopupTypeDeleteCard(card, cardData._id));
  }

  return card;
}

// Функции обработки кнопки удаления

function checkVisibleDeleteButton(cardData, userId) {
  return cardData.owner._id === userId;
}

function changeVisibleDeleteButton(buttonDelete) {
  buttonDelete.setAttribute('style', 'display: block;');
}

// Функция удаления карточки

function deleteCard(card) {
  card.remove();
}

// Функции обработки "лайка"

function checkStatusLike(cardData, userId) {
  return cardData.likes.some((like) => like._id === userId);
}

function changeLike(responseData, counterLike, buttonLike, cardData, userId) {
  counterLike.textContent = responseData.likes.length;
  const status = checkStatusLike(responseData, userId);
  status ? buttonLike.classList.add('card__like-button_is-active') : buttonLike.classList.remove('card__like-button_is-active');
  cardData.likes = responseData.likes;
}

export { createCard, deleteCard, checkStatusLike, changeLike };
