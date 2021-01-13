<?php

    $executionStartTime = microtime(true);

    //Weather API: Openweathermap Weather Data

    $url='https://api.openweathermap.org/data/2.5/weather?lat=' . $_REQUEST['coord1'] . '&lon=' . $_REQUEST['coord2'] . '&appid=ffaafdda5ec4e11d960fa30a9bb680ab';
  
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_URL,$url); 
 
    $result=curl_exec($ch);
 
    curl_close($ch); 
 
    $weather = json_decode($result,true);
 
    //end of API

    //UV and Forecast API: Openweathermap UV Data

    $url='https://api.openweathermap.org/data/2.5/onecall?lat=' . $_REQUEST['coord1'] . '&lon=' . $_REQUEST['coord2'] . '&exclude=minutely,hourly,alerts&appid=ffaafdda5ec4e11d960fa30a9bb680ab';
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_URL,$url); 
 
    $result=curl_exec($ch);
 
    curl_close($ch); 
 
    $UVAndForecastData = json_decode($result,true);
 
    //end of API

    $output['status']['code'] = "200";
    $output['status']['name'] = "ok";
    $output['status']['description'] = "success";
    $output['status']['executedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
    $output['data']['weather'] = $weather;
    $output['data']['UVAndForecastData'] = $UVAndForecastData;

    header('Content-Type: application/json; charset=UTF-8');

  echo json_encode($output);

?>