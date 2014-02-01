$(function() {
  var socket = io.connect('http://localhost:3000');

  $(document).on('click', '#user-join', function() {
    socket.emit('join', {value: 'join'});
  });
  
  socket.on('connected', function(data) {
    alert(data.message);
  });
  
  socket.on('joined', function(data) {
    alert(data.message);
  })

  var peer = new webkitRTCPeerConnection({
    "iceServers": [{"url": "stun:stun.l.google.com:19302"}]
  });
 
  navigator.webkitGetUserMedia(
    {video: true, audio: false}, 
    function(stream) {
      var localVideo = $("#local")[0];
      localVideo.src = window.webkitURL.createObjectURL(stream);
      peer.addStream(stream);
    },
    function(error) {
      console.log(error.name + ": " + error.message)
    });
  
  


});
