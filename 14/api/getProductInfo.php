<?php

    include '../dbConnection.php';
    $dbConn = getDatabaseConnection("islandStore");    
    $sql = "SELECT * FROM is_product 
            inner join is_category on is_product.categoryId = is_category.categoryId 
            inner join is_type on is_product.typeId = is_type.typeId
            WHERE is_product.productId = :productId";
    // echo $sql;
    $stmt = $dbConn -> prepare($sql);
    $stmt -> execute(array("productId"=>$_GET['productId']));
    $resultSet = $stmt->fetch(PDO::FETCH_ASSOC);
    echo json_encode($resultSet);
        
?>