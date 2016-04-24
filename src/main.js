var Promise = require('bluebird'); // Promise polyfill for IE11
import {bootstrap} from 'aurelia-bootstrapper-webpack';
import gsap from '../node_modules/gsap/src/minified/TweenMax.min.js'
import '../node_modules/semantic-ui/dist/semantic.min.js';
import '../node_modules/semantic-ui/dist/semantic.min.css'
import '../node_modules/font-awesome/css/font-awesome.css';
import '../styles/styles.css';

bootstrap(function(aurelia) {
  aurelia.use
    .standardConfiguration()
    .developmentLogging();

  aurelia.start().then(() => aurelia.setRoot('app', document.body));
});
