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

    //Country API: Geonames CountryInfo

    $url='http://api.geonames.org/countryInfoJSON?country=' . $_REQUEST['country'] . '&username=davidfish';
  
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_URL,$url); 

    $result=curl_exec($ch);

    curl_close($ch); 

    $countryInfo = json_decode($result,true);

    //end of API

    //Neighbours API: Geonames Neighbours

    $url='http://api.geonames.org/neighboursJSON?country=' . $_REQUEST['country'] . '&username=davidfish';
  
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_URL,$url); 

    $result=curl_exec($ch);

    curl_close($ch); 

    $neighbours = json_decode($result,true);

    //end of API

    //Another Country API: RESTcountries Country Data

    $url='https://restcountries.eu/rest/v2/alpha/' . $_REQUEST['country'] . '?fields=currencies;languages;flag;';
  
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_URL,$url); 
 
    $result=curl_exec($ch);
 
    curl_close($ch); 
 
    $restCountry = json_decode($result,true);
 
    //end of API

    //Exchange Rate API: OpenExchangeRates Exchange data

    $url='https://openexchangerates.org/api/latest.json?app_id=d1a8e86f1e9348d691cdbe1294e7cba6';

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_URL,$url); 
 
    $result=curl_exec($ch);
 
    curl_close($ch); 
 
    $exData = json_decode($result,true);
 
    //end of API

    //Covid API: COVID data

    $url='https://corona-api.com/countries/' . $_REQUEST['country'];
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_URL,$url); 
 
    $result=curl_exec($ch);
 
    curl_close($ch); 
 
    $covid = json_decode($result,true);
 
    //end of API

    //eleveCitynth API: Geonames City Data

    $url='http://api.geonames.org/searchJSON?country=' . $_REQUEST['country'] . '&maxRows=10&featureClass=P&orderby=population&username=davidfish';
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_URL,$url); 
 
    $result=curl_exec($ch);
 
    curl_close($ch); 
 
    $city = json_decode($result,true);
 
    //end of API

    $output['status']['code'] = "200";
    $output['status']['name'] = "ok";
    $output['status']['description'] = "success";
    $output['status']['executedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
    $output['data']['countryInfo'] = $countryInfo;
    $output['data']['neighbours'] = $neighbours;
    $output['data']['restCountry'] = $restCountry;
    $output['data']['exData'] = $exData['rates'];
    $output['data']['borders'] = $country;
    $output['data']['covid'] = $covid;
    $output['data']['city'] = $city;

    header('Content-Type: application/json; charset=UTF-8');

  echo json_encode($output);

?>