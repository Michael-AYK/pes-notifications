const axios = require('axios');
const server = require('express');
const Expo = require('expo-server-sdk').default;
const cors = require('cors');
const fetch = require("node-fetch");

let tokens = [];

const expo = new Expo()
const expressServeur = server();
let destinataires = '',
    IdEtab = '',
    TitreEvenement = '',
    type = ''

expressServeur.use(cors());
expressServeur.listen(process.env.PORT || 3000, () => {
    expressServeur.get('/', function(req, res){
        destinataires = req.query.destinataires;
        IdEtab = req.query.IdEtab;
        TitreEvenement = req.query.TitreEvenement;
        type = req.query.type
     })
        console.log(destinataires, ' - ', IdEtab, ' - ', type)
        
        fetch('https://www.ogseic.com/SuiviApprenants/myBackEnd_m_pes/getTokens.php',{
            method: 'post',
            headers: {'Accept': 'application/json', 'Content-Type': 'application/json'},
            body: JSON.stringify({destinataires: destinataires, IdEtab: IdEtab, type: type})
        })
        .then(function(d){
            return d.json()
        })
        .catch(function (error) {
            console.log(error);
          })
        .then(function(d){
            console.log('====')
            tokens = d
            console.log(tokens)
            
            console.log('avant de parcourir les tokens')
          console.log('mes tokens : ', tokens)
          for(i=0; i<tokens.length; i++){ 
              
            if(Expo.isExpoPushToken(tokens[i])){
                console.log('TOKEN VALIDE = ', tokens[i])
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
