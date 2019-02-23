import 'bootstrap';
import $ from 'jquery';
import axios from 'axios';
import { isURL } from 'validator';
import { isEqual } from 'lodash';
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
  window.state = state;

  const updateInterval = 5000;
  const isValid = url => isURL(url) && !state.feeds.some(feed => feed.url === url);

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

  const getSiteData = url => {
    const urlWithCorsProxy = `https://cors-anywhere.herokuapp.com/${url}`;
    return axios.get(urlWithCorsProxy).then(response => {
      const { feed, articles, error } = parse(response.data);
      if (error) {
        throw new Error(error);
      }
      return { feed, articles };
    });
  };

  const updateArticles = (url, feedId) => {
    setTimeout(() => {
      getSiteData(url)
        .then(({ articles }) => {
          const mapCondition = ({ title, date }) => ({ title, date });
          const newArticles = articles.map(mapCondition);
          const savedArticles = state.articles
            .filter(article => article.feedId === feedId)
            .map(mapCondition);
          if (!isEqual(newArticles, savedArticles)) {
            const articlesWithId = articles.map(article => ({ ...article, feedId }));
            state.articles = state.articles
              .filter(article => article.feedId !== feedId)
              .concat(articlesWithId);
          }
        })
        .catch(error => console.error('error on update articles', error.message))
        .finally(() => updateArticles(url, feedId));
    }, updateInterval);
  };

  const submitHandle = event => {
    event.preventDefault();
    state.formUI.formState = 'load';
    getSiteData(state.formUI.url)
      .then(({ feed, articles }) => {
        state.formUI.messageState = 'info';
        state.formUI.formState = 'clear';
        state.feeds.push({ ...feed, url: state.formUI.url });
        state.articles.push(...articles);
        updateArticles(state.formUI.url, feed.id);
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
