module.exports = ({ env }) => ({
  upload: {
    config: {
      provider: 'aws-s3',
      providerOptions: {
        s3Options: {
          endpoint: env('DO_SPACE_ENDPOINT'),
          region: env('DO_SPACE_REGION'),
          credentials: {
            accessKeyId: env('DO_SPACE_ACCESS_KEY'),
            secretAccessKey: env('DO_SPACE_SECRET_KEY'),
          },
          params: {
            ACL: env('AWS_ACL', 'public-read'),
            signedUrlExpires: env('AWS_SIGNED_URL_EXPIRES', 15 * 60),
            Bucket: env('DO_SPACE_BUCKET'),
          },
        },
      },
      actionOptions: {
        upload: {},
        uploadStream: {},
        delete: {},
      },
    },
  },

  email: {
    config: {
      provider: 'sendgrid',
      providerOptions: {
        apiKey:
          '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',
      },
      settings: {
        defaultFrom: 'no-reply@hafbuy.net',
        defaultReplyTo: 'no-reply@hafbuy.net',
      },
    },
  },

  'product-variants': {
    enabled: true,
    resolve: './src/plugins/product-variants',
  },

  'schemas-to-ts': {
    enabled: false,
    config: {
      acceptedNodeEnvs: ['development'],
      commonInterfacesFolderName: 'schemas-to-ts',
      verboseLogs: false,
      alwaysAddEnumSuffix: false,
    },
  },

  'email-designer': {
    enabled: true,
    config: {
      editor: {
        options: {
          features: {
            colorPicker: {
              presets: ['#1d1b84'],
            },
          },
        },
        appearance: {
          theme: 'dark',
        },
      },
    },
  },
})
