<?php

    $executionStartTime = microtime(true);

    //News API: API News

    $url='https://newsapi.org/v2/everything?q=+' . $_REQUEST['city'] . '&apiKey=3b861698a00e4f9389c830084ebd0fe0&pageSize=5';
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_URL,$url); 
 
    $result=curl_exec($ch);
 
    curl_close($ch); 
 
    $news = json_decode($result,true);
 
    //end of API

    $output['status']['code'] = "200";
    $output['status']['name'] = "ok";
    $output['status']['description'] = "success";
    $output['status']['executedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
    $output['data']['news'] = $news;
    
    header('Content-Type: application/json; charset=UTF-8');

  echo json_encode($output);

?>