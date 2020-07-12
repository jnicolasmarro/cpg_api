const stripe = require('stripe')('sk_test_51H2dHFAaXeWp9sNmYmQhuMTPfrJA6U28hzcj0903AZJjtpK930Sx0zcs9mOrF4I4r4Dzoe68RTzO5KDIJUup3yzl00wMdPdwXA');

function validacionDatosEstablecimiento() {
  //funcion para validar datos de establecimiento y representante
}

function validacionDatosFinancieros() {
  // funcion para validar la creacion de la tarjeta credito en el sistema
}

module.exports = {
  async creaEstablecimiento(req, res) {
    
    res.json(req.body)
    
       /* await stripe.customers.create(
            {
              description: 'Prueba de establecimiento con Stripe',
            },
            function(err, customer) {
                res.json(customer)
            }
        )*/
        
    },
    async vincularTarjeta(req, res) {
        let tok;

        await stripe.tokens.create(
            {
              card: {
                number: 5406910101410537,
                exp_month: 10,
                exp_year: 2024,
                cvc: 361,
              },
            },
            async function (err, token) {

                
                
                stripe.customers.createSource(
                    'cus_HclfLlGlyAV3p4',
                    {source: token.id},
                    function(err, card) {
                      res.json(err)
                    }
                  )
                
            }
        );
        

        /*await stripe.customers.createSource(
            'cus_HclfLlGlyAV3p4',
            {source: tok},
            function(err, card) {
              res.json(err)
            }
          )*/
    }
}