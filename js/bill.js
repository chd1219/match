var bill = bill || {};
var boutside = -1.1;
var routside = 10.3;
var outsidescale = 1.58;
var first = !1,
    isComPlay = 0;

    createbroad = !0,
    currentId = 0,
    id = 0,
    moves = [],
    chessnum = [],
    countPath = 0,
    shape = [],
    text = [],
    autoreplayset = 0,
	relayNextLock = 0,
	relayPrevLock = 0;
autoreplayspan = 2000;
isOffensive = !0;
bill.init = function (e, a, k) {
    mode = MODE_BILL;
    var a = a || comm.initMap;
    bill.cMap = bill.cMap || a.concat();
    var e = e || 3;
    bill.my = bill.my || 1,
        bill.nowMap = a,
        bill.map = comm.arr2Clone(a),
        bill.sMap = bill.sMap || [],
        bill.nowManKey = !1,
        bill.pace = bill.pace || [],
        bill.paceEx = bill.paceEx || [],
        bill.isPlay = !0,
        bill.player = 1,
        bill.isAnimating = !1,
        bill.bylaw = comm.bylaw,
        bill.showPane = comm.showPane,
        bill.isOffensive = isOffensive,
        bill.depth = e,
        bill.isFoul = !1,
        bill.mans = {},
        comm.createMans(a);
    for (var m = 0; m < bill.map.length; m++) for (var o = 0; o < bill.map[m].length; o++) {
        var n = bill.map[m][o];
        n && (comm.mans[n].x = o, comm.mans[n].y = m, comm.mans[n].isShow = !0)
    }
    comm.moves4Server = comm.getMap4Server(bill.map),
        k == !0 ? ( bill.isPlay = !0 ) : ($("#saveBtn").show(), bill.isPlay = !1);
},
bill.offensive = function () {
    console.log($("#isOffensiveTog").attr('class'));

	if (movesIndex > 0 ||　moves.length > 0){
		showFloatTip("棋局已开始，请重新开始后再选择");
        isComPlay = 1;
        console.log($("#isOffensiveTog").attr('class'));
		if($("#isOffensiveTog").hasClass('mui-active')){
                $("#isOffensiveTog").removeClass('mui-active');
                $("#isOffensiveTog").html('<div class="mui-switch-handle"></div>');
            }else{
                $("#isOffensiveTog").addClass('mui-active');
                $("#isOffensiveTog").html('<div class="mui-switch-handle" style="transition-duration: 0.2s; transform: translate(43px, 0px);"></div>');

            }
		return;
	}
	bill.cleanChess();
	bill.isOffensive == !0 ? isOffensive = !1 : isOffensive = !0;
	isVerticalReverse ? bill.init(3, comm.arrReverse(bill.cMap), !0) : bill.init(3, bill.cMap, !0);
	movesIndex = 0;
	moves.length = 0;
	bill.paceEx.length = 0;
	bill.replayBtnUpdate();
},
bill.create2 = function () {
    $("#createBtn2").hide(),
        $("#tipsInfo").hide(),
        bill.cleanChess(),
        bill.init(3, bill.map, !1);
},
    bill.create = function () {
        $("#createBtn").hide(),
            $("#mode1").hide(),
            $("#mode2").hide(),
            $("#mode3").hide(),
            $("#mode4").hide(),
            $("#mode5").show(),
            $("#restartdialog").hide(),
            createbroad = !0,
            setEnable("prevBtn2", !1),
            setEnable("nextBtn2", !1),
            bill.pace = [],
            cleanChess();
        bill.init(3, bill.map, !1);
        bill.cleanBroad();
    },
    bill.onChessDrop = function () {
        function e() {
            for (var e = callOnDrops.length - 1; e >= 0; e--) {
                var a = callOnDrops.splice(e, 1)[0],
                    m = callOnDropsArgs.splice(e, 1)[0];
            }
            bill.isAnimating = !1
        }

        for (var a = removeOnDrops.length - 1; a >= 0; a--) {
            var m = removeOnDrops.splice(a, 1)[0];
            m.parent.removeChild(m)
        }
        comm.soundplay("drop"),
            setTimeout(e, 200)
    },
    bill.addCallOnDrop = function (e, a) {
        callOnDrops.push(e),
            callOnDropsArgs.push(a)
    },
    bill.addRemoveOnDrop = function (e) {
        removeOnDrops.push(e)
    },
	bill.regret = function() {
	    if (b_autoset != 0 || r_autoset != 0) {
            showFloatTip("请取消电脑思考，再点击悔棋");
            return;
        }
		if (bill.paceEx.length == 0) {
            showFloatTip("还没开始下棋呢");
            return;
        }
		if (bill.paceEx.length != movesIndex) {
            showFloatTip("不是最后一步");
            return;
        }
		
        bill.cleanLine();
        bill.isend = !1,
		play.isPlay = !0,
		moves = bill.getMoves4Server(-1);
        bill.cleanChess();
        isVerticalReverse ? bill.init(3, comm.arrReverse(bill.cMap), !0) : bill.init(3, bill.cMap, !0);
        if (movesIndex > 0) {
            movesIndex--;
            for (var e = 0; movesIndex > e; e++)
                bill.stepPlay(moves[e].src, moves[e].dst, !0);
        }
		bill.paceEx.pop();
		moves.length--;
        bill.replayBtnUpdate();
	
	},
    bill.send = function (e) {
        var a = {};
        a.map = bill.moves4Server,
            a.moves = bill.getMoves4Server();
        var m = -1;
        serverData.head && (m = serverData.head.id),
            a.head = {
                id: m,
                totalMove: a.moves.length
            },
            serverData.meta ? a.meta = serverData.meta : a.meta = {},
            a.meta.FUPAN_TITLE = chapterTitle,
            a.meta.FUPAN_JSON_FROM = "H5",
            console.log("toServerData", a),
            console.log(JSON.stringify(a));
        var o = JSON.stringify(a);
        comm.filename = window.md5(o),
            comm.movesNum = a.moves.length;
        if (comm.movesNum == 0) {
            showFloatTip("还没开始下棋呢")
            return;
        }

        isVerticalReverse ? sendmap = comm.arrReverse(bill.cMap) : sendmap = bill.cMap;

        var map = comm.getMap6Server(sendmap);
        var moves = bill.getMoves6ServerEx();
        var notes = bill.getNotes2Server();
        var _json = {"map": map, "moves": moves, "notes": notes, "filename": comm.filename, "BillType": 1};
        $.ajax({
            type: "POST",
            url: saveURL,
            dataType: "text",
            data: _json,
            success: function (response, status, xhr) {
                window.parent.location.href = replayURL + "&file=" + comm.filename;
                console.log(_json);
            },
            error: function (response, status, xhr) {
                alert(status);
            }
        })

        //陈飞宇编写以下模块
        /*
         var xqfilename = comm.filename;
         var cfy = "http://chenfeiyu.xueyunkeji.com/weengine/app/index.php?c=entry&do=Chess&m=yuexiage_loveshare";
         var cfy1 = "http://chenfeiyu.xueyunkeji.com/weengine/app/index.php?i=3&c=entry&do=Chess_Add&m=yuexiage_loveshare" ;
         //var cfy2 ="&c=entry&do=Chess_Add&m=yuexiage_loveshare";
         $.ajax({
         type: "post",
         url: cfy,
         //dataType : 'json',
         // jsonp:"jsoncallback",
         data:{filename:xqfilename},
         success: function(response,status,xhr) {
         location.href = cfy1;
         //alert(data);
         //alert(xqfilename);
         //console.log(xqfilename);
         //location.href = xqfilename;
         },
         error: function(XMLHttpRequest, textStatus, errorThrown) {
         alert("1");
         alert(XMLHttpRequest.status);
         alert(XMLHttpRequest.readyState);
         alert(textStatus);
         }
         })*/
    },
    bill.cleanBroad = function (e) {
        bill.cleanChess();
        bill.cleanChess2();
        bill.sMap = comm.arr2Clone(bill.sMapFull),
            bill.sMapList = JSON.parse(JSON.stringify(bill.chessMan)),
            bill.createMans(bill.sMap),
            bill.init(3, bill.emptyMap, !1);
        $("#fullBtn").show();
        $("#clearBtn").hide();
    },
    bill.fullBroad = function (e) {
        bill.cleanChess();
        bill.cleanChess2();
        bill.sMap = comm.arr2Clone(bill.sMapEmpty),
            bill.sMapList = JSON.parse(JSON.stringify(bill.emptychessMan)),
            bill.init(3, comm.initMap, !1);
        $("#fullBtn").hide();
        $("#clearBtn").show();
    },
    bill.clickCanvas = function (e) {
		if (mode != 5) return;
        var a = bill.getClickMan(e),
            m = bill.getClickPoint(e),
            x = m.x,
            y = m.y;

        if (bill.isend == 1)  return;

        a ? bill.clickMan(a, x, y) : bill.clickPoint(x, y);

        if (bill.isPlay == !0) {
            bill.replayBtnUpdate();
        }
    },
    bill.clickMan = function (e, x, y) {
        if ((y > -1 && y < 10))    bill.clickManIn(e, x, y)
        if ((y < 0 || y > 9))        bill.clickManOut(e, x, y)
    }
bill.clickManIn = function (e, a, m) {	//棋盘内->棋盘内
    var o = comm.mans[e];
    if (bill.nowManKey && bill.nowManKey != e && o.my != bill.my) {
        //吃子
        if (bill.isPlay == !0) {
            if (bill.indexOfPs(comm.mans[bill.nowManKey].ps, [a, m])) {
                o.isShow = !1,
                    bill.addRemoveOnDrop(o.chess);
                var n = comm.mans[bill.nowManKey].x + "" + comm.mans[bill.nowManKey].y;
                delete bill.map[comm.mans[bill.nowManKey].y][comm.mans[bill.nowManKey].x],
                    bill.map[m][a] = bill.nowManKey,
                    comm.showPane(comm.mans[bill.nowManKey].x, comm.mans[bill.nowManKey].y, a, m);
                var t = comm.key2cid(e),
                    s = comm.toServerPos(comm.mans[bill.nowManKey].x, comm.mans[bill.nowManKey].y),
                    r = comm.toServerPos(a, m),
                    c = {cid: t, from: s, to: r};
                comm.mans[bill.nowManKey].x = a,
                    comm.mans[bill.nowManKey].y = m,
                    comm.mans[bill.nowManKey].alpha = 1,
                    comm.mans[bill.nowManKey].animate(),
                    bill.pace.push(n + a + m),
                    bill.nowManKey = !1,
                    comm.hidePane(),
                    comm.dot.dots = [],
                    comm.hideDots(),
                    comm.light.visible = !1,
                    movesIndex++;
                bill.branch(n + a + m),
                    bill.my = -bill.my;
                "j0" == e && bill.onGameEnd(-1),
                "J0" == e && bill.onGameEnd(1);
                bill.AIPlay();
            }
            else {
                comm.hideDots();
                showFloatTip("对方下子");
            }
        }
        else {
            (comm.mans[bill.nowManKey] && (comm.mans[bill.nowManKey].alpha = 1),
                comm.hideDots(),
                comm.hidePane(),
                bill.nowManKey = e,
                comm.mans[e].alpha = 0.6,
                comm.mans[e].ps = comm.mans[e].bl(),
                comm.dot.dots = comm.mans[e].ps,
                (bill.isPlay == !0) ? (comm.showDots()) : (comm.hideDots()),
                first ? (comm.soundplay("drop"), first = !1) : comm.soundplay("select"), comm.light.x = comm.spaceX * o.x + comm.pointStartX - 20, comm.light.y = comm.spaceY * o.y + comm.pointStartY - 25, comm.light.visible = !0)
        }
    }
    else if (bill.isPlay ? o.my == bill.my : !0) {

        if (b_autoset != 0 && o.my == -1)  return;
        if (r_autoset != 0 && o.my == 1)  return;

        if (bill.nowManKey == e) {
            bill.cancleSelected();					
        }
        else {
            (comm.mans[bill.nowManKey] && (comm.mans[bill.nowManKey].alpha = 1),
                createbroad ? !0 : (comm.hideDots(), comm.hidePane(), comm.mans[e].alpha = 0.6, comm.mans[e].ps = comm.mans[e].bl(), comm.dot.dots = comm.mans[e].ps),
                bill.nowManKey = e,
                (bill.isPlay || createbroad) ? (comm.showDots()) : (comm.hideDots()),
                first ? (comm.soundplay("drop"), first = !1) : comm.soundplay("select"),
                comm.light.x = comm.spaceX * o.x + comm.pointStartX - 20, comm.light.y = comm.spaceY * o.y + comm.pointStartY - 25, comm.light.visible = !0)
			cleanComputerDetail();
			cleanChessdbDetail();
        }
    }
};
bill.clickManI2O = function (e, x, y) { //棋盘内->棋盘外
    var m = bill.nowManKey;
    o = comm.mans[m];

    y < 0 ? ( y = boutside ) : ( y = routside );

    y < 0 ? ( o.my == -1 ? col = 0 : col = -1 ) : ( o.my == 1 ? col = 1 : col = -1 );
    if (col == -1) return !1;

    var maptemp = {"C": 0, "M": 1, "P": 2, "X": 3, "S": 4, "Z": 5, "c": 0, "m": 1, "p": 2, "x": 3, "s": 4, "z": 5};
    e = maptemp[m.slice(0, 1)];
    if (e > -1) {
        var templist = [];
        templist = bill.sMapList[m.slice(0, 1)];
        var oldchess = bill.sMap[col][e];
        bill.sMap[col][e] = m;
        templist.push(m);

        stage.removeChild(chessnum[col * 6 + e]),
            templist.length ? bill.drawNum(col, e, templist.length) : !1;
    }
    else {
        showFloatTip("将帅不能移出棋盘");
        bill.cancleSelected();
        return !1;
    }
    delete bill.map[o.y][o.x];
    o.x = e * outsidescale,
        o.y = y,
        o.animate();
    //删除原来的棋子
    setTimeout(function () {
        removeChess(oldchess)
    }, 300);

    bill.cancleSelected();
}
bill.cancleSelected = function () {
    bill.nowManKey = !1,
        comm.dot.dots = [],
        comm.hideDots(),
        comm.light.visible = !1;
}
bill.clickManOut = function (e, x, y) {
    if (bill.nowManKey == e) {
        bill.cancleSelected();
    }
    else {
        if (bill.nowManKey) {
            var o = comm.mans[bill.nowManKey];
            if (o.y > -1 && o.y < 10) {
                bill.clickManI2O(e, x, y)
            }
            else {
                bill.cancleSelected();
                var o = comm.mans[e];
                bill.nowManKey = e;
                first ? (comm.soundplay("drop"), first = !1) : comm.soundplay("select"), comm.light.x = comm.spaceX * o.x + comm.pointStartX - 20, comm.light.y = comm.spaceY * o.y + comm.pointStartY - 24, comm.light.visible = !0
            }
        }
        else {
            var o = comm.mans[e];
            bill.nowManKey = e;
            first ? (comm.soundplay("drop"), first = !1) : comm.soundplay("select"), comm.light.x = comm.spaceX * o.x + comm.pointStartX - 20, comm.light.y = comm.spaceY * o.y + comm.pointStartY - 24, comm.light.visible = !0
        }
    }
},
    bill.clickPoint = function (e, a) {
        if (bill.isPlay == !0) { //棋谱模式
            bill.clickPointPlaying(e, a)
        }
        else if (bill.nowManKey) { //摆棋模式
            bill.clickPointPre(e, a)
        }
        bill.cancleSelected();
    },
    bill.clickPointPlaying = function (e, a) {//棋谱模式
        var m = bill.nowManKey;
        o = comm.mans[m];
        if (bill.nowManKey && bill.indexOfPs(comm.mans[m].ps, [e, a])) {
            var n = o.x + "" + o.y;
            delete bill.map[o.y][o.x],
                bill.map[a][e] = m,
                comm.showPane(o.x, o.y, e, a);
            var t = comm.key2cid(m),
                s = comm.toServerPos(o.x, o.y),
                r = comm.toServerPos(e, a),
                c = {cid: t, from: s, to: r};
            o.x = e,
                o.y = a,
                o.animate(),

                bill.pace.push(n + e + a),
                movesIndex++;
            bill.branch(n + e + a),
                bill.my = -bill.my;
            bill.AIPlay();
        }
    }
bill.clickPointPre = function (e, a) {//摆棋模式
    var m = bill.nowManKey;
    o = comm.mans[m];
    //棋盘外->棋盘外
    if ((a < 0 || a > 9) && (o.y < 0 || o.y > 9)) {
        return;
    }
    //棋盘内->棋盘外
    if (a < 0 || a > 9) {
        a < 0 ? ( a = boutside ) : ( a = routside );

        a < 0 ? ( o.my == -1 ? col = 0 : col = -1 ) : ( o.my == 1 ? col = 1 : col = -1 );
        if (col == -1) return !1;

        var maptemp = {"C": 0, "M": 1, "P": 2, "X": 3, "S": 4, "Z": 5, "c": 0, "m": 1, "p": 2, "x": 3, "s": 4, "z": 5};
        e = maptemp[m.slice(0, 1)];
        if (e > -1) {
            var templist = [];
            templist = bill.sMapList[m.slice(0, 1)];
            var oldchess = bill.sMap[col][e];
            bill.sMap[col][e] = m;
            e = e * outsidescale;
            templist.push(m);

            stage.removeChild(chessnum[col * 6 + e / outsidescale]),
                templist.length ? bill.drawNum(col, e / outsidescale, templist.length) : !1;
        }
        else {
            showFloatTip("将帅不能移出棋盘");
            return !1;
        }
    }
    else {//棋盘内->棋盘内
        if (bill.checkMans(m, a, e)) {
            bill.map[a][e] = m;
        }
        else {
            showFloatTip("摆放错误，请重试");
            return !1;
        }
    }
    //棋盘外->棋盘内
    if (o.y < 0 || o.y > 9) {
        o.y < 0 ? (  col = 0 ) : ( col = 1 );
        row = parseInt(o.x / outsidescale);
        delete bill.sMap[col][row];
        //列表
        var templist = [];
        templist = bill.sMapList[m.slice(0, 1)];
        for (var i = 0; i < templist.length; i++) {
            if (templist[i] == m) {
                delete templist[i];
                for (var j = i; j < templist.length - 1; j++) {
                    templist[j] = templist[j + 1];
                }
                break;
            }
        }
        templist.length -= 1;
        newchess = templist[0];
        bill.createMan(newchess, o.y, o.x),
            stage.removeChild(chessnum[col * 6 + row]),
            templist.length ? bill.drawNum(col, row, templist.length) : !1;
        bill.sMap[col][row] = newchess;
    }
    else {
        delete bill.map[o.y][o.x];
    }

    o.x = e,
        o.y = a,
        o.animate();
    //删除原来的棋子
    setTimeout(function () {
        removeChess(oldchess)
    }, 300);
},
    bill.branch = function (e) {
        step = e;
        //查找是否存在分支
        if (bill.paceEx.length < movesIndex) {
            bill.paceEx[movesIndex - 1] = new Array();
            id++;
            preId = currentId;
            currentId = id;
            bill.paceEx[movesIndex - 1].push([step, id, preId]);
            m = step.split(""),
                o = {src: {x: parseInt(m[0]), y: parseInt(m[1])}, dst: {x: parseInt(m[2]), y: parseInt(m[3])}};
            moves.push(o);
            return;
        }
        if (bill.checkbranch(step)) {
            return;
        }//否则增加分支
        else {
            id++;
            preId = currentId;
            currentId = id;
            bill.paceEx[movesIndex - 1].push([step, id, preId]);
        }
    };
bill.checkbranch = function (e) {
    for (var i = 0; i < bill.paceEx[movesIndex - 1].length; i++) {
        var o = bill.paceEx[movesIndex - 1][i];
        if (o[2] == currentId && e == o[0]) {
            currentId = o[1];
            return !0;
        }
    }
    return !1;
}
bill.indexOfPs = function (e, a) {
    for (var m = 0; m < e.length; m++) if (e[m][0] == a[0] && e[m][1] == a[1]) return !0;
    return !1
},
    bill.getClickPoint = function (e) {
        var a,
            m = Math.round((e.stageY - comm.pointStartY - 20) / comm.spaceY);
        ( m < 0 || m > 9 ) ? (a = Math.round((e.stageX - comm.pointStartX - 20) / (outsidescale * comm.spaceX))) : (a = Math.round((e.stageX - comm.pointStartX - 20) / comm.spaceX));
        return {x: a, y: m}
    },
    bill.getClickMan = function (e) {
        var a = bill.getClickPoint(e),
            m = a.x,
            o = a.y;
        if (o < 0 && createbroad) return bill.sMap[0][m];
        else if (o > 9 && createbroad) return bill.sMap[1][m];
        else return 0 > m || m > 8 || 0 > o || o > 9 ? !1 : bill.map[o][m] && "0" != bill.map[o][m] ? bill.map[o][m] : !1
    },
    bill.drawLine = function (e, a) {
        var m = e.split("");
        shape[a - 1] = new createjs.Shape();
        var graphics = shape[a - 1].graphics;

        text[a - 1] = new createjs.Text(a, "16px Arial", "blue");
        text[a - 1].x = comm.pointStartX + comm.spaceX * m[2] + 20;
        text[a - 1].y = comm.pointStartY + comm.spaceY * m[3] + 20;
        stage.addChild(text[a - 1]);

        graphics.beginStroke("red");
        graphics.setStrokeStyle(2);
        graphics.moveTo(comm.pointStartX + comm.spaceX * m[0] + 20, comm.pointStartY + comm.spaceY * m[1] + 20);
        graphics.lineTo(comm.pointStartX + comm.spaceX * m[2] + 20, comm.pointStartY + comm.spaceY * m[3] + 20);

        stage.addChild(shape[a - 1]);
        stage.update();
    },
    bill.drawNum = function (i, j, n) {
        a = i * 6 + j;
        x = j * outsidescale;
        i == 0 ? y = boutside : y = routside;
        chessnum[a] = new createjs.Text(n, "20px Arial", "red");
        chessnum[a].x = comm.pointStartX + comm.spaceX * x + 45;
        chessnum[a].y = comm.pointStartY + comm.spaceY * y - 22;
        stage.addChild(chessnum[a]);
    }
bill.cleanLine = function () {
    for (var a = 0; a < text.length; a++) {
        stage.removeChild(text[a]),
            stage.removeChild(shape[a])
    }
},
    bill.reverse = function () {
        console.log($("#verticalreverseTog").attr('class'));
        if (b_autoset != 0 || r_autoset != 0) {
            isComPlay = 1;
            showFloatTip("请取消电脑思考，再点击翻转");
            console.log($("#verticalreverseTog").attr('class'));
            if( $("#verticalreverseTog").hasClass('mui-active')){
                $("#verticalreverseTog").removeClass('mui-active');
                $("#verticalreverseTog").html('<div class="mui-switch-handle"></div>');
            }else{
                $("#verticalreverseTog").addClass('mui-active');
                $("#verticalreverseTog").html('<div class="mui-switch-handle" style="transition-duration: 0.2s; transform: translate(43px, 0px);"></div>');

            }

            return;
        }

        if (bill.isAnimating) return !1;
        if (waitServerPlay) return;
        isVerticalReverse ? (isVerticalReverse = 0) : (isVerticalReverse = 1);
        bill.reverseMoves();
        bill.map = comm.arrReverse(bill.map);
        bill.cleanChess();
        bill.init(3, bill.map, !0);
        play.map = bill.map;
    },
    bill.save = function () {

        if (bill.checkJiang() == !1) {
            showFloatTip("开局不能将");
            return;
        }
        bill.resizeCanvas();
        createbroad = !1;
        comm.init();
        bill.cMap = comm.arr2Clone(bill.map),
            bill.cleanChess(),
            bill.init(3, bill.map, !0);
        bill.cleanChess2();
        play.map = bill.map;
        movesIndex = 0,
            bill.pace = [],
            bill.replayBtnUpdate();
    },
    bill.note = function () {
        popupDiv('notedialog');

        note = bill.notes[currentId];
        $('#notetext').val(note);
        $('#notedialog').on('click', '.btn_dialog_cancle', function () {
            hideDiv('notedialog');
        }).on('click', '.btn_dialog_save', function () {
            hideDiv('notedialog');
            note = $('#notetext').val();
            if (note) {
                bill.notes[currentId] = note;
                $("#noteInfo").text(note);
                //$("#noteInfo").show();
                $("#noteInfo").parent('.mui-toast-container').addClass('mui-active');
            }
        });
    },

    bill.showPlaymode = function (e) {
        $("#playmode").text(e);
        $("#playmode").show();
    },
    bill.bPlay = function () {
        b_autoset != 0 ? (clearInterval(b_autoset), b_autoset = 0,cleanComputerDetail()) : (
            b_autoset = setInterval(function () {
                if (waitServerPlay) return;
                play.map = bill.map;
                if ((movesIndex % 2 == 1 && bill.isOffensive) || (movesIndex % 2 == 0 && !bill.isOffensive)) {//黑
                    play.bAIPlay();
                    play.my = -1;
                    bill.my = 1;
                }
            }, 2000));
    },
    bill.rPlay = function () {
        r_autoset != 0 ? ( clearInterval(r_autoset), r_autoset = 0,cleanComputerDetail()) : (
            r_autoset = setInterval(function () {
                if (waitServerPlay) return;
                play.map = bill.map;
                if ((movesIndex % 2 == 0 && bill.isOffensive) || (movesIndex % 2 == 1 && !bill.isOffensive)) {//红
                    play.rAIPlay();
                    play.my = 1;
                    bill.my = -1;
                }
            }, 2000))
    },
    bill.sound = function () {
        voicemode == 1 ? (voicemode = 0, $("#soundBtn").val("音效关")) : (voicemode = 1, $("#soundBtn").val("音效开"))
    },
    bill.autoreplay = function () {
        if (b_autoset != 0 || r_autoset != 0) {
            showFloatTip("请取消电脑思考，再点击自动播放");
            return;
        }
        movesIndex >= moves.length ? showFloatTip("播放结束") : ( autoreplayset != 0 ? (showFloatTip("播放结束"), clearInterval(autoreplayset), autoreplayset = 0) : (showFloatTip("开始自动播放"), autoreplayset = setInterval(bill.replayNext, autoreplayspan)) );
    },
    bill.replayNext = function () {
		cleanChessdbDetail();
		if (!relayNextLock){
			relayNextLock = 1;
			setTimeout(bill.replayNextset, 200);
		}
		
    },
    bill.replayNextset = function () {
        if (b_autoset != 0 || r_autoset != 0) {
            showFloatTip("请取消电脑思考，再点击下一步");	
			relayNextLock = 0;
            return;
        }
        countPath = 0;
        var nextpace = [];
        nextid = currentId;
        //统计分支数
        if (bill.paceEx[movesIndex]) {
            for (j = 0; j < bill.paceEx[movesIndex].length; j++) {
                if (bill.paceEx[movesIndex][j][2] == nextid) {
                    nextpace.push(bill.paceEx[movesIndex][j]);
                    countPath++;
                }
                if (movesIndex == 0 && bill.paceEx[movesIndex][j][1] == nextid) {
                    nextpace.push(bill.paceEx[movesIndex][j]);
                    countPath++;
                }
            }
            if (countPath == 0) {
                bill.replayBtnUpdate();
				relayNextLock = 0;
                return;
            }
            if (countPath == 1) {
                currentId = nextpace[0][1];
                movesIndex++;
                moves = bill.getMoves4Server(1);
                bill.cleanChess();
                isVerticalReverse ? bill.init(3, comm.arrReverse(bill.cMap), !0) : bill.init(3, bill.cMap, !0);
                if (movesIndex > 0) {
                    for (var e = 0; movesIndex - 1 > e; e++)
                        bill.stepPlay(moves[e].src, moves[e].dst, !0);
                    bill.stepPlay(moves[e].src, moves[e].dst);
                }
                bill.replayBtnUpdate();                
				relayNextLock = 0;
                return;
            }            
            //自动播放控制
            if (autoreplayset != 0) {
                clearInterval(autoreplayset);
            }

            for (var j = 0; j < countPath; j++) {
				bill.drawLine(nextpace[j][0], j+1);
                BranchPath = "BranchPath_" + j;
                $("#nextstepdialog").prepend('<input type="button" id=' + BranchPath + ' class="chessbaseBtn chess' + j + 'Btn" value=""/>');
                var ss = ("#BranchPath_") + j;
                $(ss).one('click', function () {
                    inx = this.getAttribute("id").split("_")[1];
                    currentId = nextpace[inx][1];

                    movesIndex++;
                    moves = bill.getMoves4Server(1);
                    bill.cleanChess();
                    isVerticalReverse ? bill.init(3, comm.arrReverse(bill.cMap), !0) : bill.init(3, bill.cMap, !0);
                    if (movesIndex > 0) {
                        for (var e = 0; movesIndex - 1 > e; e++)
                            bill.stepPlay(moves[e].src, moves[e].dst, !0);
                        bill.stepPlay(moves[e].src, moves[e].dst);
                    }
                    bill.replayBtnUpdate();
                    $("#nextstepdialog").trigger("myclick");
                    //自动播放控制
                    if (autoreplayset != 0) {
                        autoreplayset = setInterval(bill.replayNext, 2000);
                    }
                });
            }
            popupDiv('nextstepdialog');
            $("#nextstepdialog").bind('myclick', function () {
                hideDiv('nextstepdialog');
                for (i = 0; i < countPath; i++) {
                    $(".chessbaseBtn").remove();
                }
                bill.cleanLine();
            });
        }
		relayNextLock = 0;
    },

    bill.replayPrev = function () {
		cleanChessdbDetail();
		if (!relayPrevLock) {
			relayPrevLock = 1;
			if (b_autoset != 0 || r_autoset != 0) {
				showFloatTip("请取消电脑思考，再点击上一步");
				return;
			}
			bill.cleanLine();
			bill.isend = !1,
				play.isPlay = !0,
				moves = bill.getMoves4Server(-1);
			bill.cleanChess();
			isVerticalReverse ? bill.init(3, comm.arrReverse(bill.cMap), !0) : bill.init(3, bill.cMap, !0);
			if (movesIndex > 0) {
				movesIndex--;
				for (var e = 0; movesIndex > e; e++)
					bill.stepPlay(moves[e].src, moves[e].dst, !0);
			}
			
			relayPrevLock = 0;
		}
		bill.replayBtnUpdate();
    },
    bill.replayFirst = function () {
		cleanChessdbDetail();
        if (b_autoset != 0 || r_autoset != 0) {
            showFloatTip("请取消电脑思考，再点击开局");
            return;
        }
        bill.cleanLine();
        bill.isend = !1,
            play.isPlay = !0,
            moves = bill.getMoves4Server(-1);
        bill.cleanChess();
        isVerticalReverse ? bill.init(3, comm.arrReverse(bill.cMap), !0) : bill.init(3, bill.cMap, !0);

        currentId = 0;
        movesIndex = 0;
        for (var e = 0; movesIndex > e; e++)
            bill.stepPlay(moves[e].src, moves[e].dst, !0);

        bill.replayBtnUpdate();
    },
    bill.replayEnd = function () {
		cleanChessdbDetail();
        if (b_autoset != 0 || r_autoset != 0) {
            showFloatTip("请取消电脑思考，再点击终局");
            return;
        }
        bill.cleanLine();
        bill.isend = !1,
            play.isPlay = !0,
            moves = bill.getMoves4Server(-1);
        bill.cleanChess();
        isVerticalReverse ? bill.init(3, comm.arrReverse(bill.cMap), !0) : bill.init(3, bill.cMap, !0);

        movesIndex = moves.length;
        currentId = bill.paceEx[movesIndex - 1][0][1];
        for (var e = 0; movesIndex > e; e++)
            bill.stepPlay(moves[e].src, moves[e].dst, !0);

        bill.replayBtnUpdate();
    },
    bill.replayBtnUpdate = function () {
		if (play.isAnimating) {
			setTimeout(function(){
				 bill.replayBtnUpdate();	
			}, 200);
			return;
		}
        moves = moves || [];
        var count = 0;
        for (var i = 0; i < moves.length; i++) {
            if (moves[i])
                count++;
        }
		
		if (count == 0) count = bill.paceEx.length;
		
        0 >= movesIndex ? setEnable("firstBtn", !1) : setEnable("firstBtn", !0),
            0 >= movesIndex ? setEnable("prevBtn", !1) : setEnable("prevBtn", !0),
            movesIndex >= count ? setEnable("nextBtn", !1) : setEnable("nextBtn", !0),
            movesIndex >= count ? setEnable("endBtn", !1) : setEnable("endBtn", !0);
        if (movesIndex >= count && autoreplayset != 0) clearInterval(autoreplayset);
        $("#tipsInfo").text("第" + movesIndex + "步 / 总" + count + "步"),
            $("#tipsInfo").show();
        if (bill.notes[currentId]) {
            $("#noteInfo").text(bill.notes[currentId]),
                //$("#noteInfo").show()
                $("#noteInfo").parent('.mui-toast-container').addClass('mui-active');
        } else {
            //$("#noteInfo").hide()
            $("#noteInfo").parent('.mui-toast-container').removeClass('mui-active');
        }
        bill.isOffensive ? (movesIndex % 2 == 0 ? (bill.my = 1, $("#AIThink").text("第" + movesIndex + "步 / 总" + count + "步    "+"红方思考中。。。"), $("#AIThink").show()) : (bill.my = -1, $("#AIThink").text("第" + movesIndex + "步 / 总" + count + "步    "+"黑方思考中。。。"), $("#AIThink").show())) : (movesIndex % 2 == 0 ? (bill.my = -1, $("#AIThink").text("第" + movesIndex + "步 / 总" + count + "步    "+"黑方思考中。。。"), $("#AIThink").show()) : (bill.my = 1, $("#AIThink").text("第" + movesIndex + "步 / 总" + count + "步    "+"红方思考中。。。"), $("#AIThink").show()));
        play.map = bill.map;
		if (mode == 5 && bill.nowManKey == !1) {
			setTimeout(function(){
				sendMessage(play.queryall(isVerticalReverse ? comm.arrReverse(play.map) : play.map, bill.my));	
			}, 1000);
		}
    },
    bill.replayTipHide = function () {
        function e() {
            a.parent.removeChild(a)
        }

        if (comm.replayTip) {
            var a = comm.replayTip;
            comm.replayTip = void 0,
                createjs.Tween.get(a).to({lpha: 0}, 1e3).call(e)
        }
    },
    bill.getMoves4Server = function (t) {
        var e = [];
        e.length = bill.paceEx.length;
        nextid = currentId;
        preid = currentId;

        /*向后延伸*/
        for (a = movesIndex; a < bill.paceEx.length; a++) {
            var nextpaceEx = bill.paceEx[a];
            for (j = 0; nextpaceEx && j < nextpaceEx.length; j++) {
                if (nextpaceEx[j][2] == nextid) {
                    nextid = nextpaceEx[j][1];

                    var m = nextpaceEx[j][0].split(""),
                        o = {src: {x: parseInt(m[0]), y: parseInt(m[1])}, dst: {x: parseInt(m[2]), y: parseInt(m[3])}};
                    e[a] = o;
                    break;
                }
            }
        }
        /*向前回溯*/
        for (a = movesIndex - 1; a >= 0; a--) {
            var prepaceEx = bill.paceEx[a];
            for (j = 0; prepaceEx && j < prepaceEx.length; j++) {
                if (prepaceEx[j][1] == preid) {
                    preid = prepaceEx[j][2];
                    if (t == -1 && a == movesIndex - 1)
                        currentId = prepaceEx[j][2];
                    var m = prepaceEx[j][0].split(""),
                        o = {src: {x: parseInt(m[0]), y: parseInt(m[1])}, dst: {x: parseInt(m[2]), y: parseInt(m[3])}};
                    e[a] = o;
                    break;
                }
            }
        }
        if (movesIndex == 0) {
            var prepaceEx = bill.paceEx[0];
            for (j = 0; prepaceEx && j < prepaceEx.length; j++) {
                if (prepaceEx[j][1] == currentId) {
                    var m = prepaceEx[j][0].split(""),
                        o = {src: {x: parseInt(m[0]), y: parseInt(m[1])}, dst: {x: parseInt(m[2]), y: parseInt(m[3])}};
                    e[0] = o;
                    break;
                }
            }
        }
        moves = e;
        return e;
        for (var e = [], a = 0; a < bill.pace.length; a++) {
            var m = bill.pace[a].split(""),
                o = {src: {x: parseInt(m[0]), y: parseInt(m[1])}, dst: {x: parseInt(m[2]), y: parseInt(m[3])}};
            e[a] = o
        }
        return e
    },
    bill.getNotes2Server = function () {
        var e = "", o = "";
        for (var a = 0; a < bill.notes.length; a++) {
            o = (bill.notes[a]);
            if (o) {
                e += " " + a + " " + o;
            }
        }
        return e
    },
    bill.getMoves6Server = function () {
        var e = "", o = "";

        for (var a = 0; a < bill.pace.length; a++) {
            var m = bill.pace[a].split("");
            o = " " + (parseInt(m[0]) + 1) + " " + (10 - parseInt(m[1])) + " " + (parseInt(m[2]) + 1) + " " + (10 - parseInt(m[3]));
            e += o;
        }
        return e
    },
    bill.getMoves6ServerEx = function () {
        var e = "", o = "";
        for (a = 0; a < bill.paceEx.length; a++) {

            var nextpaceEx = bill.paceEx[a];
            for (j = 0; j < nextpaceEx.length; j++) {
                o = ' ' + nextpaceEx[j][0] + ' ' + nextpaceEx[j][1] + ' ' + nextpaceEx[j][2] + ' ' + a;
                e += o;
            }
        }
        return e
    },
    bill.reverseMoves = function () {
        var e = "", o = "";
        for (a = 0; a < bill.paceEx.length; a++) {
            var paceEx = bill.paceEx[a];
            for (b = 0; b < paceEx.length; b++) {
                var temp = paceEx[b][0].split("");
                temp[0] = 8 - temp[0];
                temp[1] = 9 - temp[1];
                temp[2] = 8 - temp[2];
                temp[3] = 9 - temp[3];
                paceEx[b][0] = temp.join("");
            }
        }
        for (a = 0; a < bill.pace.length; a++) {
            var pace = bill.pace[a].split("");
            pace[0] = 8 - pace[0];
            pace[1] = 9 - pace[1];
            pace[2] = 8 - pace[2];
            pace[3] = 9 - pace[3];
            bill.pace[a] = pace.join("");
        }
        return e
    },
    bill.stepPlay = function (e, a, m) {
        m = m || !1,
            comm.hideDots(),
            comm.light.visible = !1;
        var o = bill.map[e.y][e.x];
        bill.nowManKey = o;
        var o = bill.map[a.y][a.x];
        o ? bill.AIclickMan(o, a.x, a.y, m) : bill.AIclickPoint(a.x, a.y, m)
    },
    bill.AIPlay = function () {
        if (playmode == 1) return;
        if (waitServerPlay) return;
        play.map = bill.map;
        if (movesIndex % 2 == 1) {//黑
            play.bAIPlay();
            play.my = -1;
            bill.my = 1;
        }
        if (movesIndex % 2 == 0) {//红
            play.rAIPlay();
            play.my = 1;
            bill.my = -1;
        }
    },
    bill.AIclickMan = function (e, a, m, o) {
        var n = comm.mans[e];
        n.isShow = !1,
            o ? n.chess.parent.removeChild(n.chess) : bill.addRemoveOnDrop(n.chess),
            delete bill.map[comm.mans[bill.nowManKey].y][comm.mans[bill.nowManKey].x],
            bill.map[m][a] = bill.nowManKey,
            bill.showPane(comm.mans[bill.nowManKey].x, comm.mans[bill.nowManKey].y, a, m),
            comm.mans[bill.nowManKey].x = a,
            comm.mans[bill.nowManKey].y = m,
            o ? comm.mans[bill.nowManKey].move() : comm.mans[bill.nowManKey].animate(),
            bill.my = -bill.my,
        "j0" == e && bill.onGameEnd(-1),
        "J0" == e && bill.onGameEnd(1),
            bill.nowManKey = !1;
    },
    bill.AIclickPoint = function (e, a, m) {
        var o = bill.nowManKey,
            n = comm.mans[o];
        bill.nowManKey && (
            delete bill.map[comm.mans[bill.nowManKey].y][comm.mans[bill.nowManKey].x],
                bill.map[a][e] = o,
                comm.showPane(n.x, n.y, e, a),
                n.x = e,
                n.y = a,
                m ? n.move() : n.animate(),
                bill.nowManKey = !1
        )
    },
    bill.replayMovesStep = function (e) {
        e = e || 1,
            bill.stepPlay(moves[movesIndex].src, moves[movesIndex].dst),
            movesIndex += e,
            bill.replayBtnUpdate();
    },
    bill.cleanChess = function () {       
        for (var e = 0; e < bill.map.length; e++) for (var a = 0; a < bill.map[e].length; a++) {
            var m = bill.map[e][a];
            if (m) removeChess(m);
        }

        comm.hidePane(),
            comm.hideDots(),
            comm.light.visible = !1
    },
    bill.cleanChess2 = function () {
        for (var e = 0; e < bill.sMap.length; e++) for (var a = 0; a < bill.sMap[e].length; a++) {
            var m = bill.sMap[e][a];
            if (m) removeChess(m);
        }
        for (var a = 0; a < chessnum.length; a++) {
            stage.removeChild(chessnum[a])
        }
    },
    bill.isend = 0,
    bill.notes = [],
    bill.emptyMap = [[, , , , "J0", , , , ""], [, , , , , , , , ""], [, , , , , , , , ""], [, , , , , , , , ""], [, , , , , , , , ""], [, , , , , , , , ""], [, , , , , , , , ""], [, , , , , , , , ""], [, , , , , , , , ""], [, , , , "j0", , , , ""]],
    bill.sMapFull = [["C0", "M0", "P0", "X0", "S0", "Z0", ""], ["c0", "m0", "p0", "x0", "s0", "z0", ""]],
    bill.sMapEmpty = [[, , , , , , , ,], [, , , , ,]],
    bill.chessMan = {
        "C": ["C0", "C1"],
        "M": ["M0", "M1"],
        "P": ["P0", "P1"],
        "S": ["S0", "S1"],
        "X": ["X0", "X1"],
        "Z": ["Z0", "Z1", "Z2", "Z3", "Z4"],
        "c": ["c0", "c1"],
        "m": ["m0", "m1"],
        "p": ["p0", "p1"],
        "s": ["s0", "s1"],
        "x": ["x0", "x1"],
        "z": ["z0", "z1", "z2", "z3", "z4"]
    },
    bill.emptychessMan = {
        "C": [],
        "M": [],
        "P": [],
        "S": [],
        "X": [],
        "Z": [],
        "c": [],
        "m": [],
        "p": [],
        "s": [],
        "x": [],
        "z": []
    }
bill.createMan = function (e, a, m) {
    if (e) {
        var n = new comm["class"].Man(e);
        n.x = m,
            n.y = a,
            comm.mans[e] = n;
        var t = addChess(n.pater, comm.spaceX * n.x + comm.pointStartX, comm.spaceY * n.y + comm.pointStartY);
        n.chess = t,
            n.move()
    }
},
    bill.createMans = function (e) {
        for (var m = 0; m < e[0].length; m++) {
            var o = e[0][m];
            if (o) {
                bill.createMan(o, boutside, m * outsidescale);
                m == 5 ? bill.drawNum(0, m, 5) : bill.drawNum(0, m, 2);
            }
        }
        for (var m = 0; m < e[1].length; m++) {
            var o = e[1][m];
            if (o) {
                bill.createMan(o, routside, m * outsidescale);
                m == 5 ? bill.drawNum(1, m, 5) : bill.drawNum(1, m, 2);
            }
        }
    },
    bill.bylawX = function () {
        var n = [];
        n.push([2, 0]), n.push([6, 0]), n.push([2, 4]), n.push([6, 4]), n.push([0, 2]),
            n.push([4, 2]), n.push([8, 2]);
        return n;
    },
    bill.bylawS = function (e, a, m, o) {
        var n = [];
        n.push([3, 0]), n.push([5, 0]), n.push([4, 1]), n.push([3, 2]), n.push([5, 2]);
        return n;
    },
    bill.bylawJ = function (e, a, m, o) {
        var n = [];
        n.push([4, 0]), n.push([5, 0]), n.push([3, 0]), n.push([4, 1]), n.push([5, 1]),
            n.push([3, 1]), n.push([4, 2]), n.push([5, 2]), n.push([3, 2]);
        return n;
    },
    bill.bylawZ = function (e, a, m, o) {
        var n = [];
        n.push([0, 3]), n.push([0, 4]), n.push([2, 3]), n.push([2, 4]), n.push([4, 3]),
            n.push([4, 4]), n.push([6, 3]), n.push([6, 4]), n.push([8, 3]), n.push([8, 4]);
        for (var i = 0; i < 9; i++)
            for (var j = 5; j < 10; j++)
                n.push([i, j]);
        return n;
    },
    bill.bylawx = function () {
        var n = [];
        n.push([2, 5]), n.push([6, 5]), n.push([2, 9]), n.push([6, 9]), n.push([0, 7]),
            n.push([4, 7]), n.push([8, 7]);
        return n;
    },
    bill.bylaws = function (e, a, m, o) {
        var n = [];
        n.push([3, 7]), n.push([5, 7]), n.push([4, 8]), n.push([3, 9]), n.push([5, 9]);
        return n;
    },
    bill.bylawj = function (e, a, m, o) {
        var n = [];
        n.push([4, 7]), n.push([5, 7]), n.push([3, 7]), n.push([4, 8]), n.push([5, 8]),
            n.push([3, 8]), n.push([4, 9]), n.push([5, 9]), n.push([3, 9]);
        return n;
    },
    bill.bylawz = function (e, a, m, o) {
        var n = [];
        n.push([0, 5]), n.push([0, 6]), n.push([2, 5]), n.push([2, 6]), n.push([4, 5]),
            n.push([4, 6]), n.push([6, 5]), n.push([6, 6]), n.push([8, 5]), n.push([8, 6]);
        for (var i = 0; i < 9; i++)
            for (var j = 0; j < 5; j++)
                n.push([i, j]);
        return n;
    },
    bill.checkMans = function (e, a, m) {
        //检查将、士、象、兵、卒的位置是否合法
        e = e.slice(0, 1);
        (isVerticalReverse == 0) ? ( result = {
                "J": (a > -1 & 3 > a & m > 2 & 6 > m),
                "X": ( ((a == 0 || a == 4) & (m == 2 || m == 6)) || (a == 2 & (m == 0 || m == 4 || m == 8)) ),
                "S": ( ((a == 0 || a == 2) & (m == 3 || m == 5)) || (a == 1 & (m == 4)) ),
                "Z": ( ((a == 3 || a == 4) & (m == 0 || m == 2 || m == 4 || m == 6 || m == 8)) || (a > 4 & 10 > a) ),
                "j": (a > 6 & 10 > a & m > 2 & 6 > m),
                "x": ( ((a == 5 || a == 9) & (m == 2 || m == 6)) || (a == 7 & (m == 0 || m == 4 || m == 8)) ),
                "s": ( ((a == 7 || a == 9) & (m == 3 || m == 5)) || (a == 8 & (m == 4)) ),
                "z": ( ((a == 5 || a == 6) & (m == 0 || m == 2 || m == 4 || m == 6 || m == 8)) || (a > -1 & 5 > a) ),
                "C": !0,
                "M": !0,
                "P": !0,
                "c": !0,
                "m": !0,
                "p": !0
            }[e] || !1) : ( result = {
                "j": (a > -1 & 3 > a & m > 2 & 6 > m),
                "x": ( ((a == 0 || a == 4) & (m == 2 || m == 6)) || (a == 2 & (m == 0 || m == 4 || m == 8)) ),
                "s": ( ((a == 0 || a == 2) & (m == 3 || m == 5)) || (a == 1 & (m == 4)) ),
                "z": ( ((a == 3 || a == 4) & (m == 0 || m == 2 || m == 4 || m == 6 || m == 8)) || (a > 4 & 10 > a) ),
                "J": (a > 6 & 10 > a & m > 2 & 6 > m),
                "X": ( ((a == 5 || a == 9) & (m == 2 || m == 6)) || (a == 7 & (m == 0 || m == 4 || m == 8)) ),
                "S": ( ((a == 7 || a == 9) & (m == 3 || m == 5)) || (a == 8 & (m == 4)) ),
                "Z": ( ((a == 5 || a == 6) & (m == 0 || m == 2 || m == 4 || m == 6 || m == 8)) || (a > -1 & 5 > a) ),
                "C": !0,
                "M": !0,
                "P": !0,
                "c": !0,
                "m": !0,
                "p": !0
            }[e] || !1)

        return result;
    },
    bill.checkManDots = function (e) {
        comm.hideDots();
        e = e.slice(0, 1);
        //显示可走的点
        isVerticalReverse == 0 ? (comm.dot.dots = {
                "J": bill.bylawJ(),
                "S": bill.bylawS(),
                "X": bill.bylawX(),
                "Z": bill.bylawZ(),
                "j": bill.bylawj(),
                "s": bill.bylaws(),
                "x": bill.bylawx(),
                "z": bill.bylawz()
            }[e] || []) : (comm.dot.dots = {
                "J": bill.bylawj(),
                "S": bill.bylaws(),
                "X": bill.bylawx(),
                "Z": bill.bylawz(),
                "j": bill.bylawJ(),
                "s": bill.bylawS(),
                "x": bill.bylawX(),
                "z": bill.bylawZ()
            }[e] || [])

        comm.showDots();
    },
    bill.checkJiang = function () {
        for (var e = 0; e < 3; e++) for (var a = 3; a < 6; a++) {
            var m = bill.map[e][a];
            if (m == "J0") {
                var flag = 0;
                for (var o = e + 1; o < bill.map.length; o++) {
                    m = bill.map[o][a];
                    if (m == "j0") {
                        if (flag == 0)
                            return !1;
                    }
                    else if (m) {
                        flag++;
                    }
                }
                return !0;
            }
        }
        return !0;
    },

    bill.resizeCanvas = function () {

        canvas = document.getElementById("chess");

        stageWidth = window.screen.width;
        stageHeight = 0;

        canvasWidth =  window.screen.width - 10;
        canvasHeight = canvasWidth / 640 * 866;

        if(mode == 5){
            stageHeight = (window.screen.width - 10)/ 640 * 706 - 10 ;
        }else{
            stageHeight = window.screen.width / 640 * 866 ;
        }

        if(stageHeight + 100 > window.screen.height){
            //如果屏幕太矮
            stageHeight = window.screen.height - 100;
            console.log(stageHeight);
            if(mode == 5){

                stageWidth = stageHeight / 706 * 640 + 10;

            }else{
                stageWidth = stageHeight / 866 * 640 + 10;
            }
			canvasWidth = stageWidth - 10;
			canvasHeight = canvasWidth / 640 * 866;
        }

        canvas.style.width = canvasWidth + 'px';
        canvas.style.height = canvasHeight + 'px';
        $('.wgo-board').css('width',stageWidth+'px');
        $('.wgo-board').css('height',stageHeight+'px');
        //console.log('现在的屏幕和canvas的宽度之差为'+window.screen.height+' - '+stageHeight);
        $(".mode5").hide();
        $(".mode4").show();
        $(document).attr("title", "开始拆解");
        $(".mui-title").html("开始拆解");
        resizeBoard();
    }
bill.onGameEnd = function (e, a) {
    clearInterval(b_autoset), b_autoset = 0;
    clearInterval(r_autoset), r_autoset = 0;
    bill.isend = 1;
    /*锁定，等待1s后解锁*/
    setTimeout((function () {
        waitServerPlay = !1;
    }), 1000);
}