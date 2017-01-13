var ws;
function initWebsocket(){
	var wsImpl = window.WebSocket || window.MozWebSocket;
	// create a new websocket and connect
	//window.ws = new wsImpl('ws://121.43.37.233:8183/');
	window.ws = new ReconnectingWebSocket('ws://121.43.37.233:8182/');
	// when data is comming from the server, this metod is called
	ws.onmessage = function (evt) {
		heartCheck.reset();
		play.ParseMsg(evt.data);	
		console.log(evt.data);
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
    $("#regretBtn").click(play.regret),
    $("#replayBtn").click(comm.replayMoves),
    $("#nextBtn").click(comm.replayNext),
    $("#prevBtn").click(comm.replayPrev),
    $("#restartBtn").click(comm.restart),   
	$("#reverseBtn").click(bill.reverse),	
	$("#noteBtn").click(bill.note),	
	$("#settingBtn").click(bill.setting),	
    $("#sendBtn").click(comm.send),
	$("#prevBtn2").click(bill.replayPrev),
    $("#nextBtn2").click(bill.replayNext),
    $("#returnBtn1").click(moreBtn),
    $("#returnBtn2").click(moreBtn),
    $("#returnBtn3").click(moreBtn),
	$("#returnBtn4").click(moreBtn),
    $("#returnBtn").click(moreBtn);	
	$("#createBtn").click(bill.create),
	$("#createBtn2").click(bill.create2),
	$("#sendBtn2").click(bill.send),
	$("#fullBtn").click(bill.fullBroad),
	$("#clearBtn").click(bill.cleanBroad),				
	$("#saveBtn").click(bill.save);		
};
