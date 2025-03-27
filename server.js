const express = require('express')
const app = express()
const cors = require('cors')
const mercadopago = require('mercadopago')
// const { init } = require('express/lib/application')

const MercadoPagoConfig = mercadopago.MercadoPagoConfig
const Preference = mercadopago.Preference

// REPLACE WITH YOUR ACCESS TOKEN AVAILABLE IN: https://developers.mercadopago.com/panel
console.log(process.env.ACCESS_TOKEN)
const client = new MercadoPagoConfig({ accessToken: process.env.ACCESS_TOKEN, options: { timeout: 5000 } })

app.use(express.urlencoded({ extended: false }))
app.use(express.json())
// app.use(express.static('../../client/html-js'))
app.use(cors({ origin: ['http://localhost:5173', 'https://develop.d2g0syn6uetin0.amplifyapp.com'] }))
app.get('/', function (req, res) {
  res.status(200).send('<h1>Server running</h1>')
})

require('./routes')(app)

app.post('/create_preference', (req, res) => {
  const preference = new Preference(client)

  let body = {
    items: [
      {
        title: req.body.description,
        unit_price: Number(req.body.price),
        quantity: Number(req.body.quantity),
        description: req.body.description,
      },
    ],
    back_urls: {
      success: 'https://develop.d2g0syn6uetin0.amplifyapp.com/estado-de-pago',
      failure: 'https://develop.d2g0syn6uetin0.amplifyapp.com/estado-de-pago',
      pending: 'https://develop.d2g0syn6uetin0.amplifyapp.com/estado-de-pago',
    },
    auto_return: 'approved',
    payment_methods: {
      installments: 6, // Máximo de 6 cuotas
      excluded_payment_methods: [
        { id: 'visa' }, // Excluir tarjetas Visa
      ],
    },
    notification_url: 'https://mercadopago-api-mutuo-hidden-snow-7668.fly.dev/webhook/mercadopago?source_news=webhooks',
  }

  const requestOptions = {
    integratorId: 'dev_24c65fb163bf11ea96500242ac130004',
  }

  preference
    .create({
      body,
      requestOptions,
    })
    .then(response => {
      console.log(response)
      res.json({
        id: response.id,
        init_point: response.sandbox_init_point,
      })
    })
    .catch(console.log)
})

app.get('/feedback', function (req, res) {
  res.json({
    Payment: req.query.payment_id,
    Status: req.query.status,
    MerchantOrder: req.query.merchant_order_id,
  })
})

app.listen(3000, () => {
  console.log('The server is now running on Port 3000')
})
