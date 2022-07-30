const cast_api = "//www.gstatic.com/cast/sdk/libs/caf_receiver/v3/cast_receiver_framework.js";

// Taken from: https://stackoverflow.com/a/14786759
function loadScript(url, callback) {
  var head = document.getElementsByTagName("head")[0];
  var script = document.createElement("script");
  script.type = "text/javascript";
  script.src = url;

  script.onreadystatechange = callback;
  script.onload = callback;

  head.appendChild(script);
}

// Taken from: https://github.com/home-assistant/frontend/blob/dev/cast/src/receiver/entrypoint.ts
function playDummyMedia() {
  const loadRequestData = new cast.framework.messages.LoadRequestData();
  loadRequestData.autoplay = true;
  loadRequestData.media = new cast.framework.messages.MediaInformation();
  loadRequestData.media.contentId = "https://cast.home-assistant.io/images/google-nest-hub.png";
  loadRequestData.media.contentType = "image/jpeg";
  loadRequestData.media.streamType = cast.framework.messages.StreamType.NONE;
  const metadata = new cast.framework.messages.GenericMediaMetadata();
  metadata.title = "Dummy " + (new Date().toTimeString());
  loadRequestData.media.metadata = metadata;
  loadRequestData.requestId = 0;
  window.playerManager.load(loadRequestData);
  window.setTimeout(playDummyMedia, 60 * 9 * 1000);
}

function removeTouchControls() {
  var controls = document.body.querySelector("touch-controls");
  if (controls) {
    controls.remove();
  }
}

function setupMutationObserver() {
  // This is to allow the touch display to work
  const observer = new MutationObserver(removeTouchControls);
  observer.observe(document.body, { childList: true, subtree: true });
}

function startReceiver() {
  const mediaPlayer = document.createElement("cast-media-player");
  mediaPlayer.style.display = "none";
  document.body.append(mediaPlayer);
  
  setupMutationObserver();

  window.castReceiverContext = cast.framework.CastReceiverContext.getInstance();
  window.castReceiverContext.setLoggerLevel(cast.framework.LoggerLevel.DEBUG);

  window.castReceiverContext.addEventListener(cast.framework.system.EventType.READY, function(event) {
    window.castReceiverContext.setApplicationState("Application ready");
    playDummyMedia();
  });

  window.playerManager = window.castReceiverContext.getPlayerManager();
  
  const options = new cast.framework.CastReceiverOptions();
  
  options.statusText = "Application is starting";
  options.disableIdleTimeout = true;
  
  window.castReceiverContext.start(options);
}

loadScript(cast_api, startReceiver);
