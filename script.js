require("./style.less");
var colorbrewer = require('colorbrewer')
var chroma = require('chroma-js')
var _ = require('lodash')

const s = Snap(300, 300);

document.getElementsByTagName("svg")[0].onclick=function(){
    window.open('https://www.youtube.com/watch?v=YynhRxRZNX4');
};

var rmap = {};
var scale = 20;
var tiles = 5;

var rscale = function(a, b, c) {
//console.log('rscale',a,b,c,scale)
  return "M" + [a, b, c].map(function(t) {
      //      var v = t[0] === 0 || t[1] === 0 || t[0] === tiles || t[1] === tiles ? 0 : _.random(-scale / 2,scale / 2);
      var v =  100 + _.random(-scale / 2, scale / 2); 
    if (!rmap['' + t]) {
      rmap['' + t] = [t[0] * scale + v, t[1] * scale + v];
      //rmap['' + t] = [t[0]*scale,t[1] * scale];
    }
    return rmap['' + t];
  }).join(' L ') + " Z"
}


var brew = _.sample(colorbrewer);
var cscale = chroma.scale([brew[7][2],_.last(brew[7])]).colors(tiles * 2);

var draw = function(a, b, c,i) {
//console.log('draw',a,b,c,i)
    if (!a || !b || !c) {
      return;
    }
    var color = cscale[i % (tiles * 2)];

    var path = s.path(rscale(a, b, c, scale)).attr({'strokeWidth': 1.51,'fill': color, stroke: color});
    return path;
  }
  
var tris = [];
_.each(_.range(0,tiles), function(j) {

  _.each(_.range(0,tiles), function(i) {
    var opts = [
      [i + 1, j + 1],
      [i, j + 1]
    ]
    var base = [[i, j], [i + 1, j]]
    var t3 = _.sample(opts);
    var t2 = _.without(opts, t3)[0]
    var t0 = base[_.indexOf(opts, t3)];
    tris.push([
      base[0], base[1], t3
    ]);

    tris.push([
      t0,
      t2, t3
    ]);
  });
});

var ps = [];
tris.forEach(function(t, i) {
  ps[i] = draw(t[0], t[1], t[2],i)
})



var animate = function() {
  var wait = ps.length;
  rmap = {};

    var brew = _.sample(colorbrewer);
    var cscale = chroma.scale([brew[7][2],_.last(brew[7])]).colors(tiles * 2);
    
    ps.forEach(function(p, i) {
    var t = tris[i];
    if (!t[0] || !t[1] || !t[2]) {
      return;
    }
    var toanim = rscale(t[0], t[1], t[2]);
  

    p.animate({
      d: toanim,
	fill: cscale[i % (tiles * 2)],
	stroke: cscale[i % (tiles * 2)]
    }, 500, mina.easeinout, function() {
      if (wait === 10) {
          animate();
      }
      wait--;
    })
    })
}
animate();
