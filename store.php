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

$database         = parse_url( getenv( 'DATABASE_URL' ) );
$database['path'] = ltrim( $database['path'], '/' );

$db_heroku_postgresql_credentials = [
	'database_type' => 'pgsql',
	'database_name' => $database['path'],
	'server'        => $database['host'],
	'username'      => $database['user'],
	'password'      => $database['pass'],
	'port'          => $database['port'],
	'prefix'        => 'kitty_',
];

if ( isset( $player['email'] ) && ! empty( $player['email'] ) ) {
	$database_heroku  = new Medoo( $db_heroku_postgresql_credentials );

	$database_heroku->insert( 'decisions', $player );
}
