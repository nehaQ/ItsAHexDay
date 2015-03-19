// Author: Neha Agrawal 2015
//   Notes: Opacity or brightness cannot be changed without changing the instrinsic value
//   		  of the Hex Color. For example, to reduce the brightness of the given colours
//   		  using a function. A change in brightness would result in a completely
//   		  different colour
// 		  * ('#000000', 50) --> #808080
// 		  * ('#EEEEEE', 25) --> #F2F2F2
// 		  * ('EEE     , 25) --> #F2F2F2
//			Dont think my calculations for setting initial colours are completely correct.
// 			I am open to feedback on this issue

//---------------------------------------------------------------------------------------

var red 		     = 0x00;
var green 		     = 0x00;
var blue 		     = 0x00;
var blueStep 	     = 1;
var greenStep 	     = 1;
var redStep 	     = 1;
var opacity 	     = 1.0;
var upperColourLimit = 0x100;
var lowerColourLimit = -1;
var displayRed;
var displayGreen;
var displayBlue;
var image;

$(document).ready(function() {

	// Dom label elements
	displayRed = document.getElementById('displayRed');
	displayGreen = document.getElementById('displayGreen');
	displayBlue = document.getElementById('displayBlue');
	image = document.getElementById('bday');

	// Time in milliseconds since midnight
	var now = new Date(),
	then = new Date(
		now.getFullYear(),
		now.getMonth(),
		now.getDate(),
		0,0,0),
		diff = now.getTime() - then.getTime(); // difference in milliseconds

	var colour = diff; // The colour we should currently be at
	// Now calculate RGB and steps
	setInitialColours(colour);

	timeout()

});

function setInitialColours (colourNumber)
{
	// Set blue initial colour
	var copy = colourNumber;
	copy = Math.floor(copy%0x9F6);
	copy = Math.floor(copy/0x5);
	if(copy > 0xFF) {
		blueStep = -1;
		blue = 0xFF - (copy - 0x100);
	}
	else {
		blue = copy;
	}

	// Set Green initial colour
	copy = colourNumber;
	copy = Math.floor(copy%0x9F600);
	copy = Math.floor(copy/0x4FB);
	if(copy > 0xFF) {
		greenStep = -1;
		green = 0xFF - (copy - 0x100);
	}
	else {
		green = copy;
	}

	//Set Red initial colour
	copy = colourNumber;
	debugger;
	copy = Math.floor(copy%0x4FB0000);
	copy = Math.floor(copy/0x9F600);
	if(copy > 0xFF) {
		redStep = -1;
		red = 0xFF - (copy - 0x100);
	}
	else {
		red = copy;
	}
}


function timeout()
{
		setTimeout(function () {
			setColour();
			changeBlue();
			if(blue == upperColourLimit || blue == lowerColourLimit) {
				blueStep *= -1;
				changeBlue();

				// GREEN
				changeGreen();
				if(green == upperColourLimit || green == lowerColourLimit) {
					greenStep *= -1;
					changeGreen();

					// RED
					changeRed();
					if(red == upperColourLimit || red == lowerColourLimit) {
						redStep *= -1;
						changeRed();
					}
				}
			}

			timeout();
		}, 5);
}

//----------------------------------------------------------------------------

function setColour ()
{
	var colourRGB = parseInt(red)+","+parseInt(green)+","+parseInt(blue);
	$('.screen').css("background-color", "rgb("+colourRGB+")");
	displayRed.textContent = red;
	displayGreen.textContent = green;
	displayBlue.textContent = blue;
	// console.log(red+" "+green+" "+blue+" "+redStep + " "+greenStep+ " "+ blueStep);
}

function changeRed()
{
	red = red + redStep;
}

//------------------------------------------------------------------------------

function changeGreen()
{
	green = green + greenStep;
}

//------------------------------------------------------------------------------

function changeBlue()
{
	blue = blue + blueStep;
}

//-----------------------------------------------------------------------------

function changeOpacity ()
{
	opacity = opacity + opacityStep;
}

//-----------------------------------------------------------------------------

function BirthdayKeyPress(e)
{
	var evtobj = window.event? event : e
	if (evtobj.keyCode == 69 && evtobj.ctrlKey) {
		image.style.display = "";
	}
}

function HideBirthday (e) {
	image.style.display = "none";
}

document.onkeydown = BirthdayKeyPress;
document.onkeyup   = HideBirthday;
