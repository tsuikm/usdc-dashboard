import Vue from 'vue';
import VueMaterial from 'vue-material';
import NuxtLinkStub from './nuxt-link-stub';
import { config } from '@vue/test-utils';

Vue.use(VueMaterial);
config.stubs['nuxt-link'] = NuxtLinkStub;
