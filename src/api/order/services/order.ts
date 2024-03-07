/**
 * order service
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreService(
  'api::order.order',
  ({ strapi }) => ({
    async create(ctx: any) {
      const { data } = ctx

      // order
      const order = await strapi.entityService.create('api::order.order', {
        data: {
          order: `${Date.now()}`,
          status: 'pending',
          date: new Date(Date.now()).toISOString(),
        },
      })

      // billing
      if (data._billing) {
        await strapi.entityService.create('api::order-billing.order-billing', {
          data: {
            order: order.id,
            ...data._billing,
          },
        })
      }

      // products
      if (data._products && data._products.length) {
        for (const product of data._products) {
          await strapi.entityService.create(
            'api::order-product.order-product',
            {
              data: {
                order: order.id,
                qty: product.qty,
                price: product.price,
                product: product.id,
                variant: product.variant
                  ? Object.entries(product.variant.variant)
                      .map(([clave, valor], index, array) => {
                        const separador = index === array.length - 1 ? '' : ', '
                        return `${clave}: ${valor}${separador}`
                      })
                      .join('')
                  : null,
              },
            }
          )
        }
      }

      // payment
      if (data._payment) {
        await strapi.entityService.create('api::order-payment.order-payment', {
          data: {
            order: order.id,
            ...data._payment,
          },
        })
      }

      await strapi
        .plugin('email-designer')
        .service('email')
        .sendTemplatedEmail(
          {
            to: 'alexis.sniffer@gmail.com',
            from: 'no-reply@hafbuy.net',
            replyTo: 'no-reply@hafbuy.net',
            attachments: [],
          },
          { templateReferenceId: 1 },
          {
            ...data,
            ...order,
          }
        )

      /* await strapi.plugins['email-designer'].services.email.send({
        templateId: 1,
        to: 'alexis.sniffer@gmail.com',
        from: 'no-reply@hafbuy.net',
        replyTo: 'no-reply@hafbuy.net',
        data: {
          ...order,
          ...data,
        },
      })*/

      /*await strapi.plugins['email'].services.email.send({
        to: 'luis.martinez0192@gmail.com',
        from: 'Hafbuy <no-reply@hafbuy.net>',
        cc: 'alexis.sniffer@gmail.com',
        bcc: '',
        replyTo: 'no-reply@hafbuy.net',
        subject: `Prueba`,
        html: `<p>prueba</p>`,
      })*/

      return order
    },
  })
)
