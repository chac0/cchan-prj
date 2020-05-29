<?php
    session_start();

    include './dbConnection.php';
    $conn = getDatabaseConnection();

    $username = $_POST['username'];
    $password = sha1($_POST['password']);

    $sql = "SELECT *
            FROM om_admin
            WHERE username = :username 
            AND   password = :password";
            
    $np = array();
    $np[':username'] = $username;
    $np[':password'] = $password;
            
    $stmt = $conn->prepare($sql);
    $stmt->execute($np);
    $record = $stmt->fetch(PDO::FETCH_ASSOC);

    if (empty($record)) {
        $_SESSION['incorrect'] = true;
        header("Location:index.php");
    } else {
        $_SESSION['username'] = $record['username'];
        $_SESSION['adminFullName'] = $record['firstName'] . " " . $record['lastName'];
        header("Location:admin.php");
    }
?>