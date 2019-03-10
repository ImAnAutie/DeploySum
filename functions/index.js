 const functions = require('firebase-functions');

const admin = require('firebase-admin');
admin.initializeApp();
const db = admin.firestore();
//const express = require('express');
//const cors = require('cors');

const SENDGRID_API_KEY = functions.config().sendgrid.key;
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(SENDGRID_API_KEY);

exports.UserCreated = functions.auth.user().onCreate((user) => {
	return db.collection("users").doc(user.uid).set({
		privacypolicyversion: "1.0.0"
	}).then(function() {
		console.log("User document created");

		console.log(user);
		const msg = {
			to: user.email,
			from: 'deploysum@parkplanr.okonetwork.org.uk',
		//	subject:  'Ne',
			templateId: 'd-0a107bb796e84f3e9ff61b0328cac139',
			substitutionWrappers: ['{{', '}}'],
			substitutions: {
				user: user
			}
		};
		return sgMail.send(msg)
	}).catch(function(error) {
		console.error("Error writing user document: ", error);
	});
});

//this simply sets a custom claim of admin for the UID specificied in the uid var
//exports.makeadmin = functions.https.onRequest((req, res) => {
//	uid="eoXv1laaiwRhbzFGv5ioekhPJV82";
//	return admin.auth().setCustomUserClaims(uid, {admin: true}).then(() => {
//		return res.send("Now admin");
//	});
//});
