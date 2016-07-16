var map;
var marker;

var width = document.width;
var stick;
var control;

var midX, midY;
var maxRadius = 110;
var lastX, lastY;

// Walk every 1 second
var walkHandle;
var walkIntervalInMs = 1000;
var touching = false;
var speedInMeterPerSecond = 8;

// location
var currentLat, currentLng;

function init() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            createMap(position.coords.latitude, position.coords.longitude);
        });
    } else {
        createMap();
    }
    control = $("#control");
    control.on('touchstart', handleStart);
    control.on('touchend', handleEnd);
    control.on('touchcancel', handleCancel);
    control.on('touchmove', handleMove);
    stick = $("#stick");

    // Calculate offsets

    // Middle point coords relative to the control area
    midX = control.width() / 2;
    midY = control.height() / 2;
}


function createMap(lat, lng) {
    currentLat = lat || -25.363;
    currentLng = lng || 131.044;
    var myLatLng = { lat: currentLat, lng: currentLng };

    map = new google.maps.Map($("#map")[0], {
        center: myLatLng,
        zoom: 18,

        zoomControl: true,
        mapTypeControl: false,
        scaleControl: false,
        streetViewControl: false,
        rotateControl: true,
        fullscreenControl: true
    });

    marker = new google.maps.Marker({
        position: myLatLng,
        map: map
    });
    // marker.setAnimation(google.maps.Animation.BOUNCE);

}

function handleStart(e) {
    // console.log("handleStart: ", arguments);
    walkHandle = setInterval(walk, walkIntervalInMs);
    e.preventDefault();
}

function handleMove(event) {
    // console.log("handleMove: ", event);
    event.preventDefault();

    var x = event.originalEvent.pageX - control.offset().left - 30;
    var y = event.originalEvent.pageY - control.offset().top - 30;

    var result = limitCoordsToCircle(event.originalEvent.pageX, event.originalEvent.pageY);

    // console.log(result)
    stick.css({
        top: result.y - 30,
        left: result.x - 30
    });
    lastX = result.x;
    lastY = result.y;
}

function limitCoordsToCircle(rawX, rawY) {
    var x = rawX - control.offset().left;
    var y = rawY - control.offset().top;

    var distance = Math.sqrt((x - midX) * (x - midX) + (y - midY) * (y - midY));
    var ratio = distance / maxRadius;
    if (distance <= maxRadius) {
        return { x: x, y: y };
    }
    ratio = 1 / ratio;
    var newX = midX + (x - midX) * ratio;
    var newY = midY + (y - midY) * ratio;
    return { x: newX, y: newY };
}

function handleCancel(e) {
    e.preventDefault();
    clearInterval(walkHandle);
}

function handleEnd(e) {
    e.preventDefault();
    clearInterval(walkHandle);
}

function walk() {
    // Latitude: 1 deg = 110.574 km
    // Longitude: 1 deg = 111.320*cos(latitude) km
    var deltaXInMeter = (lastX - midX) / 110 * speedInMeterPerSecond;
    var deltaYInMeter = (lastY - midY) / 110 * speedInMeterPerSecond;

    currentLat = currentLat - deltaYInMeter / 110574.0;
    currentLng = currentLng + deltaXInMeter / (111320.0 * Math.cos(currentLat));
    console.log(currentLat, currentLng);
    // UI update
    var center = new google.maps.LatLng(currentLat, currentLng);
    map.panTo(center);
    marker.setPosition(center);

    // Call backend to click
    $.get("updateLocation.php?lat=" + currentLat + "&lng=" + currentLng);
}
