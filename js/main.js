/**
 * Created by janis on 18/12/16.
 */


var light = false;
var pressed = false;
var soundIn = true;
var soundOut = false;
var HandIn = false;


var output = document.getElementById('output');
var output2 = document.getElementById('output2');
var progress = document.getElementById('progress');
var background = document.getElementById("bg");

var $sound = $('#sound');

var posthumb;
var thumbStart, thumbMid, indexStart, indexEnd, indexMid, indexTip;
var vectorBetweenIndexStart;
var mainValue = 100;
var trackMovement = false;
var posEnter;
var saveMainValue;
var firstDistance;
var distance;

var color = 0;
var g = 40;
var soundIn2 = false;
var tap = 1;
var aktion = false;
var active = false;
var timer;




// Variablen für Navigation
var row = 1;
var nav,
    navOld = 0;
var left = false,
    right = false;


$(document).ready(function () {
    $('.nav').slick({
        centerMode: true,
        centerPadding: '60px',
        slidesToShow: 3,
        arrows: true,
        focusOnSelect: true,
        edgeFriction: 0
    });

    $('.nav2').slick({
        centerMode: true,
        centerPadding: '60px',
        slidesToShow: 7,
        arrows: true,
        focusOnSelect: true,
        edgeFriction: 0
    });

});


var controllerTest = Leap.loop(function (frame) {

    output.innerHTML = 'distance: ' + Math.round(distance);
    output2.innerHTML = 'width:' + Math.round(saveMainValue);



    if (HandIn && soundIn) {
        $.playSound("data/txting_press_b");
        soundIn = false;
    }
    else if (!HandIn && !soundIn) {
        $.playSound("data/txting_press_a");
        soundIn = true;
    }
    HandIn = false;
});


var tappedLeft = false,
    tapTimeout = null;



// LOOP Funktion  -----------------------------------------------------------------------------------
Leap.loop({background: true}, {

    hand: function (hand) {
        HandIn = true;



        posthumb = hand.fingers[1].dipPosition[0];

        // defi. Finger
        thumbStart = new Vector(hand.fingers[0].dipPosition[0], hand.fingers[0].dipPosition[1], hand.fingers[0].dipPosition[2]);
        thumbMid = new Vector(hand.fingers[0].pipPosition[0], hand.fingers[0].pipPosition[1], hand.fingers[0].pipPosition[2]);
        indexStart = new Vector(hand.fingers[1].dipPosition[0], hand.fingers[1].dipPosition[1], hand.fingers[1].dipPosition[2]);
        indexMid = new Vector(hand.fingers[1].pipPosition[0], hand.fingers[1].pipPosition[1], hand.fingers[1].pipPosition[2]);
        indexEnd = new Vector(hand.fingers[1].mcpPosition[0], hand.fingers[1].mcpPosition[1], hand.fingers[1].mcpPosition[2]);
        indexTip = new Vector(hand.fingers[1].distal.nextJoint[0], hand.fingers[1].distal.nextJoint[1], hand.fingers[1].distal.nextJoint[2]);
        // console.log(hand.fingers[0].distal.nextJoint);
        // TAP Back -----------------------------------------------------------------------------------



        var abstandThumbIndexToIndexMCP = vectorBetweenPoints(thumbMid, indexStart).length();
        // console.log(abstandThumbIndexToIndexMCP);

        // Tappen
        if (abstandThumbIndexToIndexMCP < 90 && trackMovement == false) {

        }


        // TAP -----------------------------------------------------------------------------------


        // Adistance from thumb to indexMid
        var verbindungsvektor = vectorBetweenPoints(thumbStart, indexMid);
        var abstand0zu1 = verbindungsvektor.length();


        // Adistance from thumb to indexStart
        var abstandThumbIndex = vectorBetweenPoints(thumbStart, indexTip).length();
        console.log(abstandThumbIndex);
        // TAP-Left
        if (abstandThumbIndex < 40 && trackMovement == false) {
            tappedLeft = true;
            console.log(tappedLeft);
        } else {
            tappedLeft = false;
            // console.log(tappedLeft);

        }


        // Slide -----------------------------------------------------------------------------------


        vectorBetweenIndexStart = vectorBetweenPoints(indexStart, indexEnd);
        lineindex = new Line(indexStart, vectorBetweenIndexStart);

        distance = lineindex.distanceFromPoint(thumbStart);

        var threshold = 24;
        var multiplier = 5;

        //enter tracking
        if (distance < threshold && trackMovement == false) {
            trackMovement = true;
            posEnter = thumbStart;

            var diffVector = vectorBetweenPoints(posEnter, indexStart);
            firstDistance = diffVector.length();
        }


        //tracking
        if (distance < threshold && trackMovement == true) {

            // timer = setTimeout(function(){ active = true}, 2000);
            
            
            // if(active) {

            diffVector = vectorBetweenPoints(posEnter, thumbStart);
            var diffLength = diffVector.length();

            diffVector = vectorBetweenPoints(thumbStart, indexStart);
            var newDistance = diffVector.length();

            if (newDistance > firstDistance) {
                saveMainValue = mainValue + diffLength * multiplier;
            }
            else {
                saveMainValue = mainValue - diffLength * multiplier;
            }


            $('#output').css('font-weight', 'bold');

            color = Math.round(map(saveMainValue, -20, 1200, 0, 255));

            var r = color;

            var b = 130;



            nav = Math.round(saveMainValue);


            console.log("nav" + nav);
            console.log("navOld" + navOld);



        }

        // Tap-Left Row 1
        if (tappedLeft && row == 1) {

            $( ".content" ).animate({
                opacity: 0.1,
                marginTop: 0
            }, 0, function() {
                // Animation complete.
            });

            $( ".slick-current" ).animate({
                opacity: 1
            }, 0, function() {
                // Animation complete.
            });

            row = 2;
            console.log("row:" + row);
        }


        //exit tracking
        if (distance >= threshold && trackMovement == true) {
            trackMovement = false;
            mainValue = saveMainValue;
            aktion = false;

            $('#output').css('font-weight', 'normal');
            // console.log("exit");

            if (nav > navOld) {
                left = true;
                right = false;
                navOld = nav;
            } else if (nav < navOld) {
                right = true;
                left = false;
                navOld = nav;
            } else {
                right = false;
                left = false;
                navOld = nav;
            }

            // Slide Left Row 1
            if (left && row == 1) {
                $('.nav').slick("slickPrev");
                console.log("SwipeLeft");
            }

            // Slide Right Row 1
            if (right && row == 1) {
                $('.nav').slick("slickNext");
                console.log("SwipeRight")
            }

            // Slide Left Row 2
            if (left && row == 2) {
                $('.nav2').slick("slickPrev");
                console.log("SwipeLeft");
            }
        }


        // Show Row 2
        if (row == 2) {
            $('.nav2').css("opacity", "1");
        }



        // else if (ausgabe < ausgabeOld && row == 1) {
        //
        //     $('.nav').slick("slickNext");
        //     ausgabeOld = ausgabe;
        // }


        // else if (ausgabe < ausgabeOld && row == 2) {
        //
        //     $('.nav2').slick("slickNext");
        //     ausgabeOld = ausgabe;
        // }

    }
});






// Allow usage of pints
function Point(x, y, z) {
    this.x = x || 0;
    this.y = y || 0;
    this.z = z || 0;
}

function Vector(x, y, z) {
    this.x = x || 0;
    this.y = y || 0;
    this.z = z || 0;
}

// Add two vectors
Vector.prototype.add = function (vector) {
    var vx = this.x + vector.x;
    var vy = this.y + vector.y;
    var vz = this.z + vector.z;
    return new Vector(vx, vy, vz);
}

Vector.prototype.length = function () {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
}

Vector.prototype.subtract = function (vector) {
    var vx = this.x - vector.x;
    var vy = this.y - vector.y;
    var vz = this.z - vector.z;
    return new Vector(vx, vy, vz);
}

Vector.prototype.multiply = function (vector) {
    var vx = this.x * vector.x;
    var vy = this.y * vector.y;
    var vz = this.z * vector.z;
    return new Vector(vx, vy, vz);
}

Vector.prototype.divide = function (vector) {
    var vx = this.x / vector.x;
    var vy = this.y / vector.y;
    var vz = this.z / vector.z;
    return new Vector(vx, vy, vz);
}

Vector.prototype.crossProduct = function (vector) {
    var vx = (this.y * vector.z) - (this.z * vector.y);
    var vy = (this.z * vector.x) - (this.x * vector.z);
    var vz = (this.x * vector.y) - (this.y * vector.x);

    return new Vector(vx, vy, vz);
}

function Line(a, b) {
    this.stuetzvektor = a || 0;
    this.richtungsvektor = b || 0;
}

Line.prototype.distanceFromPoint = function (p) {
    var pointMinusStuetzvektor = p.subtract(this.stuetzvektor);
    var naechsterSchritt = pointMinusStuetzvektor.crossProduct(this.richtungsvektor);
    var lengthieren = naechsterSchritt.length();
    var untereHaelfte = this.richtungsvektor.length();

    return lengthieren / untereHaelfte;
};


// function playMusic(flag) {
//     if (flag) {
//         $sound[0].play();
//         soundIn2 = true;
//         tap = 2;
//     }
//     else {
//         soundIn2 = true;
//         // stop sound
//         tap = 1;
//
//         $sound[0].pause();
//         $sound[0].currentTime = 0;
//
//     }
// }


////////////////////////////////////////

function vectorBetweenPoints(a, b) {
    var vx = a.x - b.x;
    var vy = a.y - b.y;
    var vz = a.z - b.z;
    return new Vector(vx, vy, vz);
}

function map(value, f1, t1, f2, t2) {
    return f2 + (t2 - f2) * (value - f1) / (t1 - f1);
}

function rgbToHex(r, g, b) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}
