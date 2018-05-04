<?php
/**
 * Created by PhpStorm.
 * User: leogopal
 * Date: 4/20/18
 * Time: 2:15 PM
 */

require dirname(__FILE__) . '/vendor/autoload.php';

$root_dir = dirname(__FILE__);

/**
 * Expose global env() function from oscarotero/env
 */
Env::init();

/**
 * Use Dotenv to set required environment variables and load .env file in root
 */
$dotenv = new Dotenv\Dotenv($root_dir);

if (file_exists($root_dir . '/.env')) {
	$dotenv->load();

	$dotenv->required([
		'HTZ_DB_NAME',
		'HTZ_DB_USER',
		'HTZ_DB_PASSWORD',
		'HTZ_DB_HOST',
		'HTZ_DB_PREFIX',
		'HK_PGDB_NAME',
		'HK_PGDB_USER',
		'HK_PGDB_PASSWORD',
		'HK_PGDB_HOST',
		'HK_PGDB_PREFIX',
		'HK_PGDB_PASSWORD',
		'HK_PGDB_PORT',
		'MANDRILL_SMTP_HOST',
		'MANDRILL_SMTP_PORT',
		'MANDRILL_SMTP_USER',
		'MANDRILL_SMTP_PASSWORD',
		'FB_APP_ID',
		'FB_APP_SECRET'
	]);
}