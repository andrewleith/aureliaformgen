import {inject, bindable} from 'aurelia-framework';
import {Router} from 'aurelia-router';

@inject(Router)
export class App {

  current;

  constructor(Router) {
    this.current = this.form.ids[0];
    this.router = Router;
  }

  attached() {
    console.log('app loaded')
    // fade in app
    TweenMax.to($(this.appui), 1.5, { autoAlpha: 1});

    // debug
    window.app = this;
  }

  showNext(next) {

    // override the fade out if specified
    if (this.form.segments[this.current].model.overrides !== undefined && this.form.segments[this.current].model.overrides.exit !== undefined) {
      this.form.segments[this.current].model.overrides.exit();
    }
    else {
      // default fade out
      TweenMax.fromTo($('#' + this.current), 0.25, { autoAlpha: 1 }, { autoAlpha: 0.45});
      TweenMax.fromTo($('#' + this.current).find('hr'), 0.25, { autoAlpha: 0}, { autoAlpha: 1});
    }

    // show next
    this.current = next;
    // set state to ready to render view
    this.form.ready[this.current] = true;
    TweenMax.set($('#' + this.current), { display: 'block'} );
    TweenMax.fromTo($('#' + this.current), 0.4, { y: '+50'}, { y: '0', ease: Back.easeInOut.config(1)} );
    TweenMax.fromTo($('#' + this.current), 0.6, { autoAlpha: 0}, { delay: 0.05, autoAlpha: 1});


  }

  // app description, including segments and flows
  form = {
    ids: [ 'Q1', 'QDATE', 'Q2', 'Q3', 'Q4', 'Q5'],
    data: {
      'Q1': '',
      'QDATE': '',
      'Q2': {
          data: [],
          winners: 0
      },
      'Q3': {
          data: [],
          winners: 0
      },
      'Q4': ''
    },
    ready: {
      'Q1': true,
      'QATE': false,
      'Q2': false,
      'Q3': false,
      'Q4': false
    },
    segments:
    {
      'Q1':
      {
        type:         './dropdown-element',
        model: {
          app: this, // need a cleaner way to pass the parent context down
          id: 'Q1',
          questionText: 'Select a lottery game',
          labelText:    'Choose a game',
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
          ],
          exit: {
            eventName: 'change',
            flow: () => 'QDATE'
          }
        }
      },
      'QDATE':
      {
        type:         './dropdown-element',
        model: {
          app: this, // need a cleaner way to pass the parent context down
          id: 'QDATE',
          questionText: 'What date is your ticket for?',
          labelText:    'Choose a date',
          fields: [
            {
              value: 1,
              text: "May 1st, 2016",
            },
            {
              value: 2,
              text: "May 2nd, 2016",
            },
            {
              value: 3,
              text: "May 3rd, 2016",
            },
            {
              value: 4,
              text: "May 4th, 2016",
            },
            {
              value: 5,
              text: "May 5th, 2016",
            }
          ],
          exit: {
            eventName: 'change',
            flow: () => {
                if (this.form.data['Q1'] == '1')
                  return 'Q2';
                else
                  return 'Q3';
            }
          }
        }
      },
      'Q2':
      {
        type: './lottery-element',
        model: {
          id: 'Q2',
          app: this, // need a cleaner way to pass the parent context down
          questionText: 'Great - now, enter your numbers',
          buttonText: 'Check numbers',
          meta: {
            numbers: 6
          },
          exit: {
            eventName: 'click',
            flow: () => 'Q4'
          },
          overrides: {
            exit: () => '' // do nothing - this control will handle itself.
          }
        }
      },
      'Q3':
      {
        type: './lottery-element',
        model: {
          id: 'Q3',
          app: this, // need a cleaner way to pass the parent context down
          questionText: 'Great - now, enter your numbers',
          buttonText: 'Check numbers',
          meta: {
            numbers: 7
          },
          exit: {
            eventName: 'click',
            flow: () => 'Q5'
          }
        }
      },
      'Q4':
      {
        type: './message-element',
        model: {
          id: 'Q4',
          app: this, // need a cleaner way to pass the parent context down
          questionText: () => `You WON the lottery!!@ (${this.form.data.Q2.winners} out of 6)`,
          buttonText: 'Start again',
          exit: {
            eventName: 'click',
            flow: () => {
              debugger;
              this.router.navigate('/');
              this.router.navigate('/lotto')

            }
          }
        }
      },
      'Q5':
      {
        type: './message-element',
        model: {
          id: 'Q5',
          app: this, // need a cleaner way to pass the parent context down
          questionText: () => 'You entered ' + this.form.data['Q3'].data.length + ' numbers',
          buttonText: 'Start again',
          exit: {
            eventName: 'click',
            flow: () => {
              this.router.navigateToRoute('lotto');
            }
          }
        }
      }
    }
  };
}
