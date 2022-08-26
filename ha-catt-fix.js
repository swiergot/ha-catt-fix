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
    observer1.disconnect();
  }
}

function removeStyleDiv() {
  Array.from(document.getElementsByTagName("div")).forEach(function(el) {
    if (el.innerHTML.includes("--cast-controls")) {
      el.remove();
      observer2.disconnect();
    }
  });
}

function setupMutationObservers() {
  // This is to allow the touch display to work
  observer1 = new MutationObserver(removeTouchControls);
  observer1.observe(document.body, { childList: true, subtree: true });
  // This is to enable scrolling
  observer2 = new MutationObserver(removeStyleDiv);
  observer2.observe(document.body, { childList: true, subtree: true });
}

function startReceiver() {
  window.castReceiverContext = cast.framework.CastReceiverContext.getInstance();
  const deviceCaps = window.castReceiverContext.getDeviceCapabilities();

  if (deviceCaps === null) {
    return;
  }

  setupMutationObservers();

  const mediaPlayer = document.createElement("cast-media-player");
  mediaPlayer.style.display = "none";
  document.body.append(mediaPlayer);

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

var observer1, observer2;

loadScript(cast_api, startReceiver);

