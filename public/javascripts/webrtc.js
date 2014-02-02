window.RTCPeerConnection = 
  window.webkitPeerConnection || window.webkitRTCPeerConnection || window.mozRTCPeerConnection;
window.RTCSessionDescription = 
  window.mozRTCSessionDescription || window.RTCSessionDescription;
window.RTCIceCandidate =
  window.mozRTCIceCandidate || window.RTCIceCandidate;
window.URL = (window.webkitURL || window.URL);
navigator.getUserMedia = (navigator.getUserMedia ||
                          navigator.webkitGetUserMedia ||
                          navigator.mozGetUserMedia ||
                          navigator.msGetUserMedia);
$(function() {
  var socket = io.connect('/');
  var peer = new RTCPeerConnection({
    "iceServers": [{"url": "stun:stun.l.google.com:19302"}]
  });;
  var $localVideo = $('video#local');
  var $remoteVideo = $('video#remote');

  // オファーを送信 
  $(document).on('submit', '#call-form', function() {
    $callee = $('#callee');
    var calleeId = $callee.val();

    peer.createOffer(function(sdp) {
      peer.setLocalDescription(sdp, function() {
        socket.emit('offer', {sdp: sdp, to: calleeId});
      });
    });
    
    return false;
  });
  
  // 相手の offer を受信
  socket.on('offer', function(data) {
    if (data.sdp) {
      console.log("Offer Received");

      var sdp = new RTCSessionDescription(data.sdp);
      peer.setRemoteDescription(sdp, function() {
        if (sdp.type === 'offer') {
          // offer を受信したら answer をサーバに送信
          peer.createAnswer(function(sdp) {
            peer.setLocalDescription(sdp, function() {
              socket.emit('answer', {sdp: sdp, to: data.from});
            });
          }, error);
        }
      });
    }
  });
  
  // 相手の answer を受信
  socket.on('answer', function(data) {
    if (data.sdp) {
      console.log("Answer Received");
      
      var sdp = new RTCSessionDescription(data.sdp);
      peer.setRemoteDescription(sdp);
    }
  });

  // サーバと接続完了
  socket.on('connected', function(data) {
    $("#user-id").html(data.user.id);

    navigator.getUserMedia(
      { audio: false, video: true },
      function(stream) {
        // srcにBlob URLを指定するとカメラの画像がストリームで流れる
        $localVideo.attr('src', window.URL.createObjectURL(stream));

        // 自分のpeerにカメラストリームを接続させる
        peer.addStream(stream)
      }, error     
    );
  });
  
  // サーバから相手の candidate を受信したとき
  socket.on('candidate', function(data) {
    if (data.candidate) {
      // 相手の candidate を peer に追加
      console.log("Candidate Received");
      peer.addIceCandidate(new RTCIceCandidate(data.candidate));
    }
  });

  // ICE によって自分の candidate を取得したとき
  peer.onicecandidate = function(e) {
    if (e.candidate) {
      // 相手に自分の candidate を共有するために、サーバへ送信
      console.log("Candidate got");
      socket.emit('candidate', {candidate: e.candidate});
    }
  };

  peer.onaddstream = function(e) {
    console.log("Stream added");
    $remoteVideo.attr('src', window.URL.createObjectURL(e.stream));
  };

  function error(err) {
    console.log(err.name + ': ' + err.message);
  }
});
