<?php
session_start();

$exec_html = <<<_EOD
<!DOCTYPE html>
<html>
    <head>
        <title> Team History </title>
        <link href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css" rel="stylesheet" type="text/css" />
     <style>
            body {
                text-align: center;
                font-size: 2em;
            }
        </style>
    </head>
    <body>
        <div class="jumbotron">
            <h1> Vacation Spot History </h1>
        </div>
        {$_SESSION["history"]}
    </body>
</html>
_EOD;

echo $exec_html;

?>
