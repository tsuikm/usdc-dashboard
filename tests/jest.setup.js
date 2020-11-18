import Vue from 'vue';
import VueMaterial from 'vue-material';
import NuxtLinkStub from '@/utils/nuxt-link-stub';
import { config } from '@vue/test-utils';

Vue.use(VueMaterial);
config.stubs['nuxt-link'] = NuxtLinkStub;
