<?php
    
    session_start();
    
    if (!isset($_SESSION['username'])) {
        header("Location:login.php");
        exit();
    }
    
    include "../dbConnection.php";
    
    $conn = getDatabaseConnection("islandStore");
    
   function getCategory() {
        global $conn;
        
        $sql = "SELECT * FROM is_category
                WHERE categoryId = " . $_GET['categoryId'];
                
        $stmt = $conn->prepare($sql);
        $stmt->execute();
        $record = $stmt->fetch(PDO::FETCH_ASSOC);
        
        return $record;
    } 

    if (isset ($_GET['categoryId'])) {
        $category = getCategory();
    }
    
    if(isset($_GET['updateCategory'])) {
        
        $sql = "UPDATE is_category
                SET categoryName = :categoryName,
                    categoryDescription = :categoryDescription
                WHERE categoryId =". $_GET['categoryId'];
        $np = array();
        $np[':categoryName'] = $_GET['categoryName'];
        $np[':categoryDescription'] = $_GET['categoryDescription'];


        try {
            $stmt = $conn->prepare($sql);
            $stmt->execute($np);
            echo "Category has been updated!";
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
        <h1 class = 'display-3'>Update Category</h1>
        <div class = "container">
            <div class = "row">
                <div class = "col-md-8 offset-md-2">
        <form>
            <input  type="hidden" name="categoryId" value="<?=$category['categoryId']?>"/>
            <strong>Category name</strong> <input type="text" class="form-control" name="categoryName" value="<?=$category['categoryName']?>"> <br />
            <strong>Category Description</strong> <textarea name="categoryDescription" class="form-control" cols=50 rows = 4> <?=$category['categoryDescription']?></textarea> <br />
            <input type="submit" name="updateCategory" class='btn btn-primary' value="Update Category"> <br />
        </form>

                    <form action="admin.php">
                        <input type="submit" class = 'btn btn-secondary' id = "beginning" value="Back to Admin Panel"/>
                    </form>
            </div>
        </div>
    </div>
    </body>
</html>
