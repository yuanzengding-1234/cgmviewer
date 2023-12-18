//import { text } from "body-parser";

//attributes

function SDIdraw() {

  this.fillColor;
  this.strokeColor;
  this.strokeWidth;
  this.strokeDashArray;
  this.fontColor;
  this.fontFamily;
  this.fontSize;
  this.fontStyle;
  this.fontWeight;
  this.textAlign;
  this.isDown ;
  this.dashed = [10, 10];
  this.dotted = [2, 2];
  this.centerl = [10, 5, 2, 5];
  this.rect;
  this.ellipse;
  this.straightLine;
  this.freeFormLine;
  this.callout;
  this.origX;
  this.origY;
 
  this.opacity;
  this.isDrawing;
  this.drawingMode;

  this.state;
  this.state2;

  this.currentGroup = null;
  this.noteX;
  this.noteY;

  this.fireHotSpot = true;

  this.currentText = null;

  this.noteSvg = new String('<svg width="24px" height="25px" viewBox="0 0 1000 1083"> \
   <polygon style="fill: none; stroke: #000000; stroke-width: 33;" \
            points="239 742, 73 742, 73 78, 903 78, \
            903 742, 405 742, 239 1074, 239 742" /> \
   <polyline style="fill: none; stroke: #000000; stroke-width: 33;" \
             points="156 244, 820 244" /> \
   <polyline style="fill: none; stroke: #000000; stroke-width: 33;" \
             points="156 410, 820 410" /> \
   <polyline style="fill: none; stroke: #000000; stroke-width: 33;" \
             points="322 576, 820 576" /></svg>');


} 


function addDrawTools() {
  var on = document.getElementById("drawonoff").style.display;
  if (on === "none") {

    document.getElementById("drawonoff").style.display = "";
  }
  else {
    document.getElementById("drawonoff").style.display = "none";
    startSelection();
    setpanmode();
  }
}

function setNoControls(object)
{
  object.setControlsVisibility({
    mt: false, 
    mb: false, 
    ml: false, 
    mr: false, 
    bl: false,
    br: false, 
    tl: false, 
    tr: false,
    mtr: false, 
  });
}

function createNote(x, y,text) {

  fabric.loadSVGFromString(d.noteSvg, function (objects, options) {
    var loadedObjects = new fabric.Group(objects);
    loadedObjects.set({
      left: x,
      top: y,
      originX: 'center',
      originY: 'center',
      width: 100,
      height: 100,
      selectable: false,
      evented: false,
      sdiType: 'sdiNote',
      sdiNoteString: text,
      excludeFromExport: false,
    });

    setNoControls(loadedObjects);

    loadedObjects.addWithUpdate(new fabric.Circle({
      radius: 1,
      top: y,
      left: x,
      opacity: 0
    }));

    loadedObjects.on('mouseup', function (e) {
      // e.target should be the circle
      if (e.button === 3) {
        c.fcanvas.discardActiveObject();
        startSelection();
        return;
      }
      showCurrentNote(e.target.sdiNoteString);
      d.currentGroup = e.target;
    });

    loadedObjects.toObject = (function(toObject) {
      return function() {
        return fabric.util.object.extend(toObject.call(this), {
          sdiType: 'sdiNote',
          sdiNoteString: this.sdiNoteString,
        });
      };
    })(loadedObjects.toObject);

    c.fcanvas.add(loadedObjects);
    });
}

function showCurrentNote(text)
{
  document.getElementById("sdiNoteForm").value = text;
  document.getElementById("sdiAnnotationPopup").style.display = "block";
  document.getElementById("sdiNoteForm").focus();
}

function hideTextBox() {
  document.getElementById("sdiAnnotationPopup").style.display = "none";
  return;
}

function showNewNote(x, y) {
  if (document.getElementById("sdiAnnotationPopup").style.display == "block")
    return;

  d.noteX = x;
  d.noteY = y;
  d.currentGroup = null;
  document.getElementById("sdiNoteForm").value = "";
  document.getElementById("sdiAnnotationPopup").style.display = "block";
  document.getElementById("sdiNoteForm").focus();

  return;
}

function saveTextBox()
{
  if(document.getElementById("sdiNoteForm").value === "")
    hideTextBox();

  if(d.currentGroup == null)
  {
    createNote(d.noteX,d.noteY,document.getElementById("sdiNoteForm").value);
    c.fcanvas.renderAll();
  }
  else
  {
    d.currentGroup.sdiNoteString = document.getElementById("sdiNoteForm").value;
  }

  hideTextBox();
//  CVPortal.components.cvMedia.cgmSaveRedlining();
}

function getAttributes() {
  d.fillColor = $('#inputFillColor').colorpicker('getValue');
  //d.fillColor = document.getElementById("inputFillColor").value
  if (d.fillColor == 'None')d.fillColor = '';
   if (  document.getElementById("nofillmode").checked ) d.fillColor = '';
    d.strokeColor = $('#inputStrokeColor').colorpicker('getValue');
 //d.strokeColor  = document.getElementById("inputStrokeColor").value;
  d.strokeWidth = parseFloat(document.getElementById("inputStrokeThickness").value);

  var temp_strokeDashArray = document.getElementById("inputStrokeStyle").value;
  if (temp_strokeDashArray == 'solid')
    d.strokeDashArray = null;
  else if (temp_strokeDashArray == 'dashed')
    d.strokeDashArray = d.dashed;
  else if (temp_strokeDashArray == 'dotted')
    d.strokeDashArray = d.dotted;
  else if (temp_strokeDashArray == 'center')
    d.strokeDashArray = d.centerl;

  d.opacity = parseFloat(document.getElementById("customRangeAlpha").value) / 100.00;

  d.fontColor = document.getElementById("inputFontColor").value;
  d.fontFamily = document.getElementById("inputFontName").value;
  d.fontSize = parseInt(document.getElementById("inputFontSize").value);

  if (document.getElementById("inputFontStyle").checked)
    d.fontStyle = 'italic';
  else
    d.fontStyle = '';

  if (document.getElementById("inputFontWeight").checked)
    d.fontWeight = 'bold';
  else
    d.fontWeight = '';

  var radios = document.getElementsByName('inputAlignment');

  for (var i = 0, length = radios.length; i < length; i++) {
    if (radios[i].checked) {
      // do whatever you want with the checked radio
      d.textAlign = radios[i].value;

      // only one radio can be logically checked, don't check the rest
      break;
    }
  }
}
function setAttributes() {


  if (d.fillColor == '')
    document.getElementById("inputFillColor").value = 'None';
  else
    document.getElementById("inputFillColor").value = d.fillColor;

  document.getElementById("inputStrokeColor").value = d.strokeColor;
  document.getElementById("inputStrokeThickness").value = d.strokeWidth.toString();

  if (d.strokeDashArray == null)
    document.getElementById("inputStrokeStyle").value = 'solid';
  else if (d.strokeDashArray[0] == 10)
    document.getElementById("inputStrokeStyle").value = 'dashed';
  else if (d.strokeDashArray[0] == 2)
    document.getElementById("inputStrokeStyle").value = 'dotted';

  document.getElementById("customRangeAlpha").value = (d.opacity * 100).toString();

  document.getElementById("inputFontColor").value = d.fontColor;
  document.getElementById("inputFontName").value = d.fontFamily;
  document.getElementById("inputFontSize").value = d.fontSize.toString();

  if (d.fontStyle == '')
    document.getElementById("inputFontStyle").checked = false;
  else
    document.getElementById("inputFontStyle").checked = true;

  if (d.fontWeight == '')
    document.getElementById("inputFontWeight").checked = false;
  else
    document.getElementById("inputFontWeight").checked = true;

  if (d.textAlign === 'left')
    document.getElementById("inputAlignmentLeft").checked = true;
  else if (d.textAlign === 'center')
    document.getElementById("inputAlignmentJustify").checked = true;
  else
    document.getElementById("inputAlignmentRight").checked = true;
    return;
}

function getObjectAttributes() {

  var foundText = false;
  var foundShape = false;


  var activeObject = c.fcanvas.getActiveObjects();
  if (activeObject) {
    try {
      activeObject.forEach(function (object) {
        var type = object.get('type');
        if (type == "i-text") {
          if (foundText) {
            if (foundShape)
              throw {};
            return;
          }
          foundText = true;

          d.fontStyle = object.fontStyle;
          d.fontWeight = object.fontWeight;
          d.fontFamily = object.fontFamily;
          d.fontSize = object.fontSize;
          d.fontColor = object.stroke;
          d.opacity = object.opacity;
          d.textAlign = object.textAlign;
        }
        else {
          if (foundShape) {
            if (foundText)
              throw {};
            return;
          }
          foundShape = true;

          d.strokeColor = object.stroke;
          d.fillColor = object.fill;
          d.strokeDashArray = object.strokeDashArray;
          d.strokeWidth = object.strokeWidth;
          d.opacity = object.opacity;
        }
      });
    }
    catch(err)
    {

    }

  }

  setAttributes();
}

function setObjectAttributes() {
  getAttributes();

  c.fcanvas.freeDrawingBrush.width = d.strokeWidth;
  var rgb = hexToRgb(d.strokeColor);
  c.fcanvas.freeDrawingBrush.color = 'rgba(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ',' + d.opacity + ')';

  var activeObject = c.fcanvas.getActiveObjects();

  if (activeObject) {
    activeObject.forEach(function (object) {
      var type = object.get('type');
      if (type == "i-text") {
        object.set({
          fontStyle: d.fontStyle,
          fontWeight: d.fontWeight,
          fontFamily: d.fontFamily,
          fontSize: d.fontSize,
        
          stroke: d.fontColor,
          fill: d.fontColor,
          opacity: d.opacity,
          textAlign: d.textAlign,
        });
      }
      else {
        object.set({
          stroke: d.strokeColor,
          fill: d.fillColor,
          strokeDashArray: d.strokeDashArray,
          strokeWidth: d.strokeWidth,
          opacity: d.opacity,
        });
      }
    });
    c.fcanvas.renderAll();
  }

}

function componentToHex(c) {
  var hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}



function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}



function initDrawing() {

    c.fcanvas = new fabric.Canvas('canvas3', {
    fireRightClick: true,
    stopContextMenu: true,
  });
  
  c.drawmode = true;

  c.fcanvas.selection = false;

  c.fcanvas.on("after:render", function () {
    // Array.prototype.forEach.call(listOfCallouts, element => {
    //   element.updateBubble();
    // });
    c.fcanvas.calcOffset()
  });

  c.fcanvas.on("text:editing:exited", function (e) {
    if ((e.target.text === "" && !e.target.sdiType) || (e.target.text === "" && !e.target.sdiType.includes('callout')))
      c.fcanvas.remove(e.target);
    var dragmode = setdragmode();
    if (dragmode === 0)
      c.fcanvas.defaultCursor = 'grab';
    else
      c.fcanvas.defaultCursor = 'default';
  });








  getAttributes();
 


  c.fcanvas.on('mouse:down', function (evt) {
    let TouchposXIgnoreZoom
    let TouchposYIgnoreZoom
    let which = 1;

    if( evt.e.touches)
    {
     TouchposXIgnoreZoom = c.fcanvas.getPointer(evt.e.touches[0],true).x
     TouchposYIgnoreZoom = c.fcanvas.getPointer(evt.e.touches[0],true).y
     sdi_mouse_motion(-1000, -1000);
     sdi_mouse_motion(TouchposXIgnoreZoom * 10, TouchposYIgnoreZoom* 10);
    }
    else
    {
      which = evt.e.which
      TouchposXIgnoreZoom = evt.e.offsetX
      TouchposYIgnoreZoom = evt.e.offsetY
    }

    d.fireHotSpot = true;
    if (evt.button === 3) {
      if (c.fcanvas.selection)
        setpanmode();
      else
        startSelection();
      return;
    }
    if (c.drawmode === false)
      mousedown(which, TouchposXIgnoreZoom, TouchposYIgnoreZoom);
    else
      fm_down(evt);

  });


  c.fcanvas.on('mouse:move', function (evt) {

    let TouchposXIgnoreZoom
    let TouchposYIgnoreZoom
    let which = 1;

    if( evt.e.touches)
    {
     TouchposXIgnoreZoom = c.fcanvas.getPointer(evt.e.touches[0],true).x
     TouchposYIgnoreZoom = c.fcanvas.getPointer(evt.e.touches[0],true).y
    }
    else
    {
      which = evt.e.which
      TouchposXIgnoreZoom = evt.e.offsetX
      TouchposYIgnoreZoom = evt.e.offsetY
    }

    d.fireHotSpot = false;
    sdi_mouse_motion(TouchposXIgnoreZoom * 10, TouchposYIgnoreZoom* 10);
    if (c.drawmode === false)
      mousemove(which, TouchposXIgnoreZoom, TouchposYIgnoreZoom);
    else
      fm_move(evt);
  });


  c.fcanvas.on('mouse:up', function (evt) {
    try {
      if (evt.target != d.currentText) {
        d.currentText.exitEditing();
        d.currentText = null;
      }
    }
    catch (error) {

    }
    let TouchposXIgnoreZoom
    let TouchposYIgnoreZoom
    let which = 1;

    if( evt.e.touches)
    {
     TouchposXIgnoreZoom = c.fcanvas.getPointer(evt.e.touches[0],true).x
     TouchposYIgnoreZoom = c.fcanvas.getPointer(evt.e.touches[0],true).y
    }
    else
    {
      which = evt.e.which
      TouchposXIgnoreZoom = evt.e.offsetX
      TouchposYIgnoreZoom = evt.e.offsetY
    }

    if(d.fireHotSpot && evt.button !== 3 && c.fcanvas.isDrawingMode === false && drawtext === false)
    {
      c.xdown = TouchposXIgnoreZoom;
      c.ydown = TouchposYIgnoreZoom;
      linkURI();
    }
    if (c.drawmode === false)
      mouseup(which, TouchposXIgnoreZoom, TouchposYIgnoreZoom);
    else
      fm_up(evt);
      c.ctxx.clearRect(0, 0, c.canvas.width, c.canvas.height);
  });

  $('#attributesWindow').on('change', function() {
    //alert( this.value );
    setObjectAttributes();
  });
}

var listOfCallouts = [];
function fm_down(o) {

  if (!d.isDrawing)
    return;

  d.isDown = true;
  var pointer = c.fcanvas.getPointer(o.e);
  d.origX = pointer.x;
  d.origY = pointer.y;
  var pointer = c.fcanvas.getPointer(o.e);

  //c.fcanvas.defaultCursor = 'crosshair'; //this fixes text cursor bug

  if (d.drawingMode === "FreeFormLine2" || d.drawingMode === "StraightLine") {
    if (o.e.shiftKey)
      d.drawingMode = "StraightLine";
    else
      d.drawingMode = "FreeFormLine2";
  }
 
  switch (d.drawingMode) {
    case "Callout":
      try {
        Callout(listOfCallouts.length);

        d.callout.updateBubble();
        d.callout.textbox.enterEditing();
        startSelection();
      }
      catch(err) {

      }
      break;
    case "Rectangle":
      d.rect = new fabric.Rect({
        left: d.origX,
        top: d.origY,
        originX: 'left',
        originY: 'top',
        opacity: d.opacity,
        strokeDashArray: d.strokeDashArray,
        width: pointer.x - d.origX,
        height: pointer.y - d.origY,
        angle: 0,
        fill: d.fillColor,
        stroke: d.strokeColor,
        strokeWidth: d.strokeWidth,
        transparentCorners: false,
        selectable: false,
        evented: false
      });
      c.fcanvas.add(d.rect);
      break;
    case "Circle":
      d.ellipse = new fabric.Ellipse({
        left: d.origX,
        top: d.origY,
        originX: 'left',
        originY: 'top',
        opacity: d.opacity,
        strokeDashArray: d.strokeDashArray,
        rx: pointer.x - d.origX,
        ry: pointer.y - d.origY,
        angle: 0,
        fill: d.fillColor,
        stroke: d.strokeColor,
        strokeWidth: d.strokeWidth,
        selectable: false,
        evented: false
      });
      c.fcanvas.add(d.ellipse);
      break;
    case "StraightLine":
      var points = [pointer.x, pointer.y, pointer.x, pointer.y];
      d.straightLine = new fabric.Line(points, {
        originX: 'center',
        originY: 'center',
        opacity: d.opacity,
        strokeDashArray: d.strokeDashArray,
        fill: d.fillColor,
        stroke: d.strokeColor,
        strokeWidth: d.strokeWidth,
        selectable: false,
        evented: false
      });
      c.fcanvas.add(d.straightLine);
      break;
    case "FreeFormLine2":
      var points = [pointer.x, pointer.y, pointer.x, pointer.y];
      d.freeFormLine = new fabric.Line(points, {
        originX: 'center',
        originY: 'center',
        opacity: d.opacity,
        strokeDashArray: d.strokeDashArray,
        fill: d.fillColor,
        stroke: d.strokeColor,
        strokeWidth: d.strokeWidth,
        selectable: false,
        evented: false
      });
      c.fcanvas.add(d.freeFormLine);

      break;
    case "Text2":
      try {
        var myTextBox = new fabric.IText("", {
          fontFamily: d.fontFamily,
          fontSize: d.fontSize,
          fontStyle: d.fontStyle,
          fontWeight: d.fontWeight,
          stroke: d.fontColor,
          fill: d.fontColor,
          left: d.origX,
          top: d.origY - d.fontSize / 2,
          textAlign: d.textAlign,
          opacity: d.opacity,
          selectable: false,
          evented: false
        });
        c.fcanvas.add(myTextBox);
        c.fcanvas.on("text:editing:exited", function (e) {
          if (e.target.text === "")
            c.fcanvas.remove(e.target);
          c.fcanvas.defaultCursor = 'default'
        });  
        //myTextBox =  c.fcanvas.setActiveObject();
        //myTextBox.hiddenTextarea.focus();
        myTextBox.enterEditing();
      }
      catch(err) {

      }
      break;
  }
};

function fm_move(o) {

  if (!d.isDown) return;
  if (!d.isDrawing) return;
  var pointer = c.fcanvas.getPointer(o.e);

  switch (d.drawingMode) {
    case "Rectangle":
      if (d.origX > pointer.x) {
        d.rect.set({ left: (pointer.x) });
      }
      if (d.origY > pointer.y) {
        d.rect.set({ top: (pointer.y) });
      }

      d.rect.set({ width: Math.abs(d.origX - pointer.x) });
      d.rect.set({ height: Math.abs(d.origY - pointer.y) });
      break;
    case "Circle":
      var rx = Math.abs(d.origX - pointer.x) / 2;
      var ry = Math.abs(d.origY - pointer.y) / 2;
      if (rx > d.ellipse.strokeWidth) {
        rx -= d.ellipse.strokeWidth / 2
      }
      if (ry > d.ellipse.strokeWidth) {
        ry -= d.ellipse.strokeWidth / 2
      }
      d.ellipse.set({ rx: rx, ry: ry });

      if (d.origX > pointer.x) {
        d.ellipse.set({ originX: 'right' });
      } else {
        d.ellipse.set({ originX: 'left' });
      }
      if (d.origY > pointer.y) {
        d.ellipse.set({ originY: 'bottom' });
      } else {
        d.ellipse.set({ originY: 'top' });
      }
      break;
    case "StraightLine":
      if (Math.abs(d.origX - pointer.x) > Math.abs(d.origY - pointer.y))
        d.straightLine.set({ x2: pointer.x, y2: d.origY });
      else
        d.straightLine.set({ y2: pointer.y, x2: d.origX });
      break;
    case "FreeFormLine2":
      d.freeFormLine.set({ x2: pointer.x, y2: pointer.y });
      break;
      case "FreeFormLine":
        c.fcanvas.freeDrawingBrush.width = d.strokeWidth;
        var rgb = hexToRgb(d.strokeColor);
        c.fcanvas.freeDrawingBrush.color = 'rgba(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ',' + d.opacity + ')';
        c.fcanvas.isDrawingMode = true;
        break;
    case "Text":

      break;
  }
  c.fcanvas.renderAll();
};

function fm_up(o) {

  var pointer = c.fcanvas.getPointer(o.e);
  d.isDown = false;
  if (!d.isDrawing)
    return;
  switch (d.drawingMode) {
    case "Rectangle":
      d.rect.setCoords();
      break;
    case "Circle":
      d.ellipse.setCoords();
      break;
    case "StraightLine":
      d.straightLine.setCoords();
      break;
    case "FreeFormLine2":
      d.freeFormLine.setCoords();
      break;
    case "Text":
      showNewNote(pointer.x, pointer.y);
      break;
    case "Callout":
      //d.callout.setCoordinates();
      break;
  }
 // CVPortal.components.cvMedia.cgmSaveRedlining();
};




var drawtext = false;

function setSelectionMode(setting) {
  c.fcanvas.discardActiveObject().renderAll();
  c.fcanvas.forEachObject(function (object) {
    var type = object.get('type');
    if (type == "i-text") {
      object.exitEditing();
    }
    else if (object.sdiType &&
      object.sdiType.includes("callout") &&
      !object.sdiType.includes("calloutText") &&
      !object.sdiType.includes("calloutHandle")) {
      //object.exitEditing();
      return;
    }
    object.selectable = setting;
    object.evented = setting;
  });
}

function startDrawing(type) {

  c.drawmode = true;
  setSelectionMode(false);
  c.fcanvas.isDrawingMode = false;
  drawtext = false;
  d.isDrawing = true;
  switch (type) {
    case "Callout":
        drawtext = true;
        c.fcanvas.defaultCursor = 'text';
        break;
    case "Text":
      drawtext = true;
      c.fcanvas.defaultCursor = 'text';
      break;
    case "Text2":
        c.fcanvas.defaultCursor = 'text';
        break;
    case "FreeFormLine":
      c.fcanvas.freeDrawingBrush.width = d.strokeWidth;
      var rgb = hexToRgb(d.strokeColor);
      c.fcanvas.freeDrawingBrush.color = 'rgba(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ',' + d.opacity + ')';
      c.fcanvas.isDrawingMode = true;
      break;
    default:
      c.fcanvas.defaultCursor = 'crosshair';
  }
  c.fcanvas.selection = false;
  d.drawingMode = type;
}

function startSelectionButton() {
  startSelection();
}

function startSelection() {
  setdragmode(-1);
  d.isDrawing = false;
  drawtext = false;
  c.fcanvas.isDrawingMode = false;
  c.fcanvas.selection = true;
  c.fcanvas.defaultCursor = 'default';
  setSelectionMode(true);
  d.drawingMode = 'none';
}

function deleteObject() {
  var activeObject = c.fcanvas.getActiveObjects();
  if (activeObject == null || activeObject.length == 0)
    return;

  hideTextBox();

  d.state = JSON.stringify(c.fcanvas);
  c.fcanvas.discardActiveObject();
 
  activeObject.forEach(function (object) {
    if(!(object.sdiType  && object.sdiType.includes("calloutHandle")))
    c.fcanvas.remove(object);
  });
  d.state2 = JSON.stringify(c.fcanvas);
}

function undo_delete_Object() {
  state3 = JSON.stringify(c.fcanvas);
  if (d.state != null && d.state2 === state3) {

    sdiLoadRedLine(d.state);
    //c.fcanvas.loadFromJSON(d.state, function () {
   // });
  }
  d.state = null;

  c.fcanvas.renderAll();
  startSelection();
}

function saveObjectsToCgm()
{
  c.fcanvas.forEachObject(function (object) {
    type = object.get('type');
    
      rgb = hexToRgb(d.strokeColor);
      rgb2 = hexToRgb(d.fillColor);
  
      strokeDashArray = 0;
  
      if (d.strokeDashArray == null)
        strokeDashArray = 1;
      else if (d.strokeDashArray[0] == 10 && d.strokeDashArray[0] == 10)
        strokeDashArray = 2;
      else if (d.strokeDashArray[0] == 2)
        strokeDashArray = 3;
      else if (d.strokeDashArray[0] == 10)
        strokeDashArray = 4;

      if (type == 'line') {
        wasm_set_line_color(rgb.r, rgb.g, rgb.b);
        wasm_set_line_type(strokeDashArray);
        wasm_set_line_width(object.strokeWidth);
        //wasm_add_polyline(int npoints, float points);
        wasm_add_polyline(0, [0]);
      }
      else {
        wasm_set_edge_color(rgb.r, rgb.g, rgb.b);
        wasm_set_fill_color(rgb2.r, rgb2.g, rgb2.b);
        wasm_set_edge_type(d.style);
        wasm_set_edge_width(object.strokeWidth);
        wasm_set_edge_visibility(1);
        wasm_set_interior_style(1);

        if (type == 'rectangle'){
         // wasm_add_rectangle(float xs, float ys, float xe, float ye);
         wasm_add_rectangle(0, 0, 100, 100);
        }
        else{
          //wasm_add_circle(float xs, float ys, float radius);
          wasm_add_circle(0, 0, 100);
        }
      }
  });

}