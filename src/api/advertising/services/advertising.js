'use strict';

/**
 * advertising service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::advertising.advertising');
