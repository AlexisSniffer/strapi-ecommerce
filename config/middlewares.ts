export default [
  'strapi::errors',
  {
    name: 'strapi::security',
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          'connect-src': ["'self'", 'https:'],
          'script-src': ["'self'", 'editor.unlayer.com'],
          'frame-src': ["'self'", 'editor.unlayer.com'],
          'img-src': [
            "'self'",
            'data:',
            'blob:',
            'strapi.io',
            'market-assets.strapi.io',
            's3.amazonaws.com',
            'cdn.jsdelivr.net',
            'https://hafbuy-strapi-space.nyc3.digitaloceanspaces.com',
          ],
          'media-src': [
            "'self'",
            'data:',
            'blob:',
            'market-assets.strapi.io',
            'https://hafbuy-strapi-space.nyc3.digitaloceanspaces.com',
          ],
          upgradeInsecureRequests: null,
        },
      },
    },
  },
  'strapi::cors',
  'strapi::poweredBy',
  'strapi::logger',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
]
