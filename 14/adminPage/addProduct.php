<?php
    session_start();
    
    if (!isset($_SESSION['username'])) {
        header("Location:login.php");
        exit();
    }
    
    include "../dbConnection.php";
    
    $conn = getDatabaseConnection("islandStore");
    
    function getCategories() {
        global $conn;
        
        $sql = "SELECT categoryId, categoryName,categoryDescription
                FROM is_category
                ORDER BY categoryName";
                    
        $stmt = $conn->prepare($sql);
        $stmt->execute();
        $records = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        foreach ($records as $record) {
            echo "<option value='" . $record['categoryId'] . "'>" . $record['categoryName'] . " </option>";
        }
    }
    
    if (isset($_GET['submitProduct'])) {
        
        $productName = $_GET['productName'];
        $productDescription = $_GET['description'];
        $productImage = $_GET['productImage'];
        $productPrice = $_GET['price'];
        $categoryId = $_GET['categoryId'];
        
        $sql = "INSERT INTO is_product
                ( productName, productDescription, productImage, price, categoryId)
                VALUES ( :productName, :productDescription, :productImage, :price, :categoryId)";
                
        $np = array(); // name parameters array
        $np[':productName'] =$productName;
        $np[':productDescription'] =$productDescription;
        $np[':productImage'] = $productImage;
        $np[':price'] =$productPrice;
        $np[':categoryId'] = $categoryId;
        
        $stmt = $conn->prepare($sql);
        $stmt->execute($np);
        
        header('Location:admin.php');
    }

?>

<!DOCTYPE html>
<html>
    <head>
        <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.0.9/css/all.css" integrity="sha384-5SOiIsAziJl6AWe0HWRKTXlfcSHKmYV4RBF18PPJ173Kzn7jzMyFuTtk8JA7QQG1" crossorigin="anonymous">
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">
        <script src="https://code.jquery.com/jquery-3.2.1.slim.min.js" integrity="sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN" crossorigin="anonymous"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js" integrity="sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q" crossorigin="anonymous"></script>
        <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js" integrity="sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl" crossorigin="anonymous"></script>
        <title> Add a product </title>
        <link href="css/styles.css" rel="stylesheet" type="text/css" />
    </head>
    <body class = 'bg-info'>
        <h1 class = 'display-4'><strong>Add A Product</strong> </h1>
        <div class = "container">
            <div class = "row">
                <div class = "col-md-8 offset-md-2">
        <form>
            <strong>Product name</strong> <input type="text" class="form-control" name="productName"> <br /><br />
            <strong>Description</strong> <textarea name="description" class="form-control" cols=50 rows = 4></textarea> <br /><br />
            <strong>Price</strong> <input type="text" class="form-control" name="price" > <br /><br />
            <strong>Category</strong> <select name="categoryId" class="form-control">
                <option value="">Select One</option>
                <?php getCategories(); ?>
            </select> <br /><br />
            <strong>Set Image Url</strong> <input type="text" name="productImage" class="form-control"> <br /><br />
            <input type="submit" name="submitProduct" class='btn btn-primary' value="Add Product"> <br /><br />
        </form>
                    </br>
                    <form action="admin.php">
                        <input type="submit" class = 'btn btn-secondary' id = "beginning" value="Back to Admin Panel"/>
                    </form>
            </div>
        </div>
    </body>
</html>
