<?php

session_start();

// Cities in Mexico: "acapulco", "cabos", "cancun", "chichenitza", "huatulco","mexico_city"
// Cities in Norway: "alesund", "bergen", "hammerfest", "oslo", "stavanger","trondheim" 

// Initialize Variables
$page_flag = 0;
$clean = array();
$error = array();
$cityList = array();
$numberOfCities = "";

$citiesInMexico = array("acapulco", "cabos", "cancun", "chichenitza", "huatulco","mexico_city");
$citiesInNorway = array("alesund", "bergen", "hammerfest", "oslo", "stavanger","trondheim");

if( !empty($_GET) ) {
	foreach( $_GET as $key => $value ) {
		$clean[$key] = htmlspecialchars( $value, ENT_QUOTES);
	} 
}
if( !empty($clean['submit']) ) {
	$error = validation($clean);
	if( empty($error) ) {
	    $numberOfCities = $clean['numberOfCities'];
		$cityList = cityList($clean);

	    if($clean['order'] == "asc") { asort($cityList); }
	    if($clean['order'] == "desc") { arsort($cityList); }
	    
		$page_flag = 1;
	}


}
function validation($clean) {
	$error = array();

	// country Validation
	if( empty($clean['country']) ) {
		$error[] = "Choose a country";
	}

	// numberOfCities Validation
	if( empty($clean['numberOfCities']) ) {
		$error[] = "You must enter the number of cities!";
	}
	if( $clean['numberOfCities'] < 2 || $clean['numberOfCities'] > 12) {
		$error[] = "Number of cities must be between 2 and 12";
	}
	if( $clean['numberOfCities'] > 6 && ( $clean['country'] == "Mexico" || $clean['country'] == "Norway" )) {
		$error[] = "Number of cities must be less than 7 for just one country";
	}
	if( $clean['numberOfCities'] > 12 && $clean['country'] == "both" ) {
		$error[] = "Number of cities must be less than 13 for both";
	}

	return $error;
}

function cityList($clean) {

    global $citiesInMexico;
    global $citiesInNorway;

    $cityList = array();
    if( !empty($clean['country']) ) {
        if( $clean['country'] === "Mexico" ) {
            shuffle( $citiesInMexico );
            $cityList = array_slice($citiesInMexico, 0, $clean['numberOfCities']);
        } else if( $clean['country'] == "Norway" ) {
            shuffle( $citiesInNorway );
            $cityList = array_slice($citiesInNorway, 0, $clean['numberOfCities']);
        } else if( $clean['country'] == "both" ) {
            
            $start = 1;
            $last = $clean['numberOfCities'];

            $numCities = array();
            for($i=$start; $i<$last; $i++) {
                array_push($numCities, $i);
            }
            $numCitiesKey = array_rand($numCities, 1);

            $numCitiesOfMexico = $numCities[$numCitiesKey];
            $numCitiesOfNorway = $clean['numberOfCities'] - $numCitiesOfMexico;

            if( $numCitiesOfMexico > 6 ) {
                $numCitiesOfNorway = $numCitiesOfNorway + $numCitiesOfMexico - 6;
                $numCitiesOfMexico = 6;
            }
            if( $numCitiesOfNorway > 6 ) {
                $numCitiesOfMexico = $numCitiesOfMexico + $numCitiesOfNorway - 6;
                $numCitiesOfNorway = 6;
            }
            
            shuffle( $citiesInMexico );
            $cityInMexicoList = array_slice($citiesInMexico, 0, $numCitiesOfMexico);
            
            shuffle( $citiesInNorway );
            $cityInNorwayList = array_slice($citiesInNorway, 0, $numCitiesOfNorway);
            
            $cityList = array_merge($cityInMexicoList, $cityInNorwayList);
            
        }
    }
    
    foreach ($cityList as $city) {
        $_SESSION["history"] .= ucfirst($city)."  ";
    }
    $_SESSION["history"] .= "<br />";
    return $cityList;
}


?>

<!DOCTYPE html>
<html>
    <head>
        <title> Vacation Spot Generator </title>

        <link href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css" rel="stylesheet" type="text/css" />
        <style>
            body {
                text-align: center;
                font-size: 2em;
            }
            .error {
                color: red;
            }
            table {
                margin: 0 auto;
            }
            td {
                width:150px;
                height:100px;
                padding:5px;
            }
        </style>
    </head>
    <body>

        <div class="jumbotron">
            <h1> Winter Vacation Spots </h1>
        </div>
        <div id="wrapper">
            
            <form>
            Number of Cities to Visit: <input type="text" name="numberOfCities" size="5" value=>
            <a href="#" data-toggle="tooltip" title="Errors displayed if number of cities is less than 2; greater than 6 if country is not 'both' or greater than 12 if it's both."><img src='info.png' width='15'></a>
            <br /><br />
            
            Country to Visit:
               </select>
                <input type="radio" name="country" value="Mexico"
                  id="mexico" /> <label for="mexico"> Mexico </label>&nbsp;&nbsp;
                <input type="radio" name="country" value="Norway"
                  id="norway" /> <label for="norway"> Norway </label>&nbsp;&nbsp;
                <input type="radio" name="country" value="both"
                  id="both" /> <label for="both"> Both </label>
                <a href="#" data-toggle="tooltip" title="No country selected by default."><img src='info.png' width='15'></a>

            <br />
            Display cities to visit in alphabetical order:
            <input type="radio" name="order" value="asc"
                 id="order_asc" /> <label for="order_asc">A-Z</label>
            <input type="radio" name="order" value="desc"
                 id="order_desc" /> <label for="order_desc">Z-A</label>
            <a href="#" data-toggle="tooltip"
            title="If checked, the names should be ordered alphabetically"><img src='info.png' width='15'></a>
            <br />
            
            <input type="checkbox" name="displayImage" /> Display Images
            <br /><br />
            
            <input type="submit" name="submit" value="Display Cities to Visit!">
            <a href="#" data-toggle="tooltip" title="Errors displayed if Number of Cities or Country are not entered.">
            <img src='info.png' width='15'></a>
            
        </form><br>

            <form action="spotHistory.php">

            <input type="submit" value="Spot History"/>
            <a href="#" data-toggle="tooltip" title="Opens a new program where all previously generated spots are displayed.">
            <img src='info.png' width='15'></a>
            
            </form> 
            
            
        </div>
      
        <?php if( !empty($error) ): ?>
            <h2 class='error'>
                <?php foreach( $error as $value ): ?>
                <?php echo $value; ?><br />
                <?php endforeach; ?>
            </h2>

        <?php elseif( $page_flag === 1 ): ?>

        <hr>
        <h2> Visiting <?php echo $clean['numberOfCities']; ?> Cities in <?php echo $clean['country']; ?> </h2>
        <table border='1'>
        <?php 
            $j = 0;
            echo "<tr>";
            foreach($cityList as $city) {
                //if($j % 2 == 1) { echo $j." xxx  <tr>"; }
                echo "<td>".ucfirst($city);
                
                if($clean['displayImage'] == true) {
                    echo "<img src='img/".$city.".png'/><br>";
                }
                
                echo "</td>";
                
                $j++;
                if($j == count($cityList)) {
                    echo "</tr>";
                } elseif($j % 2 == 0) { echo "</tr><tr>"; }
            }
        endif ?>
        </table>

        <script src="https://code.jquery.com/jquery.min.js"></script>
        <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js"></script>
         <script>
            $(document).ready(function(){
                 $('[data-toggle="tooltip"]').tooltip(); 
            });
            
            
            
        </script>

    </body>
</html>
