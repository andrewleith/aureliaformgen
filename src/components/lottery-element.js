import {inject, bindable} from 'aurelia-framework';

export class LotteryElementCustomElement {
  winningNumbers = ['01', '02', '12', '44', '45', '49'];
  countOfNumbersCorrect;
  @bindable chosen = [];

  constructor() {
  }

  attached() {
    // hide elem by default - messy
    if (this.model.app.current != this.model.id)
      TweenMax.set($(this.segment), { display: 'none', autoAlpha: 0 });
  }


  // ------
  // Model data
  // ---

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

  // This element has a hook for the click event when the user is done entering
  // their numbers.  We also run some internal code to this component at this
  // point which would reach out and actually check the lotto numbers
  click() {
    this.action_verifyNumbers();
    if (this.model.exit.eventName == 'click')
    {
      this.model.app.showNext(this.model.exit.flow());
    }
  }


  // ------
  // element-specific business logic
  // ----

  // verify numbers against winning numbers (hardcoded)
  action_verifyNumbers() {
    // get winners
    var winners = this._checkForWinningNumbers(this.model.app.form.data[this.model.id].data, this.winningNumbers);

    // store this at the app-level
    this.model.app.form.data[this.model.id].winners = winners.length;

    if (winners.length > 3) {
      console.log('holy, sweet mother of mercy!');
    }

    if (winners.length == 6) {
      console.log('sweet baby jesus, YOU\'VE WON');
    }

    console.log('you\'ve gotten', winners.length, 'winning numbers!@#!@#');


    // some style
    TweenMax.to([$(this.ui_question), $(this.ui_button)], 0.4, { autoAlpha: 0, height:0,scale:0} );
  }

  // Comparing two sets of numbers, `supplied`, and `winning`, this method
  // returns the numbers that are present in both sets.
  _checkForWinningNumbers(supplied, winning) {

    var chosen = [];
    var winners = supplied.filter((n, i) => {
      if (winning.indexOf(n) != -1) {
        chosen[i] = true;
        return true;
      }
      else {
        chosen[i] = false;
        return false;
      }
    });

    this.chosen = chosen;

    return winners;
  }

  // pointless UI flourish
  button_focus() {
    console.log('focus')
    $(this.ui_doneButton).addClass('blue large');
  }
}
