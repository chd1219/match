var AI = AI || {};
AI.historyTable = {},
AI.init = function(e, a, o) {	
    var a = a || play.depth;
    AI.treeDepth = a,
    AI.number = 0,
    AI.setHistoryTable.lenght = 0;
    var r = AI.getAlphaBeta( - 99999, 99999, AI.treeDepth, comm.arr2Clone(play.map), o);
    if (r && -8888 != r.value || (AI.treeDepth = 2, r = AI.getAlphaBeta( - 99999, 99999, AI.treeDepth, comm.arr2Clone(play.map), o)), r && -8888 != r.value) {
        var c = play.mans[r.key]; (new Date).getTime();
        return [c.x, c.y, r.x, r.y]
    }
    return ! 1
},
AI.iterativeSearch = function(e, a) {
    var m = 100,
    o = 1,
    n = 8;
    AI.treeDepth = 0;
    for (var t = (new Date).getTime(), s = {},
    r = o; n >= r; r++) {
        var c = (new Date).getTime();
        AI.treeDepth = r,
        AI.aotuDepth = r;
        var s = AI.getAlphaBeta( - 99999, 99999, AI.treeDepth, e, a);
        if (c - t > m) return s
    }
    return ! 1
},
AI.getMapAllMan = function(e, a) {
    for (var m = [], o = 0; o < e.length; o++) for (var n = 0; n < e[o].length; n++) {
        var t = e[o][n];
        t && play.mans[t].my == a && (play.mans[t].x = n, play.mans[t].y = o, m.push(play.mans[t]))
    }
    return m
},
AI.getMoves = function(e, a) {
    for (var m = AI.getMapAllMan(e, a), o = [], n = play.isFoul, t = 0; t < m.length; t++) for (var s = m[t], r = s.bl(e), c = 0; c < r.length; c++) {
        var l = s.x,
        i = s.y,
        p = r[c][0],
        y = r[c][1]; (n[0] != l || n[1] != i || n[2] != p || n[3] != y) && o.push([l, i, p, y, s.key])
    }
    return o
},
AI.getAlphaBeta = function(e, a, m, o, n) {
    var t = o.join(),
    s = AI.historyTable[t];
    if (s && s.depth >= AI.treeDepth - m + 1) return s.value * n;
    if (0 == m) return {
        value: AI.evaluate(o, n)
    };
    for (var r = AI.getMoves(o, n), c = 0; c < r.length; c++) {
        var l = r[c],
        i = l[4],
        p = l[0],
        y = l[1],
        h = l[2],
        v = l[3],
        u = o[v][h] || "";
        if (o[v][h] = i, delete o[y][p], play.mans[i].x = h, play.mans[i].y = v, "j0" == u || "J0" == u) return play.mans[i].x = p,
        play.mans[i].y = y,
        o[y][p] = i,
        delete o[v][h],
        u && (o[v][h] = u),
        {
            key: i,
            x: h,
            y: v,
            value: 8888
        };
        var d = -AI.getAlphaBeta( - a, -e, m - 1, o, -n).value;
        if (play.mans[i].x = p, play.mans[i].y = y, o[y][p] = i, delete o[v][h], u && (o[v][h] = u), d >= a) return {
            key: i,
            x: h,
            y: v,
            value: a
        };
        if (d > e && (e = d, AI.treeDepth == m)) var g = {
            key: i,
            x: h,
            y: v,
            value: e
        }
    }
    return AI.treeDepth == m ? g ? g: !1 : {
        key: i,
        x: h,
        y: v,
        value: e
    }
},
AI.setHistoryTable = function(e, a, m, o) {
    AI.setHistoryTable.lenght++,
    AI.historyTable[e] = {
        depth: a,
        value: m
    }
},
AI.evaluate = function(e, a) {
    for (var m = 0,
    o = 0; o < e.length; o++) for (var n = 0; n < e[o].length; n++) {
        var t = e[o][n];
        t && (m += play.mans[t].value[o][n] * play.mans[t].my)
    }
    return AI.number++,
    m * a
};