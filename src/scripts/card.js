// Функция клонирования шаблона

function getCardTemplate(template) {
  const card = template.querySelector(".card").cloneNode(true);
  return card;
}

// Функция создания карточки

function createCard(template, cardData, deleteCard, addLike, openPopupImg, userId, addLikeById, deleteLikeById, deleteCardById, openPopupDeleteCard) {
  const card = getCardTemplate(template);
  const cardImage = card.querySelector(".card__image");
  const cardTitle = card.querySelector(".card__title");
  const buttonDelete = card.querySelector(".card__delete-button");
  const likeButton = card.querySelector(".card__like-button");
  const likeCounter = card.querySelector(".card__like-counter");

  card.dataset.id = cardData._id;
  cardImage.src = cardData.link;
  cardImage.alt = cardData.name;
  cardTitle.textContent = cardData.name;
  likeCounter.textContent = cardData.likes.length;
  likeButton.addEventListener("click", () => addLike(likeButton, addLikeById, deleteLikeById, cardData, likeCounter));
  cardImage.addEventListener("click", () => openPopupImg(cardImage, cardTitle));
  
  cardData.likes.forEach(obj => {
    if(obj['_id'] === userId) {
      likeButton.classList.add("card__like-button_is-active");
    }
  }) 

  if(cardData.owner._id == userId) {
    buttonDelete.setAttribute('style', 'display: block;');
  }
  
  return card;
}

// Функция удаления карточки

// const deleteCard = (card, cardId) => {
//   card.remove();
//   // deleteCardById(cardId).then(data  => {
//   //   console.log(data);
//   // }).catch(err => {
//   //   console.log(err);
//   // }).finally(() => {
//   // });
// };

// Функция обработчика "лайка"

const toggleLike = (likeBtn, addLikeById, deleteLikeById, card, likeCounter) => {
  if(likeBtn.closest('.card__like-button_is-active')) {
    deleteLikeById(card._id).then(data => {
      likeCounter.textContent = data.likes.length;
    });
    likeBtn.classList.remove("card__like-button_is-active");
  } else {
    addLikeById(card._id).then(data => {
      likeCounter.textContent = data.likes.length;
    });
    likeBtn.classList.add("card__like-button_is-active");
  }
};

export { createCard, /*deleteCard,*/ toggleLike };
