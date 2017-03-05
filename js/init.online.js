var ws = null;
function initWebsocket(){

	var wsImpl = window.WebSocket || window.MozWebSocket;
	// create a new websocket and connect
	//window.ws = new wsImpl('ws://121.43.37.233:8282/');
	window.ws = new ReconnectingWebSocket('ws://118.190.46.210:8183/');

	// when data is comming from the server, this metod is called
	ws.onmessage = function (evt) {
		heartCheck.reset();
		onMessage(evt.data);	
		console.log(evt.data);
	};

	// when the connection is established, this method is called
	ws.onopen = function () {
		heartCheck.start();
	};

	// when the connection is closed, this method is called
	ws.onclose = function () {
		//alert("onclose");
		//reconnect();
	}	
	
	// when the connection is error, this method is called
	ws.onerror = function () {
		//alert("onerror");
		//reconnect();
	}	
}

function loadConfig() {	
	room_id = getUrlParam("roomid");
	comm.initChess(comm.initMap);
	play.isPlay = !1,
	cleanChess();
	if(!room_id) shownewgame();
	else shownomal(),initWebsocket(),setTimeout((function(){ws.send("roomid="+room_id);}),1000);
}

function shownewgame(){
	$("#newgameBtn").show(),
	$("#returnBtn1").show(),
    $("#resignBtn").hide(),
    $("#offerdrawBtn").hide(),
    $("#regretBtn").hide(),
	hideTips();
}

function shownomal(){
	$("#newgameBtn").hide(),
	$("#returnBtn1").hide(),
	$("#returnBtn").hide(),
    $("#resignBtn").hide(),
    $("#offerdrawBtn").hide(),
    $("#regretBtn").hide(),
	echoTips("等待用户加入")	
}

function hideAll(){
	$("#newgameBtn").hide(),
	$("#returnBtn1").hide(),
	$("#returnBtn").hide(),
    $("#resignBtn").hide(),
    $("#offerdrawBtn").hide(),
    $("#regretBtn").hide(),
	$("#AIThink").hide();	
}

function initLayer(e) {
    initCanvas(e),
    onload(),
    loadConfig();   
}

newgame = function() {	
	var roomid = Math.round(Math.random()*10000);
	var href = baseURL+'online.html?roomid='+roomid;	
	location.href = href;	
};

onload = function() {
    comm.dot = {
        dots: []
    },
    comm.mans = {},
    $("#newgameBtn").click(newgame),
    $("#resignBtn").click(resignBtn),
    $("#regretBtn").click(play.regret),  
    $("#returnBtn1").click(moreBtn);	
    $("#sendBtn").click(comm.send);
    $("#returnBtn").click(resignBtn);
};

function resignBtn() {
	ws.send("resign");
    window.location = "online.html";
}

onMessage = function(d) {
	if(d.match("close")){
		$("#offerdrawBtn").hide(),
		$("#resignBtn").hide(),
		$("#regretBtn").hide(),
		$("#sendBtn").show()
		$("#returnBtn").show(),
		play.showWin();
		//ws.onclose();
		//cleanChess();
		//play.isPlay = !1;
		//reverseMode = 0;
		return;
	}
	
	if(d.match("player")){
		var e = d.split("player "); 
		if(e[1] == "1") waitServerPlay = !1,play.my = 1,play.map = comm.arr2Clone(comm.initMap);
		else if(e[1] == "2") waitServerPlay = !0,reverseMode = 1,play.my = -1,play.map = comm.arrReverse(comm.initMap);
		return;
	}
	
	if(d.match("isready")){
		var count = 0;
		waitingset = setInterval(function(){
			if(count++ < 10){
				showFloatTip(11-count,500);
			}
			else{
				clearInterval(waitingset);
			}
		},1000)
	}
	if(d.match("running")){
		if(play.isPlay) return;
		play.isPlay = !0;
		onlineinit();
		$("#resignBtn").show(),
		$("#offerdrawBtn").show(),
		$("#regretBtn").show(),
		hideTips();
	}
	
	if(d.match("waiting")){
		showFloatTip("分享给朋友邀请他来下棋", 2000);
	}
	
	if(d.match("move")){
		var e = d.split("move "); 
		
		if(e[1].match("null") || e[1].match("none")){
			play.onGameEnd( play.my, !0);
			return;
		}
		var o = e[1].split(""); 	
		if(!reverseMode)	{
			o[0] = 8 - o[0];
			o[1] = 9 - o[1];
			o[2] = 8 - o[2];
			o[3] = 9 - o[3];
		}
			
		o.length = 4;
		play.aiPace = o;	
		play.serverAIPlay();
		
		//setTimeout((function(){$("#regretBtn").hide();}),1000);
	}
	else {
		play.aiPace = null;	
	}		 
};

onlineinit = function(a) {
    var a = a || play.map;   
	play.cMap = comm.arr2Clone(a),
    play.nowMap = play.map,
    play.nowManKey = !1,
    play.pace = [],
    play.isPlay = !0,
    play.isAnimating = !1,
    play.bylaw = comm.bylaw,
    play.showPane = comm.showPane,
    play.isOffensive = !0,
    play.isFoul = !1,
    play.mans = comm.mans = {},
	play.hideThink(),
    comm.createMans(a);
    for (var m = 0; m < play.map.length; m++) for (var o = 0; o < play.map[m].length; o++) {
        var n = play.map[m][o];
        n && (comm.mans[n].x = o, comm.mans[n].y = m, comm.mans[n].isShow = !0)
    }
    comm.moves4Server = comm.getMap4Server(play.map)
};