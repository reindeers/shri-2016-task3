let video_player = () => {
  let settings = {
    width: w,
    height: h,
    controls: false,
    muted: true
  };
  return {
    setPlayer: (element, src) => {
      element.setAttribute('src', src);
      element.setAttribute('width', settings.width);
      element.setAttribute('height', settings.height);
      //element.setAttribute('controls', this.controls);
      element.setAttribute('muted', settings.muted);
    }
  };
};

let audio_player = () => {
  let settings = {
    loop: true
  };
  return {
    setPlayer: (element, src) => {
      element.setAttribute('src', src);
      element.setAttribute('loop', settings.loop);
    }
  }
};

let isFirstPlay = true;
let videoTrack = document.querySelector('.videoPlayer');
let audioTrack = document.createElement('audio');
let buttonPlay = document.querySelector('.controls_button__play');
let buttonPause = document.querySelector('.controls_button__pause');
let buttonSubmit = document.querySelector('.controls_button__submit');

buttonPlay.addEventListener('click', _onButtonPlayClick.bind(this));
buttonPause.addEventListener('click', _onButtonPauseClick.bind(this));
buttonSubmit.addEventListener('click', _onButtonSubmitClick.bind(this));
videoTrack.addEventListener('ended', _onVideoEnd.bind(this));
videoTrack.addEventListener('timeupdate', _onVideoUpdate.bind(this));
videoTrack.addEventListener('loadedmetadata', _onVideoLoadData.bind(this));
videoTrack.addEventListener('play', _onVideoPlay.bind(this));

let controlEvents = () => {
  return {
    play: (audio, video) => {
      audio.play();
      if (isFirstPlay) {
        setTimeout( () => {
        					video.play();
        				}, 1000);
        isFirstPlay = false;
      } else {
        video.play();
      }
    },
    pause: (audio, video) => {
      audio.pause();
      video.pause();
    }
  };
};

let controls = controlEvents();

function _onButtonPlayClick() {
  controls.play(audioTrack, videoTrack);

};
function _onButtonPauseClick() {
  controls.pause(audioTrack, videoTrack);
  deleteAnimations();

};
function _onButtonSubmitClick() {

  let vp = video_player();
  vp.setPlayer(videoTrack, document.getElementsByClassName('controls_input')[0].value);

  let ap = audio_player();
  ap.setPlayer(audioTrack, document.getElementsByClassName('controls_input')[2].value);

  parseSubs();
}

function _onVideoEnd() {
  audioTrack.pause();
  deleteAnimations();
};

let canvasGrey = document.querySelector('.layer_canvas__grey');
let contextGrey = canvasGrey.getContext('2d');

let bgCanvasGrey = document.createElement('canvas');
let bgContextGrey = bgCanvasGrey.getContext('2d');

let canvasNoise = document.querySelector('.layer_canvas__noise');
let contextNoise = canvasNoise.getContext('2d');

let bgCanvasNoise = document.createElement('canvas');
let bgContextNoise = bgCanvasNoise.getContext('2d');

let canvasSubs = document.querySelector('.layer_canvas__subs');
let contextSubs = canvasSubs.getContext('2d');

let canvasScratches = document.querySelector('.layer_canvas__scratches');
let contextScratches = canvasScratches.getContext('2d');

canvasGrey.style.top = videoTrack.getBoundingClientRect().top + 'px';
canvasGrey.style.left = videoTrack.getBoundingClientRect().left + 'px';

canvasNoise.style.top = videoTrack.getBoundingClientRect().top + 'px';
canvasNoise.style.left = videoTrack.getBoundingClientRect().left + 'px';

canvasSubs.style.top = videoTrack.getBoundingClientRect().top + 'px';
canvasSubs.style.left = videoTrack.getBoundingClientRect().left + 'px';

canvasScratches.style.top = videoTrack.getBoundingClientRect().top + 'px';
canvasScratches.style.left = videoTrack.getBoundingClientRect().left + 'px';

const h = 360,
      w = 640;

function _onVideoLoadData() {

    canvasGrey.width = w;
    canvasGrey.height = h;
    bgCanvasGrey.width = w;
    bgCanvasGrey.height = h;

    canvasNoise.width = w;
    canvasNoise.height = h;
    bgCanvasNoise.width = w;
    bgCanvasNoise.height = h;

    canvasSubs.width = w;
    canvasSubs.height = h;

    canvasScratches.width = w;
    canvasScratches.height = h;
};

function _onVideoPlay() {
  requestAnimationFrame(_onVideoPlay);
  makeItGrey();
  noise(contextNoise);
  drawScratches();
};

function _onVideoUpdate() {
  if (videoTrack.currentTime > subs[0].endTime - 0.3 && videoTrack.currentTime < subs[0].endTime + 0.3) {
    videoTrack.pause();
    drawSubs(subs[0].text, contextSubs);
    setTimeout('', 1000);
    subs = subs.slice(1);

    setTimeout(() => {
      videoTrack.play();
      deleteSubs(contextSubs);
    }, 1000);
  };
};

function makeItGrey() {
    //contextGrey.clearRect(0, 0, w, h);
    //contextGrey.beginPath();
    bgContextGrey.drawImage(videoTrack, 0, 0, w, h);
    let pixelData = bgContextGrey.getImageData(0, 0, w, h);
    for (let i = 0; i < pixelData.data.length; i += 4 ) {
        let r = pixelData.data[i];
        let g = pixelData.data[i + 1];
        let b = pixelData.data[i + 2];
        let averageColour = (r + g + b) / 3;
        pixelData.data[i] = averageColour;
        pixelData.data[i + 1] = averageColour;
        pixelData.data[i + 2] = averageColour;
    }
    contextGrey.putImageData(pixelData, 0, 0);
};

function noise(ctx) {
      //ctx.clearRect(0, 0, w, h);
    //  ctx.beginPath();
  let idata = bgContextNoise.createImageData(w, h),
      buffer32 = new Uint32Array(idata.data.buffer),
      len = buffer32.length,
      i = 0;

  for(; i < len;)//todo
  buffer32[i++] = ((100 * Math.random())|0) << 24;
  contextNoise.putImageData(idata, 0, 0);
};

function drawSubs(msg, context) {
  context.clearRect(0, 0, w, h);
  context.font = "bold 14px sans";
  context.fillStyle = "#000000";
  context.rect(0, 0, w, h);
  context.fill();
  context.fillStyle = "#FFFFFF";
  context.fillText(msg, 50, 50);
  context.beginPath();
};

function deleteSubs(context) {
  context.clearRect(0, 0, w, h);
};

function deleteAnimations(){
  contextNoise.clearRect(0, 0, w, h);
  contextScratches.clearRect(0, 0, w, h);
}

let subs = [];
function parseSubs() {
      let textTrack = document.querySelector("track").track;
      let isSubtitles = textTrack.kind === "subtitles";

      for (let j = 0; j < textTrack.cues.length; ++j) {
        let cue = textTrack.cues[j];
        subs.push({text: cue.text, startTime: cue.startTime, endTime: cue.endTime});
      }
      textTrack.mode = "hidden";
};

function drawScratches() {
  contextScratches.clearRect(0, 0, w, h);

  for (i = 0; i < 5; i++) {
          let x = Math.floor(Math.random() * w);
          let y = Math.floor(Math.random() * h);
          let r = Math.floor(Math.random() * 3);

          contextScratches.fillStyle = "rgba(255, 255, 255, 0.1)";
          contextScratches.beginPath();
          contextScratches.arc(x, y, r, 0, Math.PI * 2, true);
          contextScratches.closePath();
          contextScratches.fill();
        }
};
