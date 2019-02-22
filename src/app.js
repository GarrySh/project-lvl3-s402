import validator from 'validator';
import axios from 'axios';
import { watch, callWatchers } from 'melanke-watchjs';
import parse from './parser';
import { formStateWatch, messageWatch, feedsWatch, articlesWatch } from './watchers';

export default () => {
  const state = {
    formUI: {
      formState: 'clear',
      url: '',
      message: '',
      messageType: 'none',
    },
    feeds: [],
    articles: [],
  };

  const isValid = url => validator.isURL(url) && !state.feeds.some(feed => feed.url === url);

  const keyupHandle = event => {
    const url = event.target.value;
    state.formUI.url = url;
    if (url === '') {
      state.formUI.formState = 'clear';
    } else if (isValid(url)) {
      state.formUI.formState = 'valid';
    } else {
      state.formUI.formState = 'invalid';
    }
    state.formUI.messageType = 'none';
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
        state.formUI.message = 'feed successfully added';
        state.formUI.messageType = 'info';
        state.formUI.formState = 'clear';
        state.feeds.push({
          title: feedTitle,
          description: feedDescription,
          url: state.formUI.url,
        });
        state.articles.push(...feedArticles);
      })
      .catch(error => {
        const { message } = error;
        state.formUI.message = message;
        state.formUI.messageType = 'error';
        state.formUI.formState = 'valid';
        // console.log('error message', error);
      });
  };

  const input = document.querySelector('#app input');
  input.addEventListener('keyup', keyupHandle);

  const form = document.querySelector('#app form');
  form.addEventListener('submit', submitHandle);

  watch(state.formUI, 'formState', formStateWatch(state));
  watch(state.formUI, 'messageType', messageWatch(state));
  watch(state, 'feeds', feedsWatch(state));
  watch(state, 'articles', articlesWatch(state));

  callWatchers(state.formUI, 'formState');
  callWatchers(state.formUI, 'messageType');
};
