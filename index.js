const axios = require('axios');
const server = require('express');
const Expo = require('expo-server-sdk').default;
const cors = require('cors');
const fetch = require("node-fetch");

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

        console.log(req.query.destinataires, ' - ', req.query.IdEtab, ' - ', req.query.type)
        
        fetch('https://www.ogseic.com/SuiviApprenants/myBackEnd_m_pes/getTokens.php',{
            method: 'post',
            headers: {'Accept': 'application/json', 'Content-Type': 'application/json'},
            body: JSON.stringify({destinataires: req.query.destinataires, IdEtab: req.query.IdEtab, type: req.query.type})
        })
        .then(function(d){
            return d.text()
        })
        .catch(function (error) {
            console.log(error);
          })
        .then(function(d){
            console.log('====')
            tokens = d
            console.log(tokens)
            console.log('====')
        })
        
        axios.get('https://www.ogseic.com/SuiviApprenants/myBackEnd_m_pes/getTokens.php', {
            params: {
              destinataires: req.query.destinataires, IdEtab: req.query.IdEtab, type: req.query.type
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
