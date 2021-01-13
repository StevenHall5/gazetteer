<?php

    $executionStartTime = microtime(true);

    //Picture API: pixabay pics

    $url='https://pixabay.com/api/?key=19790228-8504cc9c504fc1a55e52d1ac6&q=' . $_REQUEST['city'] . '&image_type=photo&orientation=horizontal&safesearch=true&per_page=5';
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_URL,$url); 
 
    $result=curl_exec($ch);
 
    curl_close($ch); 
 
    $pics = json_decode($result,true);
 
    //end of API

    $output['status']['code'] = "200";
    $output['status']['name'] = "ok";
    $output['status']['description'] = "success";
    $output['status']['executedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
    $output['data']['pics'] = $pics;

    header('Content-Type: application/json; charset=UTF-8');

  echo json_encode($output);

?>