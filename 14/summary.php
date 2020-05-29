<?php

    include 'functions.php';
    session_start();

    //If 'removeId' has been sent, search the cart for that productName and unset it
    if(isset($_POST['removeId'])) {
        foreach($_SESSION['cart'] as $itemKey => $item) {
            if($item['productId'] == $_POST['removeId']) {
                unset($_SESSION['cart'][$itemKey]);
            }
        }
    }
    
    if(isset($_POST['clearCart'])) {
        $_SESSION['cart'] = array();
    }

?>

<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8">
        <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.0.9/css/all.css" integrity="sha384-5SOiIsAziJl6AWe0HWRKTXlfcSHKmYV4RBF18PPJ173Kzn7jzMyFuTtk8JA7QQG1" crossorigin="anonymous">
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js" integrity="sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q" crossorigin="anonymous"></script>
        <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js" integrity="sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl" crossorigin="anonymous"></script>
        <link href="css/styles.css" rel="stylesheet" type="text/css" />
        <title>SSL FINAL</title>
        
    </head>
    <body class = 'bg-info'>
        <!-- NAVIGATION icons -->
        <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
          <a class="navbar-brand" href="http://www.chaco.lc">CCHAN</a>
          <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav">
            <li class="nav-item">
                <a class="nav-link" href='index.php' id='home'>
                    <i class="fas fa-home"></i>
                    Home</a>
            </li>
              <li class="nav-item">
                <a class="nav-link" href="catalog.php" id = 'catalog'>
                    <i class="fas fa-book"></i>
                    Catalog</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="adminPage/login.php" id = 'login'>
                    <i class="fas fa-sign-in-alt"></i>
                    Login</a>
              </li>
                <li class="nav-item">
                <a class="nav-link" href="about.php" id = 'about'>
                    <i class="fas fa-info-circle"></i>
                    About Us</a>
              </li>
                <li class="nav-item active">
                    <a class="nav-link" href='cart.php'>
                        <i class="fas fa-shopping-cart"></i>
                        Cart: <span class="sr-only">(current)</span><?php displayCartCount(); ?> </a></li>
                    </a>
                </li>
            </ul>
          </div>
        </nav>
        <div class='container'>
            <div class='text-center'>
                
                <!-- Bootstrap Navagation Bar -->
                <br /> <br /> <br />
                <h2>Summary</h2>
                <?php
                    displayCart();
                ?>
                <hr>
                <h3> Tax: 8.75%</h3>
                <h3>Total: $<?php totalCart(); ?></h3>
                <!-- Checkout Items AJAX -->
                <hr>
                
                <h2>Customer Check Out</h2>
                
                <form enctype="text/plain">
                <div class="form-group">
                    <label for="firstName"><strong>First Name</strong></label>
                    <input type="text" class="form-control" name="firstName" id="firstName" placeholder="First Name">
                </div>
                
                <div class="form-group">
                    <label for="lastName"><strong>Last Name</strong></label>
                    <input type="text" class="form-control" name="lastName" id="lastName" placeholder="Last Name">
                </div>
                
                <label for="form-group"><strong>Gender</strong> </label><br />
                <select class="custom-select" id="gender" name="gender">
                    <option value="F">Female</option>
                    <option value='M' >Male</option>
                </select>
                <br /><br />
                
                <div class="form-group">
                    <label for="email"><strong>Email</strong></label>
                    <input type="text" class="form-control" name="email" id="email" placeholder="Email">
                </div>
                
                <input type="button" name ="checkout" value="checkout" id="checkout" class="btn btn-outline-danger">
                </form><br />
                
                
            <script>
    
            $(document).ready(function(){
            $("#checkout").click(function(){
            
                $.ajax({

                    type: "POST",
                    url: "submitCheckout.php",
                    dataType: "json",
                    data: {"firstName" : $("#firstName").val(),
                            "lastName" : $("#lastName").val(),
                            "gender" : $("#gender").val(),
                            "email" : $("#email").val()
                    },
                    success: function(data) {

                        alert("Submitted");
                        alert(data.firstName);
                    },
                    complete: function(data) { //optional, used for debugging purposes
                    alert(status);
                    }
                });//ajax
            });
    }); //document ready
                </script>
                <script>
    
            $(document).ready(function(){
    
            //$("#adoptionsLink").addClass("active");
            
            $(".productLink").click(function(){
                
                //alert(  );
                
                $('#productModal').modal("show");
                $("#productInfo").html("<img src='img/loading.gif'>");
                      
                
                $.ajax({

                    type: "GET",
                    url: "api/getProductInfo.php",
                    dataType: "json",
                    data: { "productId": $(this).attr("productId")},
                    success: function(data,status) {

                       $("#productModalLabel").html("<h2>" + data.productId + ":" + data.productName + "</h2>");
                       $("#productInfo").html("");
                       $("#productInfo").append("<img src='img/" + data.productImage +"' width='200' >"+ "<br><br>");
                       $("#productInfo").append("<strong>Description:</strong>  " + data.productDescription + "<br><br>");
                       $("#productInfo").append("<strong>price:</strong>  " + data.price + "<br><br>");
                       $("#productInfo").append("<strong>Region:</strong>  " + data.categoryName + "<br><br>");
                       $("#productInfo").append("<strong>Type:</strong>  " + data.typeName + "<br><br>");
                       $("#productInfo").append("<strong>Size:</strong>  " + data.size + "<br><br>");
                       $("#productInfo").append("<strong>Location:</strong>  " + data.location + "<br><br>");
                       
                    },
                    complete: function(data,status) { //optional, used for debugging purposes
                    //alert(status);
                    }
                });//ajax
            });
    }); //document ready
</script>
                <div class="modal fade" id="productModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog" style="width:1250px;" role="document" >
                    <div class="modal-content" >
                        <div class="modal-header" >
                        <h5 class="modal-title" id="productModalLabel"></h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                        </button>
                        </div>
                        <div class="modal-body">
                        <div id="productInfo"></div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <script src="js/js.js"></script>
    </body>
</html>