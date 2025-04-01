const mercadopago = require('mercadopago')
const crypto = require('crypto')
const config = require('./config')

// https://www.mercadopago.com.co/developers/es/docs/checkout-pro/additional-content/your-integrations/notifications/webhooks#editor_10

const MercadoPagoConfig = mercadopago.MercadoPagoConfig
const Payment = mercadopago.Payment

module.exports = function webhookMercadoPago(req, res) {
  try {
    // Obtain the x-signature value from the header
    const xSignature = req.headers['x-signature']
    const xRequestId = req.headers['x-request-id']
    const dataID = req.body.data?.id || req.query['data.id'] // ID del pago, de la orden comercial o del reclamo.

    if (!xSignature || !xRequestId || !dataID) {
      console.warn('Incomplete webhook data', {
        hasSignature: !!xSignature,
        hasRequestId: !!xRequestId,
        hasDataId: !!dataID,
      })

      return res.status(400).send('Invalid request')
    }

    // Separating the x-signature into parts
    const parts = xSignature.split(',')

    // Initializing variables to store ts and hash
    let ts
    let hash

    // Iterate over the values to obtain ts and v1
    parts.forEach(part => {
      // Split each part into key and value
      const [key, value] = part.split('=')
      if (key && value) {
        const trimmedKey = key.trim()
        const trimmedValue = value.trim()
        if (trimmedKey === 'ts') {
          ts = trimmedValue
        } else if (trimmedKey === 'v1') {
          hash = trimmedValue
        }
      }
    })

    // Obtain the secret key for the user/application from Mercadopago developers site
    const secret = config.webhook_secret

    // Generate the manifest string
    const manifest = `id:${dataID};request-id:${xRequestId};ts:${ts};`

    // Create an HMAC signature
    const hmac = crypto.createHmac('sha256', secret)
    hmac.update(manifest)

    // Obtain the hash result as a hexadecimal string
    const calculatedHash = hmac.digest('hex')

    if (calculatedHash !== hash) {
      console.warn('HMAC verification failed', {
        calculatedHash,
        receivedHash: hash,
      })

      return res.status(400).send('Invalid signature')
    }

    // Procesar notificación
    processPaymentNotification(req.body)

    console.log('Webhook processed successfully', {
      dataID,
      requestId: xRequestId,
    })

    res.status(200).send('Ok')
  } catch (error) {
    console.error('Webhook processing error', {
      error: error.message,
      stack: error.stack,
    })
    res.status(500).send('Internal server error')
  }
}

// https://www.mercadopago.com.co/developers/es/reference/payments/_payments_id/get
async function processPaymentNotification(body) {
  // Actualizar estado de pago, enviar confirmaciones, etc.
  const client = new MercadoPagoConfig({ accessToken: config.access_token })
  const payment = new Payment(client)

  if (body.type === 'payment') {
    payment
      .get({
        id: body.data.id,
      })
      .then(dataPayment => {
        console.log('Pago -> ', dataPayment)
        // Actualizar el estado de pago en la base de datos
      })
      .catch(console.log)
  }

  // Alertas de fraude
  if (body.type === 'stop_delivery_op_wh') {
    console.log('Fraude -> ', body.data.payment_id)
  }
}
