<?php

    $executionStartTime = microtime(true);

    $countryData = json_decode(file_get_contents("../js/countryBorders.geo.json"), true);

    $country = [];

    foreach ($countryData['features'] as $feature) {

		$temp = null;

		$temp['code'] = $feature["properties"]['iso_a2'];

    $temp['name'] = $feature["properties"]['name'];
    
    $temp['geo'] = $feature['geometry'];

		array_push($country, $temp);

    }

    usort($country, function ($item1, $item2) {

        return $item1['name'] <=> $item2['name'];

    });

    //first API: geonames countryCode

    $url='http://api.geonames.org/countryCodeJSON?lat=' . $_REQUEST['myLat'] . '&lng=' . $_REQUEST['myLong'] . '&username=davidfish';
  
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_URL,$url); 

    $result=curl_exec($ch);

    curl_close($ch); 

    $countryCode = json_decode($result,true);

    //end of API1

    //second API: geonames countryInfo

    $url='http://api.geonames.org/countryInfoJSON?country=' . $_REQUEST['country'] . '&username=davidfish';
  
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_URL,$url); 

    $result=curl_exec($ch);

    curl_close($ch); 

    $countryInfo = json_decode($result,true);

    //end of API2

    //third API: geonames neighbours

    $url='http://api.geonames.org/neighboursJSON?country=' . $_REQUEST['country'] . '&username=davidfish';
  
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_URL,$url); 

    $result=curl_exec($ch);

    curl_close($ch); 

    $neighbours = json_decode($result,true);

    //end of API3

    //fourth API: geocage capital data

    $url='https://api.opencagedata.com/geocode/v1/json?q=' . $_REQUEST['capital'] . '&key=cb5c72b0cff847b59e1d61c6fc5b4a45&limit=1';
  
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_URL,$url); 

    $result=curl_exec($ch);

    curl_close($ch); 

    $capital = json_decode($result,true);

    //end of API4

    //fifth API: openweathermap weather data

    $url='https://api.openweathermap.org/data/2.5/weather?lat=' . $_REQUEST['coord1'] . '&lon=' . $_REQUEST['coord2'] . '&appid=ffaafdda5ec4e11d960fa30a9bb680ab';
  
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_URL,$url); 
 
    $result=curl_exec($ch);
 
    curl_close($ch); 
 
    $weather = json_decode($result,true);
 
    //end of API5
    

    $output['status']['code'] = "200";
    $output['status']['name'] = "ok";
    $output['status']['description'] = "success";
    $output['status']['executedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
    $output['data']['countryCode'] = $countryCode;
    $output['data']['countryInfo'] = $countryInfo;
    $output['data']['neighbours'] = $neighbours;
    $output['data']['cap'] = $capital;
    $output['data']['weather'] = $weather;
    $output['data']['borders'] = $country;
    

    header('Content-Type: application/json; charset=UTF-8');

  echo json_encode($output);

?>