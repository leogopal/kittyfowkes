<?php
/**
 * Created by PhpStorm.
 * User: leogopal
 * Date: 4/27/18
 * Time: 11:05 AM
 */
?>      </div><!-- Close Flexbox -->

        <div id="facebook-login-dialog" class="zoom-anim-dialog mfp-hide">
            <h3>Connect to Play</h3>
            <p>Connect with Facebook in order to play.</p>
            <div id="facebook-status"></div>
            <div class="fb-login-button" data-max-rows="1" data-size="large" data-button-type="continue_with" data-show-faces="false" data-auto-logout-link="false" data-use-continue-as="true" scope="public_profile,email" onlogin="checkLoginState();"></div>
        </div>

        <script>
            // This function is called when someone finishes with the Login
            // Button. See the onlogin handler attached to it in the sample
            // code below.
            function checkLoginState() {
            	console.log('login callback function.');
                FB.getLoginStatus(function (response) {
	                if (response.status === 'connected') {

	                	FB.api('/me', {fields: 'name,first_name,email'}, function (data) {
			                var welcomeBlock = document.getElementById('facebook-status');
			                welcomeBlock.innerHTML = '<p>Welcome <strong>' + data.first_name + '</strong> you may now play!</p>';
		                });

		                setTimeout(function(){
			                $.magnificPopup.close();
                        }, 4000);

	                }
                });
            }
        </script>

        <!-- Load jQuery -->
        <script src="assets/js/plugins/jquery-3.3.1.min.js"></script>
        <script src='assets/js/plugins/TweenMax.min.js'></script>
        <script src='assets/js/plugins/Draggable.min.js'></script>
        <script src='assets/js/plugins/ThrowPropsPlugin.min.js'></script>
        <script src='assets/js/plugins/TextPlugin.min.js'></script>
        <script src='assets/js/plugins/js.cookie.js'></script>
        <script src='assets/js/plugins/magnific-popup.min.js'></script>
        <script src='assets/js/wheel-behavior.js'></script>
        <script src="assets/js/main.js"></script>

    </body>
</html>
