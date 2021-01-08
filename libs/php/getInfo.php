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

    //sixth API: RESTcountries country data

    $url='https://restcountries.eu/rest/v2/alpha/' . $_REQUEST['country'] . '?fields=currencies;languages;flag;';
  
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_URL,$url); 
 
    $result=curl_exec($ch);
 
    curl_close($ch); 
 
    $restCountry = json_decode($result,true);
 
    //end of API6

    //seventh API: OpenExchangeRates Exchange data

    $url='https://openexchangerates.org/api/latest.json?app_id=d1a8e86f1e9348d691cdbe1294e7cba6';

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_URL,$url); 
 
    $result=curl_exec($ch);
 
    curl_close($ch); 
 
    $exData = json_decode($result,true);
 
    //end of API7

    //eighth API: Openweathermap UV data

    $url='https://api.openweathermap.org/data/2.5/onecall?lat=' . $_REQUEST['coord1'] . '&lon=' . $_REQUEST['coord2'] . '&exclude=minutely,hourly,alerts&appid=ffaafdda5ec4e11d960fa30a9bb680ab';
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_URL,$url); 
 
    $result=curl_exec($ch);
 
    curl_close($ch); 
 
    $UVAndForecastData = json_decode($result,true);
 
    //end of API8

    //ninth API: COVID data

    $url='https://corona-api.com/countries/' . $_REQUEST['country'];
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_URL,$url); 
 
    $result=curl_exec($ch);
 
    curl_close($ch); 
 
    $covid = json_decode($result,true);
 
    //end of API9

    //tenth API: geonames earthquake data

    $url='http://api.geonames.org/earthquakesJSON?north=' . $_REQUEST['north'] . '&south=' . $_REQUEST['south'] . '&east=' . $_REQUEST['east'] . '&west=' . $_REQUEST['west'] . '&username=davidfish&maxRows=500';
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_URL,$url); 
 
    $result=curl_exec($ch);
 
    curl_close($ch); 
 
    $earthquake = json_decode($result,true);
 
    //end of API10

    //eleventh API: geonames city data

    $url='http://api.geonames.org/searchJSON?country=' . $_REQUEST['country'] . '&maxRows=10&featureClass=P&orderby=population&username=davidfish';
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_URL,$url); 
 
    $result=curl_exec($ch);
 
    curl_close($ch); 
 
    $city = json_decode($result,true);
 
    //end of API11

    //twelfth API: pixabay pics

    $url='https://pixabay.com/api/?key=19790228-8504cc9c504fc1a55e52d1ac6&q=' . $_REQUEST['city'] . '&image_type=photo&orientation=horizontal&safesearch=true&per_page=3';
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_URL,$url); 
 
    $result=curl_exec($ch);
 
    curl_close($ch); 
 
    $pics = json_decode($result,true);
 
    //end of API12


    

    
    

    $output['status']['code'] = "200";
    $output['status']['name'] = "ok";
    $output['status']['description'] = "success";
    $output['status']['executedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
    $output['data']['countryInfo'] = $countryInfo;
    $output['data']['neighbours'] = $neighbours;
    $output['data']['cap'] = $capital;
    $output['data']['weather'] = $weather;
    $output['data']['UVAndForecastData'] = $UVAndForecastData;
    $output['data']['restCountry'] = $restCountry;
    $output['data']['earthquake'] = $earthquake;
    $output['data']['exData'] = $exData['rates'];
    $output['data']['borders'] = $country;
    $output['data']['covid'] = $covid;
    $output['data']['city'] = $city;
    $output['data']['pics'] = $pics;
    

    header('Content-Type: application/json; charset=UTF-8');

  echo json_encode($output);

?>