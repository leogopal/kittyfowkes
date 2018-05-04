//Usage
// A $( document ).ready() block.
jQuery(document).ready(function ($) {

	var mySpinBtn = document.querySelector('.spin-wheel');
	var numSpinsRemaining = 4;
	var spinCountBadge = $("span.spin-count");

	//create a new instance of Spin2Win Wheel and pass in the vars object
	var myWheel = new Spin2WinWheel();

	if (Cookies.get('bid2stay-spin-count')) {
		numSpinsRemaining = Cookies.get('bid2stay-spin-count');
	}

	// Load the SDK asynchronously
	(function (d, s, id) {
		var js, fjs = d.getElementsByTagName(s)[0];
		if (d.getElementById(id)) return;
		js = d.createElement(s);
		js.id = id;
		js.src = "https://connect.facebook.net/en_US/sdk.js";
		fjs.parentNode.insertBefore(js, fjs);
	}(document, 'script', 'facebook-jssdk'));

	// This is called with the results from from FB.getLoginStatus().
	function statusChangeCallback(response) {
		console.log('statusChangeCallback');
		console.log(response);
		// The response object is returned with a status field that lets the
		// app know the current login status of the person.
		// Full docs on the response object can be found in the documentation
		// for FB.getLoginStatus().
		if (response.status === 'connected') {
			// Logged into your app and Facebook.
			testAPI();
		} else {
			loginToFacebook(response);
		}
	}

	// This function is called when someone finishes with the Login
	// Button.  See the onlogin handler attached to it in the sample
	// code below.
	function checkLoginState() {
		console.log('login callback function.');
		FB.getLoginStatus(function (response) {
			if (response.status === 'connected') {

				FB.api('/me', {fields: 'name,first_name,email'}, function (data) {
					var welcomeBlock = document.getElementById('facebook-status');
					welcomeBlock.innerHTML = '<p>Welcome <strong>' + data.first_name + '</strong> you may now play!</p>';
				});

				setTimeout(function () {
					$.magnificPopup.close();
				}, 4000);

			}
		});
	}

	window.fbAsyncInit = function () {
		FB.init({
			appId: '2067015103536556',
			cookie: true,  // enable cookies to allow the server to access
		                   // the session
			xfbml: true,  // parse social plugins on this page
			version: 'v2.8' // use graph api version 2.8
		});

		// Now that we've initialized the JavaScript SDK, we call
		// FB.getLoginStatus().  This function gets the state of the
		// person visiting this page and can return one of three states to
		// the callback you provide.  They can be:
		//
		// 1. Logged into your app ('connected')
		// 2. Logged into Facebook, but not your app ('not_authorized')
		// 3. Not logged into Facebook and can't tell if they are logged into
		//    your app or not.
		//
		// These three cases are handled in the callback function.

		FB.getLoginStatus(function (response) {
			statusChangeCallback(response);
		});

	};

	// Here we run a very simple test of the Graph API after login is
	// successful.  See statusChangeCallback() for when this call is made.
	function testAPI() {
		console.log('Welcome!  Fetching your information.... ');
		FB.api('/me', {fields: 'name, first_name, email'}, function (response) {
			console.log('Successful login for: ' + response.name);
		});
	}

	function onLogin(response) {
		if (response.status == 'connected') {
			$.magnificPopup.close();
			console.log('onlogin callback');
			FB.api('/me', {fields: 'name, first_name, email'}, function (data) {
				var welcomeBlock = document.getElementById('fb-welcome');
				welcomeBlock.innerHTML = 'Hello, ' + data.first_name + '!';
			});
		}
	}

	console.log("i am so ready ready ready!");

	function loginToFacebook(response) {
		$.magnificPopup.open({
			items: {
				src: '#facebook-login-dialog'
			},
			type: 'inline',

			fixedContentPos: false,
			fixedBgPos: true,

			overflowY: 'auto',

			closeBtnInside: false,
			preloader: false,

			modal: true,

			midClick: true,
			removalDelay: 300,
			mainClass: 'my-mfp-zoom-in'
		});

		FB.login(function (response) {
			checkLoginState();
		}, {scope: 'public_profile,email'});
	}


//load your JSON (you could jQuery if you prefer)
	function loadJSON(callback) {

		var xobj = new XMLHttpRequest();
		xobj.overrideMimeType("application/json");
		xobj.open('GET', './config/wheel-settings.json', true);
		xobj.onreadystatechange = function () {
			if (xobj.readyState == 4 && xobj.status == "200") {
				//Call the anonymous function (callback) passing in the response
				callback(xobj.responseText);
			}
		};
		xobj.send(null);
	}

// your own function to capture the spin results
	function myResult(e) {
		//e is the result object
		console.log('Spin Count: ' + e.spinCount + ' - ' + 'Win: ' + e.win + ' - ' + 'Message: ' + e.msg);
		numSpinsRemaining = numSpinsRemaining - 1;
		spinCountBadge.text(numSpinsRemaining);

		//e is gameResultsArray
		Cookies.set('bid2stay-spin-count', numSpinsRemaining, {
			expires: 1,
			domain: document.location.hostname,
			path: '/',
			secure: false
		});

		// if you have defined a userData object...
		if (e.userData) {

			console.log('User defined score: ' + e.userData.score);
			console.log('User defined prize: ' + e.userData.userPrize);

		}

		console.log(e);

		FB.api('/me', {fields: 'name,first_name,last_name,email'}, function (fbresponse) {
			var participant = {};

			console.log('Successful login for: ' + fbresponse.name);
			// document.getElementById('spinBtn').innerHTML = response.first_name + ', Click to Spin';
			participant.first_name = fbresponse.first_name;
			participant.email = fbresponse.email;
			console.log('Participant Created ' + participant.email);

			jQuery.ajax({
				type: "POST",
				url: "./store.php",
				data: {
					firstname: fbresponse.first_name,
					lastname: fbresponse.last_name,
					email: fbresponse.email,
					winner: e.win,
					prize: e.userData.userPrize
				},
				success: function (data, response) {
					console.log(data);
					console.log('it works!');
					console.log(response);
				},
				fail: function (response) {
					console.log(response);
					console.log('I dont work!');
				}
			});

		});

		if (numSpinsRemaining < 1) {
			myWheel.onMaxSpinsReached();
		}


		//if(e.spinCount == 3){
		//show the game progress when the spinCount is 3
		//console.log(e.target.getGameProgress());
		//restart it if you like
		//e.target.restart();
		//}

	}

//your own function to capture any errors
	function myError(e) {
		//e is error object
		console.log('Spin Count: ' + e.spinCount + ' - ' + 'Message: ' + e.msg);

	}

	function myGameEnd(e) {

		//e is gameResultsArray
		Cookies.set('bid2stay', 'game-played', {
			expires: 1,
			domain: document.location.hostname,
			path: '/',
			secure: false
		});

		mySpinBtn.disabled = true;

		console.log(e);
		TweenMax.delayedCall(5, function () {

			FB.ui({
				method: 'apprequests',
				message: 'Spin the wheel and you could stand a chance to win with Bid2Stay!',
				title: 'Invite your friends to stand a chance to win'
			}, function (fbappresponse) {
				console.log(fbappresponse);
			});

		})


	}

	function init() {
		loadJSON(function (response) {
			// Parse JSON string to an object
			var jsonData = JSON.parse(response);

			//WITH your own button
			myWheel.init({
				data: jsonData,
				onResult: myResult,
				onGameEnd: myGameEnd,
				onError: myError,
				spinTrigger: mySpinBtn
			});

			spinCountBadge.text(numSpinsRemaining);

			if (Cookies.get('bid2stay') || (numSpinsRemaining == 0 || numSpinsRemaining == '0')) {
				spinCountBadge.text('0');
				console.log('already played max');
				mySpinBtn.disabled = true;
				myWheel.playedEnough();

				FB.ui({
					method: 'apprequests',
					message: 'Spin the wheel and you could stand a chance to win with Bid2Stay!',
					title: 'Invite your friends to stand a chance to win'
				}, function (fbappresponse) {
					console.log(fbappresponse);
				});
			}

			//WITHOUT your own button
			// myWheel.init({data:jsonData, onResult:myResult, onGameEnd:myGameEnd, onError:myError});
		});
	}


// And finally call it
	init();

})
;


