export class MessageElementCustomElement {

  constructor() {
  }

  attached() {
    console.log('segment loaded', this.model.id);
    // hide elem by default
    if (this.model.app.current != this.model.id)
      TweenMax.set($(this.segment), { display: 'none', autoAlpha: 0 });
  }

  // populate the model here
  activate(modelData) {
    var model = {...modelData};
    this.model = model;

    // debugging
    window[this.model.id] = this;
  }

  // ------
  // flows
  // ---

  // Message-element has an optional button. If specified, clicking it will
  // execute this hook
  button_click() {
    debugger;
    if (this.model.exit.eventName == 'click')
    {
      this.model.exit.flow();
    }
  }
}
