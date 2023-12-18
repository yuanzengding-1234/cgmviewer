/*  fileopen.js  manages the file input button from the main menu and index.html
    the openCGMfile function below can be used instead of the file input button to
    open a CGM file using a URL path */
 var globalpath="nofile" ;
function openCGMfilewhat(urlpath){
  
  if ( started === true ) 
	openCGMfilesync(urlpath);
  else
   
 	globalpath = urlpath;

}

function openCGMfile(urlpath) {
  if (!Uint8Array.from) {
    Uint8Array.from = (function () {
      var symbolIterator;
      try {
        symbolIterator = Symbol.iterator
          ? Symbol.iterator
          : 'Symbol(Symbol.iterator)';
      } catch (e) {
        symbolIterator = 'Symbol(Symbol.iterator)';
      }

      var toStr = Object.prototype.toString;
      var isCallable = function (fn) {
        return (
          typeof fn === 'function' ||
          toStr.call(fn) === '[object Function]'
        );
      };
      var toInteger = function (value) {
        var number = Number(value);
        if (isNaN(number)) return 0;
        if (number === 0 || !isFinite(number)) return number;
        return (number > 0 ? 1 : -1) * Math.floor(Math.abs(number));
      };
      var maxSafeInteger = Math.pow(2, 53) - 1;
      var toLength = function (value) {
        var len = toInteger(value);
        return Math.min(Math.max(len, 0), maxSafeInteger);
      };

      var setGetItemHandler = function setGetItemHandler(isIterator, items) {
        var iterator = isIterator && items[symbolIterator]();
        return function getItem(k) {
          return isIterator ? iterator.next() : items[k];
        };
      };

      var getArray = function getArray(
        T,
        A,
        len,
        getItem,
        isIterator,
        mapFn
      ) {
        // 16. Let k be 0.
        var k = 0;

        // 17. Repeat, while k < len� or while iterator is done (also steps a - h)
        while (k < len || isIterator) {
          var item = getItem(k);
          var kValue = isIterator ? item.value : item;

          if (isIterator && item.done) {
            return A;
          } else {
            if (mapFn) {
              A[k] =
                typeof T === 'undefined'
                  ? mapFn(kValue, k)
                  : mapFn.call(T, kValue, k);
            } else {
              A[k] = kValue;
            }
          }
          k += 1;
        }

        if (isIterator) {
          throw new TypeError(
            'Array.from: provided arrayLike or iterator has length more then 2 ** 52 - 1'
          );
        } else {
          A.length = len;
        }

        return A;
      };

      // The length property of the from method is 1.
      return function from(arrayLikeOrIterator /*, mapFn, thisArg */) {
        // 1. Let C be the this value.
        var C = this;

        // 2. Let items be ToObject(arrayLikeOrIterator).
        var items = Object(arrayLikeOrIterator);
        var isIterator = isCallable(items[symbolIterator]);

        // 3. ReturnIfAbrupt(items).
        if (arrayLikeOrIterator == null && !isIterator) {
          throw new TypeError(
            'Array.from requires an array-like object or iterator - not null or undefined'
          );
        }

        // 4. If mapfn is undefined, then let mapping be false.
        var mapFn = arguments.length > 1 ? arguments[1] : void undefined;
        var T;
        if (typeof mapFn !== 'undefined') {
          // 5. else
          // 5. a If IsCallable(mapfn) is false, throw a TypeError exception.
          if (!isCallable(mapFn)) {
            throw new TypeError(
              'Array.from: when provided, the second argument must be a function'
            );
          }

          // 5. b. If thisArg was supplied, let T be thisArg; else let T be undefined.
          if (arguments.length > 2) {
            T = arguments[2];
          }
        }

        // 10. Let lenValue be Get(items, "length").
        // 11. Let len be ToLength(lenValue).
        var len = toLength(items.length);

        // 13. If IsConstructor(C) is true, then
        // 13. a. Let A be the result of calling the [[Construct]] internal method
        // of C with an argument list containing the single item len.
        // 14. a. Else, Let A be ArrayCreate(len).
        var A = isCallable(C) ? Object(new C(len)) : new Uint8Array(len);

        return getArray(
          T,
          A,
          len,
          setGetItemHandler(isIterator, items),
          isIterator,
          mapFn
        );
      };
    })();
  }


 
    
       
    
 
 

 
  var oReq = new XMLHttpRequest();
  oReq.overrideMimeType('text/plain; charset=x-user-defined');
    oReq.open("GET", urlpath,false);

    oReq.onload = function(ev){
 

	
    c.sizein1 = oReq.response.length ;
    var resultArray1 =Uint8Array.from(oReq.response, function (charReturn) {return charReturn.charCodeAt(0)});
    c.iptr = Module._malloc(c.sizein1);
    Module.HEAP8.set(resultArray1, c.iptr);
    
    c.ctx.setTransform(1,0,0,1,0,0);
    c.ctx.clearRect(0,0,c.w,c.h);
    c.ctx.scale(0.1,0.1); 

    
    c.calculateOnce = true;
    c.w1.x = -9898;
    c.firstTimeFileLoad = true;
    var status = sdi_printcgm(c.iptr, c.sizein1, 0,5,0,1);

    getOriginalHeightWidth();
    sdiZoomFabric();
   
  };
oReq.onerror = function (){
console.log('  load failure');
};
oReq.ontimeout = function (){
console.log('error timeout  ');
};
 
  oReq.send();
}
 
  



/* The linkRUI function is used to navigate to the hot spot, when a hot spot is a path
to a web site it brings up the web site, if the linkuri is a javascript function, it will call it"
*/



function linkURI() {

function hspot() {
  this.id;
  this.link;
  this.name;
  this.screentip;
}

hs = new hspot ;

   
    
    var id = get_link(c.xdown * c.ratio, c.ydown * c.ratio, 1);
    
    hs.id = UTF8ToString(id);
    //console.log('passing null back:' + hs.id );
    if(!hs.id )
     return;
    var link = get_link(c.xdown * c.ratio, c.ydown * c.ratio, 2);
    hs.link = UTF8ToString(link);
    var name = get_link(c.xdown * c.ratio, c.ydown * c.ratio, 3);
    hs.name = UTF8ToString(name);
    var screentip = get_link(c.xdown * c.ratio, c.ydown * c.ratio, 4);
    hs.screentip = UTF8ToString(screentip);
  
    var uri = hs.link ;

    if (uri.indexOf('www') !== -1 )
           window.open("http://" + uri);
    
    else if (typeof window[uri] === "function")
        window[uri]();
    else
        window.open( uri); // filename of type file://xxxx
       
  
  
  
  
  }
 
/* wasmpd is called when  opening the CGM (load_hotspot ) it creates a list of the
hotspot ID's found in the CGM,  and uses these to create the pulldown menu tool 
calling hotspot(0)  turns on all hot spots
calling hotspot(1)  clears all hotspots 

and calling highlightID( string )  highlights just the one hotspot id 
*/


function wasmpd(tid) {

  var i=0;
  hotspotlist = []; // make this a global list.
  

function hspot() {
  this.id;
  this.link;
  this.name;
  this.screentip;
}

hs = new hspot ;
  

//convert tid string to a char * for C program //
  strascii = [];
  for( i = 0; i < tid.length; i ++) strascii.push(tid[i].charCodeAt(0));
    const tarr = new Uint32Array(strascii.length)
  for( i=0; i<strascii.length; i++) {  tarr[i] = strascii[i] ;}
    strbuf= Module._malloc(tarr.length * tarr.BYTES_PER_ELEMENT);
    Module.HEAP32.set(tarr, strbuf >> 2);



    hs.id= tid ;
    getlinkById = Module.cwrap('sdi_getLinkById', 'number', ['number','number']);
    var link = getlinkById(strbuf,tid.length);
    var l = UTF8ToString(link);
    hs.link = l;

    getnameById = Module.cwrap('sdi_getNameById', 'number', ['number','number']);
    var name = getnameById(strbuf,tid.length);
    var n = UTF8ToString(name);
    hs.name = n;

    getscreentipById = Module.cwrap('sdi_getScreentipById', 'number', ['number','number']);
    var screentip = getscreentipById(strbuf,tid.length);
    var s = UTF8ToString(screentip);

    hs.screentip = screentip ;





var activate_hotspot_menu = 1 ;


c.hotspotlist.push(hs);
var i = 0;
var myselect = $('#menuitem2');
if (activate_hotspot_menu) 
myselect.append($('<option></option>').val(tid).html(tid));
}

function sdicleanMemory(){
 
  started = true ;
  if (globalpath.indexOf('nofile') === -1 )
  		openCGMfilesync(globalpath);

}

function modSetCanvasSize(ww, hh) {

  var ct = document.getElementById('canvas3');
  var h = ct.clientHeight + hh ;
  var w = ct.clientWidth + ww;
  sdiSetCanvasSize(w,h);
}


function sdiSetCanvasSize(width, height) {

 

  var ct = document.getElementById('canvas3');
  ct.width  = width;
  ct.height = height;
  var ct = document.getElementById('canvas2');
  ct.width  = width;
  ct.height = height;
  var ct = document.getElementById('canvas1');
  ct.width  = width;
  ct.height = height;

  c.fcanvas.setHeight(height);
  c.fcanvas.setWidth(width);
  c.fcanvas.calcOffset();
 

  c.ctx.setTransform(1, 0, 0, 1, 0, 0);
 c.ctx.scale(0.1, 0.1);

  c.w = width;
  c.h = height;

  c.calculateOnce = true;

  if(c.redrawTimer)
    clearTimeout(c.redrawTimer);
  c.redrawTimer = setTimeout(function() {setfit()}, 10);
}

function sdiSaveRedLine()
{
  var redLineInfo = JSON.stringify(c.fcanvas);
  return redLineInfo;
}

function sdiLoadRedLine(redLineInfo) {
  let originalCount = 0;
  listOfCallouts.length = 0; //reset 
  listOfCallouts = [];
  
  c.fcanvas.loadFromJSON(redLineInfo, function () {
  });

  c.fcanvas.forEachObject(function (object) {

    if (object.sdiType === "sdiNote") {

      setNoControls(object);

      object.on('mouseup', function (e) {
        // e.target should be the circle
        if (e.button === 3) {
          c.fcanvas.discardActiveObject();
          startSelection();
          return;
        }
        showCurrentNote(e.target.sdiNoteString);
        d.currentGroup = e.target;
      });

      object.toObject = (function (toObject) {
        return function () {
          return fabric.util.object.extend(toObject.call(this), {
            sdiType: 'sdiNote',
            sdiNoteString: this.sdiNoteString,
          });
        };
      })(object.toObject);
    }
    else if (object.sdiType && object.sdiType.includes("calloutText")) {
      loadListOfCallouts(object.sdiId);

      // temp.lastLeft = temp.left; //big bug in json; the eported lastLeft/lastTop does not match
      // temp.lastTop = temp.top; //big bug in json; the eported lastLeft/lastTop does not match
      //console.log('after delete: left: ' + object.left + ' top: ' + object.top + ' lastLeft: ' + object.lastLeft + ' lastTop: ' + object.lastTop)
      setCustomCalloutAttributes(object, object.sdiType, object.sdiId, object.left, object.top);
      
      object.lastLeft = object.left; //big bug in json; the eported lastLeft/lastTop does not match
      object.lastTop = object.top; //big bug in json; the eported lastLeft/lastTop does not match
      listOfCallouts[object.sdiId].textbox = object;

      object.setControlsVisibility({
        mtr: false,
      });

      object.on({
        'moving': function () {
          updateBubbleEvent(object.sdiId);
        },
        'modified': function () {
          updateBubbleEvent(object.sdiId);
        },
        'scaling': function () {
          updateBubbleEvent(object.sdiId);
        },
        'removed': function () {
          deleteCallout(object.sdiId);
        },
      })
    }
    else if (object.sdiType && object.sdiType.includes("calloutRect")) {
      loadListOfCallouts(object.sdiId);
      setCustomCalloutAttributes(object, object.sdiType, object.sdiId, 0, 0);
      listOfCallouts[object.sdiId].rect = object;

      object.set({
        objectCaching: false,
        selectable: false,
        evented: false,
      });
    }
    else if (object.sdiType && object.sdiType.includes("calloutPolygon1")) { 
      loadListOfCallouts(object.sdiId);
      let temp = createPolygon1(object.sdiId);
      c.fcanvas.add(temp);

      let index = c.fcanvas.getObjects().indexOf(object);
      temp.moveTo(index);

      

      listOfCallouts[object.sdiId].poly = temp;
      c.fcanvas.remove(object);
    }
    else if (object.sdiType && object.sdiType.includes("calloutPolygon2")) {
      loadListOfCallouts(object.sdiId);
      let temp = createPolygon2(object.sdiId);
      c.fcanvas.add(temp);

      let index = c.fcanvas.getObjects().indexOf(object);
      temp.moveTo(index);

      listOfCallouts[object.sdiId].poly2 = temp;
      c.fcanvas.remove(object);
    }
    else if (object.sdiType && object.sdiType.includes("calloutHandle")) {
      loadListOfCallouts(object.sdiId);
      //console.log('after delete: left: ' + object.left + ' top: ' + object.top );
      
      setCustomCalloutAttributes(object, object.sdiType, object.sdiId, 0, 0);
      setNoControls(object);
      listOfCallouts[object.sdiId].handle = object;

      object.on({
        'moving': function () {
          updateBubbleEvent(object.sdiId);
        }
      })
    }
    object.setCoords();
  });
  

  d.state = null;

  c.fcanvas.renderAll.bind(c.fcanvas);
  for(let i = 0; i < listOfCallouts.length; i++)
  {
    if (listOfCallouts[i].textbox && listOfCallouts[i].textbox.left)
      updateBubble(listOfCallouts[i].poly,
        listOfCallouts[i].rect,
        listOfCallouts[i].poly2,
        listOfCallouts[i].textbox,
        listOfCallouts[i].handle)
  }
  //c.fcanvas.renderAll.bind(c.fcanvas);
}

function testthis() {
  alert("am in link function");
}

function loadListOfCallouts(id) {
  if (listOfCallouts.length <= id) {
    for (let i = 0; i <= id - listOfCallouts.length +2; i++) {
      listOfCallouts.push(new CalloutClass());
    }
  }
}
