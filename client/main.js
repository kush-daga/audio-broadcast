const buttonSelector = document.querySelector("button");

const socket = io();

//trigger on click

var handleClick = () => {
  console.log("Starting Broadcast!");
  sendAudio();
};

// Handle Audio Broadcast
var sendAudio = () => {
  var constraints = { audio: true };
  navigator.mediaDevices.getUserMedia(constraints).then((mediaStream) => {
    var mediaRecorder = new MediaRecorder(mediaStream);
    mediaRecorder.onstart = (e) => {
      this.chunks = [];
    };
    mediaRecorder.ondataavailable = (e) => {
      this.chunks.push(e.data);
    };
    mediaRecorder.onstop = (e) => {
      var blob = new Blob(this.chunks, { type: "audio/ogg; codecs=opus" });
      //Emit this blobl to socket
      socket.emit("voiceEmit", blob);
    };
    //Start Recording
    console.log("Starting Recording");
    mediaRecorder.start();

    setInterval(() => {
      console.log("stopping and starting");
      mediaRecorder.stop();
      mediaRecorder.start();
    }, 5000);
  });
};

//Handle Voice recieving
socket.on("voiceRecieve", (arrayBuffer) => {
  console.log("Recieving Audio");
  var blob = new Blob([arrayBuffer], { type: "audio/ogg; codecs=opus" });
  var audio = document.createElement("audio");
  audio.src = window.URL.createObjectURL(blob);
  audio.play();
});
