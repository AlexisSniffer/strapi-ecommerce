import { Strapi } from '@strapi/strapi'

export default ({ strapi }: { strapi: Strapi }) => {
  strapi.customFields.register({
    name: 'variants',
    plugin: 'product-variants',
    type: 'string',
    inputSize: {
      default: 4,
      isResizable: true,
    },
  })
}
