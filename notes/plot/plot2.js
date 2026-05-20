// https://gist.github.com/tylerneylon/584a5e55d77372fe8ab8ddd1f1741627#file-graph_calc-js
// graph_calc.js
//
// This is a quick and dirty way to graph mathematical functions expressed in
// JavaScript and rendered as SVG. The file example.html provides an example use
// case. It's important to call setCanvasSize before graphing with a call to
// drawFn.
//

var svg = document.getElementById('svg')
var svgNS = svg.namespaceURI

var lightStyle = {stroke: '#ddd', fill: 'transparent', 'stroke-width': 3}
var darkStyle = {stroke: '#666', fill: 'transparent', 'stroke-width': 3}

var xSize
var ySize

var numFnPts = 300

function setCanvasSize(w, h) {
  xSize = w
  ySize = h
  //addAttributes(svg, {width: xSize, height: ySize})
  addAttributes(svg, {viewBox: "0 0 " + (xSize) + " " + (ySize)});
}

function add(eltName, attr) {
  var elt = document.createElementNS(svgNS, eltName)
  svg.appendChild(elt)
  if (attr) addAttributes(elt, attr)
  return elt
}

function addAttributes(elt, attr) {
  for (var key in attr) {
    elt.setAttribute(key, attr[key])
  }
  return elt
}

function drawFn(xMin, xMax, yMin, yMax, opts, fn) {

  if (opts && fn === undefined) {
    fn   = opts
    opts = null
  }

  if (opts && opts.doEqualizeAxes) {
    // This means to *increase* the frame just enough so that the axes are
    // equally scaled.
    var xRatio = (xMax - xMin) / xSize
    var yRatio = (yMax - yMin) / ySize
    if (xRatio < yRatio) {
      var xMid = (xMax + xMin) / 2
      var half = (xMax - xMin) / 2
      xMin = xMid - half * (yRatio / xRatio)
      xMax = xMid + half * (yRatio / xRatio)
    } else {
      var yMid = (yMax + yMin) / 2
      var half = (yMax - yMin) / 2
      yMin = yMid - half * (xRatio / yRatio)
      yMax = yMid + half * (xRatio / yRatio)
    }
  }

  function canvasPtFromXY(x, y) {
    var xPerc = (x - xMin) / (xMax - xMin)
    var yPerc = (y - yMin) / (yMax - yMin)
    return [xPerc * xSize, ySize - yPerc * ySize]
  }

  function drawTickAroundPt(p, dir) {
    console.log(p)
    var tick = add('line', lightStyle)
    var a = [p[0], p[1]]
    a[dir] -= 5
    var b = [p[0], p[1]]
    b[dir] += 5
    addAttributes(tick, {x1: a[0], y1: a[1], x2: b[0], y2: b[1]})
    var text = add('text', darkStyle);
    addAttributes(text, 
        {
          "alignment-baseline": "hanging",
          "text-anchor": "middle",
          x: b[0],
          y: b[1] - (a[1]-b[1])/2.0
        });
    text.innerHTML = "1";
  }

  if (opts && opts.doDrawAxes) {

    // The x-axis.
    var leftPt  = canvasPtFromXY(xMin, 0)
    var rightPt = canvasPtFromXY(xMax, 0)
    if (0 <= leftPt[1] && leftPt[1] < ySize) {
      var xAxis = add('line', lightStyle)
      addAttributes(xAxis, {x1:  leftPt[0], y1:  leftPt[1],
                            x2: rightPt[0], y2: rightPt[1]})
      for (var x = Math.ceil(xMin); x <= Math.floor(xMax); x++) {
        var p = canvasPtFromXY(x, 0)
        drawTickAroundPt(p, 1)  // 1 == vertical tick
      }
    }

    // The y-axis.
    var botPt = canvasPtFromXY(0, yMin)
    var topPt = canvasPtFromXY(0, yMax)
    if (0 <= botPt[0] && botPt[0] < xSize) {
      var yAxis = add('line', lightStyle)
      addAttributes(yAxis, {x1: botPt[0], y1: botPt[1],
                            x2: topPt[0], y2: topPt[1]})
      for (var y = Math.ceil(yMin); y <= Math.floor(yMax); y++) {
        console.log(y)
        var p = canvasPtFromXY(0, y)
        drawTickAroundPt(p, 0)  // 0 == horizontal tick
      }
    }
  }

  var xDelta = (xMax - xMin) / (numFnPts - 1)
  var pts = []
  var xPrev = xMin
  var prevCanvasY = false

  for (var i = 0; i < numFnPts; i++) {
    var x, xTarget = xMin + i * xDelta
    do {
      x = xTarget
      var y = fn(x)
      var canvasPt = canvasPtFromXY(x, y)
      var perc = 0.5
      while (prevCanvasY && Math.abs(prevCanvasY - canvasPt[1]) > 30 &&
             perc > 0.0001) {
        x = (1 - perc) * xPrev + perc * xTarget
        var y = fn(x)
        var canvasPt = canvasPtFromXY(x, y)
        perc /= 2
      }
      pts.push(canvasPt[0], canvasPt[1])
      xPrev = x
      prevCanvasY = canvasPt[1]
    } while (x < xTarget);
  }

  var polyline = add('polyline', darkStyle)
  addAttributes(polyline, {points: pts.join(' ')})
}
