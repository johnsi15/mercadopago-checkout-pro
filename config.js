module.exports = {
  webhook_secret: process.env.WEBHOOK_SECRET || '',
  port: process.env.PORT || 3000,
  node_env: process.env.NODE_ENV || 'development',
  access_token: process.env.ACCESS_TOKEN || '',
}
