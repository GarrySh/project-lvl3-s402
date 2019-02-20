import validator from 'validator';
import { watch } from 'melanke-watchjs';

export default () => {
  const state = {
    formInputUI: {
      valid: true,
      clear: true,
      inputDisable: true,
      value: '',
    },
    feeds: [],
  };

  const isValid = value => validator.isURL(value) && !state.feeds.includes(value);

  const keyupHandle = event => {
    const { value } = event.target;
    state.formInputUI.value = value;
    if (value === '') {
      state.formInputUI.clear = true;
      state.formInputUI.valid = true;
      state.formInputUI.inputDisable = true;
    } else if (isValid(value)) {
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

  const submitHandle = event => {
    event.preventDefault();
    console.log('form submited', event);
  };

  const input = document.querySelector('.feed-form__input');
  input.addEventListener('keyup', keyupHandle);

  const form = document.querySelector('.feed-form');
  form.addEventListener('submit', submitHandle);

  watch(state.formInputUI, 'clear', () => {
    if (state.formInputUI.clear) {
      form.classList.remove('was-validated');
    } else {
      form.classList.add('was-validated');
    }
    console.log('form clear?', state.formInputUI.clear);
  });

  watch(state.formInputUI, 'valid', () => {
    if (state.formInputUI.valid) {
      input.classList.add('is-valid');
      input.classList.remove('is-invalid');
    } else {
      input.classList.add('is-invalid');
      input.classList.remove('is-valid');
    }
    console.log('form valid?', state.formInputUI.valid);
  });
};
