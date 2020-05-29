<?php
    session_start();
    
    include "../dbConnection.php";
    
    $conn = getDatabaseConnection();
    
    $username = $_POST['username'];
    $password = sha1($_POST['password']);
    
    /*$sql = "SELECT *
    FROM is_admin
    WHERE username = '$username'
    AND password = '$password'";*/
    
    $sql = "SELECT *
    FROM is_admin
    WHERE username = :username
    AND password = :password";
    
    $np = array();  // name parameter
    $np[":username"] = $username;
    $np[":password"] = $password;
    
    $stmt = $conn->prepare($sql);
    $stmt->execute($np);
    $record = $stmt->fetch(PDO::FETCH_ASSOC);  // Would use fetchAll() if needing more than just one element, ie more than the single user
    
    if(empty($record)) {
        $_SESSION['incorrect'] = true;
        header("Location:login.php");
    } else {
        $_SESSION['incorrect'] = false;
        $_SESSION['username'] = $record['username'];
        $_SESSION['adminName'] = $record['firstName'] . " " . $record['lastName'];
        header("Location:admin.php");
    }


?>

<!DOCTYPE html>
<html>
    <head>
        <title> </title>
    </head>
    <body>

    </body>
</html>