'use strict';

/**
 * order-billing service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::order-billing.order-billing');
