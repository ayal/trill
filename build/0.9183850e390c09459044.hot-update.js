webpackHotUpdate(0,[
/* 0 */,
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var colorbrewer = __webpack_require__(2);
	var chroma = __webpack_require__(4);
	var _ = __webpack_require__(6);

	var s = Snap(400, 620);

	var rmap = {};
	var scale = 40;

	var rscale = function rscale(a, b, c) {
	  //console.log('rscale',a,b,c,scale)
	  return "M" + [a, b, c].map(function (t) {
	    var v = t[0] === 0 || t[1] === 0 || t[0] === 10 || t[1] === 10 ? 0 : _.random(0, 30);
	    if (!rmap['' + t]) {
	      rmap['' + t] = [_.random(t[0] * scale + v, t[0] * scale), _.random(t[1] * scale + v, t[1] * scale)];
	      //rmap['' + t] = [t[0]*scale,t[1] * scale];
	    }
	    return rmap['' + t];
	  }).join(' L ') + " Z";
	};

	var colors = ["#fff7f3", "#fde0dd", "#fcc5c0", "#fa9fb5", "#f768a1", "#dd3497", "#ae017e", "#7a0177", "#49006a"];
	var cscale = chroma.scale([colors[1], colors[3]]).colors(20);

	var draw = function draw(a, b, c, i) {
	  //console.log('draw',a,b,c,i)
	  if (!a || !b || !c) {
	    return;
	  }
	  var color = cscale[i % 20];

	  var path = s.path(rscale(a, b, c, scale)).attr({ 'strokeWidth': 1.51, 'fill': color, stroke: color });
	  return path;
	};

	var tris = [];
	_.each(_.range(0, 10), function (j) {

	  _.each(_.range(0, 10), function (i) {
	    var opts = [[i + 1, j + 1], [i, j + 1]];
	    var base = [[i, j], [i + 1, j]];
	    var t3 = _.sample(opts);
	    var t2 = _.without(opts, t3)[0];
	    var t0 = base[_.indexOf(opts, t3)];
	    tris.push([base[0], base[1], t3]);

	    tris.push([t0, t2, t3]);
	  });
	});

	var ps = [];
	tris.forEach(function (t, i) {
	  ps[i] = draw(t[0], t[1], t[2], i);
	});

	var animate = function animate() {
	  wait = ps.length;
	  rmap = {};
	  var rc = _.random(0, colors.length - 1);
	  var brew = _.sample(colorbrewer);
	  var cscale = chroma.scale([brew[7][2], _.last(brew[7])]).colors(20);

	  ps.forEach(function (p, i) {
	    var t = tris[i];
	    if (!t[0] || !t[1] || !t[2]) {
	      return;
	    }
	    var toanim = rscale(t[0], t[1], t[2]);

	    p.animate({
	      d: toanim,
	      fill: cscale[i % 20],
	      stroke: cscale[i % 20]
	    }, 2000, mina.easeOut, function () {
	      if (wait === 1) {
	        _.delay(animate);
	      }
	      wait--;
	    });
	  });
	};
	animate();

/***/ }
])