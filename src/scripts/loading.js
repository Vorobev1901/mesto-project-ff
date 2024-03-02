
function renderSaveLoading(isLoading, buttonElement){
    if(isLoading) {
      buttonElement.textContent = "Сохранение...";
      buttonElement.disabled = true;
    } else {
      buttonElement.textContent = "Сохранить";
      buttonElement.disabled = false;
    }
}

function renderCreateLoading(isLoading, buttonElement){
    if(isLoading) {
      buttonElement.textContent = "Создание...";
      buttonElement.disabled = true;
    } else {
      buttonElement.textContent = "Создать";
      buttonElement.disabled = false;
    }
}

function renderDeleteLoading(isLoading, buttonElement){
  if(isLoading) {
    buttonElement.textContent = "Удаление...";
    buttonElement.disabled = true;
  } else {
    buttonElement.textContent = "Да";
    buttonElement.disabled = false;
  }
}

export {renderSaveLoading, renderCreateLoading, renderDeleteLoading};