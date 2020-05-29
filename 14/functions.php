<?php

function displayCart() {
    // if there are islands in the Session, display them
    if(isset($_SESSION['cart'])) {
        echo "<table class='table'>";
        foreach($_SESSION['cart'] as $item) {
            $productId = $item['productId'];
            $productName = $item['productName'];
            $price = $item['price'];
            $productImage = $item['productImage'];
            
            // display data as table row
            echo "<tr>";
            echo "<td><img src='img/$productImage' width='200'></td>";
            echo "<td><h4><a href='#' class='productLink' productId=$productId>$productName</a></h4></td>";
            echo "<td><h4>$price</h4></td>";
            
            // updating form for remove button
            echo "<form method='post'>";
            echo "<input type='hidden' name='removeId' value='$productId'>";
            echo "<td><button class='btn btn-danger'>Remove</button></td>";
            echo "</form>";
            
            echo "</tr>";
        }
        echo "</table>";
    }
}

function totalCart() {
    //if there are island in session add total
    $price=0;
    
    $taxrate = .0875; //If Change tax here but also <h3> tag in summary page 
    
    if(isset($_SESSION['cart'])) {
        foreach($_SESSION['cart'] as $item) {
            $price += $item['price'];
        }
    }
    $tax = $price * $taxrate;
    $total = $tax+ $price;
    echo $total;
}

function displayCartCount() {
    echo count($_SESSION['cart']);
}

?>
