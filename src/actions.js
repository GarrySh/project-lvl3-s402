import axios from 'axios';
import { differenceWith, isEqual, uniqueId } from 'lodash';

const getArticles = dom => {
  const articleNodeList = dom.querySelectorAll('item');
  const articles = Array.from(articleNodeList).map(article => ({
    title: article.querySelector('title').textContent,
    url: article.querySelector('link').textContent,
    description: article.querySelector('description').textContent,
    date: article.querySelector('pubDate').textContent,
  }));
  return articles;
};

const getFeed = dom => {
  const title = dom.querySelector('channel > title').textContent;
  const description = dom.querySelector('channel > description').textContent;
  return {
    title,
    description,
  };
};

const parse = data => {
  const parser = new DOMParser();
  const dom = parser.parseFromString(data, 'application/xml');
  if (dom.querySelector('parsererror')) {
    return { error: 'parseError' };
  }
  const feed = getFeed(dom);
  const articles = getArticles(dom);
  return { feed, articles, error: null };
};

export const getSiteData = url => {
  const urlWithCorsProxy = `https://cors-anywhere.herokuapp.com/${url}`;
  return axios.get(urlWithCorsProxy).then(response => {
    const { feed, articles, error } = parse(response.data);
    if (error) {
      throw new Error(error);
    }
    return { feed, articles };
  });
};

const updateInterval = 5000;

export const updateArticles = (url, state, feedId) => {
  setTimeout(() => {
    getSiteData(url)
      .then(({ articles }) => {
        const articlesInState = state.articles
          .filter(article => article.feedId === feedId)
          .map(({ title, url: articleUrl, description, date }) => ({
            title,
            url: articleUrl,
            description,
            date,
          }));
        const newArticles = differenceWith(articles, articlesInState, isEqual);
        if (newArticles.length !== 0) {
          const articlesWithId = newArticles.map(article => ({
            ...article,
            id: uniqueId(),
            feedId,
          }));
          state.articles.unshift(...articlesWithId);
        }
      })
      .catch(error => console.error('error on update articles', error.message))
      .finally(() => updateArticles(url, state, feedId));
  }, updateInterval);
};
