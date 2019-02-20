const getArticles = dom => {
  const articleNodeList = dom.querySelectorAll('item');
  const articles = Array.from(articleNodeList).map(article => ({
    title: article.querySelector('title').textContent,
    link: article.querySelector('link').textContent,
    description: article.querySelector('description').textContent,
    pubDate: article.querySelector('pubDate').textContent,
  }));
  return articles;
};

export default data => {
  const domParser = new DOMParser();
  const dom = domParser.parseFromString(data, 'application/xml');
  if (dom.querySelector('parsererror')) {
    return { error: 'document parse error' };
  }
  // window.dom = dom;
  const feedTitle = dom.querySelector('channel > title').textContent;
  const feedDescription = dom.querySelector('channel > description').textContent;
  return { feedTitle, feedDescription, feedArticles: getArticles(dom), error: null };
};
