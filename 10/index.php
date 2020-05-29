<?php
    session_start();
?>

<!DOCTYPE html>
<html>
    <head>
        <title> Admin Login </title>
        <style>
            @import url("css/styles.css");
        </style>
    </head>   
    <body>
        <h1> Admin Login </h1>

        <form method = "POST" action= "loginProcess.php">
            Username: <input type = "text" name="username"/> <br/>
            Password: <input type = "password" name="password"/> <br/><br/>
            
            <input type="submit" name = "login" value = "Login!"/>
            <br/><br/>
            <?php
                if($_SESSION['incorrect']){
                    echo "<p class = 'lead' id = 'error' style='color:red'>";
                    echo "<strong>Incorrect Username or Password!</strong></p>";
                }
            ?>
        </form>
    </div>
    </body>
</html>
