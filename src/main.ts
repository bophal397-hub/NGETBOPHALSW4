import { bootstrapApplication } from '@angular/platform-browser';
// Use the ESM build of Bootstrap to avoid CommonJS optimization bailouts
import 'bootstrap/dist/js/bootstrap.esm.min.js';
import { appConfig } from './app/app.config';
import { App } from './app/app';

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
