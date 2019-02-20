import validator from 'validator';
import axios from 'axios';
import { watch } from 'melanke-watchjs';
import parse from './parser';

export default () => {
  const state = {
    formInputUI: {
      valid: null,
      clear: true,
      inputDisable: true,
      url: '',
      error: null,
    },
    feeds: [],
    articles: [],
  };

  const isValid = url => validator.isURL(url) && !state.feeds.includes(url);

  const keyupHandle = event => {
    const url = event.target.value;
    state.formInputUI.url = url;
    if (url === '') {
      state.formInputUI.clear = true;
      state.formInputUI.valid = true;
      state.formInputUI.inputDisable = true;
    } else if (isValid(url)) {
      state.formInputUI.clear = false;
      state.formInputUI.valid = true;
      state.formInputUI.inputDisable = false;
    } else {
      state.formInputUI.clear = false;
      state.formInputUI.valid = false;
      state.formInputUI.inputDisable = true;
    }
    console.log('state changed', state);
  };

  // const urlWithCorsProxy = state.formInputUI.url;
  const submitHandle = event => {
    event.preventDefault();
    const urlWithCorsProxy = `https://cors-anywhere.herokuapp.com/${state.formInputUI.url}`;
    axios
      .get(urlWithCorsProxy)
      .then(response => {
        console.log('response', response);
        const { feedTitle, feedDescription, feedArticles, error } = parse(response.data);
        if (error) {
          Promise.reject(error);
        }
        state.feeds.push({ feedTitle, feedDescription });
        state.articles.push(...feedArticles);
      })
      .catch(error => {
        state.formInputUI.error = error;
        console.error(error);
      });
    // console.log('form submited', event);
  };

  const input = document.querySelector('.feed-form__input');
  input.addEventListener('keyup', keyupHandle);

  const form = document.querySelector('.feed-form');
  form.addEventListener('submit', submitHandle);

  watch(state.formInputUI, 'valid', () => {
    if (state.formInputUI.clear) {
      input.classList.remove('is-invalid');
      input.classList.remove('is-valid');
    } else if (state.formInputUI.valid) {
      input.classList.add('is-valid');
      input.classList.remove('is-invalid');
    } else {
      input.classList.add('is-invalid');
      input.classList.remove('is-valid');
    }
    console.log('form valid?', state.formInputUI.valid);
  });

  const button = document.querySelector('.feed-form__button');
  watch(state.formInputUI, 'inputDisable', () => {
    if (state.formInputUI.inputDisable) {
      button.setAttribute('disabled', 'disabled');
    } else {
      button.removeAttribute('disabled');
    }
  });
};
