function addChess(e) {
    e || (e = "c");
    var a = new createjs.Container,
    m = LABEL[e],
    o = new m,
    n = new lib.ChessBody;
    return a.body = n,
    a.label = o,
    n.framerate = 24,
    o.framerate = 24,
    n.stop(),
    o.stop(),
    a.addChild(n),
    a.addChild(o),
    chessLayer.addChild(a),
    a.key = e,
    a
}
function intiBoard() {
    var e = new lib.Board;
    chessBottonLayer.addChild(e)
}

function moreBtn() {
    window.location = "index.html"
}

function getUrlParam(e) {
    var a = new RegExp("(^|&)" + e + "=([^&]*)(&|$)"),
    m = window.location.search.substr(1).match(a);
    return null != m ? unescape(m[2]) : null
}
function getEnv() {
    var e = navigator.userAgent.toLowerCase();
    return /micromessenger(\/[\d\.]+)*/.test(e) ? "weixin": /qq\/(\/[\d\.]+)*/.test(e) || /qzone\//.test(e) ? "qq": "web"
}
function loadConfig() {
	comm.initChess();
}
function requestServerStart(e) {
    e = e || serverData.map;
    var a = {
        Piece: e
    };
    SAI(1, a, onAct, onFault)
}
function onAct(e) {
    comm.playid = e.playid,
    comm.seq = e.seq
}
function SAI(e, a, m, o) {
    
}

function loadSound(e) {
    fileLoaded(e)
}
function stageClick(e) {
   //play.clickCanvas(e)
}

function enterFrame() {
    var e = new Date,
    a = e.getTime(),
    m = a - lastTime;
    Math.round(1e3 / m);
    lastTime = a
}
function showMask() {
    $("body").css("overflow", "hidden"),
    $("#cover").show(),
    "web" == getEnv() && (console.log("onUserMessage", onUserMessage()), console.log("onUserShare", onUserShare()))
}
function hideMask() {
    $("body").css("overflow", "auto"),
    $("#cover").hide()
}
function hideLoading() {
    $("#loading").hide()
}
function showBtns() {    
    $("#btnBox").show()
}
function showResult(e) {
    e ? ($("#gameLose").hide(), $("#gameWin").show(), $("#mode1").hide(), $("#mode2").hide(), $("#mode3").show()) : ($("#gameLose").show(), $("#gameWin").hide(), setEnable("regretBtn", !1)),
    $("#gameResult").show()
}
function hideResult() {
    $("#gameResult").hide()
}
function initLayer(e) {
    canvas = document.getElementById("chess"),
    images = images || {},
    ss = ss || {};
    var a = e.target;
    ss.chess_slim_atlas_ = a.getResult("chess_slim_atlas_"),
    exportRoot = new lib.chess_slim,
    ss.f_atlas_ = a.getResult("f_atlas_"),
    new res.f,
    stage = new createjs.Stage(canvas),
    stage.addChild(exportRoot),
    stage.update(),
    createjs.Touch.enable(stage),
    stage.on("stagemousedown", stageClick),
    chessLayer = comm.chessLayer = new createjs.Container,
    chessLayer.mouseEnabled = !1,
    chessLayer.mouseChildren = !1,
    chessTopLayer = comm.chessTopLayer = new createjs.Container,
    chessTopLayer.mouseEnabled = !1,
    chessTopLayer.mouseChildren = !1,
    chessBottonLayer = comm.chessBottonLayer = new createjs.Container,
    chessBottonLayer.mouseEnabled = !1,
    chessBottonLayer.mouseChildren = !1,
    chessTopLayer.x = chessLayer.x = 0,
    chessTopLayer.y = chessLayer.y = 0,
    stage.addChild(chessBottonLayer),
    stage.addChild(chessLayer),
    stage.addChild(chessTopLayer),
    comm.init(),
    comm.onload(),
    loadConfig(),
    showBtns(),
    setTimeout(hideLoading, 200),
    commTipsImg = new Image,
    commTipsImg.src = "assets/images/commTips.png";
}
function showFloatTip(e, a) {
    function m(e) {
        e.parent.removeChild(e)
    }
    a = a || 1000;
    var o = comm.getTips(e);
    o.alpha = 0;
    var n = o.getBounds().width,
    t = (640 - n) / 2 - 50;
    o.x = t,
    o.y = 300,
    comm.chessTopLayer.addChild(o),
    createjs.Tween.get(o).to({
        alpha: 1
    },
    500).wait(a).to({
        alpha: 0
    },
    1e3).call(m, [o])
}
comm = comm || {};

comm.init = function(e) {
    comm.width = 640,
    comm.height = 723,
    comm.spaceX = 67,
    comm.spaceY = 67,
    comm.pointStartX = 32,
    comm.pointStartY = 29+150
},

comm.initChess = function(e, a) {    
    intiBoard();  
    intiPane(),
    showBtns();
};

comm.clickCanvas = function(e) {
    movesTipsShow && (comm.replayMoves(), comm.replayTipHide(), movesTipsShow = !1)
},
comm.reverseY = function(e) {
    return 9 - e
},
comm.key2cid = function(e) {
    var a = comm.name2id[e.split("")[0]];
    return a
},
comm.toServerPos = function(e, a) {
    var m = {
        x: parseInt(e) + 1,
        y: 10 - parseInt(a)
    };
    return m
},
comm.onload = function() {
    comm.dot = {
        dots: []
    },
    comm.mans = {},
    $("#replayBtn").click(comm.replayMoves),
    $("#restartBtn").click(comm.restart),   	
    $("#sendBtn").click(comm.send),
    $("#returnBtn1").click(moreBtn),
    $("#returnBtn2").click(moreBtn),
    $("#returnBtn3").click(moreBtn),
	$("#returnBtn4").click(moreBtn),
    $("#returnBtn").click(moreBtn);	
};
comm.showPane = function(e, a, m, o) {
    comm.box1.visible = !0,
    comm.box1.x = comm.spaceX * e + comm.pointStartX + 3 + parseInt(e / 3),
    comm.box1.y = comm.spaceY * a + comm.pointStartY + 4,
    comm.box2.visible = !0,
    comm.box2.x = comm.spaceX * m + comm.pointStartX + 3 + parseInt(m / 3),
    comm.box2.y = comm.spaceY * o + comm.pointStartY + 4 + parseInt(o / 3)
},
comm.hidePane = function() {
    comm.box1.visible = !1,
    comm.box2.visible = !1
};