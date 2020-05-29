<?php
    if(isset($_GET['keyword'])) {
        include 'api/pixabayAPI.php';
        echo "You searched for: " . $_GET['keyword'] . "<br/>";
        $imageURLs = getImageURLs($_GET['keyword'], $_GET['layout']);
        $bgURLs = getImageURLs($_GET['category'], $_GET['layout']);
        $backgroundImage = $bgURLs[array_rand($bgURLs)];
    } else {
        $backgroundImage = "./img/sea.jpg";  
    }
?>

<!DOCTYPE html>
<html>
    <head>
        <title>Image Carousel</title>
        <meta charset="utf-8">
        
        <!--JQuery: Collection of Javascript Functions, wrapper around Javascript-->
        <!--Provides a lot of convenient methods-->
        
        
        <!--Bootstrap: "CSS side," provides pre-made components that are styled already-->
        <!--Provides functionality for function designs, know how to adjust the size-->
        <!--Ex: Mobile vs. Desktop-->
        <link href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" rel="stylesheet">
        
        <style>
            @import url("./css/styles.css");
            
            /*Background Image = Variable to be able to change the background at will*/
            body {
                background-image: url('<?=$backgroundImage?>');
            }
        </style>
    </head>
    
    <body>
        <br/>
        <br/>
        
        <!-- HTML Form -->
        <form>
            <input type="text" name="keyword" placeholder="Keyword" value="<?=$_GET['keyword']?>">
            
            <input type="radio" id="lhorizontal" name="layout" value="horizontal" checked>
            <label for="Horizontal"></label><label for="lhorizontal">Horizontal</label>
            
            <input type="radio" id="lvertical" name="layout" value="vertical">
            <label for="Vertical"></label><label for="lvertical">Vertical</label>
            
            <select name="category" style="color:black">
                <option value="">Select One</option>
                <option value="ocean">Sea</option>
                <option>Forest</option>
                <option>Mountain</option>
                <option>Snow</option>
            </select>
            
            <input type="submit" value="Search"/>
        </form>
        
        <!--Do 4.2 for random images & 4.3-->
        <?php
            // 1) Form not submitted
            // 2) Form submitted
            if(!isset($imageURLs)) {
                echo "<h2>Type a keyword to display a slideshow <br/> of random images from Pixabay.com</h2>";
            } else {
        ?>
        
        <div id="carousel-example-generic" class="carousel slide" data-ride="carousel" style="width:500px">
          <!-- Indicators-->
          <ol class="carousel-indicators">
              <?php
                for($i = 0; $i < 7; ++$i) {
                    echo "<li data-target='#carousel-example-generic' data-slide-to='$i'";
                    echo ($i == 0) ? " class='active'" : "";
                    echo "></li>";
                }
              ?>
          </ol>
          
          <!-- Wrapper for Images -->
          <div class="carousel-inner" role="listbox">
              <?php
                for($i = 0; $i < 7; ++$i) {
                    
                    // Ensures no duplicate pictures
                    do {
                        $randomIndex = rand(0, count($imageURLs));
                    } while(!isset($imageURLs[$randomIndex]));
                    
                    echo '<div class="item';
                    echo ($i == 0) ? " active" : "";
                    echo '">';
                    echo '<img src="' . $imageURLs[$randomIndex] . '" width=500px>';
                    echo "</div>";
                    unset($imageURLs[$randomIndex]);
                }
              ?>
            </div>
            
            
            <!-- Move Picture Controls -->
            <a class="left carousel-control" href="#carousel-example-generic" role="button" data-slide="prev">
                <span class="glyphicon glyphicon-chevron-left" aria-hidden="true"></span>
                <span class="sr-only">Previous</span>
            </a>
            <a class="right carousel-control" href="#carousel-example-generic" role="button" data-slide="next">
                <span class="glyphicon glyphicon-chevron-right" aria-hidden="true"></span>
                <span class="sr-only">Next</span>
            </a>
        </div>

        <?php
            } // Ends the 'else' statement
        ?>
        
        <br/>
        <br/>
        
        <!--Put Javascript APIs here b/c it could block the displays by going first-->
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
        <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>
    </body>
</html>