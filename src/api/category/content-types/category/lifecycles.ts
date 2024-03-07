import { errors } from '@strapi/utils'
const { ApplicationError } = errors

interface CategoryProps {
  id: number
  name: string
  category?: CategoryProps
}

interface UpdateProps {
  category?: any[]
  subcategories?: any[]
}

const errorMessage = {
  es: 'No es posible agregar más de 3 niveles de categorías.',
  en: 'It is not possible to add more than 3 levels of categories.',
}

module.exports = {
  async afterCreate(event) {
    const { result } = event
    await validate(result)
  },

  async afterUpdate(event) {
    const { result } = event
    await validate(result)
  },
}

// TODO: realizar 2 validaciones -> 1. root con 3 niveles, sub con 3 niveles
async function validate(result: any) {
  let dataUpdate: UpdateProps = {}
  let error = false
  const parents = await findParent(result.id)

  if (result.category && result.category.count >= 1) {
    const rootParents = await findParent(parents.tree.category.id)

    if (rootParents.nivel >= 3) {
      dataUpdate.category = []
      error = true
    }
  }

  if (result.subcategories && result.subcategories.count >= 1) {
    if (parents.nivel >= 3) {
      dataUpdate.subcategories = []
      error = true
    }
  }

  if (error) {
    await updateCategory(result.id, dataUpdate)
    throw new ApplicationError(errorMessage[result.locale])
  }
}

async function findParent(
  id: number
): Promise<{ tree: CategoryProps | null; nivel: number }> {
  let nivel = 1

  const tree = (await strapi.entityService.findOne(
    'api::category.category',
    id,
    {
      fields: ['name'],
      populate: {
        category: {
          fields: ['name'],
          populate: {
            category: {
              fields: ['name'],
            },
          },
        },
      },
    }
  )) as CategoryProps | null

  if (tree.category) {
    nivel++

    if (tree.category.category) {
      nivel++
    }
  }

  return {
    tree,
    nivel,
  }
}

async function updateCategory(id: number, data: any) {
  await strapi.entityService.update('api::category.category', id, {
    data,
  })
}
