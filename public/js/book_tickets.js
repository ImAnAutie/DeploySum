function book_tickets(park) {
	console.log(`Loading ticket purchase url for park:${park}`);

	swal({
		title: "Just searching for the best booking site",
		text: "",
		imageUrl: "/img/ajax-loading.gif",
		showCancelButton: false,
		showConfirmButton: false
	});

	$.get(`/mobileapi/parks/${park}/tickets/buy`, function(result) {
		console.log(result);
		if (result.status) {
			console.log("Success!");
			if (result.affiliate) {
				console.log("Affiliate, showing disclaimer and redirecting");
				swal({
                			title: `Sending you to our Ticketing partner, ${result.affiliate_name}`,
                			text: "Just a second",
        			        imageUrl: "/img/ajax-loading.gif",
        				showCancelButton: false,
				        showConfirmButton: false
				});
				setTimeout(function() {
					location.href=result.url;
				},2000);
			} else {
				console.log("Not affiliate, redirecting");
				location.href=result.url;
			};
		} else {
			console.log("Status false");
			console.log(result);
			swal({
				title: "Oops!",
				text: "Sorry but something went wrong, please try again",
				type: "error",
				cancelButtonText: "Close",
				showCancelButton: true,
				showConfirmButton: false
			});
		};
	}).fail(function(error) {
		console.log("Network failure");
		console.log(error);
		swal({
			title: "Oops!",
			text: "Sorry but there was a network error, please check your connection and try again",
			type: "error",
			cancelButtonText: "Close",
			showCancelButton: true,
			showConfirmButton: false
		});
	});
};



function book_hotel(park) {
	console.log(`Loading hotel purchase url for park:${park}`);

	swal({
		title: "Just searching for the best booking site",
		text: "",
		imageUrl: "/img/ajax-loading.gif",
		showCancelButton: false,
		showConfirmButton: false
	});

	$.get(`/mobileapi/parks/${park}/hotels/buy`, function(result) {
		console.log(result);
		if (result.status) {
			console.log("Success!");
			if (result.affiliate) {
				console.log("Affiliate, showing disclaimer and redirecting");
				swal({
                			title: `Sending you to our partner, ${result.affiliate_name}`,
                			text: "Just a second",
        			        imageUrl: "/img/ajax-loading.gif",
        				showCancelButton: false,
				        showConfirmButton: false
				});
				setTimeout(function() {
					location.href=result.url;
				},2000);
			} else {
				console.log("Not affiliate, redirecting");
				location.href=result.url;
			};
		} else {
			console.log("Status false");
			console.log(result);
			swal({
				title: "Oops!",
				text: "Sorry but something went wrong, please try again",
				type: "error",
				cancelButtonText: "Close",
				showCancelButton: true,
				showConfirmButton: false
			});
		};
	}).fail(function(error) {
		console.log("Network failure");
		console.log(error);
		swal({
			title: "Oops!",
			text: "Sorry but there was a network error, please check your connection and try again",
			type: "error",
			cancelButtonText: "Close",
			showCancelButton: true,
			showConfirmButton: false
		});
	});
};
