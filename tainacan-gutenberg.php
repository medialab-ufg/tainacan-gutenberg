<?php
/*
Plugin Name:  Tainacan Gutenberg Blocks
Plugin URI:   https://github.com/medialab-ufg/tainacan-gutenberg
Description:  Agrega blocos do Tainacan Repositório ao Gutenberg
Version:      0.00
Author:       Weryques S. Silva
Author URI:   https://github.com/Weryques
License:      ''
License URI:  ''
Text Domain:  ''
Domain Path:  ''
*/

defined('ABSPATH') or die('No script kiddies please!');

include_once( ABSPATH . 'wp-admin/includes/plugin.php' );
require_once('tainacan-gutenberg-blocks.php');

$TG__blocks = new TAINACAN_GUTENBERG__Blocks();

?>