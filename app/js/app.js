/*** Сущности ***/
const videoPlayer = () => {
  const settings = {
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
      element.muted = settings.muted;
    }
  };
};

const audioPlayer = () => {
  const settings = {
    loop: true
  };
  return {
    setPlayer: (element, src) => {
      element.setAttribute('src', src);
      element.setAttribute('loop', settings.loop);
    }
  }
};

const controlEvents = () => {
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

/*** Объявление основных переменных-объектов ***/
const h = 360,
      w = 640;

let controls = controlEvents();
let isFirstPlay = true;
const videoTrack = document.querySelector('.videoPlayer');
const audioTrack = document.createElement('audio');
const buttonPlay = document.querySelector('.controls_button__play');
const buttonPause = document.querySelector('.controls_button__pause');
const buttonSubmit = document.querySelector('.controls_button__submit');

/*** События ***/
buttonPlay.addEventListener('click', _onButtonPlayClick.bind(this));
buttonPause.addEventListener('click', _onButtonPauseClick.bind(this));
buttonSubmit.addEventListener('click', _onButtonSubmitClick.bind(this));
videoTrack.addEventListener('ended', _onVideoEnd.bind(this));
videoTrack.addEventListener('timeupdate', _onVideoUpdate.bind(this));
videoTrack.addEventListener('loadedmetadata', _onVideoLoadData.bind(this));
videoTrack.addEventListener('play', _onVideoPlay.bind(this));

function _onButtonPlayClick() {
  controls.play(audioTrack, videoTrack);
};

function _onButtonPauseClick() {
  controls.pause(audioTrack, videoTrack);
  deleteAnimations();
};

function _onButtonSubmitClick() {
  let vp = videoPlayer();
  vp.setPlayer(videoTrack, document.getElementsByClassName('controls_input')[0].value);

  let ap = audioPlayer();
  ap.setPlayer(audioTrack, document.getElementsByClassName('controls_input')[2].value);

  parseSubs();
};

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
  makeItGrey(bgContextGrey, contextGrey, videoTrack);
  drawNoise(bgContextNoise, contextNoise, videoTrack);
  drawScratches(contextScratches);
};

function _onVideoEnd() {
  audioTrack.pause();
  deleteAnimations();
};

function _onVideoUpdate() {
  if (isTimeToShowSubs(videoTrack.currentTime, subs[0].endTime)) {
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

/* Определение canvas */
const canvasGrey = document.querySelector('.layer_canvas__grey');
const contextGrey = canvasGrey.getContext('2d');

const bgCanvasGrey = document.createElement('canvas');
const bgContextGrey = bgCanvasGrey.getContext('2d');

const canvasNoise = document.querySelector('.layer_canvas__noise');
const contextNoise = canvasNoise.getContext('2d');

const bgCanvasNoise = document.createElement('canvas');
const bgContextNoise = bgCanvasNoise.getContext('2d');

const canvasSubs = document.querySelector('.layer_canvas__subs');
const contextSubs = canvasSubs.getContext('2d');

const canvasScratches = document.querySelector('.layer_canvas__scratches');
const contextScratches = canvasScratches.getContext('2d');

canvasGrey.style.top = videoTrack.getBoundingClientRect().top + 'px';
canvasGrey.style.left = videoTrack.getBoundingClientRect().left + 'px';

canvasNoise.style.top = videoTrack.getBoundingClientRect().top + 'px';
canvasNoise.style.left = videoTrack.getBoundingClientRect().left + 'px';

canvasSubs.style.top = videoTrack.getBoundingClientRect().top + 'px';
canvasSubs.style.left = videoTrack.getBoundingClientRect().left + 'px';

canvasScratches.style.top = videoTrack.getBoundingClientRect().top + 'px';
canvasScratches.style.left = videoTrack.getBoundingClientRect().left + 'px';

const makeItGrey = (vContext, rContext, video) => {
    vContext.drawImage(video, 0, 0, w, h);
    let pixelData = vContext.getImageData(0, 0, w, h);
    for (let i = 0; i < pixelData.data.length; i += 4 ) {
        let r = pixelData.data[i];
        let g = pixelData.data[i + 1];
        let b = pixelData.data[i + 2];
        let averageColour = (r + g + b) / 3;
        pixelData.data[i] = averageColour;
        pixelData.data[i + 1] = averageColour;
        pixelData.data[i + 2] = averageColour;
    }
    rContext.putImageData(pixelData, 0, 0);
};

const drawNoise = (vContext, rContext) => {
  let idata = vContext.createImageData(w, h),
      buffer32 = new Uint32Array(idata.data.buffer),
      len = buffer32.length,
      i = 0;

  while (i < len) {
    buffer32[i++] = ((100 * Math.random())|0) << 24;
  }
  rContext.putImageData(idata, 0, 0);

};

const drawSubs = (msg, context) => {
  context.clearRect(0, 0, w, h);
  context.font = "bold 14px sans";
  context.fillStyle = "#000000";
  context.rect(0, 0, w, h);
  context.fill();
  context.fillStyle = "#FFFFFF";
  context.fillText(msg, 50, 50);
  context.beginPath();
};

const deleteSubs = (context) => {
  context.clearRect(0, 0, w, h);
};

const COUNT_OF_SCRATCHES = 5;
const MAX_RADIUS = 3;

const drawScratches = (context) => {
  context.clearRect(0, 0, w, h);
  for (i = 0; i < COUNT_OF_SCRATCHES; i++) {

          let x = Math.floor(Math.random() * w);
          let y = Math.floor(Math.random() * h);
          let r = Math.floor(Math.random() * MAX_RADIUS);

          context.fillStyle = "rgba(255, 255, 255, 0.1)";
          context.beginPath();
          context.arc(x, y, r, 0, Math.PI * 2, true);
          context.closePath();
          context.fill();
        }
};

/*** Вспомогательные функции ***/

const DIVERGENCE = 0.3;

const isTimeToShowSubs = (currentTime, subsTime) =>
    currentTime > subsTime - DIVERGENCE && currentTime < subsTime + DIVERGENCE;

const deleteAnimations = () => { //ToDo
  contextNoise.clearRect(0, 0, w, h);
  contextScratches.clearRect(0, 0, w, h);
}

let subs = [];
const parseSubs = () => {
      let textTrack = document.querySelector("track").track;
      let isSubtitles = textTrack.kind === "subtitles";

      for (let j = 0; j < textTrack.cues.length; j++) {
        let cue = textTrack.cues[j];
        subs.push({text: cue.text, startTime: cue.startTime, endTime: cue.endTime});
      };
      textTrack.mode = "hidden";
};
