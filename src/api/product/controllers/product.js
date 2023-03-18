'use strict'

/**
 *  product controller
 */

const { createCoreController } = require('@strapi/strapi').factories

module.exports = createCoreController('api::product.product', ({ strapi }) => ({
  async find(ctx) {
    const { data, meta } = await super.find(ctx)
    const query = strapi.db.query('api::product.product')

    await Promise.all(
      data.map(async (item, index) => {
        const foundItem = await query.findOne({
          where: {
            id: item.id,
          },
          populate: ['createdBy', 'updatedBy'],
        })

        data[index].attributes.createdBy = {
          id: foundItem.createdBy.id,
          firstname: foundItem.createdBy.firstname,
          lastname: foundItem.createdBy.lastname,
        }

        data[index].attributes.updatedBy = {
          id: foundItem.updatedBy.id,
          firstname: foundItem.updatedBy.firstname,
          lastname: foundItem.updatedBy.lastname,
        }
      })
    )
    return { data, meta }
  },
}))
