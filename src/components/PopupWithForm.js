import { Popup } from './Popup.js';

class PopupWithForm extends Popup {
  constructor(popupSelector, handleFormSubmit) {
    super(popupSelector);

    this._handleFormSubmit = handleFormSubmit;
    this._form = document.querySelector(popupSelector).querySelector('.form');
    this._inputList = Array.from(this._form.querySelectorAll('.form__input'));
    this._submitButton = this._form.querySelector('.form__submit-button');
    this._submitButtonText = this._submitButton.textContent;
  }

  //метод собирает данные всех полей формы
  _getInputValues() {
    this._formInputValues = {}; //пустой объект
    this._inputList.forEach((input) => {
      this._formInputValues[input.name] = input.value;
    });
    return this._formInputValues;
  }

  close() {
    super.close();
    this._form.reset();
  }

 
  setEventListeners() {
    super.setEventListeners();

    this._form.addEventListener('submit', (e) => {
      e.preventDefault();
      this._handleFormSubmit(this._getInputValues());
    });
  }

  renderLoading(isLoading, submitButtonText) {
    if (isLoading) {
      this._submitButton.textContent = submitButtonText;
      this._submitButton.disabled = true;
    } else {
      this._submitButton.textContent = submitButtonText;
      this._submitButton.disabled = false;
    }
  }
}

export { PopupWithForm };