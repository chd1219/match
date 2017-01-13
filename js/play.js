var play = play || {};
play.init = function(e, a) {
    var a = a || comm.initMap;
    play.cMap = comm.arr2Clone(a);
    var e = e || 3;
    play.my = 1,
    play.nowMap = a,
    play.map = comm.arr2Clone(a),
    play.nowManKey = !1,
    play.pace = [],
    play.isPlay = !0,
    play.isAnimating = !1,
    play.bylaw = comm.bylaw,
    play.showPane = comm.showPane,
    play.isOffensive = !0,
    play.depth = e,
    play.isFoul = !1,
    play.mans = comm.mans = {},
    comm.createMans(a);
    for (var m = 0; m < play.map.length; m++) for (var o = 0; o < play.map[m].length; o++) {
        var n = play.map[m][o];
        n && (comm.mans[n].x = o, comm.mans[n].y = m, comm.mans[n].isShow = !0)
    }
    comm.moves4Server = comm.getMap4Server(play.map)
};
var removeOnDrops = [],
callOnDrops = [],
callOnDropsArgs = [];
play.onChessDrop = function() {
    function e() {
        for (var e = callOnDrops.length - 1; e >= 0; e--) {
            var a = callOnDrops.splice(e, 1)[0],
			m = callOnDropsArgs.splice(e, 1)[0];
           	a.apply(this, m)
        }
        play.isAnimating = !1
    }
    for (var a = removeOnDrops.length - 1; a >= 0; a--) {
        var m = removeOnDrops.splice(a, 1)[0];
        m.parent.removeChild(m)
    }
    comm.soundplay("drop"),
    //play.showThink(),
    setTimeout(e, 200)
},
play.addCallOnDrop = function(e, a) {	
    callOnDrops.push(e),
    callOnDropsArgs.push(a)
},
play.addRemoveOnDrop = function(e) {
    removeOnDrops.push(e)
},
play.regret = function() {
    play.pace.length >= 1 ? (regret()) : showFloatTip("还没开始下棋呢")
},
play.clickCanvas = function(e) {
    if (play.isAnimating) return ! 1;
    if (!play.isPlay) return ! 1;
	if(waitServerPlay) return ! 1;
    var a = play.getClickMan(e),
    m = play.getClickPoint(e),
    o = m.x,
    n = m.y;
    a ? play.clickMan(a, o, n) : play.clickPoint(o, n),
    play.isFoul = play.checkFoul()
},
play.clickMan = function(e, a, m) {	
    var o = comm.mans[e];
    if (play.nowManKey && play.nowManKey != e && o.my != comm.mans[play.nowManKey].my) {
        if (play.indexOfPs(comm.mans[play.nowManKey].ps, [a, m])) {
            o.isShow = !1,
            play.addRemoveOnDrop(o.chess);
            var n = comm.mans[play.nowManKey].x + "" + comm.mans[play.nowManKey].y;
            delete play.map[comm.mans[play.nowManKey].y][comm.mans[play.nowManKey].x],
            play.map[m][a] = play.nowManKey,
            comm.showPane(comm.mans[play.nowManKey].x, comm.mans[play.nowManKey].y, a, m);
            var t = comm.key2cid(e),
            s = comm.toServerPos(comm.mans[play.nowManKey].x, comm.mans[play.nowManKey].y),
            r = comm.toServerPos(a, m),
            c = { cid: t, from: s, to: r };
            comm.mans[play.nowManKey].x = a,
            comm.mans[play.nowManKey].y = m,
            comm.mans[play.nowManKey].alpha = 1,
            comm.mans[play.nowManKey].animate(),
            play.pace.push(n + a + m),
            play.nowManKey = !1,
            comm.hidePane(),
            comm.dot.dots = [],
            comm.hideDots(),
            comm.light.visible = !1,			
			play.AIPlay(n + a + m),
            "j0" == e && play.onGameEnd(-1),
            "J0" == e && play.onGameEnd(1);						
        }
    } else {
		play.my === o.my && (
		comm.mans[play.nowManKey] && (comm.mans[play.nowManKey].alpha = 1),
		comm.hideDots(), 
		comm.hidePane(), 
		play.nowManKey = e, 
		comm.mans[e].ps = comm.mans[e].bl(), 
		comm.dot.dots = comm.mans[e].ps, 
		comm.showDots(), 
		first ? (comm.soundplay("drop"), first = !1) : comm.soundplay("select"), 
		comm.light.x = comm.spaceX * o.x + comm.pointStartX - 20, 
		comm.light.y = comm.spaceY * o.y + comm.pointStartY - 24
		)
	}
};
var first = !1;
play.clickPoint = function(e, a) {
    var m = play.nowManKey,
    o = comm.mans[m];
    if (play.nowManKey && play.indexOfPs(comm.mans[m].ps, [e, a])) {
        var n = o.x + "" + o.y;
        delete play.map[o.y][o.x],
        play.map[a][e] = m,
        comm.showPane(o.x, o.y, e, a);
        var t = comm.key2cid(m),
        s = comm.toServerPos(o.x, o.y),
        r = comm.toServerPos(e, a),
        c = { cid: t, from: s, to: r };
        o.x = e,
        o.y = a,
        o.animate(),
        play.pace.push(n + e + a),
        play.nowManKey = !1,
        comm.dot.dots = [],
        comm.hideDots(),
		play.AIPlay(n + e + a),
        comm.light.visible = !1;		
    }
};
var time;
function echoTips(e){	
	t = 0;
	time = setInterval(function(){
		$("#AIThink").text(e + "(" + (++t) + "s)"),
		$("#AIThink").show();			
	},1000);
}
function hideTips(){
	clearInterval(time);
};
play.showThink = function() {
	room_id = getUrlParam("roomid");
	room_id ? ( play.my == -1 ? echoTips("红方思考中。。。") : echoTips("黑方思考中。。。") ) : ( movesIndex%2 == 0 ? ($("#AIThink").text("红方思考中。。。"),$("#AIThink").show()) : ($("#AIThink").text("黑方思考中。。。"),$("#AIThink").show()) );
},
play.hideThink = function() {
    clearInterval(time);
	$("#AIThink").hide();
},
play.stepPlay = function(e, a, m) {
    m = m || !1,
    comm.hideDots(),
    comm.light.visible = !1;
    var o = play.map[e.y][e.x];
    play.nowManKey = o;
    var o = play.map[a.y][a.x];
    o ? play.AIclickMan(o, a.x, a.y, m) : play.AIclickPoint(a.x, a.y, m)
};
var waitServerPlay = !1;
play.autoPlay = function(){ 		
	if(!waitServerPlay){
			play.AIPlay();		
			if(play.my == 1) play.my = -1;
			else play.my = 1;	
		}			
},
play.AIPlay = function(e) {
	room_id = getUrlParam("roomid");
	room_id ? play.onlinePlay(e) : play.bAIPlay();
},
play.onlinePlay = function(e) {
	play.showThink();
	waitServerPlay = !0;
	sendPosition("move "+e);
	console.log(e);
},
play.bAIPlay = function() {/*黑*/
	play.showThink();
	waitServerPlay = !0;
	sendPosition(play.getFen(reverseMode ? comm.arrReverse(play.map) : play.map, -1));
},
play.rAIPlay = function() {/*红*/
	play.showThink();
	waitServerPlay = !0;
	sendPosition(play.getFen(reverseMode ? comm.arrReverse(play.map) : play.map, 1));
},
play.serverAIPlay = function() {		
    if (0 != play.isPlay) {		
        if (!play.aiPace) return void(waitServerPlay = !0);
       
        var e = play.aiPace;
        play.aiPace = void 0;
		if(reverseMode){
			e[0] = 8-e[0];
			e[1] = 9-e[1];
			e[2] = 8-e[2];
			e[3] = 9-e[3];
		}

        play.pace.push(e.join(""));
		movesIndex++; 
		if(playmode != "1"){			
			bill.branch(e.join(""));
			bill.replayBtnUpdate();	
		}
		
        var a = play.map[e[1]][e[0]];
        play.nowManKey = a;
        var a = play.map[e[3]][e[2]];

        a ? setTimeout(play.AIclickMan, 1000, a, e[2], e[3]) : setTimeout(play.AIclickPoint, 1000, e[2], e[3]);
		/*锁定，等待1s后解锁*/
		setTimeout((function(){waitServerPlay = !1;}),1000);
		if(playmode == 1) setTimeout((function(){checkIsFinalKill();}),1800);
		//if(playmode == 4) checkIsFinalKill();
    }
},
play.clientPlay = function() {
    if (0 != play.isPlay) {
		//checkIsFinalKill();
        var e = AI.init();
        if (!e) {
			if(play.my == 1)		return void play.onGameEnd(-1);
			else return void play.onGameEnd(1);
		}			
        play.pace.push(e.join(""));
        var a = play.map[e[1]][e[0]];
        play.nowManKey = a;
        var a = play.map[e[3]][e[2]];
        a ? setTimeout(play.AIclickMan, 100, a, e[2], e[3]) : setTimeout(play.AIclickPoint, 100, e[2], e[3])
    }
},
play.ParseMsg = function(d) {

	if(d.match("bestmove")){
		var e = d.split("bestmove "); 
		
		if(e[1].match("null") || e[1].match("none")){
			play.my == 1 ? play.onGameEnd(-1) : play.onGameEnd(1);
			return;
		}
		var o = e[1].split(""); 
		/*坐标变换(a-i)->(0-8),(0-9)->(9-0)*/
		for(var i=0;i<4;i++){
			o[i] = {"a":"0","b":"1","c":"2","d":"3","e":"4","f":"5","g":"6","h":"7","i":"8","0":"9","1":"8","2":"7","3":"6","4":"5","5":"4","6":"3","7":"2","8":"1","9":"0"}[o[i]] || "";			                      
		}
		o.length = 4;
		play.aiPace = o;	
		if(playmode == "4") setTimeout((function(){play.serverAIPlay();}),100);
		else play.serverAIPlay();
	}
	else {
		play.aiPace = null;	
	}		 
},
play.checkFoul = function() {
    var e = play.pace,
    a = parseInt(e.length, 10);
    return a > 11 && e[a - 1] == e[a - 5] && e[a - 5] == e[a - 9] ? e[a - 4].split("") : !1
},
play.AIclickMan = function(e, a, m, o) {
    var n = comm.mans[e];
    n.isShow = !1,
    o ? n.chess.parent.removeChild(n.chess) : play.addRemoveOnDrop(n.chess),
    delete play.map[comm.mans[play.nowManKey].y][comm.mans[play.nowManKey].x],
    play.map[m][a] = play.nowManKey,
    play.showPane(comm.mans[play.nowManKey].x, comm.mans[play.nowManKey].y, a, m),
    comm.mans[play.nowManKey].x = a,
    comm.mans[play.nowManKey].y = m,
    o ? comm.mans[play.nowManKey].move() : comm.mans[play.nowManKey].animate(),
    play.nowManKey = !1,
    "j0" == e && play.onGameEnd(-1),
    "J0" == e && play.onGameEnd(1),
    play.hideThink();
},
play.AIclickPoint = function(e, a, m) {
    var o = play.nowManKey,
    n = comm.mans[o];
    play.nowManKey && (delete play.map[comm.mans[play.nowManKey].y][comm.mans[play.nowManKey].x], play.map[a][e] = o, comm.showPane(n.x, n.y, e, a), n.x = e, n.y = a, m ? n.move() : n.animate(), play.nowManKey = !1),
	play.hideThink();
},
play.indexOfPs = function(e, a) {
    for (var m = 0; m < e.length; m++) if (e[m][0] == a[0] && e[m][1] == a[1]) return ! 0;
    return ! 1
},
play.getClickPoint = function(e) {
    var a = Math.round((e.stageX - comm.pointStartX - 20) / comm.spaceX),
    m = Math.round((e.stageY - comm.pointStartY - 20) / comm.spaceY);
    return { x: a, y: m }
},
play.getClickMan = function(e) {
    var a = play.getClickPoint(e),
    m = a.x,
    o = a.y;
    return 0 > m || m > 8 || 0 > o || o > 9 ? !1 : play.map[o][m] && "0" != play.map[o][m] ? play.map[o][m] : !1
},
play.onGameEndLose = function() {
    play.onGameEnd(-1, 1)
},
play.onGameEnd = function(e, a) {
    play.isPlay = !1,
    comm.onGameEnd(e),
    play.hideThink();
    if(reverseMode){
        -1 === e ? play.showWin() : play.showLose()
    }
   else{
        1 === e ? play.showWin() : play.showLose()
    }	
},
play.showWin = function() {
    comm.soundplay("gamewin"),
	showFloatTip("红方胜！");
},
play.showLose = function() {
    comm.soundplay("gamelose"),
	showFloatTip("黑方胜！");
};
play.getFen = function(e,a){
	var result = "position fen ";
	var map = "";
	var arr = [];
	var coutZero = 0;
	for(var i=0;i<10;i++){
		coutZero = 0;
		for(var j=0;j<9;j++){
			map = e[i][j];
		
			if(!map){
				coutZero++;
				continue;
			}			
			if(coutZero > 0){
				result += ""+coutZero;
				coutZero = 0;
			}
			/*将棋盘数组转化成FEN格式*/
			var board={"J0":"k","X0":"b","X1":"b","S0":"a","S1":"a","Z0":"p","Z1":"p","Z2":"p","Z3":"p","Z4":"p","C0":"r","C1":"r","M0":"n","M1":"n","P0":"c","P1":"c","j0":"K","x0":"B","x1":"B","s0":"A","s1":"A","z0":"P","z1":"P","z2":"P","z3":"P","z4":"P","c0":"R","c1":"R","m0":"N","m1":"N","p0":"C","p1":"C"}[map] || ""; 
			
			result += board;
		}
		if(i < (e.length-1)){
			if(coutZero > 0){
				result += ""+coutZero;
				coutZero = 0;
			}
			result += "/";
		}		
	}
	a == -1 ? (result += " b - - 0 1") : (result += " w - - 0 1");
	console.log(result);
	
	if (result.indexOf("k") != -1 && result.indexOf("K") != -1) return result;    
	return "";
}
