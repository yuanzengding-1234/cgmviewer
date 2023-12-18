

const readerin = new FileReader();
const readertif = new FileReader();





// For both PNG and JPG files
function viewImage(file) { 
  setfit();
  readerin.readAsDataURL(file);
   
  readerin.onload = function( ) {
  
   
  fabric.Image.fromURL(readerin.result, function (img) {
    img.set({ 
      left: 0, 
      top: 0,
      originX: 'left',
      originY: 'top',
    //  ZIndex: -1,
      transparentCorners: false,
      lockMovementX: true,
      lockMovementY: true,
      selectable: false,
      evented: false
    });


    c.fcanvas.add(img);
    var x = c.fcanvas.getWidth();
    var y = c.fcanvas.getHeight();
    if ( x >= y)
    img.scaleToWidth(x);
    else
    img.scaleToHeight(y);
   
  });
  openCGMfile('images/blank.cgm');
}
readerin.onerror = function() {console.log('error loading png');}
}



function viewsvg(file) {
  setfit();

  const path = document.getElementById('filein').value;
  var zz = path.indexOf('svgz');
  if (zz === -1)  
   readerin.readAsDataURL(file);
   else
   readerin.readAsArrayBuffer(file);

  
   
  readerin.onload = function( ) {
    
var Base64={_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",encode:function(e){var t="";var n,r,i,s,o,u,a;var f=0;e=Base64._utf8_encode(e);while(f<e.length){n=e.charCodeAt(f++);r=e.charCodeAt(f++);i=e.charCodeAt(f++);s=n>>2;o=(n&3)<<4|r>>4;u=(r&15)<<2|i>>6;a=i&63;if(isNaN(r)){u=a=64}else if(isNaN(i)){a=64}t=t+this._keyStr.charAt(s)+this._keyStr.charAt(o)+this._keyStr.charAt(u)+this._keyStr.charAt(a)}return t},decode:function(e){var t="";var n,r,i;var s,o,u,a;var f=0;e=e.replace(/[^A-Za-z0-9+/=]/g,"");while(f<e.length){s=this._keyStr.indexOf(e.charAt(f++));o=this._keyStr.indexOf(e.charAt(f++));u=this._keyStr.indexOf(e.charAt(f++));a=this._keyStr.indexOf(e.charAt(f++));n=s<<2|o>>4;r=(o&15)<<4|u>>2;i=(u&3)<<6|a;t=t+String.fromCharCode(n);if(u!=64){t=t+String.fromCharCode(r)}if(a!=64){t=t+String.fromCharCode(i)}}t=Base64._utf8_decode(t);return t},_utf8_encode:function(e){e=e.replace(/rn/g,"n");var t="";for(var n=0;n<e.length;n++){var r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r)}else if(r>127&&r<2048){t+=String.fromCharCode(r>>6|192);t+=String.fromCharCode(r&63|128)}else{t+=String.fromCharCode(r>>12|224);t+=String.fromCharCode(r>>6&63|128);t+=String.fromCharCode(r&63|128)}}return t},_utf8_decode:function(e){var t="";var n=0;var r=c1=c2=0;while(n<e.length){r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r);n++}else if(r>191&&r<224){c2=e.charCodeAt(n+1);t+=String.fromCharCode((r&31)<<6|c2&63);n+=2}else{c2=e.charCodeAt(n+1);c3=e.charCodeAt(n+2);t+=String.fromCharCode((r&15)<<12|(c2&63)<<6|c3&63);n+=3}}return t}}

    var uncompressed;
    if (zz === -1)
     uncompressed = readerin.result ;

    else{
    var bin = new Int8Array(readerin.result);
    var data = pako.inflate(new Uint8Array(bin), { to: 'string' });
    uncompressed ="data:Image/svg+xml;base64," + Base64.encode(data)  ;
    }
    var svgeditmode = 0;
    if (document.getElementById("svgeditmode").checked)svgeditmode = 1;
    
fabric.loadSVGFromURL(uncompressed, function(objects, options) {
   var obj = fabric.util.groupSVGElements(objects, options);
  
  var x = c.fcanvas.getWidth();
  var y = c.fcanvas.getHeight();
  if ( x >= y)
  obj.scaleToWidth(x);
  else
  obj.scaleToHeight(y);
 

//  obj.set({ZIndex:-1});  
  obj.set({lockMovementX:'true'});
  obj.set({lockMovementY:'true'});
  obj.selectable = false ; 

 
 if ( svgeditmode === 0 ){
   c.fcanvas.add(obj);
 }else{

  objects.forEach( function(obj){
    obj.selectable = true;
    c.fcanvas.add(obj);
  });
 }

  c.fcanvas.renderAll();
});
}
readerin.onerror = function() {console.log('error loading png');}

openCGMfile('images/blank.cgm');
// let uncompressed = pako.inflate(new Uint8Array(bin), { to: 'string' });
}




function processTif(file) {
  readertif.readAsArrayBuffer(file);
}

readertif.onload = function () {
    var buffer = readertif.result;
    var tiff = new Tiff({buffer: buffer});
    var canvas = tiff.toDataURL();
    var width = tiff.width();
    var height = tiff.height();
    if (canvas) {
      //$('#output').empty().append(canvas);
      //c.ctx.drawImage(canvas, 0, 0);

      try {
        c.fcanvas.forEachObject(function (object) {
          var type = object.get('type');
          if (type == "sdiTif")
          {
            c.fcanvas.remove(object);
            throw e;
          }
        });
      } catch (e) {

      }

     

      fabric.Image.fromURL(canvas, function (img) {
        img.set({ 
          left: 0, 
          top: 0,
          originX: 'left',
          originY: 'top',
          type: 'sdiTif',
    //      ZIndex: -1,
          lockMovementX: true,
          lockMovementY: true,

          transparentCorners: false,
          selectable: false,
          evented: false
        });
        if(width > c.fcanvas.getWidth())
         
          var x = c.fcanvas.getWidth();
          var y = c.fcanvas.getHeight();
          if ( x >= y)
          img.scaleToWidth(x);
          else
          img.scaleToHeight(y);
        c.fcanvas.add(img);
        c.fcanvas.sendToBack(img);
      });

     
      c.fcanvas.renderAll();

      openCGMfile('images/blank.cgm');
      setfit();
    }   
}

function transferpdf(file,outlen){

  
  //var data = new Blob([cgmArrayOut], { type: 'image/png' });
  //var url = window.URL.createObjectURL(data);
  //document.getElementById('download_link_2').href = url;
 
 
  readerin.readAsArrayBuffer(file);
  c.sizein1 = file.size;
  
  
}


readertif.onerror = function () {
  console.log(readertif.error.message);
}

readerin.onload = function () {
  var bytes;
  var importObject=sdi_printpdf;
  var resultArray1 = new Int8Array(readerin.result);
  c.iptr = Module._malloc(c.sizein1);
  var outlen = c.sizein1 * 10 ;
  var outputPtr = Module._malloc(outlen);
  Module.HEAP8.set(resultArray1, c.iptr);
   
  c.calculateOnce = true;
  c.w1.x = -9898;
  c.firstTimeFileLoad = true;
   
 
  var status = sdi_printcgm(c.iptr, c.sizein1, 0, 0, 0, 1);

   
  
  var load_hotspot = Module.cwrap('sdi_load_hotspot_id', 'number', [null]);
 
  load_hotspot();   

  getOriginalHeightWidth();
  sdiZoomFabric();
  

}

readerin.onerror = function () {
  console.log(readerin.error.message);
}

function processFile(file) {

  if (c.sizein1 !== 0) {
    Module._free(c.iptr);
    c.sizein1 = 0;
  }

  c.sizein1 = file.size;
  readerin.readAsArrayBuffer(file);

  c.ctx.setTransform(1, 0, 0, 1, 0, 0);
  c.ctx.clearRect(0, 0, c.w, c.h);
  c.ctx.scale(0.1, 0.1);

}

function getfilein(file) {
  
  processFile(file);
}
 
function openfile() {
  var i = 0;
  


  var num = document.getElementById('filein').files.length;
  for (i = 0; i < num; i++) {
    var file = document.getElementById('filein').files[i];


    if (file.name.indexOf('.cgm') !== -1 || file.name.indexOf('.CGM') !== -1 )
      getfilein(file);
      //if (file.name.indexOf('.pdf') !== -1 || file.name.indexOf('.PDF') !== -1 ) openpdf(file);
    if (file.name.indexOf('.xml') !== -1 || file.name.indexOf('.XML') !== -1 ) {
      c.XML = 1;
      parseit(file);



    }

    if (file.name.indexOf('.svg') !== -1 || file.name.indexOf('.SVG') !== -1 ) viewsvg(file);
    else if (file.name.indexOf('.png') !== -1 || file.name.indexOf('.PNG') !== -1 ) viewImage(file);
    else if (file.name.indexOf('.jp') !== -1 || file.name.indexOf('.JP') !== -1 )viewImage(file);
    else if (file.name.toLowerCase().indexOf('.tif') !== -1  ) processTif(file);
    else if (file.name.indexOf('.htm') !== -1  || file.name.indexOf('.HTM') !== -1 ) {
      c.XML = 1;

      GMreadhtmlfile(file);
    }
  }
}


function GMreadhtmlfile(file) {
 var  main_html_file = './' + file.name;
  $.ajax({
    url: main_html_file,

    method: "GET",
    success: function (response) {
      $("#area").html(response);
      // var main_cgm_file = $("TBODY").find("PARAM").attr("VALUE");
      //GMparseXML();
    }
  });

}
// drag and drop handler for file open

function dropHandler(ev) {
  console.log('File(s) dropped');

  // Prevent default behavior (Prevent file from being opened)
  ev.preventDefault();

  if (ev.dataTransfer.items) {
    // Use DataTransferItemList interface to access the file(s)
    for (var i = 0; i < ev.dataTransfer.items.length; i++) {
      // If dropped items aren't files, reject them
      if (ev.dataTransfer.items[i].kind === 'file') {
        var file = ev.dataTransfer.items[i].getAsFile();
        console.log('... file[' + i + '].name = ' + file.name);

        if (file.name.toLowerCase().indexOf('.svgz') !== -1  ) viewsvg(file);
        else if (file.name.toLowerCase().indexOf('.svg') !== -1  ) viewsvg(file);
        else if (file.name.toLowerCase().indexOf('.png') !== -1  ) viewImage(file);
        else if (file.name.toLowerCase().indexOf('.jp') !== -1  ) viewImage(file);
        else if (file.name.toLowerCase().indexOf('.tif') !== -1  ) processTif(file);
        else processFile(file)

 
      }
    }
  } else {
    // Use DataTransfer interface to access the file(s)
    for (var i = 0; i < ev.dataTransfer.files.length; i++) {
      console.log('... file[' + i + '].name = ' + ev.dataTransfer.files[i].name);
      var file = ev.dataTransfer.items[i].getAsFile();
      if (file.name.toLowerCase().indexOf('.svgz') !== -1  ) viewsvg(file);
      else if (file.name.toLowerCase().indexOf('.svg') !== -1  ) viewsvg(file);
      else if (file.name.toLowerCase().indexOf('.png') !== -1  ) viewImage(file);
      else if (file.name.toLowerCase().indexOf('.jp') !== -1  ) viewImage(file);
      else if (file.name.toLowerCase().indexOf('.tif') !== -1  ) processTif(file);
      else processFile(ev.dataTransfer.files[i]);
    }
  }
}
 

function dragOverHandler(ev) {
  console.log('File(s) in drop zone');

  // Prevent default behavior (Prevent file from being opened)
  ev.preventDefault();
}




var urlpath = "http://www.sdicgm.com/xmlfiles/sample1/";

function hl_my_hotspot(urlpath, hotspot) {
  var oReq = new XMLHttpRequest();
  oReq.addEventListener("load", reqListener);
  oReq.open("GET", urlpath);
  oReq.send();
}

function reqListener() {
  console.log(this.responseText);
  var m = new File([this.responseText], 'myfile.xml');
  parseit(m);
  getvalue(hotspot);

}