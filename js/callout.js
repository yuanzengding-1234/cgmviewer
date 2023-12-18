
function CalloutClass() {
  this.poly;
  this.poly2;
  this.rect;
  this.handle;
  this.textbox;
}

var listOfCallouts = [];

function Callout(id) {

  //let callouts= [];
  let strokeWidth = 2;
  let handleSize = 24;

  let myCalloutClass = new CalloutClass();

  //text
  let textbox = new fabric.Textbox('', {
    left: d.origX,
    top: d.origY,
    width: 100,
    fontSize: d.fontSize,
    originY: 'center',
    originX: 'center',
    hasRotatingPoint: false,
    sdiType: 'calloutText',
    sdiId: id,
    opacity: d.opacity,
    strokeDashArray: d.strokeDashArray,
     
    stroke: d.strokeColor,
    strokeWidth: d.strokeWidth,
    lastLeft: d.origX,
    lastTop: d.origY,
  });

  textbox.setControlsVisibility({
    mtr: false,
  });

  textbox.on({
    'moving': function () {
      updateBubbleEvent(id);
    },
    'modified': function () {
      updateBubbleEvent(id);
    },
    'scaling': function () {
      updateBubbleEvent(id);
      //moveCalloutHandle();
    },
    'removed': function () {
      deleteCallout(id);
    },
  })

  c.fcanvas.on("text:changed", function (e) {
    if (e.target.sdiType && e.target.sdiType.includes('callout'))
      updateBubbleEvent(e.target.sdiId);
  });

  c.fcanvas.on('selection:created', (e) => {
    if (e.selected.length < 2)
      return;

    let selection = c.fcanvas.getActiveObject();
    e.selected.forEach(function (object) {
      if (object.sdiType && (object.sdiType.includes('callout'))) {
        selection.removeWithUpdate(object)
      }
    })
    //c.fcanvas.renderAll();
  })

  //speech bubble tail handle
  let handle = new fabric.Rect({
    // fill: 'white',
    // stroke: 'black',
    // strokeWidth: strokeWidth,

    fill: 'transparent',
    left: d.origX + 100,
    top: d.origY + 100,
    width: handleSize,
    height: handleSize,
    hasRotatingPoint: false,
    hasControls: false,
    originY: 'center',
    originX: 'center',
    
    sdiType: 'calloutHandle',
  });

  setNoControls(handle);

  handle.on({
    'moving': function () {
      updateBubbleEvent(id);
    }
  })

  //speech bubble background box
  let rect = new fabric.Rect({
    fill: 'white',
    stroke: 'black',
    strokeWidth: strokeWidth,
    width: 300,
    height: 100,
    rx: 8,
    ry: 8,
    objectCaching: false,
    selectable: false,
    evented: false,
    sdiType: 'calloutRect',
    opacity: d.opacity,
    strokeDashArray: d.strokeDashArray,
    fill: d.fillColor,
    stroke: d.strokeColor,
    strokeWidth: d.strokeWidth,
  });

  //speech bubble tail polygon
  let poly = createPolygon1(id);

  //2nd tail poly to overlay the bubble stroke
  let poly2 = createPolygon2(id);

  setCustomCalloutAttributes(poly, poly.sdiType, id, 0, 0);
  setCustomCalloutAttributes(rect, rect.sdiType, id, 0, 0);
  setCustomCalloutAttributes(poly2, poly2.sdiType, id, 0, 0);
  setCustomCalloutAttributes(textbox, textbox.sdiType, id, textbox.lastLeft, textbox.lastTop);
  setCustomCalloutAttributes(handle, handle.sdiType, id, 0, 0);

  myCalloutClass.poly = poly;
  myCalloutClass.rect = rect;
  myCalloutClass.poly2 = poly2;
  myCalloutClass.textbox = textbox;
  myCalloutClass.handle = handle;

  listOfCallouts.push(myCalloutClass);

  c.fcanvas.add(poly, rect, poly2, textbox);
  c.fcanvas.add(handle);

  updateBubble(poly, rect, poly2, textbox, handle);

  textbox.enterEditing();
  d.currentText = textbox;

  poly.setCoords();
  rect.setCoords();
  poly2.setCoords();
  textbox.setCoords();
  handle.setCoords();
}

function deleteCallout(id) {
  c.fcanvas.remove(listOfCallouts[id].poly);
  c.fcanvas.remove(listOfCallouts[id].rect);
  c.fcanvas.remove(listOfCallouts[id].poly2);
  c.fcanvas.remove(listOfCallouts[id].handle);
}

function updateBubbleEvent(id) {
  updateBubble(listOfCallouts[id].poly,
    listOfCallouts[id].rect,
    listOfCallouts[id].poly2,
    listOfCallouts[id].textbox,
    listOfCallouts[id].handle)
}

function updateBubble(poly, rect, poly2, textbox, handle) {

  let boxPadding = 16;
  let arrowWidth = textbox.height*textbox.scaleY /2;
  let strokeWidth = 2;

  //lets spare us some typing
  let x = textbox.left;
  let y = textbox.top;



  //if the textbox was moved, update the handle position too
  if (x !== textbox.lastLeft ||
    y !== textbox.lastTop) {

    //console.log('x: ' + x + ' Y: ' + y + ' textbox.lastTop: ' + textbox.lastTop + ' textbox.lastLeft' + textbox.lastLeft)

    handle.left += (x - textbox.lastLeft);
    handle.top += (y - textbox.lastTop);
    handle.setCoords();
  }

  //update rect
  let bound = textbox.getBoundingRect(true);
  rect.left = textbox.left - boxPadding - bound.width / 2;
  rect.top = textbox.top - boxPadding - bound.height / 2;
  rect.width = bound.width + (boxPadding * 2);
  rect.height = bound.height + (boxPadding * 2);

  //console.log('boundx: ' + x + ' boundy: ' + y)


  //to support 360° thick tails we have to do some triangulation
  let halfPi = Math.PI / 2;
  let angleRadians = Math.atan2(handle.top - y, handle.left - x);
  let offsetX = Math.cos(angleRadians + halfPi);
  let offsetY = Math.sin(angleRadians + halfPi);

  //update tail poly
  poly.points[0].x = handle.left;
  poly.points[0].y = handle.top;
  poly.points[1].x = x - (offsetX * arrowWidth);
  poly.points[1].y = y - (offsetY * arrowWidth);
  poly.points[2].x = x + (offsetX * arrowWidth);
  poly.points[2].y = y + (offsetY * arrowWidth);

  //white overlay poly (prevent dividing line)
  let halfStroke = strokeWidth / 2;
  poly2.points[0].x = handle.left;
  poly2.points[0].y = handle.top;
  poly2.points[1].x = x - offsetX * (arrowWidth - halfStroke);
  poly2.points[1].y = y - offsetY * (arrowWidth - halfStroke);
  poly2.points[2].x = x + offsetX * (arrowWidth - halfStroke);
  poly2.points[2].y = y + offsetY * (arrowWidth - halfStroke);

  //remember current position to detect further changes
  textbox.lastLeft = x;
  textbox.lastTop = y;
}

function setCustomCalloutAttributes(object, type, id, lastLeft, lastTop) {
  object.toObject = (function (toObject) {
    return function () {
      return fabric.util.object.extend(toObject.call(this), {
        sdiType: type,
        sdiId: id,
        lastLeft: lastLeft,
        lastTop: lastTop,
      });
    };
  })(object.toObject);
}

function testMovePolygon() {
  listOfCallouts[0].poly.left = 400;
  listOfCallouts[0].poly.top = 100;
  // listOfCallouts[0].poly.points[0].x = 500;
  // listOfCallouts[0].poly.points[0].y = 500;
  // listOfCallouts[0].poly.points[1].x = 750;
  // listOfCallouts[0].poly.points[1].y = 1000;
  // listOfCallouts[0].poly.points[2].x = 1000;
  // listOfCallouts[0].poly.points[2].y = 750;
}

function createPolygon1(id) {
  let strokeWidth = 2;
  let temp = new fabric.Polygon(
    [{ x: 0, y: 0 }, { x: 500, y: 0 }, { x: 500, y: 500 }],
    {
      fill: 'white',
      stroke: 'black',
      strokeWidth: strokeWidth,
      objectCaching: false,
      selectable: false,
      evented: false,
      opacity: d.opacity,
    strokeDashArray: d.strokeDashArray,
    fill: d.fillColor,
    stroke: d.strokeColor,
    strokeWidth: d.strokeWidth,
      sdiType: 'calloutPolygon1',
    }
  );

  setCustomCalloutAttributes(temp, temp.sdiType, id, 0, 0);

  return temp;
}

function createPolygon2(id) {
  let strokeWidth = 2;
  var temp = new fabric.Polygon(
    [{ x: 0, y: 0 }, { x: 500, y: 0 }, { x: 500, y: 500 }],
    {
      fill: 'white',
      // stroke: 'red',
      // strokeWidth: strokeWidth,
      objectCaching: false,
      selectable: false,
      evented: false,opacity: d.opacity,
      strokeDashArray: d.strokeDashArray,
      fill: d.fillColor,
       
       
      sdiType: 'calloutPolygon2',
    }
  );

  setCustomCalloutAttributes(temp, temp.sdiType, id, 0, 0);

  return temp;
}
