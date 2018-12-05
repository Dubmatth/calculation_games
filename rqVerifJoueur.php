<?php

$pseudo = $_POST['pseudo'];

$pdo = new PDO('mysql:host=localhost;dbname=calculs;charset:utf8', 'root', 'root');
$rq = $pdo->prepare('SELECT pseudo, nom, prenom FROM joueur WHERE pseudo = :pseudo');
$rq->bindParam(':pseudo', $pseudo, PDO::PARAM_STR);
$rq->execute();
$result = $rq->fetchAll(PDO::FETCH_ASSOC);

echo json_encode($result);