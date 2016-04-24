// framework deps
import {inject, bindable} from 'aurelia-framework';
// local deps
import {App} from '../components/app'
// end deps

@inject(App)
export class Lottery {

  constructor(App) {
    this.app = App;
  }
}
