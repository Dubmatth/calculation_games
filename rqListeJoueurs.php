<?php


$pdo = new PDO('mysql:host=localhost;dbname=calculs;charset:utf8', 'root', 'root');
$rq = $pdo->prepare('SELECT * FROM joueur');
$rq->execute();
$result = $rq->fetchAll(PDO::FETCH_ASSOC);

echo json_encode($result);