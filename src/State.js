export default class {
  formUI = {
    formState: 'clear',
    messageState: 'none',
  };

  feeds = [];

  articles = [];

  changeFormState(formState) {
    this.formUI.formState = formState;
  }

  changeMessageState(messageState) {
    this.formUI.messageState = messageState;
  }
}
