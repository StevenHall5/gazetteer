<?php

    $executionStartTime = microtime(true);

    //Capital API: geocage capital data

    $url='https://api.opencagedata.com/geocode/v1/json?q=' . $_REQUEST['capital'] . '&key=cb5c72b0cff847b59e1d61c6fc5b4a45&limit=1';
  
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_URL,$url); 

    $result=curl_exec($ch);

    curl_close($ch); 

    $capital = json_decode($result,true);

    //end of API

    $output['status']['code'] = "200";
    $output['status']['name'] = "ok";
    $output['status']['description'] = "success";
    $output['status']['executedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
    $output['data']['cap'] = $capital;

    header('Content-Type: application/json; charset=UTF-8');

  echo json_encode($output);

?>