var ws;
function initWebsocket() {
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
	ws.onclose = function () {}
	// when the connection is error, this method is called
	ws.onerror = function () {}
}
function loadConfig() {
	file = getUrlParam("file"),
    level_id = getUrlParam("level_id");
    __getChessData(chessdata);
	initWebsocket();
}

var __getChessData = function(e) {
	serverData = e;
	if(serverData.BillType){
		var a;
		serverData.map ? ( comm.isPVP = !1, a = comm.parseMap(serverData.map)) : ( comm.isPVP = !0, comm.pvpTitle = serverData.meta.FUPAN_GAMESCENE_NAME, a = comm.initMap.concat(), 1 == serverData.meta.FUPAN_CHESS_COLOR && a.reverse()),
		serverData.meta && serverData.meta.FUPAN_TITLE ? chapterTitle = serverData.meta.FUPAN_TITLE: (chapterTitle = "空章节标题", console.log(chapterTitle)),
		document.title = chapterTitle;
		var m = comm.parseMovesEx(serverData.moves);
		comm.movesNum = m.length,
		comm.parseNote(serverData.notes);
		comm.initChessEx(a, m);	
		createbroad = !1;
		bill.map = a;
		bill.cMap = comm.arr2Clone(bill.map),
		bill.cleanChess(),
		bill.init(3,bill.map,!0);
		bill.cleanChess2();
		play.map = bill.map;
		play.mans = comm.mans;		
		play.isFoul = !1,
		movesIndex = 0,
		play.pace = [],
		firststepman = bill.map[m[0][0][0][1]][m[0][0][0][0]];
		play.mans[firststepman].my == 1 ? bill.isOffensive = !0 : (bill.isOffensive = !1,showFloatTip("黑方先手"));
		bill.replayBtnUpdate();
		mode = MODE_BILLREPLAY;
		showBtns();
		$("#sendBtn").hide();
	}
	else{
		var a;
		serverData.map ? ( comm.isPVP = !1, a = comm.parseMap(serverData.map)) : ( comm.isPVP = !0, comm.pvpTitle = serverData.meta.FUPAN_GAMESCENE_NAME, a = comm.initMap.concat(), 1 == serverData.meta.FUPAN_CHESS_COLOR && a.reverse()),
		serverData.meta && serverData.meta.FUPAN_TITLE ? chapterTitle = serverData.meta.FUPAN_TITLE: (chapterTitle = "空章节标题", console.log(chapterTitle)),
		document.title = chapterTitle;
		var m = comm.parseMoves(serverData.moves);
		comm.movesNum = m.length,
		comm.initChess(a, m);
		var o = new res.ReplayTip;
		o.x = 116,
		o.y = 296,
		comm.chessTopLayer.parent.addChild(o),
		comm.replayTip = o,
		comm.replayBtnUpdate(),
		mode = MODE_REPLAY;
		showBtns();
	}        
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
	$("#sendBtn").on('tap',bill.send),
	$("#fullBtn").on('tap',bill.fullBroad),
	$("#clearBtn").on('tap',bill.cleanBroad),				
	$("#saveBtn").on('tap',bill.save);			
};