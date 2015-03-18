/*!
 * station-clock.js
 *
 * Copyright (c) 2010 Ruediger Appel
 * ludi at mac dot com
 *
 * Date: 2010-08-08
 * Version: 1.0.0
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *   http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * Known Issues:
 *
 *   Shadows for some second hands is not on one layer
 */

// clock body (Uhrgehäuse)
StationClock.RoundBody      = 2;

// stroke dial (Zifferblatt)
StationClock.AustriaStrokeDial    = 3;

//clock hour hand (Stundenzeiger)
StationClock.PointedHourHand = 1;

//clock minute hand (Minutenzeiger)
StationClock.PointedMinuteHand = 1;

//clock second hand (Sekundenzeiger)
StationClock.BarSecondHand           = 1;

// clock boss (Zeigerabdeckung)
StationClock.NoBoss    = 0;

// minute hand behaviour
StationClock.CreepingMinuteHand        = 0;

// second hand behaviour
StationClock.CreepingSecondHand        = 0;

document.addEventListener('DOMContentLoaded', start);

function start()
{   
  var clock = new StationClock("clock");
  clock.body = StationClock.RoundBody;
  
  clock.dial = StationClock.AustriaStrokeDial;
  clock.hourHand = StationClock.PointedHourHand;
  clock.minuteHand = StationClock.PointedMinuteHand;
  clock.secondHand = StationClock.BarSecondHand;
  clock.boss = StationClock.NoBoss;
  clock.minuteHandBehaviour = StationClock.CreepingMinuteHand;
  clock.secondHandBehaviour = StationClock.CreepingSecondHand;

  window.setInterval(function() {clock.draw();}, 50);
}

function StationClock(clockId) {
  this.clockId = clockId; 
  this.radius  = 0;

  // clock body
  this.bodyShadowColor   = "rgba(0,0,0,0.5)";
  this.bodyShadowOffsetX = 0.03;
  this.bodyShadowOffsetY = 0.03;
  this.bodyShadowBlur    = 0.06;
  
  this.handShadowColor   = "rgba(0,0,0,0.3)"; // this needs to be changed
  this.handShadowOffsetX = 0.03;
  this.handShadowOffsetY = 0.03;
  this.handShadowBlur    = 0.04;
  
  // clock boss
  this.bossShadowColor   = "rgba(0,0,0,0.2)";
  this.bossShadowOffsetX = 0.02;
  this.bossShadowOffsetY = 0.02;
  this.bossShadowBlur    = 0.03;
  
  // hand animation
  this.minuteHandAnimationStep = 0;
  this.secondHandAnimationStep = 0;
  this.lastMinute = 0;
  this.lastSecond = 0;
  
}

var fillCircleColour = 'rgb(255, 255, 255)';
var strokeCircleColour = 'rgb(204, 204, 204)';
var strokeLineColour = 'rgb(255, 255, 255)';
var fillPolygonColour = 'rgb(204, 204, 204)';
var hourHandColour = 'rgb(204, 204, 204)';
var minuteHandColour = 'rgb(255, 255, 255)';
var secondHandColour = 'rgb(255, 0, 0)';

function setSetShadowColour(colour)
{
  setShadowColour = colour;
}

function setFillCircleColour(colour)
{
  fillCircleColour = colour;
}

function setStrokeCircleColour(colour)
{
  strokeCircleColour = colour;
}

function setStrokeLineColour(colour)
{
  strokeLineColour = colour;
}

function setFillPolygonColour(colour)
{
  fillPolygonColour = colour;
}


StationClock.prototype.draw = function() {
  var clock = document.getElementById(this.clockId);
  if (clock) {
    var context = clock.getContext('2d');
    if (context) {
      this.radius = 0.75 * (Math.min(clock.width, clock.height) / 2);
      
      // clear canvas and set new origin
      context.clearRect(0, 0, clock.width, clock.height);
      context.save();
      context.translate(clock.width / 2, clock.height / 2);
      
      // draw body--------------------------------------
      context.save();
      this.fillCircle(context, fillCircleColour, 0, 0, 0);//change here for inner circle colour
      context.save();
      this.setShadow(context, this.bodyShadowColor, this.bodyShadowOffsetX, this.bodyShadowOffsetY, this.bodyShadowBlur);
      this.strokeCircle(context, strokeCircleColour, 0, 0, 1.05, 0.03); // RING: context, colour of ring, radius of ring, width of ring
      context.restore();
      context.restore();
      
      // draw dial-----------------------------------
      for (var i = 0; i < 60; i++) {
        context.save();
        context.rotate(i * Math.PI / 30);
        if ((i % 5) == 0) {
              this.fillPolygon(context, fillPolygonColour, -0.03, -1.0, 0.03, -1.0, 0.02, -0.88, -0.02, -0.88); // hours on the face
            } else {
              this.strokeLine(context, strokeLineColour, 0.0, -1.0, 0.0, -0.94, 0.02);
            }
        context.restore();
      }

      // get current time-----------------------------------
      var time    = new Date();
      var millis  = time.getMilliseconds() / 1000.0;
      var seconds = time.getSeconds();
      var minutes = time.getMinutes();
      var hours   = time.getHours();

      // draw hour hand--------------------------
      context.save();
      context.rotate(hours * Math.PI / 6 + minutes * Math.PI / 360);
      this.setShadow(context, this.handShadowColor, this.handShadowOffsetX, this.handShadowOffsetY, this.handShadowBlur);
      this.fillPolygon(context, hourHandColour, 0.0, -0.6,  0.03, -0.6, 0.065, 0.19, -0.065, 0.19);
      context.restore();
      
      // draw minute hand-----------------
      context.save();
      context.rotate((minutes + seconds / 60) * Math.PI / 30);
      this.setShadow(context, this.handShadowColor, this.handShadowOffsetX, this.handShadowOffsetY, this.handShadowBlur);
      
      // Fill in the minute hand
      this.fillPolygon(context, minuteHandColour, -0.015, -0.9,  0.015, -0.9, 0.045, 0.23, -0.045, 0.23);
      context.restore();
      
      // draw second hand-------------------
      context.save();
      context.rotate((seconds + millis) * Math.PI / 30);
      this.setShadow(context, this.handShadowColor, this.handShadowOffsetX, this.handShadowOffsetY, this.handShadowBlur);
      this.fillPolygon(context, secondHandColour, -0.006, -0.92, 0.006, -0.92, 0.025, 0.23, -0.025, 0.23);
      context.restore();
      
      context.restore();
    }
  }
};

StationClock.prototype.getAnimationOffset = function(animationStep) {
  switch (animationStep) {
    case 3: return  0.2;
    case 2: return -0.1;
    case 1: return  0.05;
  }
  return 0;
};

StationClock.prototype.setShadow = function(context, color, offsetX, offsetY, blur) {
  if (color) {
  	context.shadowColor   = color;
  	context.shadowOffsetX = this.radius * offsetX;
  	context.shadowOffsetY = this.radius * offsetY;
  	context.shadowBlur    = this.radius * blur;
  }
};

StationClock.prototype.fillCircle = function(context, color, x, y, radius) {
  if (color) {
    context.beginPath();
    context.fillStyle = color;
    context.arc(x * this.radius, y * this.radius, radius * this.radius, 0, 2 * Math.PI, true);
    context.fill();
  }
};

StationClock.prototype.strokeCircle = function(context, color, x, y, radius, lineWidth) {
  if (color) {
    context.beginPath();
    context.strokeStyle = color;
    context.lineWidth = lineWidth * this.radius;
    context.arc(x * this.radius, y * this.radius, radius * this.radius, 0, 2 * Math.PI, true);
    context.stroke();
  }
};

StationClock.prototype.strokeLine = function(context, color, x1, y1, x2, y2, width) {
  if (color) {
	  context.beginPath();
	  context.strokeStyle = color;
	  context.moveTo(x1 * this.radius, y1 * this.radius);
	  context.lineTo(x2 * this.radius, y2 * this.radius);
	  context.lineWidth = width * this.radius;
	  context.stroke();
  }
};

StationClock.prototype.fillPolygon = function(context, color, x1, y1, x2, y2, x3, y3, x4, y4, x5, y5) {
  if (color) {
	  context.beginPath();
	  context.fillStyle = color;
	  context.moveTo(x1 * this.radius, y1 * this.radius);
	  context.lineTo(x2 * this.radius, y2 * this.radius);
	  context.lineTo(x3 * this.radius, y3 * this.radius);
	  context.lineTo(x4 * this.radius, y4 * this.radius);
	  if ((x5 != undefined) && (y5 != undefined)) {
	    context.lineTo(x5 * this.radius, y5 * this.radius);
	  }
	  context.lineTo(x1 * this.radius, y1 * this.radius);
	  context.fill();
  }
};


