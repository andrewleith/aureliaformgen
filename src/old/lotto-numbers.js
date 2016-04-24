import {inject, bindable} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';

import {text} from './lotto-numbers-lang';

@inject(text, EventAggregator)
export class LottoNumbersCustomElement {
  constructor(text, eventAggregator) {
      this.text = text;
      this.ea = eventAggregator;

      this.ea.subscribe('pageBegin', page => {
        console.log('page begin')
        page.begin();
      });

      this.ea.subscribe('pageComplete', page => {
        page.complete();
      });
        window.musings = this.app;
  }

  winningNumbers = ['01', '02', '12', '44', '45', '49'];
  myNumbers = [];
  chosen = [];
  selectedGame = '';
  thing;

  app = {
    ids: [ 'Q1', 'Q2', 'Q3' ],
    segments: [
      {
        'Q1': { type: "./dropdown-element" },
      },
      {
        'Q2': { },
      },
      {
        'Q3': { }
      }
    ],
    flows: [
      () => 'Q1',
      () => 'Q2',
      () => {
        //if (somethingcrazyhappened)
        return 'Q3'
      }
    ]
  };

  pages = [
    {
      type: "./dropdown-element",
      model: {
        questionText: "Select a lottery game",
        labelText: "Choose a game",
        fields: [
          {
            value: 1,
            text: "Lotto 649",
            meta: {
              numbers: 6
            }
          },
          {
            value: 1,
            text: "Lotto MAX",
            meta: {
              numbers: 7
            }
          }
        ]
      }
    },
    {
      type: "./dropdown-element",
      model: {
        questionText: "Select a lottery game AGAIN",
        labelText: "Choose a game",
        fields: [
          {
            value: 1,
            text: "Lotto 649",
            meta: {
              numbers: 6
            }
          },
          {
            value: 2,
            text: "Lotto MAX",
            meta: {
              numbers: 7
            }
          }
        ]
      }
    }
  ];

  // state
  @bindable state = {
    q1Complete: false,
    q2Complete: false
  }

  attached() {
    window.debug =  this; // something i can inspect at any point during dev


    // ui setup
    TweenMax.set($('.blotto section:not(:first)'), { autoAlpha: 0});
    $('select.dropdown').dropdown(); // make it a semantic ui dropdown
  }

  stateChanged() {
    switch (this.state.verified) {
      case true:
        $(this.ui_doneButton).addClass('disabled').removeClass('blue');
        break;
      case false:
        $(this.ui_doneButton).removeClass('disabled').addClass('blue');
        break;
      default:
    }
  }
  /* value lists */
  games = [
    {
      id: 0,
      name: "Lotto 649",
      numbers: 6
    },
    {
      id: 1,
      name: "Lotto MAX",
      numbers: 7
    }
  ];

  /* -----
   * user-initiated actions *
   * ---                    */
  action_selectGame() {
    if (this.selectedGame !== '-1') {
      this.action_resetNumbers();
      // show some boxes
      let numberOfNumbers = this.games[this.selectedGame].numbers;
      console.log('number:', numberOfNumbers)
      let nums = [];
      for (let i = 0; i < numberOfNumbers; i++) {
        nums.push('');
      }

      this.myNumbers  = nums;

      this.event_questionCompleted();

    }
    else {
      if ($(this.ui_numbers).transition('is visible')) {
        $(this.ui_numbers).transition('drop');
      }
    }
  }

  action_verifyNumbers() {
    console.log(this.test);
    // get winners
    var winners = this._checkForWinningNumbers(this.myNumbers, this.winningNumbers);
    this.countOfNumbersCorrect = winners.length;

    if (winners.length > 3) {
      console.log('holy, sweet mother of mercy!');
    }

    if (winners.length == 6) {
      console.log('sweet baby jesus, YOU\'VE WON');
    }

    console.log('you\'ve gotten', winners.length, 'winning numbers!@#!@#');


    this.event_numbersVerified();
  }

  action_keyup(item, e) {
    console.log(e.keyCode);
    // if the field is full
    // and you're not on the last input
    // and you didn't just tab/shift-tab in
    if (this.myNumbers[item].length == 2 &&
        item < this.myNumbers.length - 1 &&
        e.keyCode != 9 && e.keyCode != 16)
    {
      console.log('try')
      $('lotto-number').eq(item + 1).find('input').focus();
    }

    // if the data changed (typed anything other than tab/shift+tab)
    // then indicate to user they need to re-verify
    if (e.keyCode != 9 && e.keyCode != 16) {
      this.action_resetNumbers();
    }
  }

  action_resetNumbers() {
    this.chosen = [];
    this._updateState({
      q1Complete: false,
      q2Complete: false
    });

    //TweenMax.set($('.blotto section:first'), { autoAlpha: 1});
    //TweenMax.set($('.blotto section:not(:first)'), { autoAlpha: 0});
    //this.selectedGame = '';
  }


  /* -----
   * ui-initated events *
   * ---                */

  // this fades the previous question and shows the next
  event_questionCompleted() {
    TweenMax.fromTo($(this.ui_gameSelect), 0.25, { autoAlpha: 1}, { autoAlpha: 0.45} );
    TweenMax.fromTo($(this.ui_gameSelect).find('hr'), 0.25, { autoAlpha: 0}, { autoAlpha: 1} );
    TweenMax.fromTo($(this.ui_numbers), 0.4, { y: '-50'}, { delay: 0.15, y: '0', ease: Back.easeInOut.config(1)} );
    TweenMax.fromTo($(this.ui_numbers), 0.6, { autoAlpha: 0}, { delay: 0.15, autoAlpha: 1});
  }

  event_numbersVerified() {
    //TweenMax.fromTo($(this.ui_numbers), 0.25, { autoAlpha: 1}, { autoAlpha: 0.45} );
    TweenMax.fromTo($(this.ui_numbers).find('hr'), 0.25, { autoAlpha: 0}, { autoAlpha: 1} );
    TweenMax.fromTo($(this.ui_message), 0.4, { y: '-50'}, { delay: 0.15, y: '0', ease: Back.easeInOut.config(1)} );
    TweenMax.fromTo($(this.ui_message), 0.6, { autoAlpha: 0}, { delay: 0.15, autoAlpha: 1});

    this._updateState({ verified: true });
  }


  /* ---
   * Utility methods
   * ---
   */

  _updateState(newState) {
    var state = {
      ...this.state,
      ...newState
    }
    this.state = state;
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
}
