<?php

    include "../dbConnection.php";
    
    if (!isset($_SESSION['username'])) {
        header("Location:login.php");
        exit();
    }
    
    $conn = getDatabaseConnection("islandStore");
    
    $sql = "DELETE
            FROM is_category
            WHERE categoryId = " . $_GET['categoryId'];
            
    $stmt = $conn->prepare($sql);
    $stmt->execute();
    
    header("Location:admin.php");

?>