(function(){
  
  const WebSocket = require('ws');
  const WebSocketServer = WebSocket.Server;

 // This provides methods for sending stuff to the websocket

 angular
  .module('firebotApp')
  .factory('websocketService', function (listenerService, settingsService) {
    var service = {};      
      
    // Setup the WebSocketServer with the saved port.  
    var port = settingsService.getWebSocketPort();      
    const wss = new WebSocketServer({
        port: port
    });
      
    // Websocket Server
    // This allows for the guiBroadcast call to send out data via websocket.
    service.broadcast = function(data) {
        var data = JSON.stringify(data);
        console.log(data);
        wss.clients.forEach(function each(client) {
            client.send(data);
        });
    };
    
    // This allows the websocket server to accept incoming packets from overlay.
    wss.on('connection', function connection(ws) {
        ws.on('message', function incoming(message) {
            var message = JSON.parse(message);
            var eventType = message.event;
            // TO DO: This would be where you'd watch for events shown in the GUI to end.
        });
    });
    
    // Watches for an event from main process    
    listenerService.registerListener(
      { type: listenerService.ListenerType.SHOW_VIDEO }, 
      (data) => {
        showVideo(data);
      });

    // Watches for an event from main process    
    listenerService.registerListener(
      { type: listenerService.ListenerType.SHOW_IMAGE }, 
      (data) => {
        showImage(data);
      });
      
    // Watches for an event from main process    
    listenerService.registerListener(
      { type: listenerService.ListenerType.SHOW_HTML }, 
      (data) => {
        showHtml(data);
      });
      
    // Watches for an event from main process    
    listenerService.registerListener(
      { type: listenerService.ListenerType.CELEBREATE }, 
      (data) => {
         service.broadcast(data);
      });
      
      function showImage(data){
          var filepath = data.filepath;
          var imagePosition = data.imagePosition;
          var imageHeight = data.imageHeight;
          var imageWidth = data.imageWidth;
          var imageDuration = parseInt(data.imageDuration);
      
          // Set defaults if they werent filled out.
          if(imagePosition == "" || imagePosition === null){
              var imageX = "Top Middle";
          }
          if(imageHeight == "" || imageHeight === null){
              var imageHeight = false;
          }
          if(imageWidth == "" || imageWidth === null){
              var imageWidth = false;
          }
          if(imageDuration == "" || imageDuration === null){
              var imageDuration = 5;
          }        
      
          // Setup filepath based on compatibility settings.
          var compatibility = settingsService.getOverlayCompatibility();

          if(compatibility == "Other"){
              var filepath = "file:///"+filepath;
          }else{
              var filepath = "http://absolute/"+filepath;
          }
      
          // Compile data and send to overlay.
          var data = {"event":"image","filepath":filepath, "imagePosition":imagePosition, "imageHeight":imageHeight, "imageWidth": imageWidth, "imageDuration":imageDuration};
          service.broadcast(data);
      }
      
      function showVideo(data){
          var filepath = data.filepath;
          var youtubeId = data.youtubeId;
          var videoPosition = data.videoPosition;
          var videoHeight = data.videoHeight;
          var videoWidth = data.videoWidth;
          var videoDuration = parseInt(data.videoDuration);
      
          // Set defaults if they werent filled out.
          if(videoPosition == "" || videoPosition === null){
              var videoX = "Top Middle";
          }
          if(videoHeight == "" || videoHeight === null){
              var videoHeight = false;
          }
          if(videoWidth == "" || videoWidth === null){
              var videoWidth = false;
          }
          if(videoDuration == "" || videoDuration === null){
              var videoDuration = 5;
          }        
      
          // Setup filepath based on compatibility settings.
          var compatibility = settingsService.getOverlayCompatibility();

          if(compatibility == "Other"){
              var filepath = "file:///"+filepath;
          }else{
              var filepath = "http://absolute/"+filepath;
          }
      
          // Compile data and send to overlay.
          var data = {"event":"video","filepath":filepath, "youtubeId": youtubeId, "videoPosition":videoPosition, "videoHeight":videoHeight, "videoWidth": videoWidth, "videoDuration":videoDuration};
          service.broadcast(data);
      }
      
      // Shows HTML
      // This function takes info given from the main process and then sends a request to the overlay to render it.
      function showHtml(data){
          var HTML = data.html;
          var length = data.length;
          var removal = data.removal;
      
          // Compile data and send to overlay.
          var data = {"event":"html","html": HTML, "length": length, "removal": removal};
          service.broadcast(data);
      }
    
    return service;
  });
})();