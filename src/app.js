import validator from 'validator';
import 'bootstrap';
import $ from 'jquery';
import axios from 'axios';
import { watch, callWatchers } from 'melanke-watchjs';
import parse from './parser';
import { formStateWatch, messageWatch, feedsWatch, articlesWatch } from './watchers';

export default () => {
  const state = {
    formUI: {
      formState: 'clear',
      url: '',
      messageState: 'none',
    },
    feeds: [],
    articles: [],
  };

  const isValid = url => validator.isURL(url) && !state.feeds.some(feed => feed.url === url);

  const inputHandle = event => {
    const url = event.target.value;
    state.formUI.url = url;
    if (url === '') {
      state.formUI.formState = 'clear';
    } else if (isValid(url)) {
      state.formUI.formState = 'valid';
    } else {
      state.formUI.formState = 'invalid';
    }
    state.formUI.messageState = 'none';
  };

  const submitHandle = event => {
    event.preventDefault();
    state.formUI.formState = 'load';
    const urlWithCorsProxy = `https://cors-anywhere.herokuapp.com/${state.formUI.url}`;
    axios
      .get(urlWithCorsProxy)
      .then(response => {
        const { feedTitle, feedDescription, feedArticles, error } = parse(response.data);
        if (error) {
          throw new Error(error);
        }
        state.formUI.messageState = 'info';
        state.formUI.formState = 'clear';
        state.feeds.push({
          title: feedTitle,
          description: feedDescription,
          url: state.formUI.url,
        });
        state.articles.push(...feedArticles);
      })
      .catch(({ message }) => {
        if (message === 'parseError') {
          state.formUI.messageState = 'error-parse';
        } else if (message === 'Request failed with status code 404') {
          state.formUI.messageState = 'error-404';
        } else {
          state.formUI.messageState = 'error-unknown';
        }
        state.formUI.formState = 'valid';
      });
  };

  const input = document.querySelector('#app input');
  input.addEventListener('keyup', inputHandle);
  input.addEventListener('input', inputHandle);

  const form = document.querySelector('#app form');
  form.addEventListener('submit', submitHandle);

  watch(state.formUI, 'formState', formStateWatch(state));
  watch(state.formUI, 'messageState', messageWatch(state));
  watch(state, 'feeds', feedsWatch(state));
  watch(state, 'articles', articlesWatch(state));

  callWatchers(state.formUI, 'formState');
  callWatchers(state.formUI, 'messageState');

  $('#articleModal').on('show.bs.modal', function showModal(event) {
    const button = $(event.relatedTarget);
    const articleId = button.data('id').toString();
    const article = state.articles.find(item => item.id === articleId);
    const modal = $(this);
    const modalBody = modal.find('.modal-body');
    modal.find(modalBody).text(article.description);
  });
};
