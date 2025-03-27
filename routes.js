const webhookMercadoPago = require('./webhook-mercadopago')

module.exports = app => {
  app.post('/webhook/mercadopago', webhookMercadoPago)
}
