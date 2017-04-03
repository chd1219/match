var ws = null;
function initWebsocket(){
	var wsImpl = window.WebSocket || window.MozWebSocket;
	// create a new websocket and connect
	//window.ws = new wsImpl('ws://121.43.37.233:8183/');
	window.ws = new ReconnectingWebSocket('ws://121.43.37.233:8181/');
	// when data is comming from the server, this metod is called
	ws.onmessage = function (evt) {
		heartCheck.reset();
		play.ParseMsg(evt.data);	
		console.log(evt.data);
	}
	// when the connection is established, this method is called
	ws.onopen = function () {
		heartCheck.start();
	}
	// when the connection is closed, this method is called
	ws.onclose = function () {

	}		
	// when the connection is error, this method is called
	ws.onerror = function () {
		
	}	
}
function loadConfig() {
    comm.initChess(comm.initMap);
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
    $("#regretBtn").click(play.regret),    
    $("#restartBtn").click(comm.restart),  
    $("#returnBtn").click(moreBtn);	 	
    $("#sendBtn").click(comm.send);
};