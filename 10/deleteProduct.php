<?php
session_start();

if (!isset($_SESSION['username'])) {
    header("Location: index.php");
    exit();
}

include './dbConnection.php';
$conn = getDatabaseConnection();

if (isset($_GET['productId'])) {

    $sql = "DELETE FROM om_product WHERE productId = ". $_GET['productId'];
    
    try {
        $statement = $conn->prepare($sql);
        $statement->execute();
        header("Location: admin.php");
    } catch(PDOException $e) {
        print('ERROR:'.$e->getMessage());
        exit;
    }
}
?>
