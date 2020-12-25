const axios = require('axios');
const server = require('express');
const Expo = require('expo-server-sdk').default;
const cors = require('cors');
const fetch = require('node-fetch')

const expo = new Expo()
const expressServeur = server();

expressServeur.use(cors());
expressServeur.listen(process.env.PORT || 3000, () => {
    console.log('server en écoute sur le port', (process.env.PORT || 3000))

    expressServeur.get('/', function(req, res){
        const destinataires = req.query.destinataires;
        const IdEtab = req.query.IdEtab;
        const TitreEvenement = req.query.TitreEvenement;
        const type = req.query.type
        const NomEtab = req.query.NomEtab

        console.log('requete : ', [destinataires], IdEtab, TitreEvenement, type)

        var gettingIdEvent = destinataires.split("_")
        var posibleIdEvent = gettingIdEvent[0]

        console.log(gettingIdEvent)

        if(posibleIdEvent === 'IDEVENT'){
          const IdEvenement = gettingIdEvent[1]
          console.log('IDEVENT ICI')
          let tokens = [];
          fetch('http://192.168.0.103/m_pes/getTokensEvent.php', {
              method: 'post',
              headers: {'Accept': 'application/json', 'Content-Type': 'application/json'},
              body:JSON.stringify({
                IdEvenement: IdEvenement, IdEtab: IdEtab, type: type
              })
            })
            .then(d => d.json())
            .catch(function (error) {
              console.log(error);
            })
            .then(response => {
              tokens = response

              console.log('mes tokens : ', tokens)
              for(i=0; i<tokens.length; i++){
                  
                  if(Expo.isExpoPushToken(tokens[i].otoken)){

                      let messages = {
                          to: tokens[i].otoken,
                          sound: 'default',
                          title: NomEtab,
                          body: TitreEvenement
                      }
                      
                      console.log('Message : ', messages)
                      

                      fetch('https://exp.host/--/api/v2/push/send', {
                        method: 'POST',
                        headers: {
                          Accept: 'application/json',
                          'Accept-encoding': 'gzip, deflate',
                          'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(messages)
                      })
                      .then(response => response.json())
                      .catch((e) => {
                        res.send({'Erreur reçu === ': e})
                      })
                      .then(ticket => {

                        res.send(ticket)
                        console.log(ticket.data)
                        fetch('https://exp.host/--/api/v2/push/getReceipts', {
                          method: 'post',
                          headers: { 'Content-Type': 'application/json'},
                          body: JSON.stringify({'ids': [ticket.data.id]})
                        })
                        .then(res => res.json())
                        .catch((e) => console.log(e))
                        .then(res => console.log(res))
                      })
                      // expo.sendPushNotificationsAsync(messages).then(ticket => res.send({ticket: ticket})).catch((e) => {
                      //     console.log(e)
                      //     res.send({erreur: 'Erreur d envoi'})
                      // })
                  }else{

                  }

              }
            })


        }else{ //IdEvenement est null
          let tokens = [];
          fetch('http://192.168.0.103/m_pes/getTokens.php', {
              method: 'post',
              headers: {'Accept': 'application/json', 'Content-Type': 'application/json'},
              body:JSON.stringify({
                destinataires: [destinataires], IdEtab: IdEtab, type: type
              })
            })
            .then(d => d.json())
            .catch(function (error) {
              console.log(error);
            })
            .then(response => {
              tokens = response

              console.log('mes tokens : ', tokens)
              for(i=0; i<tokens.length; i++){
                  
                  if(Expo.isExpoPushToken(tokens[i].otoken)){

                      let messages = {
                          to: tokens[i].otoken,
                          sound: 'default',
                          title: NomEtab,
                          body: TitreEvenement
                      }
                      
                      console.log('Message : ', messages)
                      

                      fetch('https://exp.host/--/api/v2/push/send', {
                        method: 'POST',
                        headers: {
                          Accept: 'application/json',
                          'Accept-encoding': 'gzip, deflate',
                          'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(messages)
                      })
                      .then(response => response.json())
                      .catch((e) => {
                        res.send({'Erreur reçu === ': e})
                      })
                      .then(ticket => {

                        res.send(ticket)
                        console.log(ticket.data)
                        fetch('https://exp.host/--/api/v2/push/getReceipts', {
                          method: 'post',
                          headers: { 'Content-Type': 'application/json'},
                          body: JSON.stringify({'ids': [ticket.data.id]})
                        })
                        .then(res => res.json())
                        .catch((e) => console.log(e))
                        .then(res => console.log(res))
                      })
                      // expo.sendPushNotificationsAsync(messages).then(ticket => res.send({ticket: ticket})).catch((e) => {
                      //     console.log(e)
                      //     res.send({erreur: 'Erreur d envoi'})
                      // })
                  }else{

                  }

              }
            })
        }
          
    })
})
