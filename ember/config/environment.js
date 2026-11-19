'use strict';

module.exports = function (environment) {
  const ENV = {
    modulePrefix: 'weathernow-ember',
    environment,
    rootURL: '/ember/',
    // 'none' — single-screen app; the router never touches the URL, so it
    // boots identically at /ember/, at / in dev, or anywhere else
    locationType: 'none',
    EmberENV: {
      EXTEND_PROTOTYPES: false,
      FEATURES: {},
    },

    APP: {},
  };

  if (environment === 'test') {
    ENV.locationType = 'none';
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;
    ENV.APP.rootElement = '#ember-testing';
    ENV.APP.autoboot = false;
  }

  return ENV;
};
