<?php
// Initialize Variables
$page_flag = 0;
$clean = array();
$error = array();

if( !empty($_POST) ) {
	foreach( $_POST as $key => $value ) {
		$clean[$key] = htmlspecialchars( $value, ENT_QUOTES);
	} 
}
if( !empty($clean['btn_confirm']) ) {
	$error = validation($clean);
	if( empty($error) ) {
		$page_flag = 1;
	}
} elseif( !empty($clean['btn_submit']) ) {
	$page_flag = 2;
	// To Send Email
	$header = null;
	$auto_reply_subject = null;
	$auto_reply_text = null;
	$admin_reply_subject = null;
	$admin_reply_text = null;
	date_default_timezone_set('America/New_York');
	$header = "MIME-Version: 1.0\n";
	$header .= "From: Slurp & Burp Ramen <admin@chaco.lc>\n";
	$header .= "Reply-To: Slurp & Burp Ramen <admin@chaco.lc>\n";
	$auto_reply_subject = 'Slurp & Burp Ramen | Customer Review Form';
	$auto_reply_text = "Thank You For Your Comment!
We recieved your message as below.\n\n";
	$auto_reply_text .= "Commnent Sent At:" . date("Y-m-d H:i") . "\n";
	$auto_reply_text .= "Name:" . $clean['your_name'] . "\n";
	$auto_reply_text .= "Email:" . $clean['email'] . "\n";
	if( $clean['gender'] === "male" ) {
		$auto_reply_text .= "Gender:Male\n";
	} else {
		$auto_reply_text .= "Gender:Female\n";
	}
	
	if( $clean['age'] === "1" ){
		$auto_reply_text .= "Age:19 or Younger\n";
	} elseif ( $clean['age'] === "2" ){
		$auto_reply_text .= "Age:Between 20 and 29\n";
	} elseif ( $clean['age'] === "3" ){
		$auto_reply_text .= "Age:Between 30 and 39\n";
	} elseif ( $clean['age'] === "4" ){
		$auto_reply_text .= "Age:Between 40 and 49\n";
	} elseif( $clean['age'] === "5" ){
		$auto_reply_text .= "Age:Between 50 and 59\n";
	} elseif( $clean['age'] === "6" ){
		$auto_reply_text .= "Age:60 or Older\n";
	}
	$auto_reply_text .= "Comment:" . nl2br($clean['contact']) . "\n\n";
	$auto_reply_text .= "Slurp & Burp Ramen";
	// To Send Auto Reply Email
	// mb_send_mail( $clean['email'], $auto_reply_subject, $auto_reply_text, $header);
	$admin_reply_subject = "We Recieved Your Commnet";
	$admin_reply_text = "We recieved comment as below.\n\n";
	$admin_reply_text .= "Comment Sent At:" . date("Y-m-d H:i") . "\n";
	$admin_reply_text .= "Name:" . $clean['your_name'] . "\n";
	$admin_reply_text .= "Email Address:" . $clean['email'] . "\n";
	if( $clean['gender'] === "male" ) {
		$admin_reply_text .= "Gender:Male\n";
	} else {
		$admin_reply_text .= "Gender:Female\n";
	}
	
	if( $clean['age'] === "1" ){
		$admin_reply_text .= "Age:19 or Younger\n";
	} elseif ( $clean['age'] === "2" ){
		$admin_reply_text .= "Age:Between 20 and 29\n";
	} elseif ( $clean['age'] === "3" ){
		$admin_reply_text .= "Age:Between 30 and 39\n";
	} elseif ( $clean['age'] === "4" ){
		$admin_reply_text .= "Age:Between 40 and 49\n";
	} elseif( $clean['age'] === "5" ){
		$admin_reply_text .= "Age:Between 50 and 59\n";
	} elseif( $clean['age'] === "6" ){
		$admin_reply_text .= "Age:60 or Older\n";
	}
	$admin_reply_text .= "Comment:" . nl2br($clean['contact']) . "\n\n";
	// To Email Admin
	// mb_send_mail( 'admin@chaco.lc', $admin_reply_subject, $admin_reply_text, $header);
}
function validation($data) {
	$error = array();
	// Name Validation
	if( empty($data['your_name']) ) {
		$error[] = "Enter Name.";
	}
	
	// Email Validation
	if( empty($data['email']) ) {
		$error[] = "Enter Email Address.";
	} elseif ( !filter_var($data['email'], FILTER_VALIDATE_EMAIL) ){
		$error[] = "Wrong Email Format. Please Re-enter Email Address.";
	}
	
	// Gender Validation
	if( empty($data['gender']) ) {
		$error[] = "Enter Gender.";
	}
	
	// Age Validation
	if( empty($data['age']) ) {
		$error[] = "Enter Age.";
	}
	
	// Cemment Validation
	if( empty($data['contact']) ) {
		$error[] = "Enter Commnet.";
	}
	// Privacy Policy Validation
	if( empty($data['agreement']) ) {
		$error[] = "Please Confirm Our Privacy Policy.";
	} elseif( (int)$data['agreement'] != 1 ) {
		$error[] = "Please Confirm And Agree Our Privacy Policy.";
	}

	return $error;
}
?>

<!DOCTYPE>
<html lang="en">
<head>
<title>Slurp &amp; Burp Ramen | Comment Form</title>
<link rel="stylesheet" href="./css/styles.css" type="text/css" media="all" />
<meta http-equiv="content-language" content="en">
<meta charset="UTF-8">
</head>

<body>
<div class="box">
    
<h1>Slurp &amp; Burp Ramen | Comment Form</h1>
<?php if( $page_flag === 1 ): ?>

<form method="post" action="">
	<small>Print this page and take it to counter since Heroku requires credit card information to use the add-ins of mailsender.</small>
	<div class="element_wrap">
		<label for="your_name">Name</label>
		<p><?php echo $clean['your_name']; ?></p>
	</div>
	<div class="element_wrap">
		<label for="email">Email Address</label>
		<p><?php echo $clean['email']; ?></p>
	</div>
	<div class="element_wrap">
		<label for="gender">Gender</label>
		<p><?php if( $clean['gender'] === "male" ){ echo 'Male'; }else{ echo 'Female'; } ?></p>
	</div>
	<div class="element_wrap">
		<label for="age">Age</label>
		<p><?php if( $clean['age'] === "1" ){ echo '19 or Younger'; }
		elseif( $clean['age'] === "2" ){ echo 'Between 20 and 29'; }
		elseif( $clean['age'] === "3" ){ echo 'Between 30 and 39'; }
		elseif( $clean['age'] === "4" ){ echo 'Between 40 and 49'; }
		elseif( $clean['age'] === "5" ){ echo 'Between 50 and 59'; }
		elseif( $clean['age'] === "6" ){ echo '60 or Older'; } ?></p>
	</div>
	<div class="element_wrap">
		<label for="contact">Comment</label>
		<p><?php echo nl2br($clean['contact']); ?></p>
	</div>
	<div class="element_wrap">
		<label for="agreement">Confirm and Agree Privacy Policy.</label>
		<p><?php if( $clean['agreement'] === "1" ){ echo 'Agree'; }else{ echo 'Disagree'; } ?></p>
	</div>
	<input type="submit" name="btn_back" value="Back">
	<input type="submit" name="btn_submit" value="Submit">
	<input type="hidden" name="your_name" value="<?php echo $clean['your_name']; ?>">
	<input type="hidden" name="email" value="<?php echo $clean['email']; ?>">
	<input type="hidden" name="gender" value="<?php echo $clean['gender']; ?>">
	<input type="hidden" name="age" value="<?php echo $clean['age']; ?>">
	<input type="hidden" name="contact" value="<?php echo $clean['contact']; ?>">
	<input type="hidden" name="agreement" value="<?php echo $clean['agreement']; ?>">
</form>

<?php elseif( $page_flag === 2 ): ?>

<p>Comment Sent.</p>

<?php else: ?>

<?php if( !empty($error) ): ?>
	<ul class="error_list">
	<?php foreach( $error as $value ): ?>
		<li><?php echo $value; ?></li>
	<?php endforeach; ?>
	</ul>
<?php endif; ?>

<form method="post" action="">
	<div class="element_wrap">
		<label for="your_name">Name</label>
		<input type="text" name="your_name" value="<?php if( !empty($clean['your_name']) ){ echo $clean['your_name']; } ?>">
	</div>
	<div class="element_wrap">
		<label for="email">Email Address</label>
		<input type="text" name="email" value="<?php if( !empty($clean['email']) ){ echo $clean['email']; } ?>">
	</div>
	<div class="element_wrap">
		<label for="gender">Gender</label>
		<label for="gender_male"><input id="gender_male" type="radio" name="gender" value="male" <?php if( !empty($clean['gender']) && $clean['gender'] === "male" ){ echo 'checked'; } ?>>Male</label>
		<label for="gender_female"><input id="gender_female" type="radio" name="gender" value="female" <?php if( !empty($clean['gender']) && $clean['gender'] === "female" ){ echo 'checked'; } ?>>Female</label>
	</div>
	<div class="element_wrap">
		<label for="age">Age</label>
		<select name="age">
			<option value="">Please Select.</option>
			<option value="1" <?php if( !empty($clean['age']) && $clean['age'] === "1" ){ echo 'selected'; } ?>>19 or Younger</option>
			<option value="2" <?php if( !empty($clean['age']) && $clean['age'] === "2" ){ echo 'selected'; } ?>>Between 20 and 29</option>
			<option value="3" <?php if( !empty($clean['age']) && $clean['age'] === "3" ){ echo 'selected'; } ?>>Between 30 and 39</option>
			<option value="4" <?php if( !empty($clean['age']) && $clean['age'] === "4" ){ echo 'selected'; } ?>>Between 40 and 49</option>
			<option value="5" <?php if( !empty($clean['age']) && $clean['age'] === "5" ){ echo 'selected'; } ?>>Between 50 and 59</option>
			<option value="6" <?php if( !empty($clean['age']) && $clean['age'] === "6" ){ echo 'selected'; } ?>>60 and Older</option>
		</select>
	</div>
	<div class="element_wrap">
		<label for="contact">Comment</label>
		<textarea name="contact"><?php if( !empty($clean['contact']) ){ echo $clean['contact']; } ?></textarea>
	</div>
	<div class="element_wrap">
		<label for="agreement"><input id="agreement" type="checkbox" name="agreement" value="1" <?php if( !empty($clean['agreement']) && $clean['agreement'] === "1" ){ echo 'checked'; } ?>>Agree Privacy Policy.</label>
	</div>
	<div class="cp_box">
		<input id="cp00" type="checkbox">
		<label for="cp00">Read Privacy Policy</label>
		<div class="cp_container" align=left>
<p>Slurp & Burp Ramen ("us", "we", or "our") operates the https://cchan-prj.herokuapp.com/3 website (the "Service").</p>

<p>Information Collection And Use</p>

<p>We collect several different types of information for various purposes to provide and improve our Service to you.</p>

<p>Types of Data Collected</p>

<p>Personal Data</p>

<p>While using our Service, we may ask you to provide us with certain personally identifiable information that can be used to contact or identify you ("Personal Data"). Personally identifiable information may include, but is not limited to:</p>

<ul>
<li>Email address</li><li>First name and last name</li><li>Cookies and Usage Data</li>
</ul>

<p>Usage Data</p>

<p>We may also collect information how the Service is accessed and used ("Usage Data"). This Usage Data may include information such as your computer's Internet Protocol address (e.g. IP address), browser type, browser version, the pages of our Service that you visit, the time and date of your visit, the time spent on those pages, unique device identifiers and other diagnostic data.</p>

<p>Tracking & Cookies Data</p>
<p>We use cookies and similar tracking technologies to track the activity on our Service and hold certain information.</p>
<p>Cookies are files with small amount of data which may include an anonymous unique identifier. Cookies are sent to your browser from a website and stored on your device. Tracking technologies also used are beacons, tags, and scripts to collect and track information and to improve and analyze our Service.</p>
<p>You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our Service.</p>
<p>Examples of Cookies we use:</p>
<ul>
    <li><strong>Session Cookies.</strong> We use Session Cookies to operate our Service.</li>
    <li><strong>Preference Cookies.</strong> We use Preference Cookies to remember your preferences and various settings.</li>
    <li><strong>Security Cookies.</strong> We use Security Cookies for security purposes.</li>
</ul>

<p>Use of Data</p>
    
<p>Slurp & Burp Ramen uses the collected data for various purposes:</p>    
<ul>
    <li>To provide and maintain the Service</li>
    <li>To notify you about changes to our Service</li>
    <li>To allow you to participate in interactive features of our Service when you choose to do so</li>
    <li>To provide customer care and support</li>
    <li>To provide analysis or valuable information so that we can improve the Service</li>
    <li>To monitor the usage of the Service</li>
    <li>To detect, prevent and address technical issues</li>
</ul>

<p>Transfer Of Data</p>
<p>Your information, including Personal Data, may be transferred to — and maintained on — computers located outside of your state, province, country or other governmental jurisdiction where the data protection laws may differ than those from your jurisdiction.</p>
<p>If you are located outside United States and choose to provide information to us, please note that we transfer the data, including Personal Data, to United States and process it there.</p>
<p>Your consent to this Privacy Policy followed by your submission of such information represents your agreement to that transfer.</p>
<p>Slurp & Burp Ramen will take all steps reasonably necessary to ensure that your data is treated securely and in accordance with this Privacy Policy and no transfer of your Personal Data will take place to an organization or a country unless there are adequate controls in place including the security of your data and other personal information.</p>

<p>Disclosure Of Data</p>

<p>Legal Requirements</p>
<p>Slurp & Burp Ramen may disclose your Personal Data in the good faith belief that such action is necessary to:</p>
<ul>
    <li>To comply with a legal obligation</li>
    <li>To protect and defend the rights or property of Slurp & Burp Ramen</li>
    <li>To prevent or investigate possible wrongdoing in connection with the Service</li>
    <li>To protect the personal safety of users of the Service or the public</li>
    <li>To protect against legal liability</li>
</ul>

<p>Security Of Data</p>
<p>The security of your data is important to us, but remember that no method of transmission over the Internet, or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your Personal Data, we cannot guarantee its absolute security.</p>

<p>Service Providers</p>
<p>We may employ third party companies and individuals to facilitate our Service ("Service Providers"), to provide the Service on our behalf, to perform Service-related services or to assist us in analyzing how our Service is used.</p>
<p>These third parties have access to your Personal Data only to perform these tasks on our behalf and are obligated not to disclose or use it for any other purpose.</p>



<p>Links To Other Sites</p>
<p>Our Service may contain links to other sites that are not operated by us. If you click on a third party link, you will be directed to that third party's site. We strongly advise you to review the Privacy Policy of every site you visit.</p>
<p>We have no control over and assume no responsibility for the content, privacy policies or practices of any third party sites or services.</p>


<p>Children's Privacy</p>
<p>Our Service does not address anyone under the age of 18 ("Children").</p>
<p>We do not knowingly collect personally identifiable information from anyone under the age of 18. If you are a parent or guardian and you are aware that your Children has provided us with Personal Data, please contact us. If we become aware that we have collected Personal Data from children without verification of parental consent, we take steps to remove that information from our servers.</p>


<p>Changes To This Privacy Policy</p>
<p>We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.</p>
<p>We will let you know via email and/or a prominent notice on our Service, prior to the change becoming effective and update the "effective date" at the top of this Privacy Policy.</p>
<p>You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.</p>


<p>Contact Us</p>
<p>If you have any questions about this Privacy Policy, please contact us:</p>
<ul>
        <li>By email: admin@chaco.lc</li>
          
        </ul>
		</div>
	</div>

	<input type="submit" name="btn_confirm" value="Confirm">
</form>

<?php endif; ?>

    <footer>
    
        <hr>
            2019&copy; <strong>Hisako Yada</strong> <br />
            <img id="logo" src="./img/logo.gif" alt="logo"/>
        
    </footer>

</div>
</body>
</html>
