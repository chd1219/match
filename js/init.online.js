var ws = null;
function initWebsocket(){

	var wsImpl = window.WebSocket || window.MozWebSocket;
	// create a new websocket and connect
	//window.ws = new wsImpl('ws://121.43.37.233:8282/');
	window.ws = new ReconnectingWebSocket('ws://121.43.37.233:8183/');

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
	if(!room_id) newgame();
	else initWebsocket(),setTimeout((function(){ws.send("roomid="+room_id);}),1000);
}
function initLayer(e) {
    initCanvas(e),
    onload(),
    loadConfig();   
	if(room_id) showFloatTip("分享给朋友邀请他来下棋",2000)	
}
newgame = function() {
	popupDiv('onlinedialog');		
		$("#onlinedialog").on('click', '.btn_dialog_cancle', function () {          
					hideDiv('onlinedialog');    
                }).on('click', '.btn_dialog_ok', function () {                    
					hideDiv('onlinedialog');    
					var roomid = Math.round(Math.random()*10000);
					var href = baseURL+'online.html?roomid='+roomid;	
					location.href = href;	
                });		
},
restart = function() {
	popupDiv('restartdialog');		
		$("#restartdialog").on('click', '.btn_dialog_cancle', function () {          
					hideDiv('restartdialog');    
                }).on('click', '.btn_dialog_ok', function () {                    
					hideDiv('restartdialog');    
					var href = baseURL+'online.html';	
					location.href = href;	
                });		
	
};
onload = function() {
    comm.dot = {
        dots: []
    },
    comm.mans = {},
    $("#regretBtn").click(play.regret),
    $("#restartBtn").click(restart),  
    $("#returnBtn").click(moreBtn);	
    $("#sendBtn").click(comm.send);
};
onMessage = function(d) {
	if(d.match("player")){
		var e = d.split("player "); 
		if(e[1] == "1") play.my = 1,play.map = comm.arr2Clone(comm.initMap);
		else if(e[1] == "2") reverseMode = 1,play.my = -1,play.map = comm.arrReverse(comm.initMap);
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
		playinit()
	}
	
	if(d.match("close")){
		showFloatTip(d);
		//cleanChess();
		//play.isPlay = !1;
		//reverseMode = 0;
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
	}
	else {
		play.aiPace = null;	
	}		 
}
playinit = function(a) {
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
    comm.createMans(a);
    for (var m = 0; m < play.map.length; m++) for (var o = 0; o < play.map[m].length; o++) {
        var n = play.map[m][o];
        n && (comm.mans[n].x = o, comm.mans[n].y = m, comm.mans[n].isShow = !0)
    }
    comm.moves4Server = comm.getMap4Server(play.map)
};