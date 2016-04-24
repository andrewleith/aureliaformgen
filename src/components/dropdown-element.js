import {inject, bindable} from 'aurelia-framework';

export class DropdownElementCustomElement {
  app;
  id;
  questionText;
  labelText;
  fields;
  @bindable data;
  @bindable thing;
  exit;

  constructor() {
  }

  attached() {
    // hide elem by default - messy
    if (this.model.app.current != this.model.id)
      TweenMax.set($(this.segment), { display: 'none', autoAlpha: 0 });

    $('select.dropdown').dropdown(); // make it a semantic ui dropdown
  }

  // ------
  // Model data
  // ---

  // populate the model here
  activate(modelData) {
    var model = {...modelData}; // not sure if i'm doing this right
    this.model = model;

    //debugging
    window[this.model.id] = this;
  }


  // ------
  // flows
  // ---

  // This element has a hook for the change event of the dropdown.  We could add
  // as many of these hooks on an element-by-element basis
  change() {
    // keep data synced to app
    this.model.app.form.data[this.id] = this.data;

    if (this.model.exit.eventName == 'change')
    {
      this.model.app.showNext(this.model.exit.flow());
    }
  }
}
