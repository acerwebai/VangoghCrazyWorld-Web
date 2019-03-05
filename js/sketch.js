/*
===
Fast Style Transfer Simple Demo
===
*/

let nets, nets1;
//let modelNames = ['Wheatfield_with_Crows', 'sien_with_a_cigar', 'Soup-Distribution', 'self-portrait', 'Red-Vineyards', 'la-campesinos', 'bedroom', 'Sunflowers-Bew', 'starrynight', 'Wheatfield_with_Crows-2', 'sien_with_a_cigar-2', 'Soup-Distribution-2', 'self-portrait-2', 'Red-Vineyards-2', 'la-campesinos-2', 'bedroom-2', 'Sunflowers-Bew-2', 'starrynight-2', 'Wheatfield_with_Crows-1', 'sien_with_a_cigar-1', 'Soup-Distribution-1', 'self-portrait-1', 'Red-Vineyards-1', 'la-campesinos-1', 'bedroom-1', 'Sunflowers-Bew-1', 'starrynight-1'];
let inputImg, inputImg1, styleImg;
let outputImgData;
let outputImgData1;
let outputImgData2;
let outputImg;
let outputImg1;
let outputImg2;
let modelNum = 0;
let model_num = 0;
let currentModel = 'starrynight'; 
let currentInitModel = 'starrynight';  //, currentModel1 = 'starrynight-1', currentModel2 = 'starrynight-2';
let uploader;
let uploader1;
let webcam = false;
let modelReady = false;
let video;
let style;
let start = false;
let isLoading = true;
let isSafa = false;

function setup() {
    //    noCanvas();
    inputImg = select('#input-img');
    //inputImg1 = select('#input-img1').elt;
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
    inputImg.elt.style.width = '480px';
    inputImg.elt.style.height = '480px';
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
    inputImg.elt.style.width = '250px';
    inputImg.elt.style.height = '250px';
}

function transferImg() {
    if (webcam) deactiveWebcam();
    console.log("transferImg");
     
    nets = new ml5.styleTransfer('models/' + currentModel + '/', modelLoaded);
    
}

function modelLoaded1() {
  //  modelNum++;
    //console.log('modelloaded 2:' + inputImg.src);
    outputImgContainer.addClass('reverse-img');
   // if (modelNum >= modelNames.length) {
        modelReady = true;
        nets1.transfer(gotResult);
   // }
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
    //    if (modelReady && webcam && video && video.elt && start) {
    //        image(outputImgContainer, 0, 0, 250, 250);
    // predictImg(currentModel);
    //    }
}


function updateStyleImg(ele) {
  if (ele.src) {
    styleImg.src = ele.src;
    currentInitModel = ele.id;
    currentModel = ele.id;
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
  if (ele.src) inputImg.elt.src = ele.src;
  if (currentModel) transferImg();
}

function uploadImg() {
    uploader.click();
    if (webcam) deactiveWebcam();
}

function gotNewInputImg() {
  if (uploader.files && uploader.files[0]) {
    //console.log("gotNewInputImg"+uploadImg.files[0]);
      let newImgUrl = window.URL.createObjectURL(uploader.files[0]);
     // inputImg1.src = newImgUrl;
     // inputImg1.show();
     setTimeout(() => {
      console.log("newImgUrl = "+newImgUrl);
     }, 2000);
     console.log("newImgUrl = "+newImgUrl);
      inputImg.elt.src = newImgUrl.src;
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
  outputImgContainer.parent('output-img-container1');
  if (webcam) {
      console.log('onpredictclick: video');
      transferVideo();
  } else {
      console.log('onpredictclick: img');
      transferImg();
      //console.log('onpredictclick: img');
  }
}

function onPredictClick2() {
  currentModel = currentInitModel + "-2";
  outputImgContainer.parent('output-img-container2');
  if (webcam) {
      console.log('onpredictclick: video');
      transferVideo();
  } else {
      console.log('onpredictclick: img');
      transferImg();
      //console.log('onpredictclick: img');
  }
}
