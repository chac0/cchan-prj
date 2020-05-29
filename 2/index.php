<?php
session_start();
if (!isset($_SESSION["times"])){
	$_SESSION["times"] = 0;
}
if (!isset($_SESSION["win"])){
	$_SESSION["win"] = 0;
}
if (!isset($_SESSION["draw"])){
	$_SESSION["draw"] = 0;
}
if (!isset($_SESSION["lose"])){
	$_SESSION["lose"] = 0;
}
if (isset($_GET["rsp"])){
	rsp_exec($_GET["rsp"]);
} elseif($_GET["mode"] == "reset"){
	session_destroy();
	rsp_input();
} else {
	rsp_input();
}

function rsp_input(){

	$input_html_header = <<<_EOD
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"
   "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="ja" lang="ja">
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
	<meta http-equiv="Content-Style-Type" content="text/css" />
	<title> Rock Scissors Paper Game </title>
	<link rel="stylesheet" href="./css/styles.css" type="text/css" media="all" />
    <link href="https://fonts.googleapis.com/css?family=Montserrat" rel="stylesheet">
</head>
<body>
	<h1>Rock Scissors Paper Game</h1>
	<div class="main">
		<form id="rsp" method="GET" action="index.php">
		<h2>Choose Your Hand</h2>
		<div>
_EOD;

	$input_html_footer = <<<_EOD
			<br />
			<br />
			<input type="submit" value="Go!" />
		</div>
		</form>
	</div>
</body>
    <footer>
    
        <hr>
            2019&copy; <strong>Hisako Yada</strong> <br />
            <img id="logo" src="./img/logo.gif" alt="logo"/>
        
    </footer>
</html>
_EOD;

	echo $input_html_header;
	
	$defined_hand = array('rock' => 'ROCK', 'scissors' => 'SCISSORS', 'paper' => 'PAPER');
	while ($current_value = current($defined_hand)) {
	    echo '<input type="radio" name="rsp" value="'.key($defined_hand).'">'.$defined_hand[key($defined_hand)].'&nbsp;<img width="50" src="./img/'.key($defined_hand).'.jpg" /></input><br />';
	    next($defined_hand);
	}
	
	echo $input_html_footer;
	
}

function rsp_exec($hand){

	$_SESSION["times"]++;
	$s_times = $_SESSION["times"];
	$my_hand = array('rock' => 1, 'scissors' => 2, 'paper' => 3);
	$my_hand_jp = array('rock' => 'ROCK', 'scissors' => 'SCISSORS', 'paper' => 'PAPER');
	$cpu_hand_jp = array( 1 => 'ROCK', 2 => 'SCISSORS', 3 => 'PAPER');
	$cpu_hand = array_rand($cpu_hand_jp);
	$battle = $my_hand[$hand] - $cpu_hand;
	switch ($battle) {
		case -1 :
		case 2  :
			$result = "You Won :D";
			$result_short = "Won";
			$_SESSION["win"]++;
			break;
		case 0  :
			$result = "One More Time :)";
			$result_short = "Draw";
			$_SESSION["draw"]++;
			break;
		default :
			$result = "You Lost :(";
			$result_short = "Lost";
			$_SESSION["lose"]++;
	}
	$my_hand_out = $my_hand_jp[$hand];
	$cpu_hand_out = $cpu_hand_jp[$cpu_hand];
	$d = getdate();
	$datetime = $d["year"]."/".$d["mon"]."/".$d["mday"]." ".$d["hours"].":".$d["minutes"];
	$_SESSION["detail"] .= $datetime
	 ." You: ".$my_hand_out." Computer: ".$cpu_hand_out
	 ." Result: ".$result_short."<br />\n";
	 
$exec_html = <<<_EOD
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"
   "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="ja" lang="ja">
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
	<meta http-equiv="Content-Style-Type" content="text/css" />
	<title> Rock Scissors Paper | Result </title>
	<link rel="stylesheet" href="./css/styles.css" type="text/css" media="all" />
    <link href="https://fonts.googleapis.com/css?family=Montserrat" rel="stylesheet">
</head>
<body>
	<h1>Rock Scissors Paper | Result</h1>
	<div class="main">
		<h2>You : $my_hand_out Computer : $cpu_hand_out </h2>
		<h2>The Result is ... $result </h2>
		<h3>- Game History -</h3>
		<p>
		Win : {$_SESSION["win"]} / Lost : {$_SESSION["lose"]} / Draw : {$_SESSION["draw"]}
		</p>
		<p style="font-size:8pt;">
		Details<br />
		{$_SESSION["detail"]}
		</p>
		<p>
			<a href="index.php">One More Game?!</a>
		</p>
		<p>
			<a href="index.php?mode=reset">Reset History</a>
		</p>
	</div>
</body>
    <footer>
    
        <hr />
            2019&copy; <strong>Hisako Yada</strong> <br />
            <img id="logo" src="./img/logo.gif" alt="logo"/>
        
    </footer>
</html>
_EOD;
	echo $exec_html;

}
?>
