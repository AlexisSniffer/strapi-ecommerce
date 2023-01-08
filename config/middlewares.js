module.exports = ({ env }) => [
  'strapi::errors',
  'strapi::cors',
  'strapi::poweredBy',
  'strapi::logger',
  'strapi::query',
  'strapi::body',
  'strapi::favicon',
  'strapi::public',
  {
    name: 'strapi::security',
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          'connect-src': ["'self'", 'https:'],
          'img-src': [
            "'self'",
            'data:',
            'blob:',
            `https://hafbuy-strapi-space.nyc3.digitaloceanspaces.com`,
          ],
          'media-src': [
            "'self'",
            'data:',
            'blob:',
            `https://hafbuy-strapi-space.nyc3.digitaloceanspaces.com`,
          ],
          upgradeInsecureRequests: null,
        },
      },
    },
  },
]
