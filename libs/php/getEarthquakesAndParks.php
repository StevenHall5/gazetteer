<?php

    $executionStartTime = microtime(true);

    //Earthquake API: Geonames Earthquake Data

    $url='http://api.geonames.org/earthquakesJSON?north=' . $_REQUEST['north'] . '&south=' . $_REQUEST['south'] . '&east=' . $_REQUEST['east'] . '&west=' . $_REQUEST['west'] . '&username=davidfish&maxRows=500';
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_URL,$url); 
 
    $result=curl_exec($ch);
 
    curl_close($ch); 
 
    $earthquake = json_decode($result,true);
 
    //end of API

    //National Parks API: OpenTripMap Parks Data

    $url='https://api.opentripmap.com/0.1/en/places/bbox?lon_min=' . $_REQUEST['west'] . '&lat_min=' . $_REQUEST['south'] . '&lon_max=' . $_REQUEST['east'] . '&lat_max=' . $_REQUEST['north'] . '&kinds=national_parks&limit=20&apikey=5ae2e3f221c38a28845f05b6eab36615569b4c3842a96ab45cf511a8';
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_URL,$url); 
 
    $result=curl_exec($ch);
 
    curl_close($ch); 
 
    $park = json_decode($result,true);
 
    //end of API

    $output['status']['code'] = "200";
    $output['status']['name'] = "ok";
    $output['status']['description'] = "success";
    $output['status']['executedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
    $output['data']['earthquake'] = $earthquake;
    $output['data']['park'] = $park;
  
    header('Content-Type: application/json; charset=UTF-8');

  echo json_encode($output);

?>