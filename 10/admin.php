<?php
session_start();

if (!isset($_SESSION['username'])) {
    header("Location: index.php");
    exit();
}

include './dbConnection.php';
$conn = getDatabaseConnection();

function displayAllProducts() {
    global $conn;
    
    $sql="SELECT * FROM om_product ORDER BY productId";
    
    $statement = $conn->prepare($sql);
    $statement->execute();
    $records = $statement->fetchAll(PDO::FETCH_ASSOC);
    return $records;
}

function getCategories() {
    global $conn;
    $sql = "SELECT catId, catName FROM om_category ORDER BY catName";
    $statement = $conn->prepare($sql);
    $statement->execute();
    $records = $statement->fetchAll(PDO::FETCH_ASSOC);
    foreach ($records as $record) {
        echo "<option value='".$record["catId"] ."'>". $record['catName']." </option>";
    }
}

function getProductInfo() {
    global $conn;
    $sql = "SELECT * FROM om_product WHERE productId = " . $_GET['productId'];
    
    $statement = $connection->prepare($sql);
    $statement->execute();
    $record = $statement->fetch(PDO::FETCH_ASSOC);
    
    return $record;
}

if (isset($_GET['submitProduct'])) {
    $productName = $_GET['productName'];
    $productDescription = $_GET['description'];
    $productImage = $_GET['productImage'];
    $productPrice = $_GET['price'];
    $catId = $_GET['catId'];
    
    $sql = "INSERT INTO om product
        ( productName, productDescription, productImage, price, catid),
        VALUES ( :productName, :productDescription, :productImage, :price, :catId)";
    
    $namedParameters = array();
    $namedParameters[':productName'] = $productName;
    $namedParameters[':productDescription'] = $productDescription;
    $namedParameters[':productImage'] = $productImage;
    $namedParameters[':price'] = $productPrice;
    $namedParameters[':catId'] = $catid;
    $statement = $conn->prepare($sql);
    $statement->execute($namedParameters);
}

if (isset($_GET['productId'])) {
    $product = getProductInfo();
}

?>

<!DOCTYPE html>
<html>
    <head>
        <title> Admin Page </title>
        <script>
            function confirmDelete() {
               return confirm("Are you sure you want to delete the product?");
            }
        </script>
        <style>
            @import url("css/styles.css");
        </style>
    </head>
    <body>
        <h1> Welcome <?=$_SESSION['adminFullName']?>! </h1>

        <h2> ADMIN PAGE </h2>
        <hr>

        <form action="addProduct.php">
            <input id="addButton" type="submit" name="addproduct" value="Add Product"/>
        </form>
        
         <form action="logout.php">
            <input type="submit"  value="Logout"/>
        </form>
        
        <br /><br />

        <div id="products">
            
        <?php 
            $records=displayAllProducts();
            echo "<table class='table table-hover'>";
            echo "<thead>
                <tr>
                    <th scope='col'>ID</th>
                    <th scope='col'>Name</th>
                    <th scope='col'>Description</th>
                    <th scope='col'>Price</th>
                    <th scope='col'>Update</th>
                    <th scope='col'>Remove</th>
                </tr>
            </thead>";
            
            echo "<tbody>";
                foreach($records as $record) {
                    echo "<tr>";
                    echo "<td>" . $record['productId']."</td>";
                    echo "<td>" . $record['productName']."</td>";
                    echo "<td>" . $record['productDescription']."</td>";
                    echo "<td>$" .$record['price']."</td>";
                    // echo "<td><a class='btn btn-primary' href='updateProduct.php?productId=".$record['productId']."'>Update</a></td>";
                    echo "<form action='updateProduct.php'>";
                    echo "<input type='hidden' name='productId' value= " . $record['productId']." />";
                    echo "<td><input id='updateButton' type='submit' value='Update'></td>";
                    echo "</form>";
                    echo "<form action='deleteProduct.php' onsubmit='return confirmDelete()'>";
                    echo "<input type='hidden' name='productId' value= " . $record['productId']." />";
                    echo "<td><input  id='removeButton' type='submit' value='Remove'></td>";
                    echo "</form>";
                }
            echo "</tbody>";
            echo "</table> ";
        ?>

        </div>
    </body>
</html>
