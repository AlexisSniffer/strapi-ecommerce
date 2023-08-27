'use strict';

/**
 * orders-payment service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::orders-payment.orders-payment');
