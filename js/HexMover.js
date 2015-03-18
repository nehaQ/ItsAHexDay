// Author: Neha Agrawal 2015
//   Notes: Opacity or brightness cannot be changed without changing the instrinsic value
//   		  of the Hex Color. For example, to reduce the brightness of the given colours
//   		  using a function. A change in brightness would result in a completely 
//   		  different colour
//   		  * ('#000000', 50) --> #808080
// 		  * ('#EEEEEE', 25) --> #F2F2F2
// 		  * ('EEE     , 25) --> #F2F2F2

//---------------------------------------------------------------------------------------

var red 		= 0x00;
var green 		= 0x00;
var blue 		= 0x00;
var blueStep 	= 1;
var greenStep 	= 1;
var redStep 	= 1;
var opacity 	= 1.0;
var upperColourLimit = 0x100;
var lowerColourLimit = -1;
var displayRed;
var displayGreen;
var displayBlue;

$(document).ready(function(){

	displayRed = document.getElementById('displayRed');
	displayGreen = document.getElementById('displayGreen');
	displayBlue = document.getElementById('displayBlue');

	timeout()
	
});


function timeout() {
	
		setTimeout(function () {
	        
	        setColour();
	        changeBlue();
	        if(blue == upperColourLimit || blue == lowerColourLimit)
	        {
	        	blueStep *= -1;
	        	changeBlue();

	        	// GREEN
	        	changeGreen();
	        	if(green == upperColourLimit || green == lowerColourLimit)
	        	{
	        		greenStep *= -1; 
	        		changeGreen();

	        		// RED
	        		changeRed();
	        		if(red == upperColourLimit || red == lowerColourLimit)
	        		{
	        			redStep *= -1;
	        			changeRed();
	        		}
	        	}
	        }

	        timeout();
    	}, 5);	
	  
}

//----------------------------------------------------------------------------

function setColour () {
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