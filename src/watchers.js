import { format as formatDate } from 'date-fns';

export const formStateWatch = state => () => {
  const input = document.querySelector('#app input');
  const button = document.querySelector('#app button');

  switch (state.formUI.formState) {
    case 'clear':
      button.disabled = true;
      input.disabled = false;
      input.classList.remove('is-valid', 'is-invalid');
      input.value = '';
      break;
    case 'invalid':
      button.disabled = true;
      input.disabled = false;
      input.classList.add('is-invalid');
      input.classList.remove('is-valid');
      break;
    case 'valid':
      button.disabled = false;
      input.disabled = false;
      input.classList.add('is-valid');
      input.classList.remove('is-invalid');
      break;
    case 'load':
      button.disabled = true;
      input.disabled = true;
      break;
    default:
  }
};

export const messageWatch = state => () => {
  const message = document.querySelector('#app .alert');

  switch (state.formUI.messageState) {
    case 'none':
      message.classList.remove('show');
      message.textContent = '';
      break;
    case 'error-parse':
      message.classList.add('show', 'alert-danger');
      message.classList.remove('alert-info');
      message.textContent = 'Document parse error';
      break;
    case 'error-404':
      message.classList.add('show', 'alert-danger');
      message.classList.remove('alert-info');
      message.textContent = 'Page not found';
      break;
    case 'error-unknown':
      message.classList.add('show', 'alert-danger');
      message.classList.remove('alert-info');
      message.textContent = 'Oops something went wrong, please try again';
      break;
    case 'info':
      message.classList.add('show', 'alert-info');
      message.classList.remove('alert-danger');
      message.textContent = 'Feed successfully added';
      break;
    default:
  }
};

export const feedsWatch = state => () => {
  const feeds = document.getElementById('feeds-list');

  feeds.innerHTML = '';
  state.feeds.forEach(feed => {
    const feedEl = document.createElement('li');
    feedEl.classList.add('mb-3');
    feedEl.innerHTML = `<div class="card border-secondary style="width: 18rem;">
        <div class="card-body text-secondary">
          <h5 class="card-title">${feed.title}</h5>
          <p class="card-text">${feed.description}</p>
        </div>
      </div>`;
    feeds.appendChild(feedEl);
  });
};

export const articlesWatch = state => () => {
  const articles = document.getElementById('articles-list');

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
          <a class="btn btn-secondary" href="${article.url}">Go to the article</a>
          <button class="btn btn-primary" type="button" data-toggle="modal" data-target="#articleModal" data-id="${
            article.id
          }">
            Open article description
          </button>
        </div>
      </div>
    `;
    articles.appendChild(articleEl);
  });
};
