<?php

require 'vendor/autoload.php';
require 'settings.php';

// Using Medoo namespace
use Medoo\Medoo;

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// Initialize
$player = [
	'firstname' => $_POST["firstname"],
	'lastname'  => $_POST["lastname"],
	'email'     => $_POST["email"],
	'winner'    => $_POST["winner"],
	'prize'     => $_POST["prize"],
];

$db_hetzner_credentials = [
	'database_type' => 'mysql',
	'database_name' => env( 'HTZ_DB_NAME' ),
	'server'        => env( 'HTZ_DB_HOST' ),
	'username'      => env( 'HTZ_DB_USER' ),
	'password'      => env( 'HTZ_DB_PASSWORD' ),
	'prefix'        => env( 'HTZ_DB_PREFIX' ),
];

$database         = parse_url( getenv( 'DATABASE_URL' ) );
$database['path'] = ltrim( $database['path'], '/' );

$db_heroku_postgresql_credentials = [
	'database_type' => 'pgsql',
	'database_name' => $database['path'],
	'server'        => $database['host'],
	'username'      => $database['user'],
	'password'      => $database['pass'],
	'port'          => $database['port'],
	'prefix'        => 'bid2stay_',
];

if ( isset( $player['email'] ) && ! empty( $player['email'] ) ) {

	$database_hetzner = new Medoo( $db_hetzner_credentials );
	$database_heroku  = new Medoo( $db_heroku_postgresql_credentials );

	$database_heroku->insert( 'contestants', $player );
	$database_hetzner->insert( 'contestants', $player );

	$player_prize = '';

	switch ( $player['prize'] ) {
		case "NightStay":
			$player_prize = 'a 1 x Night Stay for 2!';
			break;
		case "Breakfast":
			$player_prize = 'a Free Breakfast for 2!';
			break;
		case "300Points":
			$player_prize = '300 Reward Points!';
			break;
		case "PillowSet":
			$player_prize = 'a Pillow Set!';
			break;
		case "WildCard":
			$player_prize = 'a Wild Card Prize!';
			break;
		case "TryAgain":
			$player_prize = false;
			break;
	}

	if ( $player_prize ) {

		$mail = new PHPMailer;

		try {
			$message = file_get_contents( 'template-parts/email.html' );
			$message = str_replace( '%firstname%', $player['firstname'], $message );
			$message = str_replace( '%prize%', $player_prize, $message );

			//Server settings
			$mail->IsSMTP();                                      // Set mailer to use SMTP
			$mail->Host       = 'smtp.mandrillapp.com';                 // Specify main and backup server
			$mail->Port       = 587;                                    // Set the SMTP port
			$mail->SMTPAuth   = true;                               // Enable SMTP authentication
			$mail->Username   = 'mandrill@digitlab.co.za';                // SMTP username
			$mail->Password   = 'kfCu6nkMhDZKxMtcBVQ2Ag';                  // SMTP password
			$mail->SMTPSecure = 'tls';                            // Enable

			//Recipients
			$mail->setFrom( 'noreply@stagebid2stay.co.za', 'Bid2Stay' );
			$mail->addAddress( $player['email'], $player['firstname'] );     // Add a recipient

			//Content
			$mail->isHTML( true );                                  // Set email format to HTML
			$mail->Subject = $player['firstname'] . ', you stand a chance to win ' . $player_prize;
			$mail->Body    = $message;

			$mail->send();

			echo 'Message has been sent to ' . $player['firstname'] . ' at ' . $player['email'];
		} catch ( Exception $e ) {
			echo 'Message could not be sent. Mailer Error: ', $mail->ErrorInfo;
		}
	}
}
