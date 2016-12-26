var canvas, stage, exportRoot;
var chessLayer,chessTopLayer,chessBottonLayer;

var MODE_PLAY = 1;
var MODE_REPLAY = 2;
var MODE_BILL = 3;
var mode = 1;
var playmode = 1;
var file,level_id = -1;
var chapterTitle = '';
var REPLAY_GET_URL = baseURL+'/save/';
var REPLAY_SAVE_URL = REPLAY_GET_URL;	

var CDN_PATH = '';
var JS_VER_COMBINED = 'combined';
var JS_VER_MIN = 'min';
var JS_VER = JS_VER_MIN;

var baseURL = 'http://localhost/match/';
//var baseURL = 'http://chd.xueyunkeji.com/match/';
var REPLAY_GET_URL = baseURL+'save/';