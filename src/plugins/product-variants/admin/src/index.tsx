import { prefixPluginTranslations } from '@strapi/helper-plugin'

import pluginPkg from '../../package.json'
import PluginIcon from './components/PluginIcon'
import pluginId from './pluginId'
import getTrad from './utils/getTrad'

const name = pluginPkg.strapi.name

export default {
  register(app: any) {
    app.customFields.register({
      name: 'variants',
      pluginId: 'product-variants',
      type: 'string',
      intlLabel: {
        id: getTrad('product-variants.label'),
        defaultMessage: 'Variants',
      },
      intlDescription: {
        id: getTrad('product-variants.description'),
        defaultMessage: 'Variants (Cartesian product)',
      },
      components: {
        Input: async () =>
          import(
            /* webpackChunkName: "input-component" */ './components/Variants/Input'
          ),
      },
      icon: PluginIcon,
      options: {},
    })
  },

  bootstrap(app: any) {},

  async registerTrads(app: any) {
    const { locales } = app

    const importedTrads = await Promise.all(
      (locales as any[]).map((locale) => {
        return import(`./translations/${locale}.json`)
          .then(({ default: data }) => {
            return {
              data: prefixPluginTranslations(data, pluginId),
              locale,
            }
          })
          .catch(() => {
            return {
              data: {},
              locale,
            }
          })
      })
    )

    return Promise.resolve(importedTrads)
  },
}
