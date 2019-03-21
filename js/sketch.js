/*
===
Fast Style Transfer Simple Demo
===
*/
let nets, nets1;
let inputImg, inputImg1, styleImg, inputImage;
let input_source=0;  // 0: for example, 1: for upload image
let outputImgContainer;
let model_num = 0;
let currentModel = 'starrynight'; 
let currentInitModel = 'starrynight';  
let uploader;
let webcam = false;
let modelReady = false;
let video;
let isLoading = true;
let isSafa = false;

function setup() {
    inputImg = select('#input-img');
    inputImg1 = select('#input-img1');
    styleImg = select('#style-img').elt;

    // Image uploader
    uploader = select('#uploader').elt;
    uploader.addEventListener('change', gotNewInputImg);


    // output img container
    outputImgContainer = createImg('images/loading.gif', 'image');
    outputImgContainer.parent('output-img-container');

    console.log('after load models-3');
    transferImg();
}

// A function to be called when the model has been loaded
function modelLoaded() {
    modelReady = true;
    outputImgContainer.removeClass('reverse-img');
    console.log("input source:"+input_source);
    if (input_source==1) inputImg = select('#input-img1');
    else inputImg = select('#input-img');
    inputImg.elt.style.width = '540px';
    inputImg.elt.style.height = '540px';
    console.log("image source:"+inputImg.elt.src + " ; model_num :" +model_num);
    
    var d = new Date();
    var t1 = d.getTime();
    nets.transfer(inputImg, function (err, result) {
        console.log('result:'+result + 'err:'+err);
        outputImgContainer.elt.src = result.src;
        var d2 = new Date();
        var t2 = d2.getTime();
        console.log("inference time = " + (t2 - t1) + "ms");
    });
    inputImg.elt.style.width = '360px';
    inputImg.elt.style.height = '250px';
}

function transferImg() {
    if (webcam) deactiveWebcam();
    console.log("transferImg");
     
    nets = new ml5.styleTransfer('models/' + currentModel + '/', modelLoaded);
    
}

function modelLoaded1() {
    outputImgContainer.addClass('reverse-img');
  //      modelReady = true;
    nets1.transfer(gotResult);
}

function gotResult(err, img) {
    if (webcam) {
        var d = new Date();
        var t1 = d.getTime();
        console.log(" in gotResult");
        outputImgContainer.elt.src = img.src;
        nets1.transfer(gotResult);
        var d2 = new Date();
        var t2 = d2.getTime();
        console.log("webcam inference time = " + (t2 - t1) + "ms");
    }
}

    // webcam transfer process
function transferVideo() {
        nets1 = new ml5.styleTransfer('models/' + currentModel + '/', video, modelLoaded1);
}

function draw() {
}


function updateStyleImg(ele) {
  if (ele.src) {
    styleImg.src = ele.src;
    currentInitModel = ele.id;
    if (model_num>0) currentModel = currentInitModel+'-'+String(model_num);
    else currentModel=currentInitModel;
  }
    if (currentModel) {
        if (webcam) {
            transferVideo();
        } else {
            transferImg();
        }
    }
}

function updateInputImg(ele) {
  if (webcam) deactiveWebcam();
  if (ele.src) {
    inputImg.elt.src = ele.src;
  }
  if (currentModel) {
    input_source=0;
    transferImg();
  }
}

function uploadImg() {
    uploader.click();
    if (webcam) deactiveWebcam();
}

function gotNewInputImg() {
  if (uploader.files && uploader.files[0]) {
     var newImgUrl = window.URL.createObjectURL(uploader.files[0]);
     inputImg1.elt.src = newImgUrl;
     input_source=1;
     setTimeout(() => {
       if (currentModel) transferImg();
     }, 1e3);
     console.log("inputImg1 size:"+inputImg1.elt.width+"x"+inputImg1.elt.height);
  }
}

function useWebcam() {
  if (!video) {
    // webcam video
    video = createCapture(VIDEO);
    video.size(250, 250);
    video.parent('input-source2');
  }
  webcam = true;
    select('#input-img2').hide();
    transferVideo();
  //outputImgContainer.addClass('reverse-img');
}

function deactiveWebcam() {
  outputImgContainer.removeClass('reverse-img');
 
  if (webcam) {
    video.hide();
    video = '';
    }
    webcam = false;
}
    
function onPredictClick() {
  currentModel=currentInitModel;
  model_num=0;
  outputImgContainer.parent('output-img-container');
    if (webcam) {
        console.log('onpredictclick: video');
        transferVideo();
    } else {
        console.log('onpredictclick: img');
        transferImg();
        //console.log('onpredictclick: img');
    }
}

function onPredictClick1() {
  currentModel = currentInitModel + "-1";
  model_num=1;
  outputImgContainer.parent('output-img-container1');
  if (webcam) {
      console.log('onpredictclick1: video');
      transferVideo();
  } else {
      console.log('onpredictclick1: img');
      transferImg();
      //console.log('onpredictclick: img');
  }
}

function onPredictClick2() {
  currentModel = currentInitModel + "-2";
  model_num=2;
  outputImgContainer.parent('output-img-container2');
  if (webcam) {
      console.log('onpredictclick2: video');
      transferVideo();
  } else {
      console.log('onpredictclick2: img');
      transferImg();
      //console.log('onpredictclick: img');
  }
}

function saveimgas() {
  var imgOrUrl;
  imgOrUrl = outputImgContainer.elt;
  //console.log(imgOrUrl);
  if (typeof imgOrUrl == 'object')
     imgOrUrl = outputImgContainer.elt.src;
  //console.log(imgOrUrl);
  window.location.href=imgOrUrl.replace("image/png","image/octet-stream");
}
