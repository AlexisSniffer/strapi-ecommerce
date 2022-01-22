module.exports = ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET', '4047ae555fee92725496448cbba4c14e'),
  },
});
