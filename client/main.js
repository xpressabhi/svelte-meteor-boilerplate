import { Meteor } from 'meteor/meteor';
import App from '../imports/ui/App.svelte';
import '../imports/startup/accounts-config.js';
import '/node_modules/bootstrap/dist/js/bootstrap.min.js';

Meteor.startup(() => {
  new App({
    target: document.getElementById('app')
  });
});