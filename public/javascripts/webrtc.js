$(function() {
  var socket = io.connect('/');

  $(document).on('submit', '#join-form', function() {
    $userName = $('#user-name')
    socket.emit('join', {name: $userName.val()});
    return false;
  });
  
  socket.on('connected', function(data) {
    //alert(data);
  });
  
  socket.on('joined', function(users) {
    userList = $('#users ul').empty();
    for (var user in users) {
      userList.append("<li>" + user + "</li>");
    }
  });

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
