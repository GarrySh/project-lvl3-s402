import { uniqueId } from 'lodash';

const getArticles = (dom, feedId) => {
  const articleNodeList = dom.querySelectorAll('item');
  const articles = Array.from(articleNodeList).map(article => ({
    id: uniqueId(),
    feedId,
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
    id: uniqueId(),
    title,
    description,
  };
};

export default data => {
  const parser = new DOMParser();
  const dom = parser.parseFromString(data, 'application/xml');
  if (dom.querySelector('parsererror')) {
    return { error: 'parseError' };
  }
  const feed = getFeed(dom);
  const articles = getArticles(dom, feed.id);
  return { feed, articles, error: null };
};
