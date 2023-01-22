const dayjs = require('dayjs')

const money = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})

module.exports = {
  async afterCreate(event) {
    const { result } = event

    try {
      const order = await strapi.entityService.findOne(
        'api::order.order',
        result.id,
        {
          fields: ['order', 'status', 'date'],
          populate: {
            orders_billing: true,
            orders_products: {
              populate: {
                product: {
                  fields: ['name', 'price', 'isDiscount', 'discount'],
                  populate: {
                    createdBy: {
                      fields: ['firstname', 'lastname', 'email'],
                    },
                  },
                },
              },
            },
            user: true,
          },
        }
      )

      let emailMap = new Map()

      order.orders_products.forEach((el) => {
        if (!emailMap.has(el.product.createdBy.email)) {
          emailMap.set(el.product.createdBy.email, [])
        }

        emailMap.get(el.product.createdBy.email).push({
          price: el.price,
          qty: el.qty,
          product: {
            name: el.product.name,
            price: el.product.price,
            isDiscount: el.product.isDiscount,
            discount: el.product.discount,
          },
        })
      })

      for (const [key, value] of emailMap) {
        let templateProducts = ''
        value.forEach((el) => {
          templateProducts += `
            <tr>
              <td style='padding:0.5rem; border: 1px solid #CCC;'>
                ${el.product.name}</td>
              <td style='padding:0.5rem; border: 1px solid #CCC; text-align: right;'>
                ${money.format(el.price)}
              </td>
              <td style='padding:0.5rem; border: 1px solid #CCC; text-align: right;'>
                ${el.qty}
              </td>
              <td style='padding:0.5rem; border: 1px solid #CCC; text-align: right;'>
                ${money.format(el.price * el.qty)}
              </td>
            </tr>
          `
        })

        const subtotal = value.reduce(
          (accumulator, current) => accumulator + current.price * current.qty,
          0
        )
        const itbms = subtotal * 0.07
        const total = subtotal + itbms
        templateProducts += `
          <tr>
            <td style='padding:0.5rem; border: 1px solid #CCC; text-align: right;'></td>
            <td style='padding:0.5rem; border: 1px solid #CCC; text-align: right;'></td>
            <td style='padding:0.5rem; border: 1px solid #CCC; text-align: right;'><b>SUBTOTAL:</b></td>
            <td style='padding:0.5rem; border: 1px solid #CCC; text-align: right;'>${money.format(
              subtotal
            )}</td>
          </tr>
          <tr>
            <td style='padding:0.5rem; border: 1px solid #CCC; text-align: right;'></td>
            <td style='padding:0.5rem; border: 1px solid #CCC; text-align: right;'></td>
            <td style='padding:0.5rem; border: 1px solid #CCC; text-align: right;'><b>ITBMS:</b></td>
            <td style='padding:0.5rem; border: 1px solid #CCC; text-align: right;'>${money.format(
              itbms
            )}</td>
          </tr>
          <tr>
            <td style='padding:0.5rem; border: 1px solid #CCC; text-align: right;'></td>
            <td style='padding:0.5rem; border: 1px solid #CCC; text-align: right;'></td>
            <td style='padding:0.5rem; border: 1px solid #CCC; text-align: right;'><b>TOTAL:</b></td>
            <td style='padding:0.5rem; border: 1px solid #CCC; text-align: right;'>${money.format(
              total
            )}</td>
          </tr>
        `

        const template = `
          <header>
            <h1>Orden #: ${order.order}</h1>
            <h3>Fecha: ${dayjs(order.date).format('DD/MM/YYYY hh:mm a')}</h3>
            <h4>Detalles del cliente:</h4>
            <ul>
            <li>Nombre: ${order.orders_billing.name} ${
          order.orders_billing.lastname
        }
            <li>Teléfono: ${order.orders_billing.phone}</li>
            <li>Email: ${order.orders_billing.email}</li>
            <li>Dirección: ${order.orders_billing.adress}</li>
            </ul>
          </header>

          <section>
            <h4>Productos:</h4>
            <table>
              <thead>
                <th>Producto</th>
                <th>Precio</th>
                <th>Cantidad</th>
                <th>Subtotal</th>
              </thead>
              <tbody>
                ${templateProducts}
              </tbody>
            </table>
          </section>
        `

        await strapi.plugins['email'].services.email.send({
          to: key,
          from: 'Hafbuy <no-reply@hafbuy.net>',
          cc: '',
          bcc: '',
          replyTo: 'no-reply@hafbuy.net',
          subject: `Hafbuy - orden #: ${order.order} - fecha: ${dayjs(
            order.date
          ).format('DD/MM/YYYY hh:mm a')}`,
          html: template,
        })
      }
    } catch (err) {
      console.log(err)
    }
  },
}
