var ws;
function initWebsocket(){
	var wsImpl = window.WebSocket || window.MozWebSocket;
	// create a new websocket and connect
	window.ws = new ReconnectingWebSocket('ws://121.43.37.233:8182/');
	// when data is comming from the server, this metod is called
	ws.onmessage = function (evt) {
		heartCheck.reset();
		play.ParseMsg(evt.data);	
	};
	// when the connection is established, this method is called
	ws.onopen = function () {
		heartCheck.start();
	};
	// when the connection is closed, this method is called
	ws.onclose = function () {
		
	}		
	// when the connection is error, this method is called
	ws.onerror = function () {

	}	
}
function loadConfig() {
    comm.initChess(comm.initMap);
	bill.create();	
	initWebsocket();
}
function initLayer(e) {
    initCanvas(e);
    onload(),
    loadConfig()    
}
onload = function() {
    comm.dot = {
        dots: []
    },
    comm.mans = {},
	
    $("#isOffensiveBtn").on('tap',bill.offensive),
    $("#blackautoplayBtn").on('tap',bill.bPlay),
    $("#redautoplayBtn").on('tap',bill.rPlay),
    $("#soundBtn").on('tap',bill.sound),
	$("#verticalreverseBtn").on('tap',bill.reverse),	
	$("#noteBtn").on('tap',bill.note),	
	$("#firstBtn").on('tap',bill.replayFirst),
	$("#autoreplayBtn").on('tap',bill.autoreplay),
	$("#prevBtn").on('tap',bill.replayPrev),
    $("#nextBtn").on('tap',bill.replayNext),
    $("#endBtn").on('tap',bill.replayEnd),
	$("#regretBtn").on('tap',bill.regret),
	$("#sendBtn").on('tap',bill.send),
	$("#fullBtn").on('tap',bill.fullBroad),
	$("#clearBtn").on('tap',bill.cleanBroad),				
	$("#saveBtn").on('tap',bill.save);		
};
