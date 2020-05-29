<?php

    function play() {
        for ($i = 1; $i < 4; $i++) {
            ${"randomValue" . $i } = rand(0,4);
            displaySymbol(${"randomValue" . $i}, $i);
        }
        displayPoints($randomValue1, $randomValue2, $randomValue3);
    }

    function displaySymbol($x, $pos) {
        switch ($x) {
            case 0: 
                $symbol = "seven";
                break;
            case 1:
                $symbol = "cherry";
                break;
            case 2:
                $symbol = "lemon";
                break;
            case 3:
                $symbol = "grapes";
                break;
        }
        echo "<img id='reel$pos' src='img/$symbol.png' alt='$symbol' title='" . ucfirst($symbol) . "' width='70px' />";
    }
            
    function displayPoints($x, $y, $z) {
        echo "<div id='output'>";
        if ($x == $y && $y == $z) {
            switch ($x) {
                case 0:
                    $totalPoints = 1000;
                    break;
                case 1:
                    $totalPoints = 500;
                    break;
                case 2:
                    $totalPoints = 250;
                    break;
                case 3:
                    $totalPoints = 900;
                    break;
            }
            echo "<h2>You won $totalPoints points!</h2>";
        } else {
            echo "<h3>Try Again!</h3>";
        }
        echo "</div>";
    }

?>
