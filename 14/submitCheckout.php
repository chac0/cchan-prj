<?php
session_start();

include 'connect.php';
$connect = getDatabaseConnection();

//Data for is_user
$firstName=$_POST['firstName'];
$lastName=$_POST['lastName'];
$gender=$_POST['gender'];
$email=$_POST['email'];


$sqlUser = "INSERT INTO is_user (firstName, lastName, gender, email)
        VALUES (:firstName, :lastName, :gender, :email)";
$dataUser = array(
    ":firstName" => $firstName,
    ":lastName" => $lastName,
    ":gender" => $gender,
    ":email" => $email
);
try {
$stmt = $connect->prepare($sqlUser);
$stmt->execute($dataUser);
} catch (PDOException $e) {
   echo json_encode($e); 
}


?>