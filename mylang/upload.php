<!DOCTYPE html>
<html lang="en">
<head>
	<meta http-equiv="content-type" content="text/html; charset=UTF-8" />
	<title>File Upload</title>
	<link rel="stylesheet" href="/m2aonline/assets/css/app.css">
	<script src="/m2aonline/assets/js/vendor/jquery-min.js"></script>
</head>
<body class="file_upload">
	<?php 
		if (isset($_GET['fieldName'])) {
			// Field name has been set:
			$fld = $_GET['fieldName'];
		}
		
		if (isset($_GET['accNo'])) {
			// Record accession number:
			$acc = $_GET['accNo'];
		}
		
		// This will only run if a file has been uploaded:
		if (isset($_FILES['file'])) {
			// Set up variables for use:
			$folder = "F:\\M2ADEMO\M2AIMG\\"; // The folder which images will ultimately be stored in
			$max_file_size = 0; // The maximum file size (in bytes)
		
			// Setup disallowed filetypes:
			$bad_ext = array("php","php4","php5","js","exe","bat","py","sql","htaccess","config","asp","aspx","cgi","pl","jar","cgi","dat","htm","html");
			
			// Setup temp variable for getting file extension:
			$temp = explode('.', $_FILES['file']['name']);
			$ext = strtolower(end($temp));
			
			// Check if file is allowed based on filetype alone:
			if (in_array($ext, $bad_ext)) {
				$errors[] = "Bad filetype. Files of type '" . $ext . "' are not allowed to be uploaded.";
			} else {
				// A server side error was encountered with the file:
				if ($_FILES['file']['error'] > 0) {
					switch($_FILES['file']['error']) {
						case 1:
							$errors[] = "Filesize is too large.";
							break;
						case 2:
							$errors[] = "Filesize is too large.";
							break;
						case 3:
							$errors[] = "File was only partially uploaded, please try again.";
							break;
						case 4:
							$errors[] = "No file was selected for uploaded. Please select a file and try again.";
							break;
						case 6:
							$errors[] = "Temporary folder missing.  Please contact MINISIS Inc.";
							break;
						case 7:
							$errors[] = "Failed to write to disk.  Please contact MINISIS Inc.";
							break;
						case 8:
							$errors[] = "A site extension stopped the file upload.  Please contact MINISIS Inc.";
							break;
						default:
							$errors[] = "An unknown error occurred.  Please try again, and if the issue persists, please contact MINISIS Inc.";
							break;
					}
				} else {				
					// Ensure that the file is less than the maximum allowed file size,
					// or, ignore file size if the maximum allowed file size is set to '0'.
					if (!($max_file_size < 1 || ($_FILES['file']['size'] <= $max_file_size))) {
						$errors[] = "Filesize of " . $_FILES['file']['size'] . " bytes is larger than the allowed size of " . $max_file_size . " bytes.";
					} else {
						// File was successfully uploaded to the temp folder:
						if (isset($acc)) {
							$new_filename = $acc . ' ' . random_filename();
							$new_filename = str_replace(' ', '_', $new_filename);
						} else {
							$new_filename = random_filename() . random_filename();
						}
						
						if (file_exists($folder . $new_filename . '.' . $ext)) {
							while (file_exists($folder . $new_filename . '.' . $ext)) {
								if (isset($acc)) {
									$new_filename = $acc . ' ' . random_filename();
									$new_filename = str_replace(' ', '_', $new_filename);
								} else {
									$new_filename = random_filename() . random_filename();
								}
							}
						}
						
						 if (move_uploaded_file($_FILES["file"]["tmp_name"], $folder.$new_filename.'.'.$ext)) {
							$success[] = "File was successfully uploaded as $new_filename.$ext.";
						 } else {
							$errors[] = "There was an error moving your file to the correct folder.";
						 }
						
					}
				}
				
			}
		}
		
		
		function random_filename() {
			$chars = rand(2,5);
			$digits = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890'; 
			return substr(str_shuffle($digits), 0, $chars);
		}
		
	?>
	<h2>Please select a file to upload</h2>
	<?php
		if (isset($errors)) {
			foreach ($errors as $error) {
				echo "<p class=\"error\">\n";
				echo "\t $error \n";
				echo "</p>\n";
			}
		}
		
		if (isset($success)) {
			foreach ($success as $s) {
				echo "<p class=\"success\">\n";
				echo "\t $s \n";
				echo "</p>";
			}
		}
	?>
	
	
	
	
	<form method="post" enctype="multipart/form-data">
		<label for="file">Filename:</label>
		<input type="file" name="file" id="file"><br>
		<input type="submit" name="submit" value="Submit">
	</form>
	<script>
		var uploadField = document.getElementById("file");
		uploadField.onchange = function() {
			if(this.files[0].size > 50000000){
			alert("File Is Too Big. Maximum Allowed File Size is 50MB");
			this.value = "";
			};
		};
	</script>
	
	<?php if (isset($success)): ?>
		<script>
			// Get the calling field (where to put the file location into):
			var callField = '#' + '<?php echo $fld; ?>';
			var file = '<?php echo $new_filename.'.'.$ext; ?>';
			parent.$tmp = file;
			parent.$.colorbox.close();
		</script>
	<?php endif; ?>
</body>
</html>