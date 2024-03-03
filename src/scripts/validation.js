// Валидация формы EditProfile

const checkInputValidity = (formElement, inputElement, inputErrorClass, errorClass) => {
  const regex = /[^а-яёa-z\-\s]+/i;
  const inputStr = inputElement.value;
  if (regex.test(inputStr) && inputElement.getAttribute('type') !== 'url') {
    inputElement.setCustomValidity(inputElement.dataset.errorMessage);
  } else {
    inputElement.setCustomValidity('');
  }
  if (!inputElement.validity.valid) {
    showInputError(formElement, inputElement, inputElement.validationMessage, inputErrorClass, errorClass);
  } else {
    hideInputError(formElement, inputElement, inputErrorClass, errorClass);
  }
};

const showInputError = (formElement, inputElement, errorMessage, inputErrorClass, errorClass) => {
  const errorElement = formElement.querySelector(`.${inputElement.id}-error`);
  inputElement.classList.add(inputErrorClass);
  errorElement.classList.add(errorClass);
  errorElement.textContent = errorMessage;
};

const hideInputError = (formElement, inputElement, inputErrorClass, errorClass) => {
  const errorElement = formElement.querySelector(`.${inputElement.id}-error`);
  inputElement.classList.remove(inputErrorClass);
  errorElement.classList.remove(errorClass);
  errorElement.textContent = '';
};

const setEventListeners = (formElement, inputSelector, submitButtonSelector, inactiveButtonClass, inputErrorClass, errorClass) => {
  const inputList = Array.from(formElement.querySelectorAll(inputSelector));
  const buttonElement = formElement.querySelector(submitButtonSelector);
  toggleButtonState(inputList, buttonElement, inactiveButtonClass);
  inputList.forEach((input) => {
    input.addEventListener('input', () => {
      checkInputValidity(formElement, input, inputErrorClass, errorClass);
      toggleButtonState(inputList, buttonElement, inactiveButtonClass);
    });
  });
};

const hasInvalidInput = (inputList) => {
  return inputList.some((input) => {
    return !input.validity.valid;
  });
};

const toggleButtonState = (inputList, buttonElement, inactiveButtonClass) => {
  if (hasInvalidInput(inputList)) {
    buttonElement.disabled = true;
    buttonElement.classList.add(inactiveButtonClass);
  } else {
    buttonElement.disabled = false;
    buttonElement.classList.remove(inactiveButtonClass);
  }
};

// Включение всех форм на странице

const enableValidation = ({ formSelector, inputSelector, submitButtonSelector, inactiveButtonClass, inputErrorClass, errorClass }) => {
  const formList = Array.from(document.querySelectorAll(formSelector));
  formList.forEach((form) => {
    setEventListeners(form, inputSelector, submitButtonSelector, inactiveButtonClass, inputErrorClass, errorClass);
  });
};

// Очистка ошибок у полей формы

const clearValidation = (formElement, { inputSelector, submitButtonSelector, inactiveButtonClass, inputErrorClass, errorClass }) => {
  const inputList = Array.from(formElement.querySelectorAll(inputSelector));
  const buttonElement = formElement.querySelector(submitButtonSelector);
  inputList.forEach((input) => {
    input.setCustomValidity('');
    hideInputError(formElement, input, inputErrorClass, errorClass);
  });
  toggleButtonState(inputList, buttonElement, inactiveButtonClass);
};

export { enableValidation, clearValidation };
