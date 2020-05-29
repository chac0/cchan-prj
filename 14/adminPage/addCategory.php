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
        
            echo "<table class='table table-hover'>";
            echo "<thead>
                    <tr>
                        <th scope='col'>ID</th>
                        <th scope='col'>Category Name</th>
                        <th scope='col'>Category Description</th>
                    </tr>
                    </thead>";
            echo "<tbody>";
            foreach($records as $record) {
                
                echo "<tr>";
                echo "<td>" . $record['categoryId'] . "</td>";
                echo "<td>" . $record['categoryName'] . "</td>";
                echo "<td>" . $record['categoryDescription'] . "</td>";
                echo "<td><a class='btn btn-primary' href='updateCategory.php?categoryId=" . $record['categoryId'] . "'>Update</a></td>";
                echo "<form action='deleteCategory.php' onsubmit='return confirmDelete()'>";
                echo "<input type='hidden' name='categoryId' value= '" . $record['categoryId'] . "'/>";
                echo "<td><input type='submit' class='btn btn-danger' value='Remove'></td>";
            }
            
            echo "</tbody>";
            echo "</table>";
    }
    
    if (isset($_GET['submitCategory'])) {
        
        $categoryName = $_GET['categoryName'];
        $categoryDescription = $_GET['categoryDescription'];

        $sql = "INSERT INTO is_category
                ( categoryName, categoryDescription)
                VALUES ( :categoryName, :categoryDescription)";
                
        $np = array(); // name parameters array
        $np[':categoryName'] =$categoryName;
        $np[':categoryDescription'] =$productDescription;

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
        <h1 class = 'display-4'><strong>Add A Category</strong> </h1>
        <div class = "container">
            <div class = "row">
                <div class = "col-md-8 offset-md-2">
        <form>
            <strong>Category name</strong> <input type="text" class="form-control" name="categoryName"> <br /><br />
            <strong>Category Description</strong> <textarea name="description" class="form-control" cols=50 rows = 4></textarea> <br /><br />
            <input type="submit" name="submitCategory" class='btn btn-primary' value="Add Category"> <br /><br />
        </form>
                    </br>
                    <form action="admin.php">
                        <input type="submit" class = 'btn btn-secondary' id = "beginning" value="Back to Admin Panel"/>
                    </form>
            </div>
            <?php getCategories() ?>
        </div>
    </body>
</html>
