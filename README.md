# basic aurelia form generator
This app generates a form based on a specification.  

To begin, see src/components/app.js for an example.  At the bottom of the file, it lays out the form in a object.  The form as specified is made up of named segments each with a particular type.  This project has defined 3 such types so far: dropdown, lotto, and message.

```javascript
form = {
  ids: ...,[ 'Q1', 'QDATE', 'Q2', 'Q3', 'Q4', 'Q5'],
  data: ...,
  ready: ...,
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
```
## Getting Started

Before you start, make sure you have a working [NodeJS](http://nodejs.org/) environment, preferably with NPM 3.

From the project folder, execute the following command:

```shell
npm install
```

This will install all required dependencies, including a local version of Webpack that is going to
build and bundle the app. There is no need to install Webpack globally.

To run the app execute the following command:

```shell
npm run dev
```

This command starts the Webpack development server that serves the built bundles.
You can now browse the skeleton app at http://localhost:3000. Changes in the code
will automatically build and reload the app.
