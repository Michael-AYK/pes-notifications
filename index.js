const axios = require('axios');
const server = require('express');
const Expo = require('expo-server-sdk').default;
const cors = require('cors');

let tokens = [];

const expo = new Expo()
const expressServeur = server();

expressServeur.use(cors());
expressServeur.listen(process.env.PORT || 3000, () => {
    expressServeur.get('/', function(req, res){
        const destinataires = req.query.destinataires;
        const IdEtab = req.query.IdEtab;
        const TitreEvenement = req.query.TitreEvenement;
        const type = req.query.type

        axios.get('http://192.168.0.100/m_pes/getTokens.php', {
            params: {
              destinataires: destinataires, IdEtab: IdEtab, type: type
            }
          })
          .then(function (response) {
            tokens = response.data
          })
          .catch(function (error) {
            console.log(error);
          })

          console.log('avant de parcourir les tokens')
          console.log('mes tokens : ', tokens)
          for(i=0; i<tokens.length; i++){
              
            if(Expo.isExpoPushToken(tokens[i])){
                let messages = [
                    {
                        to: tokens[i],
                        sound: 'default',
                        body: TitreEvenement
                    }
                ]

                expo.sendPushNotificationsAsync(messages).then(ticket => res.send({ticket: ticket})).catch((e) => {
                    console.log(e)
                    res.send({erreur: 'Erreur d envoi'})
                })
            }

          }
    })
})