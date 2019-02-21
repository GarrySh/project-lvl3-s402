import validator from 'validator';
import axios from 'axios';
import { watch } from 'melanke-watchjs';
import { format as formatDate } from 'date-fns';
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

  const isValid = url => validator.isURL(url) && !state.feeds.some(feed => feed.url === url);

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

  const submitHandle = event => {
    event.preventDefault();
    const urlWithCorsProxy = `https://cors-anywhere.herokuapp.com/${state.formInputUI.url}`;
    axios
      .get(urlWithCorsProxy)
      .then(response => {
        // console.log('response', response);
        const { feedTitle, feedDescription, feedArticles, error } = parse(response.data);
        if (error) {
          // console.log('error de', error);
          return Promise.reject(new Error({ message: error }));
        }
        state.feeds.push({
          title: feedTitle,
          description: feedDescription,
          url: state.formInputUI.url,
        });
        state.articles.push(...feedArticles);
        return response;
      })
      .catch(error => {
        window.err = error;
        state.formInputUI.error = error.message;
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

  watch(state.formInputUI, 'error', () => {
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
};
