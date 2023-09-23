# Tensorflow.js

  A tensorflow.js implementation of a handwritten number classifeir trained on MNIST datset.
  An example for deployment of models that you build and trained or by using pre-trained models to a webpage for making a webapp.
  This project serves for knowledge purpose on how to build or train machine/deep learning models in javascript using tensorflow.js library directly on browser or node.js.
  Libraries - :
  tensorflow.js - for building , training and deploying tenssorflow models.
  tensorflow-visualization - for visualizing during training with the help of graphs.

# Run

  You can run the mnistfinal.html file in two ways-

  1. (DEFAULT) You can use pretrained model json file to avoid training every time you visit webpage. This is prefered if you already know how to train model in javascript or if      you are not interested in making a model instead of using pre-trained model, as the data is lost each time you refresh the page or leave the webpage. Training takes less than      a minute and it's training is visualized also. For using it just import script-pretrained.js at the end of body tag in mnistfinal.html.
  ![](https://github.com/NikhilR068/mnist-classifier-tfjs/blob/master/assets/demo.png?raw=true)
  2. You can build and train model directly in javascripts each time page is loaded. Training takes less than a minute and it's training is visualized also. For using it just       import script-train.js and data.js at the end of body tag in mnistfinal.html.(REMEMBER TO REMOVE SCRIPT-PRETRAINED.JS WHICH IS IMPORTED BY DEFAULT)
  ![](https://github.com/NikhilR068/mnist-classifier-tfjs/blob/master/assets/training_visualization.png?raw=true)

[Github Page Link](https://noct068.github.io/mnist-classifier-tfjs/)
