const modelSlider = {
  currentIndex: -1,
  prevIndex: -1,
  sliders: [],
};

const slider = {
  init: function () {
    modelSlider.sliders = Array.from(document.querySelectorAll('.proposal-slider-item'));

    if (modelSlider.sliders.length) {
      modelSlider.currentIndex = this.findCurrentIndex();

      sliderButtonsView.init();
      sliderDotsView.init();
    }
  },

  getSliders: function () {
    return modelSlider.sliders;
  },

  getCurrentIndex: function () {
    return modelSlider.currentIndex;
  },

  getPrevIndex: function () {
    return modelSlider.prevIndex;
  },

  setPrevSlide: function (evt) {
    evt.preventDefault();
    let currentIndex = this.getCurrentIndex();
    if (!this.isFirstSlide()) {
      this.changeSlide(--currentIndex);
    }
    sliderButtonsView.render();
    sliderDotsView.render();
  },

  setNextSlide: function (evt) {
    evt.preventDefault();
    let currentIndex = this.getCurrentIndex();
    if (!this.isLastSlide()) {
      this.changeSlide(++currentIndex);
    }
    sliderButtonsView.render();
    sliderDotsView.render();
  },

  findCurrentIndex: function () {
    const currentIndex = modelSlider.sliders.findIndex(function (slide) {
      return slide.classList.contains('proposal-slide-current');
    });

    return (currentIndex === -1) ? 0 : currentIndex;
  },

  changeSlide: function (newIndex) {
    modelSlider.prevIndex = modelSlider.currentIndex;
    if (modelSlider.prevIndex !== -1) {
      modelSlider.sliders[modelSlider.prevIndex].classList.remove('proposal-slide-current');
    }
    modelSlider.sliders[newIndex].classList.add('proposal-slide-current');
    modelSlider.currentIndex = newIndex;
  },

  isFirstSlide: function () {
    return modelSlider.currentIndex === 0;
  },

  isLastSlide: function () {
    return (modelSlider.sliders.length - 1) === modelSlider.currentIndex;
  },
};

const sliderButtonsView = {
  init: function () {
    const sliderElem = document.querySelector('.proposal-slider');
    this.btnPrevElem = sliderElem.querySelector('.slider-button-prev');
    this.btnNextElem = sliderElem.querySelector('.slider-button-next');

    this.btnPrevElem.addEventListener('click', slider.setPrevSlide.bind(slider));
    this.btnNextElem.addEventListener('click', slider.setNextSlide.bind(slider));

    this.render();
  },

  render: function () {
    this.btnPrevElem.disabled = !!slider.isFirstSlide();
    this.btnNextElem.disabled = !!slider.isLastSlide();
  }
};

const sliderDotsView = {
  init: function () {
    this.sliderControlsElem = document.querySelector('.proposal-slider-controls');
    this.sliderControls = [];
    let elem, i;
    const sliders = slider.getSliders();
    this.sliderControlsElem.innerHTML = '';
    const controlsListFragment = document.createDocumentFragment();

    for (i = 0; i < sliders.length; i++) {
      elem = document.createElement('span');

      elem.addEventListener('click', (function (indexCopy) {
        return function (evt) {
          evt.preventDefault();
          if (indexCopy !== slider.getCurrentIndex()) {
            slider.changeSlide(indexCopy);
            sliderButtonsView.render();
            sliderDotsView.render();
          }
        };
      })(i));

      this.sliderControls.push(elem);
      controlsListFragment.appendChild(elem);
    }
    this.sliderControlsElem.appendChild(controlsListFragment);

    this.render();
  },

  render: function () {
    const prevIndex = slider.getPrevIndex();
    const currentIndex = slider.getCurrentIndex();

    if (prevIndex !== -1) {
      this.sliderControls[prevIndex].classList.remove('current');
    }
    this.sliderControls[currentIndex].classList.add('current');
  }
};

const initServices = function () {
  const servicesElm = document.querySelector('.services');

  if (!servicesElm) {
    return;
  }

  const servicesBtnElm = Array.from(servicesElm.querySelectorAll('.services-button'));
  const servicesItemsElm = Array.from(servicesElm.querySelectorAll('.services-desc-list-item'));

  servicesBtnElm.forEach(function (elem, index) {
    elem.addEventListener('click', (function (indexCopy) {
      return function (evt) {
        evt.preventDefault();
        const currentBtnElm = servicesElm.querySelector('.services-button-current');
        const currentItemElm = servicesElm.querySelector('.services-desc-list-current');

        if (currentBtnElm !== evt.target) {
          currentBtnElm.classList.remove('services-button-current');
          currentItemElm.classList.remove('services-desc-list-current');
          evt.target.classList.add('services-button-current');
          servicesItemsElm[indexCopy].classList.add('services-desc-list-current');
        }
      };
    })(index));
  });
}

const initMessagePopup = function () {
  const msgLinkElm = document.querySelector('.contacts-form-popup');
  const msgPopupElm = document.querySelector('.modal-message');

  if (!msgPopupElm) {
    return;
  }

  const msgClose = msgPopupElm.querySelector('.modal-close');
  const msgForm = msgPopupElm.querySelector('.message-form');
  const msgName = msgForm.querySelector('.message-user-name');
  const msgEmail = msgForm.querySelector('.message-user-email');
  const msgText = msgForm.querySelector('.message-user-text');

  let isStorageSupport = true;
  let storageUserName = '';
  let storageUserEmail = '';

  try {
    storageUserName = localStorage.getItem('userName');
    storageUserEmail = localStorage.getItem('userEmail');
  } catch (err) {
    isStorageSupport = false;
  }

  msgLinkElm.addEventListener('click', function (evt) {
    evt.preventDefault();
    msgPopupElm.classList.add('modal-show');

    if (storageUserName) {
      msgName.value = storageUserName;
      msgEmail.focus();
    } else {
      msgName.focus();
    }

    if (storageUserEmail) {
      msgEmail.value = storageUserEmail;
      msgText.focus();
    }
  });

  msgClose.addEventListener('click', function (evt) {
    evt.preventDefault();
    msgPopupElm.classList.remove('modal-show');
    msgPopupElm.classList.remove('modal-error');
  });

  msgForm.addEventListener('submit', function (evt) {
    if (!msgName.value || !msgEmail.value || !msgText.value) {
      evt.preventDefault();
      msgPopupElm.classList.remove("modal-error");
      msgPopupElm.offsetWidth = msgPopupElm.offsetWidth;
      msgPopupElm.classList.add("modal-error");
    } else {
      if (isStorageSupport) {
        localStorage.setItem('userName', msgName.value);
        localStorage.setItem('userEmail', msgEmail.value);
      }
    }
  });

  window.addEventListener('keydown', function (evt) {
    let handled = false;
    if (evt.key !== undefined && evt.key === 'Escape') {
      handled = true;
    } else if (evt.keyCode !== undefined && evt.keyCode === 27) {
      handled = true;
    }

    if (handled) {
      if (msgPopupElm.classList.contains('modal-show')) {
        evt.preventDefault();
        msgPopupElm.classList.remove('modal-show');
        msgPopupElm.classList.remove('modal-error');
      }
    }
  });
}

const initMapPopup = function () {
  const mapThumbElm = document.querySelector('.contacts-map');
  const mapPopupElm = document.querySelector('.modal-map');

  if (!mapPopupElm) {
    return;
  }

  const mapClose = mapPopupElm.querySelector('.modal-close');

  mapThumbElm.addEventListener('click', function (evt) {
    evt.preventDefault();
    mapPopupElm.classList.add('modal-show');
  });

  mapClose.addEventListener('click', function (evt) {
    evt.preventDefault();
    mapPopupElm.classList.remove('modal-show');
  });

  window.addEventListener("keydown", function (evt) {
    let handled = false;
    if (evt.key !== undefined && evt.key === 'Escape') {
      handled = true;
    } else if (evt.keyCode !== undefined && evt.keyCode === 27) {
      handled = true;
    }

    if (handled) {
      if (mapPopupElm.classList.contains('modal-show')) {
        evt.preventDefault();
        mapPopupElm.classList.remove('modal-show');
      }
    }
  });
}

const initProductPopup = function () {
  const buyButtons = Array.from(document.querySelectorAll('.buy-button'));
  const productPopup = document.querySelector('.modal-product');

  if (!productPopup) {
    return;
  }

  const mapClose = productPopup.querySelector('.modal-close');
  const mapContinue = productPopup.querySelector('.continue-button');

  buyButtons.forEach(function (elm) {
    elm.addEventListener('click', function (evt) {
      evt.preventDefault();
      productPopup.classList.add('modal-show');
    });
  });

  mapClose.addEventListener('click', function (evt) {
    evt.preventDefault();
    productPopup.classList.remove('modal-show');
  });

  mapContinue.addEventListener('click', function (evt) {
    evt.preventDefault();
    productPopup.classList.remove('modal-show');
  });

  window.addEventListener("keydown", function (evt) {
    let handled = false;
    if (evt.key !== undefined && evt.key === 'Escape') {
      handled = true;
    } else if (evt.keyCode !== undefined && evt.keyCode === 27) {
      handled = true;
    }

    if (handled) {
      if (productPopup.classList.contains('modal-show')) {
        evt.preventDefault();
        productPopup.classList.remove('modal-show');
      }
    }
  });
}

const init = function () {
  slider.init();
  initServices();
  initMessagePopup();
  initMapPopup();
  initProductPopup();
}

document.addEventListener("DOMContentLoaded", init);
