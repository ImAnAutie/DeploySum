firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
	console.log("Signed in!");
	console.log(user);
	$('#div_signing_in_now').show();
	$('#div_login_methods').hide();
	if (!user['emailVerified']) {
		var user = firebase.auth().currentUser;
	//	user.sendEmailVerification().then(function() {
	//	}).catch(function(error) {
	//	});
	};

	location.href="/";
  }
});
