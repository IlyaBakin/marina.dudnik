<?php

class getAddress
{
	private $KEY = 'AIzaSyAmOKz_5rJHIr_KRrSCHzAHHBj43h07AJU';
	private $url = 'https://maps.googleapis.com/maps/api/place/autocomplete/json';

	function __construct( )
	{
		# code...
	}

	public function index()
	{
		$add = trim($_GET['addr']);
		if ( strlen($add) === 0 )
			return json_encode(['success' => false, 'error' => 'empty_query']);

		$getPar = [

			'input' 		=> $add ,
			'key' 			=> $this->KEY ,
			'language' 		=> 'ru' ,
			'components' 	=> 'country:ru' ,

		];

		$info = $this->curl(['url' => $this->url, 'params' => $getPar ]);

		if ( !$info )
			return json_encode(['success' => false, 'error' => 'request_error']);

		$info = json_decode($info, 1 );

		if( count($info['predictions']) === 0 )
			return json_encode(['success' => false, 'error' => 'empty_result'] );

		$places = [];
		foreach ($info['predictions'] as $key => $value) {

			$places[] = $value['description'];

			$logData = [
				'query' 	=> $add ,
				'result'	=> $value['description'] ,
				'date'		=> date('Y-m-d H:i:s')
			];
			$this->log( $logData );


		}

		return json_encode( [ 'success' => true, 'data' => $places ] );

	}
	private function log( Array $data )
	{
		$mysqli = new mysqli('localhost', 'ivbakiu6_marinad', 'ZRiFN2e&', 'ivbakiu6_marinad');

		if ( $mysqli->connect_errno )
		    return false;

		$fileds = '';
		$values = '';
		foreach ($data as $key => $value) {

			$key = $mysqli->real_escape_string($key);
			$value = $mysqli->real_escape_string($value);

			$fileds .= "`$key`,";
			$values .= "'$value',";

		}
		$fileds = substr($fileds, 0, -1 );
		$values = substr($values, 0, -1 );

		if( $mysqli->query("INSERT INTO google_addr_log ( $fileds ) VALUES ( $values ) " ) ) 
			return true;
		else
			return false;


	}
	private function curl( Array $params )
	{
		$ch = curl_init();
		if ( isset($params['method']) AND $params['method'] == 'POST' )
		{
			curl_setopt($ch, CURLOPT_POST, 1);
			curl_setopt($ch, CURLOPT_POSTFIELDS, $params['params'] );
		}
		if( isset($params['params']) AND count( $params['params']) > 0 )
		{
			$params['url'] .= '?'.http_build_query( $params['params'] );
		}

		curl_setopt($ch, CURLOPT_URL, $params['url']);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);

		$d = curl_exec($ch);
		$info = curl_getinfo($ch);

		curl_close($ch);

		if ( $info['http_code'] === 200 )
		{
			return $d;
		} else {
			return false;
		}

	}
}