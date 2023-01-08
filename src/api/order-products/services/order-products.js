'use strict';

/**
 * order-products service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::order-products.order-products');
