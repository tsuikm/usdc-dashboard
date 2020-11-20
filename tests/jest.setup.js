import Vue from 'vue';
import VueMaterial from 'vue-material';
import NuxtLinkStub from './nuxt-link-stub';
import { config } from '@vue/test-utils';

Vue.use(VueMaterial);
config.stubs['nuxt-link'] = NuxtLinkStub;

// Strictly handle `unhandledRejection` warnings.
//
// For the context of our project, we only use async/await, so these warning are
// thrown errors in async contexts (aka an error, meaning our tests shouldn't
// have passed).
//
// For now, listen to these warnings and treat these as errors.
// Solution derived from https://stackoverflow.com/questions/51105622/how-to-ensure-jest-fails-on-unhandledrejection
process.on('unhandledRejection', reason => {
  throw reason;
});

// Strictly handle `console.error` warnings.
//
// Jest, by default, logs console.error messages but doesn't treat it as an error.
//
// For now, listen to these warnings and treat these as errors.
// Solution derived from https://github.com/facebook/jest/issues/6121
console.error = message => {
  throw (message instanceof Error ? message : new Error(message));
};
