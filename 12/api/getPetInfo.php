<?php
    include '../dbConnection.php';
    $dbConn = getDatabaseConnection("pets");    
    $sql = "SELECT *, YEAR(CURDATE()) - yob age 
            FROM pets 
            WHERE id = :id";
    $stmt = $dbConn -> prepare($sql);
    $stmt -> execute(array("id"=>$_GET['id']));
    $resultSet = $stmt->fetch(PDO::FETCH_ASSOC);
    echo json_encode($resultSet);
        
?>