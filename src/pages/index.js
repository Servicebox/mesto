import '../pages/index.css';



import 
{
  initialCards,
  obj,
  editProfileButton,
  addCardButton,
  formCards,
  formProfile,
  nameProfileInput,
  jobProfileInput,
  cardsBlock,
  editAvatarButton,
  formAvatar
} from '../utils/constants';

import { Card } from '../components/Card.js';
import { FormValidator } from '../components/FormValidator.js';
import { Section } from '../components/Section.js';
import { PopupWithForm } from '../components/PopupWithForm.js';
import { PopupWithImage } from '../components/PopupWithImage.js';
import { UserInfo } from '../components/UserInfo.js';
import { PopupConfirmation } from '../components/PopupConfirmation.js';
import { Api } from '../components/Api.js';


// экз класса Api
const api = new Api({
  url: 'https://mesto.nomoreparties.co/v1/cohort-64',
  headers: {
    authorization: '5d9c5d74-2e9f-4bf3-bd3c-1563f1b38a12',
    'Content-Type': 'application/json'
  }
})

Promise.all([api.getUserInfoApi(), api.getInitialCards()])
  .then(([userData, initialCards]) => {
    user.setUserInfo(userData);
    cardsList.renderItems(initialCards);
  })
  .catch((err) => {
    console.log(err);
  });

// попап просмотра изображения
const popupViewImage = new PopupWithImage('.popup-image');
popupViewImage.setEventListeners();

function viewPopupImageImg(name, link) {
  //открытие попап просмотра изображения
  popupViewImage.open(name, link);
}

//попап подтверждения удаления карточки
const popupConfirm = new PopupConfirmation('.popup-delete');
popupConfirm.setEventListeners();

// для записи и нформации в инпуты профиля
function inputsProfileInfo(data) {
  nameProfileInput.value = data.name;
  jobProfileInput.value = data.job;
}

// управление отображением информации о пользователе на странице */
const user = new UserInfo({
  nameSelector: '.profile__name',
  jobSelector: '.profile__job',
  avatarSelector: '.profile__avatar',
});

// попап редактирования профиля
const popupProfile = new PopupWithForm('.popup-profile', (inputs) => {
  popupProfile.renderLoading(true, 'Сохраняем...');
  api
    .editUserInfo(inputs)
    .then((inputs) => {
      user.setUserInfo(inputs);
      popupProfile.close();
      console.log(inputs);
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      popupProfile.renderLoading(false, 'Сохранить');
    });
});
popupProfile.setEventListeners();

editProfileButton.addEventListener('click', () => {
  //открытие попап профиля
  const userInfoProfile = user.getUserInfo();
  inputsProfileInfo({
    name: userInfoProfile.name,
    job: userInfoProfile.job,
  });
  popupProfile.open();
  profileValidation.disablesSubmitForm();
});

//попап редактирования аватарки
const popupAvatar = new PopupWithForm('.popup-avatar', (data) => {
  popupAvatar.renderLoading(true, 'Сохраняем...');
  api
    .editUserAvatar(data)
    .then((data) => {
      user.setUserInfo(data);
      popupAvatar.close();
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      popupAvatar.renderLoading(false, 'Сохранить');
    });
});
popupAvatar.setEventListeners();


editAvatarButton.addEventListener('click', () => {
  popupAvatar.open();//открытие попап аватарки
  formAvatarValidation.disablesSubmitForm();
});

//создание новой карточки 
const createCard = (data) => {
  const card = new Card(
    {
      data: data,
      userId: user.getUserId(),
      viewPopupImage: () => {
        viewPopupImageImg(data);
      },
      handleCardDelete: () => {
        popupConfirm.open();
        popupConfirm.setSubmit(() => {
          popupConfirm.renderLoading(true, 'Удаляем...');
          api
            .removeCardApi(card.getId())
            .then(() => {
              card.removeCard();
              popupConfirm.close();
            })
            .catch((err) => {
              console.log(err);
            })
            .finally(() => {
              popupConfirm.renderLoading(false, 'Да');
            });
        });
      },
      handleCardLike: () => {
        api
          .addCardLike(card.getId())
          .then((data) => {
            card.cardLiked(data);
          })
          .catch((err) => {
            console.log(err);
          });
      },
      handleRemoveLike: () => {
        api
          .removeCardLike(card.getId())
          .then((data) => {
            card.cardLiked(data);
          })
          .catch((err) => {
            console.log(err);
          });
      },
    },
    '#card__template'
  );
  return card.generateCard();
};

// отрисовка элементов на странице 
const cardsList = new Section(
  {
    renderer: (input) => {
      cardsList.addItem(createCard(input),true);
    },
  },
  cardsBlock
);

//попап добавления карточки 
const popupAdd = new PopupWithForm('.popup-add', (data) => {
  popupAdd.renderLoading(true, 'Создаем...');
  api
    .addCards(data)
    .then((data) => {
      cardsList.addItem(createCard(data),false);
      popupAdd.close();
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      popupAdd.renderLoading(false, 'Создать');
    });
});
popupAdd.setEventListeners();

addCardButton.addEventListener('click', () => {
  //для открытия попап добавления карточоки
  popupAdd.open();
  formCardValidation.disablesSubmitForm();
});

//валидация форм
const profileValidation = new FormValidator(obj, formProfile);
profileValidation.enableValidation();

const formCardValidation = new FormValidator(obj, formCards);
formCardValidation.enableValidation();

const formAvatarValidation = new FormValidator(obj, formAvatar);
formAvatarValidation.enableValidation();