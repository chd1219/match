function loadConfig() {
   file = getUrlParam("file"),
    level_id = getUrlParam("level_id");
    var e;
    if (file) e = REPLAY_GET_URL + file,
    $.getJSON(e,
    function(e) {
		$("#reverseBtn").show();
        serverData = e;
		if(serverData.BillType){
			var a;
			serverData.map ? ($("#moreBtn2").addClass("moreBtn2"), $("#moreBtn2").removeClass("moreBtn4"), comm.isPVP = !1, a = comm.parseMap(serverData.map)) : ($("#moreBtn2").addClass("moreBtn4"), $("#moreBtn2").removeClass("moreBtn2"), comm.isPVP = !0, comm.pvpTitle = serverData.meta.FUPAN_GAMESCENE_NAME, a = comm.initMap.concat(), 1 == serverData.meta.FUPAN_CHESS_COLOR && a.reverse()),
			serverData.meta && serverData.meta.FUPAN_TITLE ? chapterTitle = serverData.meta.FUPAN_TITLE: (chapterTitle = "空章节标题", console.log(chapterTitle)),
			document.title = chapterTitle;
			var m = comm.parseMovesEx(serverData.moves);
			comm.movesNum = m.length,
			comm.parseNote(serverData.notes);
			comm.initChessEx(a, m);			
			bill.replayBtnUpdate(),
			mode = 4;
			showBtns();
			$("#sendBtn2").hide();
		}
		else{
			var a;
			serverData.map ? ($("#moreBtn2").addClass("moreBtn2"), $("#moreBtn2").removeClass("moreBtn4"), comm.isPVP = !1, a = comm.parseMap(serverData.map)) : ($("#moreBtn2").addClass("moreBtn4"), $("#moreBtn2").removeClass("moreBtn2"), comm.isPVP = !0, comm.pvpTitle = serverData.meta.FUPAN_GAMESCENE_NAME, a = comm.initMap.concat(), 1 == serverData.meta.FUPAN_CHESS_COLOR && a.reverse()),
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
    })    
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