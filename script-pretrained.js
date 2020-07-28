var model;
var canvas, ctx, saveButton, clearButton;
var pos = {x:0, y:0};
var rawImage;
var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

async function loadModel(){console.log('loading mnist model..');
	model = await tf.loadLayersModel('model/mnist.json');
	console.log('Successfully loaded model');
	return model;
}
    
function erase() {
	ctx.fillStyle = "black";
	ctx.fillRect(0,0,280,280);
    	var resultField = document.getElementById('result');
	resultField.innerText = "";
}
    
function save() {
	var raw = tf.browser.fromPixels(rawImage,1);
	var resized = tf.image.resizeBilinear(raw, [28,28]);
	var tensor = resized.expandDims(0);
    	var prediction = model.predict(tensor);
    	var pIndex = tf.argMax(prediction, 1).dataSync();
    	var resultField = document.getElementById('result');
	resultField.innerText = pIndex;
}
    
function init() {
	canvas = document.getElementById('canvas');
	rawImage = document.getElementById('canvasimg');
	ctx = canvas.getContext("2d");
	ctx.fillStyle = "black";
	ctx.fillRect(0,0,280,280);
	//canvas.addEventListener("mousemove", draw);
	//canvas.addEventListener("mousedown", setPosition);
    canvas.addEventListener('mousemove', function(e) {
      pos.x = e.pageX - this.offsetLeft;
      pos.y = e.pageY - this.offsetTop;
    }, false);
    ctx.lineWidth = isMobile ? 40 : 25;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#ffffff';

    canvas.addEventListener('mousedown', function(e) {
      ctx.moveTo(pos.x, pos.y);
      ctx.beginPath();
      canvas.addEventListener('mousemove', onPaint, false);
    }, false);
    
    
    canvas.addEventListener('mouseup', function() {
      $('#result').html('<img id="spinner" src=""/>');
      canvas.removeEventListener('mousemove', onPaint, false);
      rawImage.src = canvas.toDataURL('image/png');
    }, false);
    
    
    
    var onPaint = function() {
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
    };
    canvas.addEventListener('touchstart', function (e) {
      var touch = e.touches[0];
      canvas.dispatchEvent(new MouseEvent('mousedown', {
        clientX: touch.clientX,
        clientY: touch.clientY
      }));
    }, false);
    canvas.addEventListener('touchend', function (e) {
      canvas.dispatchEvent(new MouseEvent('mouseup', {}));
    }, false);
    canvas.addEventListener('touchmove', function (e) {
      var touch = e.touches[0];
      canvas.dispatchEvent(new MouseEvent('mousemove', {
        clientX: touch.clientX,
        clientY: touch.clientY
      }));
    }, false);

	saveButton = document.getElementById('sb');
	saveButton.addEventListener("click", save);
	clearButton = document.getElementById('cb');
	clearButton.addEventListener("click", erase);
}
async function run() {  
	model = loadModel();
	init();
}

document.addEventListener('DOMContentLoaded', run);