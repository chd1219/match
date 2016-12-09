var play = play || {};
play.init = function(e, a) {
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
    createjs.Sound.play("drop"),
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
	if (play.isAnimating) return ! 1;
    if (!play.isPlay) return ! 1;
    play.pace.length >= 1 ? (regret(), SAI(3, {},
    onReqRegret, onFault)) : showFloatTip("还没开始下棋呢")
},
play.clickCanvas = function(e) {
    if (play.isAnimating) return ! 1;
    if (!play.isPlay) return ! 1;
    var a = play.getClickMan(e),
    m = play.getClickPoint(e),
    o = m.x,
    n = m.y;
	if(waitServerPlay) return;
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
            c = {
                cid: t,
                from: s,
                to: r
            };
            play.addCallOnDrop(SAI, [2, c, onReqMove, onFault]),
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
            "j0" == e && play.onGameEnd( - 1),
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
		first ? (createjs.Sound.play("drop"), first = !1) : createjs.Sound.play("select"), 
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
        c = {
            cid: t,
            from: s,
            to: r
        };
        play.addCallOnDrop(SAI, [2, c, onReqMove, onFault]),
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
},
play.showThink = function() {
    $("#AIThink").show()
},
play.hideThink = function() {
    $("#AIThink").hide()
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
	play.showThink();
	waitServerPlay = !0;
	sendPosition("move "+e);
	console.log(e);
},
play.AIPlay2 = function() {//黑
	play.showThink();
	waitServerPlay = !0;
	sendPosition(play.getFen(play.map,-1));
},
play.AIPlay1 = function() {//红
	play.showThink();
	waitServerPlay = !0;
	sendPosition(play.getFen(play.map,1));
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
		
        var a = play.map[e[1]][e[0]];
        play.nowManKey = a;
        var a = play.map[e[3]][e[2]];
        a ? setTimeout(play.AIclickMan, 1000, a, e[2], e[3]) : setTimeout(play.AIclickPoint, 1000, e[2], e[3]);
		//锁定，等待1s后解锁
		setTimeout((function(){waitServerPlay = !1;}),1000);
		if(playmode == 1) setTimeout((function(){checkIsFinalKill();}),1800);
		//if(playmode == 4) checkIsFinalKill();
    }
	play.hideThink();
},
play.onMessage = function(d) {
	
	//showFloatTip(d);
	
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
		play.init()
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
    "j0" == e && play.onGameEnd( - 1),
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
    return {
        x: a,
        y: m
    }
},
play.getClickMan = function(e) {
    var a = play.getClickPoint(e),
    m = a.x,
    o = a.y;
    return 0 > m || m > 8 || 0 > o || o > 9 ? !1 : play.map[o][m] && "0" != play.map[o][m] ? play.map[o][m] : !1
},
play.onGameEndLose = function() {
    play.onGameEnd( - 1, 1)
},
play.onGameEnd = function(e, a) {
	clearInterval(autoset),
    play.isPlay = !1,
    comm.onGameEnd(e),
    play.hideThink(),
    1 === e ? (console.log("恭喜你，你赢了！"), play.showWin()) : (console.log("很遗憾，你输了！"), play.showLose())
	
},
play.showWin = function() {
    createjs.Sound.play("gamewin"),
	reverseMode ? showFloatTip("很遗憾，你输了！") : showFloatTip("恭喜你，你赢了！");
},
play.showLose = function() {
    createjs.Sound.play("gamelose"),
	reverseMode ? showFloatTip("恭喜你，你赢了！") : showFloatTip("很遗憾，你输了！");
};
play.getFen = function(e,a){
	var result = "position fen ";
	var o = "";
	var arr = [];
	var coutZero = 0;
	for(var i=0;i<10;i++){
		coutZero = 0;
		for(var j=0;j<9;j++){
			o = e[i][j];
			
			if(!o){
				coutZero++;
				continue;
			}			
			if(coutZero > 0){
				result += ""+coutZero;
				coutZero = 0;
			}
				
			switch(o){
				case "J0":		result += "k";	break;
				case "X0":		result += "b";	break;
				case "X1":		result += "b";	break;
				case "S0":		result += "a";	break;
				case "S1":		result += "a";	break;
				case "Z0":		result += "p";	break;
				case "Z1":		result += "p";	break;
				case "Z2":		result += "p";	break;
				case "Z3":		result += "p";	break;
				case "Z4":		result += "p";	break;
				case "C0":		result += "r";	break;
				case "C1":		result += "r";	break;
				case "M0":		result += "n";	break;
				case "M1":		result += "n";	break;
				case "P0":		result += "c";	break;	
				case "P1":		result += "c";	break;					
				case "j0":		result += "K";	break;
				case "x0":		result += "B";	break;
				case "x1":		result += "B";	break;
				case "s0":		result += "A";	break;
				case "s1":		result += "A";	break;
				case "z0":		result += "P";	break;
				case "z1":		result += "P";	break;
				case "z2":		result += "P";	break;
				case "z3":		result += "P";	break;
				case "z4":		result += "P";	break;
				case "c0":		result += "R";	break;
				case "c1":		result += "R";	break;
				case "m0":		result += "N";	break;
				case "m1":		result += "N";	break;
				case "p0":		result += "C";	break;
				case "p1":		result += "C";	break;
				default:						break;		
			}	

		}
		if(i < (e.length-1)){
			if(coutZero > 0){
				result += ""+coutZero;
				coutZero = 0;
			}
			result += "/";
		}		
	}
	a == -1 ? (result += " b - - 0 1") : (result += " w - - 0 1")
	return result;
}
