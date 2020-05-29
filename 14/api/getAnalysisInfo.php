<?php

    include '../dbConnection.php';
    $dbConn = getDatabaseConnection("islandStore");    
    $sql = "select count(*) as totalIslands, AVG( price ) as average, MAX( price ) as max, MIN( price ) as min from is_product";
    // echo $sql;
    $stmt = $dbConn -> prepare($sql);
    $stmt -> execute(array("productId"=>$_GET['productId']));
    $resultSet = $stmt->fetch(PDO::FETCH_ASSOC);
    $resultSet[0] = $resultSet;

    echo json_encode($resultSet);
        
?>