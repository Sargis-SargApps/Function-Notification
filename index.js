const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();
const db=admin.firestore();


exports.notifyFav=functions.firestore.document("users/{uid}/ArticleFav/{articleId}").onCreate((snap, context) => {

var message = {
  notification: {
      title: "Tienes un nuevo me gusta",
      body: "email",
      click_action: "MainActivity"
  }
}
  let getEmail=snap.ref.parent.parent.get().then(doc => {
      var email=doc.data().email;
      message.notification.body=email
      return null;
    });

    const idArticleFav= snap.ref.id.trim();

    let getOwnerId=db.collection("article").doc(idArticleFav).get().then(doc=>{
        var ownerID=doc.data().ownerID.trim();  
        return ownerID;
   
      }).then(ownerID => {
        let getToken=db.collection("users").doc(ownerID).get().then(doc2=> {
          var token=doc2.data().token.trim()
          return token;

        }).then(token => {
            return admin.messaging().sendToDevice(token,message);
          });

          return null;
      }).catch(err => {
        console.log("Error al obtener documento",err);
      });

 return null;
});

