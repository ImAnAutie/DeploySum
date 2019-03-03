appconfig={};
appconfig.app_full_name="ParkPlanr";
//cms content id for GDPR/Privacy policy
appconfig.privacydocid="iplPavcsXKPhyMELre4U";
appconfig.privacypolicyversion="1.0.0";
appconfig.indexdocid="giApgG7x3OruN0dqRp41";
appconfig.notfounddocid="d7JQOC3cPr1ZRKbqsV42";
appconfig.aboutdocid="ucoDlMCiqVKdKciXNo5V";


window.addEventListener("popstate", function(event){
	console.log(event);
	pushstate(event.state,"",location.href,true);
});

function set_page_content(title,h1title,boxtitle,small,html) {
	if (!h1title) {
		h1title=title;
	};
	if (!boxtitle) {
		boxtitle=h1title;
	};
	$('#main_box').find('.box-title').text(boxtitle);
	$('title').text(title);
	$('.content-header').find('h1').find('small').text(small);
	small_html=$('.content-header').find('h1').find('small').wrap('<div/>').parent().html();
	$('.content-header').find('h1').text(h1title);
	$('.content-header').find('h1').append(small_html);
	$('#main_box').find('.box-body').html(html);
};

function load_cms_page(docid) {
	var docRef = db.collection("cms_content").doc(docid);
	docRef.get().then(function(pagedoc) {
		if (pagedoc.exists) {
			console.log("Document data:", pagedoc.data());
			set_page_content(pagedoc.data().title,null,null,"",pagedoc.data().html);
		} else {
			// pagedoc.data() will be undefined in this case
			console.log("No such page document!");
		};
	}).catch(function(error) {
		console.log("Error getting page document:", error);
		alert("Sorry something went wrong. (#PAGEFETCHFAIL)");
		location.reload();
	});
};

function onclick_page(atag) {
	url=$(atag).attr('href');
	console.log(url);
	pushstate(null,appconfig.app_full_name,url,false);
	return false;
};

function pushstate(state,title,url,eventonly) {
	$('title').text(title);

	//event only skips the actual history.pushState, used for running the page logic on load
	if (!eventonly) {
		console.log("Pushing state");
		history.pushState(state,title,url);
	};

	stateurl=location.href.split('/');
	console.log(stateurl);
	stateurl.splice(0,3);
	console.log(stateurl);

	switch (stateurl[0]) {
		// /privacy
		case "privacy":
			console.log("Loading privacy policy page");
			load_cms_page(appconfig.privacydocid);
			break;
			// /
		case "about":
			console.log("Loading about page");
			load_cms_page(appconfig.aboutdocid);
			break;
		case "discountcalculator":
			console.log("Loading discount calculator");
			set_page_content("Discount Calculator",null,null,"Quickly calculate discounts",Template7.compile($('#page_discountcalculator_template').html())());
			break;
		case "":
			console.log("Loading index page");
			load_cms_page(appconfig.indexdocid);
			break;
		default:
			//lookup state url in slug, OR search for stateurl[0].stateurl[0]/stateurl[1] etc... up to the entire stateurl
			console.log("Loading 404 page");
			load_cms_page(appconfig.notfounddocid);
			break;
	};
};


$(document).ready(function() {
	pushstate({},"",location.href,true);
});



firebase.auth().onAuthStateChanged(function(user) {
	$('.show_if_signed_in').hide();
	$('.show_if_admin').hide();
	$('.show_if_map_vip').hide();

	if (user) {
		console.log("Signed in!");

		$('.show_if_signed_in').show();
		$('.show_if_admin').show();

		firebase.auth().currentUser.getIdTokenResult().then((idTokenResult) => {
			// Confirm the user is an Admin.
			if (!!idTokenResult.claims.admin) {
				console.log("Showing admin ui");
				$('.show_if_admin').show();
			}
		}).catch((error) => {
			console.log(error);
		});
	};
});


function page_discountcalculator_discount(percentage) {
	full_price=$('#page_discountcalculator_fullprice').val();
	discount_amount=((full_price/100)*percentage).toFixed(2);
	discounted_price=(full_price-discount_amount).toFixed(2);
	console.log(full_price,discount_amount,discounted_price);

	$('.page_discountcalculator_result_full_price').text(full_price);
	$('.page_discountcalculator_result_percentage').text(percentage);
	$('.page_discountcalculator_result_discounted_price').text(discounted_price);
	$('.page_discountcalculator_result_discount_amount').text(discount_amount);
	$('#page_discountcalculator_input').hide();
	$('#page_discountcalculator_output').show();
};

function page_discountcalculator_switch_to_input() {
	$('#page_discountcalculator_input').show();
	$('#page_discountcalculator_output').hide();
};
