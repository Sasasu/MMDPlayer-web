import MMDPlayer from "./MMDPlayer"

let modelFile = 'model/Sour_BreathYou/Breath_You.pmx';
let cameraFile = 'model/camera.vmd';
let musicFile = 'model/music.mp3';
let vmdFile = "model/DeepBlueTown_he_Oideyo_dance.vmd"
let stageFile = "model/Crystal_Stage/Crystal_Stage.pmx"
let mmdplayer = new MMDPlayer();
mmdplayer.modeFile = modelFile;
mmdplayer.cameraFile = cameraFile;
mmdplayer.musicFile = musicFile;
mmdplayer.vmdFile = vmdFile;
mmdplayer.stageFile = stageFile;
window.addEventListener('resize', function () { mmdplayer.resize(window.innerWidth, window.innerHeight) }, false);
function onProgress(item: any, loaded: number, total: number) {
    console.log(item);
    document.getElementById("loding-text").innerText = ((loaded / total) * 100).toFixed(0) + " %";
}
function onLoad() {
    document.getElementById("loding-text").innerText = "click to play";
    document.getElementById("loading-image").style.display = "none";
    document.getElementById("loding-text").onclick = function () {
        document.getElementById("loding-text").innerText = "Initializing physical";
        mmdplayer.init();
        setTimeout(() => { document.getElementById("loading").style.display = "none"; mmdplayer.play() }, 5000);
    }
}

let manager = mmdplayer.load();

manager.onProgress = onProgress;
manager.onLoad = onLoad;
