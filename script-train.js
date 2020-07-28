import {MnistData} from './data.js';
var canvas, ctx, saveButton, clearButton;
var pos = {x:0, y:0};
var rawImage;
var model;
var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);	
function getModel() {
	model = tf.sequential();

	model.add(tf.layers.conv2d({inputShape: [28, 28, 1], kernelSize: 3, filters: 8, activation: 'relu'}));
	model.add(tf.layers.maxPooling2d({poolSize: [2, 2]}));
	model.add(tf.layers.conv2d({filters: 16, kernelSize: 3, activation: 'relu'}));
	model.add(tf.layers.maxPooling2d({poolSize: [2, 2]}));
	model.add(tf.layers.flatten());
	model.add(tf.layers.dense({units: 128, activation: 'relu'}));
	model.add(tf.layers.dense({units: 10, activation: 'softmax'}));

	model.compile({optimizer: tf.train.adam(), loss: 'categoricalCrossentropy', metrics: ['accuracy']});

	return model;
}

async function train(model, data) {
	const metrics = ['loss', 'val_loss', 'accuracy', 'val_accuracy'];
	const container = { name: 'Model Training', styles: { height: '640px' } };
	const fitCallbacks = tfvis.show.fitCallbacks(container, metrics);
  
	const BATCH_SIZE = 512;
	const TRAIN_DATA_SIZE = 5500;
	const TEST_DATA_SIZE = 1000;

	const [trainXs, trainYs] = tf.tidy(() => {
		const d = data.nextTrainBatch(TRAIN_DATA_SIZE);
		return [
			d.xs.reshape([TRAIN_DATA_SIZE, 28, 28, 1]),
			d.labels
		];
	});

	const [testXs, testYs] = tf.tidy(() => {
		const d = data.nextTestBatch(TEST_DATA_SIZE);
		return [
			d.xs.reshape([TEST_DATA_SIZE, 28, 28, 1]),
			d.labels
		];
	});

	return model.fit(trainXs, trainYs, {
		batchSize: BATCH_SIZE,
		validationData: [testXs, testYs],
		epochs: 20,
		shuffle: true,
		callbacks: fitCallbacks
	});
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
	const data = new MnistData();
	await data.load();
	const model = getModel();
	await train(model, data);
	init();
	alert("Training is done, try classifying your handwriting!");
}

document.addEventListener('DOMContentLoaded', run);