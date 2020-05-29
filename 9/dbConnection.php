<?php
function getDatabaseConnection() {
    // mysql://b2c39898989a45:2d0f1e07@us-cdbr-iron-east-01.cleardb.net/heroku_dac37addba7e971?reconnect=true
    // mysql://b7d97aa192206e:bc8bc220@us-cdbr-iron-east-05.cleardb.net/heroku_8f1c158f8d4d7a6?reconnect=true

    $host = "us-cdbr-iron-east-05.cleardb.net";
    $username = "b7d97aa192206e";
    $password = "bc8bc220";
    $dbname = "heroku_8f1c158f8d4d7a6";
    $charset = 'utf8mb4';
        
    try {
            $dbconn = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
            $dbconn ->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            return $dbconn;
        } catch(PDOException $e) {
            print('ERROR:'.$e->getMessage());
            exit;
    }
    return $dbconn; 

}
?>
