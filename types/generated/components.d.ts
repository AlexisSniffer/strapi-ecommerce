import type { Schema, Attribute } from '@strapi/strapi'

export interface VariantsVariants extends Schema.Component {
  collectionName: 'components_variants_variants'
  info: {
    displayName: 'variants'
    description: ''
  }
  attributes: {
    images: Attribute.Media
    price: Attribute.Decimal & Attribute.Required
    discount: Attribute.Decimal
    isDiscount: Attribute.Boolean &
      Attribute.Required &
      Attribute.DefaultTo<false>
    until: Attribute.DateTime
    stock: Attribute.Integer &
      Attribute.SetMinMax<{
        min: 0
      }>
    variant: Attribute.Component<'variants.variation', true>
  }
}

export interface VariantsVariation extends Schema.Component {
  collectionName: 'components_variants_variations'
  info: {
    displayName: 'variation'
    description: ''
  }
  attributes: {
    value: Attribute.String & Attribute.Required
    type: Attribute.Relation<
      'variants.variation',
      'oneToOne',
      'api::variant-type.variant-type'
    >
  }
}

declare module '@strapi/types' {
  export module Shared {
    export interface Components {
      'variants.variants': VariantsVariants
      'variants.variation': VariantsVariation
    }
  }
}
