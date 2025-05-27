<?php
if (isset($_FILES['audioFile'])) {
    $targetDir = "uploads/";
    $fileName = basename($_FILES["audioFile"]["name"]);
    $targetFile = $targetDir . $fileName;

    if (move_uploaded_file($_FILES["audioFile"]["tmp_name"], $targetFile)) {
        echo "File uploaded: " . $targetFile;
        // Save $targetFile path to the database as needed
    } else {
        echo "Upload failed.";
    }
}
?>
