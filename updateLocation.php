<?php

$lat = $_REQUEST["lat"];
$lng = $_REQUEST["lng"];

$xmlString = '<gpx><wpt lat="'.$lat.'" lon="'.$lng.'"></wpt></gpx>';
echo $xmlString;
file_put_contents('location.gpx',$xmlString);
shell_exec('/Users/liuyisun/tmp/PokeStick/autoclicker_bin 547 1073');
sleep(0.1);
shell_exec('/Users/liuyisun/tmp/PokeStick/autoclicker_bin 547 1115');
//547 1315
//547 1359
?>