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

export default data => {
  const parser = new DOMParser();
  const dom = parser.parseFromString(data, 'application/xml');
  if (dom.querySelector('parsererror')) {
    return { error: 'feed parse error' };
  }
  const feedTitle = dom.querySelector('channel > title').textContent;
  const feedDescription = dom.querySelector('channel > description').textContent;
  return { feedTitle, feedDescription, feedArticles: getArticles(dom), error: null };
};
