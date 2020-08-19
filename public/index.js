let audio = undefined, toggleBtn, stopBtn, volSlider, speedSlider, panSlider,volP,speedP,panP,input,p1,msg;
let amp, fft;
let volHistory = [],elem = [];
let w, gap, start = 120, circleArea = 500;

function setup() {
    p1 = createP("Choose an Audio File : ");
    p1.id("p1");
    input = createFileInput(handleFile);
    msg = createP();
    msg.style("display","none");
    createCanvas(1520, 500);
    w = width / 512;
    gap = 2;
    colorMode(RGB);
}

function draw() {
    background(0);
    fill(255);
    noStroke();
    text("Time Domain", 20, 50, 30, 30);
    text("Frequency Domain", 20, height / 1.3, 30, 30);
    if (audio && volSlider) {
        setAudioProperty();
        stroke(255);
        noFill();
        timeDomain();
        frequencyDomain();
        audio.onended(endAudio);
    }
}

function handleFile(file) {
    msg.style("display","block");
    if(file.type==="audio") {
        volHistory = [];
        audio = loadSound(file.data, loaded);
        msg.html("Audio file loaded!");
        amp = new p5.Amplitude();
        fft = new p5.FFT(0.7, 512);
    }
    else {
        if(audio && audio.isPlaying()) audio.stop();
        msg.html("Please choose an audio file !");
        audio = undefined;
        if(elem.length) {
            for (let i = 0; i < elem.length; i++) elem[i].remove();            
        }
    }
}

function loaded() {
    
    if(elem.length) {
        for (let i = 0; i < elem.length; i++) elem[i].remove();            
    }
    
    toggleBtn = createButton('Play');
    stopBtn = createButton('Stop');
    volSlider = createSlider(0, 1, 0.5, 0.01);
    speedSlider = createSlider(0.2, 2, 1, 0.01);
    panSlider = createSlider(-1, 1, 0, 0.01);
    volP = createP('Volume : ');
    speedP = createP('Speed : ');
    panP = createP('Pan : ');
    
    toggleBtn.mousePressed(toggleAudio);
    stopBtn.mousePressed(()=> audio.stop());
    
    toggleBtn.id("toggle");
    stopBtn.id("stop");
    volP.id('volP');
    speedP.id('speedP');
    panP.id('panP');
    volSlider.id('volS');
    speedSlider.id('speedS');
    panSlider.id('panS');
    
    elem = [toggleBtn,stopBtn,volSlider,speedSlider,panSlider,volP,speedP,panP]
}

function toggleAudio() {
    if (audio.isPlaying()) {
        audio.pause();
        toggleBtn.html('Play');
    }
    else {
        audio.play();
        toggleBtn.html('Pause');
    }
}

function endAudio(){
    toggleBtn.html('Play');
    amp = new p5.Amplitude();
    fft = new p5.FFT(0.7, 512);
}

function setAudioProperty() {
    audio.setVolume(volSlider.value());
    audio.rate(speedSlider.value());
    audio.pan(panSlider.value());
}

function timeDomain() {
    let vol = amp.getLevel();
    volHistory.push(vol);
    beginShape();
    for (let i = 0; i < volHistory.length; i++) {
        let y = map(volHistory[i], 0, 1, height / 4.3, 0);
        vertex(i + start, y);
    }
    endShape();
    
    if (volHistory.length > width - circleArea) {
        volHistory.splice(0, 1);
    }
    stroke(255, 0, 0);
    line(volHistory.length + start, 0, volHistory.length + start, height / 2.15);
    stroke(255);
    fill(255, 0, 0);
    ellipse(width - circleArea / 4, 150, vol * 200 + 80, vol * 200 + 80);
}

function frequencyDomain() {
    let amp1 = fft.analyze();
    fill(random(255),0, 0);
    for (let i = 0; i < amp1.length; i++) {
        let y = map(amp1[i], 0, 255, height, height - height / 4);
        rect(i * w + i * gap + start, y, w, height - y);
    }
}
