import validator from 'validator';
import axios from 'axios';
import { watch } from 'melanke-watchjs';
import { format as formatDate } from 'date-fns';
import parse from './parser';

export default () => {
  const state = {
    inputFormUI: {
      valid: null,
      clear: true,
      inputDisable: true,
      url: '',
      error: null,
      load: false,
    },
    feeds: [],
    articles: [],
  };

  window.state = state;

  const isValid = url => validator.isURL(url) && !state.feeds.some(feed => feed.url === url);

  const keyupHandle = event => {
    const url = event.target.value;
    state.inputFormUI.url = url;
    if (url === '') {
      state.inputFormUI.clear = true;
      state.inputFormUI.valid = true;
      state.inputFormUI.inputDisable = true;
    } else if (isValid(url)) {
      state.inputFormUI.clear = false;
      state.inputFormUI.valid = true;
      state.inputFormUI.inputDisable = false;
    } else {
      state.inputFormUI.clear = false;
      state.inputFormUI.valid = false;
      state.inputFormUI.inputDisable = true;
    }
    console.log('state changed', state);
  };

  const submitHandle = event => {
    event.preventDefault();
    state.inputFormUI.load = true;
    const urlWithCorsProxy = `https://cors-anywhere.herokuapp.com/${state.inputFormUI.url}`;
    axios
      .get(urlWithCorsProxy)
      .then(response => {
        // console.log('response', response);
        const { feedTitle, feedDescription, feedArticles, error } = parse(response.data);
        if (error) {
          throw new Error(error);
        }
        state.feeds.push({
          title: feedTitle,
          description: feedDescription,
          url: state.inputFormUI.url,
        });
        state.articles.push(...feedArticles);
      })
      .catch(error => {
        const { message } = error;
        window.err = error;
        state.inputFormUI.error = message;
        console.log('error message', error);
      })
      .finally(() => {
        state.inputFormUI.load = false;
      });
    // console.log('form submited', event);
  };

  const input = document.querySelector('.feed-form__input');
  input.addEventListener('keyup', keyupHandle);

  const form = document.querySelector('.feed-form');
  form.addEventListener('submit', submitHandle);

  watch(state.inputFormUI, 'valid', () => {
    if (state.inputFormUI.clear) {
      input.classList.remove('is-invalid');
      input.classList.remove('is-valid');
    } else if (state.inputFormUI.valid) {
      input.classList.add('is-valid');
      input.classList.remove('is-invalid');
    } else {
      input.classList.add('is-invalid');
      input.classList.remove('is-valid');
    }
    console.log('form valid?', state.inputFormUI.valid);
  });

  const button = document.querySelector('.feed-form__button');
  watch(state.inputFormUI, 'inputDisable', () => {
    if (state.inputFormUI.inputDisable) {
      button.setAttribute('disabled', 'disabled');
    } else {
      button.removeAttribute('disabled');
    }
  });

  const feeds = document.querySelector('.feeds-list');
  watch(state, 'feeds', () => {
    feeds.innerHTML = '';
    state.feeds.forEach(feed => {
      const feedEl = document.createElement('li');
      feedEl.classList.add('mb-3');
      feedEl.innerHTML = `
        <div class="card border-secondary style="width: 18rem;">
          <div class="card-body text-secondary">
            <h5 class="card-title">${feed.title}</h5>
            <p class="card-text">${feed.description}</p>
            <a href="${feed.url}" class="card-link">Feed link</a>
          </div>
        </div>
      `;
      feeds.appendChild(feedEl);
    });
  });

  const articles = document.querySelector('.articles-list');
  watch(state, 'articles', () => {
    articles.innerHTML = '';
    state.articles.forEach(article => {
      const articleEl = document.createElement('li');
      articleEl.classList.add('mb-3');
      const articleDate = formatDate(article.date, 'DD MMM YYYY HH:mm');
      articleEl.innerHTML = `
        <div class="card border-secondary style="width: 18rem;">
          <div class="card-header">
          ${article.title}
          </div>
          <div class="card-body text-secondary">
            <h6 class="card-subtitle mb-2 text-muted">${articleDate}</h6>
            <p class="card-text">${article.description}</p>
          </div>
        </div>
      `;
      articles.appendChild(articleEl);
    });
  });

  const message = document.querySelector('.feed-form__message');
  watch(state.inputFormUI, 'error', () => {
    if (state.inputFormUI.error) {
      message.innerHTML = `<div class="alert alert-warning alert-dismissible fade show" role="alert">
        ${state.inputFormUI.error}
        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>`;
    } else {
      message.innerHTML = '';
    }
  });

  watch(state.inputFormUI, 'url', () => {
    input.value = state.inputFormUI.url;
  });
};
