<?php
    
    session_start();

    if (!isset($_SESSION['username'])) {
        header("Location:login.php");
        exit();
    }
    
    include "../dbConnection.php";
    
    $conn = getDatabaseConnection("islandStore");
    
    function getProductInfo() {
        global $conn;
        
        $sql = "SELECT * FROM is_product
                WHERE productId = " . $_GET['productId'];
                
        $stmt = $conn->prepare($sql);
        $stmt->execute();
        $record = $stmt->fetch(PDO::FETCH_ASSOC);
        
        return $record;
    }
    
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

    if (isset ($_GET['productId'])) {
        $product = getProductInfo();
    }
    
    if(isset($_GET['updateProduct'])) {
        
        $sql = "UPDATE is_product
                SET productName = :productName,
                    productDescription = :productDescription,
                    productImage = :productImage,
                    price = :price,
                    categoryId = :categoryId
                WHERE productId = :productId";
        $np = array();
        $np[':productName'] = $_GET['productName'];
        $np[':productDescription'] = $_GET['productDescription'];
        $np[':productImage'] = $_GET['productImage'];
        $np[':price'] = $_GET['price'];
        $np[':categoryId'] = $_GET['categoryId'];
        $np[':productId'] = $_GET['productId'];

        try {
            $stmt = $conn->prepare($sql);
            $stmt->execute($np);
            echo "Product has been updated!";
        } catch(PDOException $e) {
            print('ERROR:'.$e->getMessage());
            exit;
        }
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
        <title>Update Product </title>
        <link href="css/styles.css" rel="stylesheet" type="text/css" />
    </head>
    <body class = 'bg-info'>
        <h1 class = 'display-3'>Update Product</h1>
        <div class = "container">
            <div class = "row">
                <div class = "col-md-8 offset-md-2">
        <form>
            <input  type="hidden" name="productId" value="<?=$product['productId']?>"/>
            <strong>Product name</strong> <input type="text" class="form-control" name="productName" value="<?=$product['productName']?>"> <br />
            <strong>Description</strong> <textarea name="description" class="form-control" cols=50 rows = 4> <?=$product['productDescription']?></textarea> <br />
            <strong>Price</strong> <input type="text" class="form-control" name="price" value="<?=$product['price']?>"> <br />
            <strong>Category</strong> <select name="categoryId" class="form-control">
                <option value="">Select One</option>
                <?php getCategories( $product['categoryId']); ?>
            </select> <br />
            <strong>Set Image Url</strong> <input type="text" name="productImage" value="<?=$product['productImage']?>" class="form-control"> <br />
            <input type="submit" name="updateProduct" class='btn btn-primary' value="Update Product"> <br />
        </form>

                    <form action="admin.php">
                        <input type="submit" class = 'btn btn-secondary' id = "beginning" value="Back to Admin Panel"/>
                    </form>
            </div>
        </div>
    </div>
    </body>
</html>
