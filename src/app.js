import 'bootstrap';
import $ from 'jquery';
import { watch, callWatchers } from 'melanke-watchjs';
import State from './State';
import { formStateWatch, messageWatch, feedsWatch, articlesWatch } from './watchers';
import { inputHandle, submitHandle } from './handlers';

export default () => {
  const state = new State();

  const input = document.querySelector('#app input');
  input.addEventListener('keyup', inputHandle(state));
  input.addEventListener('input', inputHandle(state));

  const form = document.querySelector('#app form');
  form.addEventListener('submit', submitHandle(state));

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
