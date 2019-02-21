import { format as formatDate } from 'date-fns';

export const formStateWatch = state => () => {
  const input = document.querySelector('.feed-form__input');
  const button = document.querySelector('.feed-form__button');

  switch (state.formUI.formState) {
    case 'clear':
      button.disabled = false;
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
  console.log('formState?', state.formUI.formState);
};

export const messageWatch = state => () => {
  const message = document.querySelector('.feed-form__message');

  switch (state.formUI.messageType) {
    case 'none':
      message.classList.remove('show');
      message.textContent = '';
      break;
    case 'error':
      message.classList.add('show', 'alert-danger');
      message.classList.remove('alert-info');
      message.textContent = state.formUI.message;
      break;
    case 'info':
      message.classList.add('show', 'alert-info');
      message.classList.remove('alert-danger');
      message.textContent = state.formUI.message;
      break;
    default:
  }
  console.log('message type', state.formUI.messageType);
};

export const feedsWatch = state => () => {
  const feeds = document.querySelector('.feeds-list');

  feeds.innerHTML = '';
  state.feeds.forEach(feed => {
    const feedEl = document.createElement('li');
    feedEl.classList.add('mb-3');
    feedEl.innerHTML = `<div class="card border-secondary style="width: 18rem;">
        <div class="card-body text-secondary">
          <h5 class="card-title">${feed.title}</h5>
          <p class="card-text">${feed.description}</p>
          <a href="${feed.url}" class="card-link">Feed link</a>
        </div>
      </div>`;
    feeds.appendChild(feedEl);
  });
};

export const articlesWatch = state => () => {
  const articles = document.querySelector('.articles-list');

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
};
