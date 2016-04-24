import {bindable} from 'aurelia-framework';

export class LottoNumberCustomElement {
  @bindable val;
  @bindable chosen;

  blur() {
    if (this.val !== undefined && this.val.length == 1)
      this.val = '0' + this.val;
  }

  action_keyup(item, e) {
    // if the field is full
    // and you didn't just tab/shift-tab in
    if (this.val !== undefined && this.val.length == 2 &&
        e.keyCode != 9 && e.keyCode != 16)
    {
      $(this.container).parents('lotto-number').next().find('input').focus(); //gorss
    }

    // if the data changed (typed anything other than tab/shift+tab)
    // then indicate to user they need to re-verify
    if (e.keyCode != 9 && e.keyCode != 16) {
      //this.action_resetNumbers();
    }
  }

  chosenChanged(newValue) {
    var styleChosen = {
      background: 'rgba(166, 255, 91, 0.42)',
      border: '2px solid rgb(120, 214, 41)'
    };
    var styleNotChosen = {
      color: 'rgb(230, 230, 230)',
      background: 'rgb(181, 181, 181)',
      border: '2px solid transparent'
    };
    var styleDefault = {
      color: 'rgba(0, 0, 0, 0.6)',
      background: '#E8E8E8',
      border: '2px solid transparent'
    };

    console.log('container:', $(this.container), 'nv', newValue);

    switch (newValue) {
      case true:
        //console.log('container:', $(this.container));
        TweenMax.to($(this.container), 0.25, styleChosen);
        break;
      case false:
        TweenMax.to($(this.container), 0.25, styleNotChosen);
        break;
      default:
        TweenMax.to($(this.container), 0.25, styleDefault);
    }
  }

  attached() {
    //debug
    window['lotto'+ Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1)] = this;
  }
}
