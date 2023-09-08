async function updateRatings(event) {
  const { result } = event

  try {
    const review = await strapi
      .query('api::review.review')
      .findOne({ id: result.id, populate: { product: true } })

    const product = await strapi
      .query('api::product.product')
      .findOne({ where: { id: review.product.id } })

    if (product) {
      const reviews = await strapi.query('api::review.review').findMany({
        filters: {
          product: {
            id: product.id,
          },
        },
      })

      const totalReviews = reviews.reduce(
        (sum, review) => sum + review.rating,
        0
      )

      const averageRating = Math.round(totalReviews / reviews.length)

      await strapi.query('api::product.product').update({
        where: {
          id: product.id,
        },
        data: { ratings: averageRating },
      })
    }
  } catch (err) {
    console.log(err)
  }
}

module.exports = {
  async afterCreate(event) {
    await updateRatings(event)
  },
}
