<?php
header('Content-Type: text/html; charset=utf-8');
define( 'ROOT_DIR', '/home/i/ivbakiu6/ivbakiu6.beget.tech/public_html/marina.dudnik/api' );
function autoloader( $class ) {
	$dirs = array (
		"controllers"
	);
	$fineded = false;
	foreach ( $dirs as $dir )
	{
		if ( file_exists( ROOT_DIR . "/" . $dir . "/" . $class . ".class.php" ) )
		{
			$fineded = true;
			@include ROOT_DIR . "/" . $dir . "/" . $class . ".class.php";
		}
	}
	if(!$fineded)
		return json_encode(['success' => false, 'error' => 'error_method']);
}

spl_autoload_register('autoloader');

if(preg_match("/\?/", $_SERVER['REQUEST_URI']))
	$_SERVER['REQUEST_URI'] = preg_replace("/\?.*/", '', $_SERVER['REQUEST_URI']);

$path = explode('/', $_SERVER['REQUEST_URI']);


$path[3] = preg_replace("/\W/", '', $path[3]);
$method = $path[3];
$do = new $method();
echo $do->index();

