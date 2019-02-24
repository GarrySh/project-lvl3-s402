import { isURL } from 'validator';
import { uniqueId } from 'lodash';
import { getSiteData, updateArticles } from './actions';

export const submitHandle = state => event => {
  event.preventDefault();
  state.changeFormState('load');
  const url = event.target.querySelector('input').value;
  getSiteData(url)
    .then(({ feed, articles }) => {
      state.changeMessageState('info');
      state.changeFormState('clear');
      const feedId = uniqueId();
      state.feeds.unshift({ ...feed, id: feedId });
      const articlesWithId = articles.map(article => ({ ...article, feedId, id: uniqueId() }));
      state.articles.unshift(...articlesWithId);
      updateArticles(url, state, feedId);
    })
    .catch(({ message }) => {
      if (message === 'parseError') {
        state.changeMessageState('error-parse');
      } else if (message === 'Request failed with status code 404') {
        state.changeMessageState('error-404');
      } else {
        state.changeMessageState('error-unknown');
      }
      state.changeFormState('valid');
    });
};

const isValid = (url, state) => isURL(url) && !state.feeds.some(feed => feed.url === url);

export const inputHandle = state => event => {
  const url = event.target.value;
  if (url === '') {
    state.changeFormState('clear');
  } else if (isValid(url, state)) {
    state.changeFormState('valid');
  } else {
    state.changeFormState('invalid');
  }
  state.changeMessageState('none');
};
