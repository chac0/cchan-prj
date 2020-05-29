<?php

    include "../dbConnection.php";
    
    if (!isset($_SESSION['username'])) {
        header("Location:login.php");
        exit();
    }
    
    $conn = getDatabaseConnection("islandStore");
    
    $sql = "DELETE
            FROM is_product
            WHERE productId = " . $_GET['productId'];
            
    $stmt = $conn->prepare($sql);
    $stmt->execute();
    
    header("Location:admin.php");

?>