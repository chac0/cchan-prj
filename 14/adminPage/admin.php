<?php

    session_start();
    
    if (!isset($_SESSION['username'])) {
        header("Location:login.php");
        exit();
    }
    
    include "../dbConnection.php";
    
    $conn = getDatabaseConnection("islandStore");
    
    if(!isset($_SESSION['adminName'])) {
        
        header("Location:login.php");
    }
    
    function displayAllProducts() {
        global $conn;
        
        $sql = "SELECT * 
                FROM is_product
                ORDER BY productId";
                
        $stmt = $conn->prepare($sql);
        $stmt->execute();
        $records = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        return $records;
    }

?>


<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8">
        <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.0.9/css/all.css" integrity="sha384-5SOiIsAziJl6AWe0HWRKTXlfcSHKmYV4RBF18PPJ173Kzn7jzMyFuTtk8JA7QQG1" crossorigin="anonymous">
        <title>Admin Main Page</title>
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.3/umd/popper.min.js" integrity="sha384-vFJXuSJphROIrBnz7yo7oB41mKfc8JzQZiCq4NCceLEaO4IHwicKwpJf9c9IpFgh" crossorigin="anonymous"></script>
      	<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.0/css/bootstrap.min.css" integrity="sha384-9gVQ4dYFwwWSjIDZnLEWnxCjeSWFphJiwGPXr1jddIhOegiu1FwO5qRGvFXOdJZ4" crossorigin="anonymous">
      	<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.1.0/js/bootstrap.min.js" integrity="sha384-uefMccjFJAIv6A+rW+L4AHf99KvxDjWSu1z9VI8SKNVmz4sk7buKt/6v9KI65qnm" crossorigin="anonymous"></script> 
      	<link href="css/styles.css" rel="stylesheet" type="text/css" />       
        <script>
            $(document).ready(function(){
                $("#getData").click(function(){
                    $.ajax({
                        type: "GET",
                        url: "../api/getAnalysisInfo.php",
                        dataType: "json",
                        data: { "id" : "" },
                        success: function(data,status) {
                                $("#Agg").html("");
                                $("#Agg").append("<strong>Total Islands:</strong> " + data[0].totalIslands + "<br><br>");
                                $("#Agg").append("<strong>Average Island Price:</strong>  $" + data[0].average + "<br><br>");
                                $("#Agg").append("<strong>Max Island Price:</strong>  $" + data[0].max + "<br><br>");
                                $("#Agg").append("<strong>Min Island Price:</strong>  $" + data[0].min + "<br><br>");
                        }
                    });
                });
            });
            function confirmDelete() {
                
                return confirm("Are you sure you want to delete the product?");
                
            }
            function confirmDelete2() {
                
                return confirm("Are you sure you want to delete the category?");
                
            }
            function confirmDelete3() {
                
                return confirm("Are you sure you want to delete the type?");
                
            }
            
        </script>
        
    </head>
    <body class = 'bg-info'>

        <h1 class="display-3">Island Store | Admin Panel</h1>
        <div class = "container">    
            <h2 class = 'display-4' id = "welcome" ><strong> Welcome <?=$_SESSION['adminName']?>! </strong></h3>
            
            <br />
            <form action="addProduct.php">
                <input type="submit" class = 'btn btn-secondary' id = "beginning" name="addProduct" value="Add Product"/>
            </form>
            <br/>
            <form action="addCategory.php">
                <input type="submit" class = 'btn btn-secondary' id = "beginning" name="addCategory" value="Add Category"/>
            </form>
            <br/>
            <form action="logout.php">
                <input type="submit" class = 'btn btn-secondary' id = "beginning" value="Logout"/>
            </form>
            <br/>
            <p>
            <button class="btn btn-primary" type="button" data-toggle="collapse" data-target="#bookTable" aria-expanded="false" aria-controls="bookTable">
                Show Island Information
            </button>
            </p>
            <div class="collapse" id="bookTable">
                    <br /> <br />
                    <h2 class = 'display-4' id = "welcome" > Islands </h3><br />
                            <?php
            $records = displayAllProducts();
            
            echo "<table class='table table-hover'>";
            echo "<thead>
                    <tr>
                        <th scope-'col'>Image</th>
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
                $productImage = $record['productImage'];
                echo "<tr>";
                echo "<td><img src='../img/$productImage' width='150'></td>";
                echo "<td>" . $record['productId'] . "</td>";
                echo "<td>" . $record['productName'] . "</td>";
                echo "<td>" . $record['productDescription'] . "</td>";
                echo "<td>" . $record['price'] . "</td>";
                echo "<td><a class='btn btn-primary' href='updateProduct.php?productId=" . $record['productId'] . "'>Update</a></td>";
                echo "<form action='deleteProduct.php' onsubmit='return confirmDelete()'>";
                echo "<input type='hidden' name='productId' value= '" . $record['productId'] . "'/>";
                echo "<td><input type='submit' class='btn btn-danger' value='Remove'></td>";
            }
            
            echo "</tbody>";
            echo "</table>";
        
        ?>
            </div>

            <p>
              <a class="btn btn-primary" id="getData" data-toggle="collapse" href="#Agg" role="button" aria-expanded="false" aria-controls="Agg">
                Data Analysis 
              </a>
            </p>
            <div class="collapse" id="Agg">
            </div>
            
            
        </div>
    </body>
</html>
