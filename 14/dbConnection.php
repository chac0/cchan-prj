<?php
function getDatabaseConnection() {
	// mysql://b7d97aa192206e:bc8bc220@us-cdbr-iron-east-05.cleardb.net/heroku_8f1c158f8d4d7a6?reconnect=true

    // when connecting from Heroku
    if  (strpos($_SERVER['HTTP_HOST'], 'herokuapp') != false) {
        $url = parse_url(getenv("CLEARDB_DATABASE_URL"));
        $host = $url["host"];
        $dbname = substr($url["path"], 1);
        $username = $url["user"];
        $password = $url["pass"];
    } else {
    // when connecting from test env
        $host = "us-cdbr-iron-east-01.cleardb.net";
        $username = "bb0f0658353ff9";
        $password = "64fbe028";
        $dbname = "heroku_0ef6520b48ff710";
        $charset = 'utf8mb4';
    }
    
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
