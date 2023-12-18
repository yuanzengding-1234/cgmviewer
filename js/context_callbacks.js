




// Context menu handlers
function viewlinks() {
  //document.getElementById("canvas1").style.zIndex = "1"
  //document.getElementById("canvas2").style.zIndex = "1"
  //document.getElementById("canvas3").style.zIndex = "1"
  hotspot(0);

}

function setdragmode(value) {
  if (typeof setdragmode.mode === 'undefined') setdragmode.mode = 0;
  if (typeof value === "undefined") return setdragmode.mode;
  else setdragmode.mode = value;
}


function sdiSaveRedLineTest()
{
  c.redLineJsonTest = sdiSaveRedLine();
}

function sdiLoadRedLineTest()
{
  sdiLoadRedLine(c.redLineJsonTest);
}


function setzoomin() {
  hotspot(1);
  zoom(1);
  startSelection();
}


function setzoomout() {
  hotspot(1);
  zoom(-1);
  startSelection();
}

function setzoom() {
  hotspot(1);
  c.drawmode = false;
  c.fcanvas.isDrawingMode = false;
  c.fcanvas.selection = false;
  
  setSelectionMode(false);
  setdragmode(1);
}

function setpanmode() {
  try {
    c.drawmode = false;
    c.fcanvas.isDrawingMode = false;
    c.fcanvas.selection = false;
    setSelectionMode(false);
    setdragmode(0);
  }
  catch(error) { }

}


function setfit() {
  c.ctx.clearRect(0, 0, c.w*10,c.h*10);
  if (c.w1.x === -9898)
    return;
  c.w1.x = c.global_vdc_xs;
  c.w1.y = c.global_vdc_ys;
  c.w2.x = c.global_vdc_xe;
  c.w2.y = c.global_vdc_ye;

  c.w1.x = -9898;
  
  var status = sdi_printcgm(c.iptr, c.sizein1, 0,0,0,0);
  document.scrollTop = 0;


  sdiZoomFabric(); 

}

function sdi_trnsf_callback(){
  if(c.calculateOnce)
  {
/*
  getfitpixel(c.w, c.h);

  var vdc = getvdc(0, 0);
  var str = UTF8ToString(vdc);
  var a = str.split(",");

  var width1 = parseFloat(a[0]);
  var height1 = parseFloat(a[1]);
  */
  var width1 = getvdcX(0,0);
  var height1 = getvdcY(0,0);
/*
  var vdc4 = getvdc(c.w, c.h);
  var str4 = UTF8ToString(vdc4);
  var a4 = str4.split(",");

  var width2 = parseFloat(a4[0]);
  var height2 = parseFloat(a4[1]);
  */
  var width2 = getvdcX(c.w, c.h);
  var height2 = getvdcY(c.w, c.h);
  c.originalVdcWidth = Math.abs(width2 - width1) * c.ratio;
  c.originalVdcHeight = Math.abs(height2 - height1) * c.ratio;

  c.calculateOnce = false;
  }

}




function linkID(evt) {


  var a = get_link(thisX * c.ratio, thisY * c.ratio, 1);
  var string = UTF8ToString(a);
  var x = thisX * c.ratio;
  var y = thisY * c.ratio;
  parseXML(string, x, y);

}


function get_info_javascript() {

  alert("This is inside the script, ");
}



function contextMenuAddItem(menustring) {

  var action = function () {
    menuLink;
  };


  var menuitem = document.createElement('LI');
  menuitem.addEventListener('click', action);
  menuitem.classList.add("linkmenu__item");
  menuitem.innerHTML = '<a href="#">' + menustring + '</a>';
  document.getElementById('menuitems').appendChild(menuitem);

}

function sdiparseXML(id, x, y) {

  var toolTip = "";
  var nstring = "";
  /*
    var ful = document.getElementById('menuitems') ;
    var listLength = ful.children.length;
    for (i = 0; i < listLength; i++) ful.removeChild(ful.children[0]);
 
    toolTip = $("#"+id).find('GM\\:LOCATOR').each(function(){

  


 
    toolTip = $(this).attr("title");
    contextMenuAddItem( toolTip);

    //nstring = nstring.concat(toolTip);
    //nstring = nstring.concat("<br>");
     
    
});
 
*/
  //toolTip =  $("#"+id).find('DIV').html();
  toolTip = $("#" + id).find('GM\\:CALLOUT-TEXT DIV').html();
  return toolTip;
  //$("GM\\:FIGURE-GROUP").find("DIV GM\\:CALLOUT GM\\:CALLOUT-TEXT").each(function(){
  //  var toolTip = $(this).find('DIV').html();

  //nstring = nstring.concat(toolTip);
  //nstring = nstring.concat('<br>');

  //});         
  // return nstring ; 




}



function wasmXMLtooltip(x, y1, angle, tid) {





  var tooltip = sdiparseXML(tid, x, y1);

  var y = y1 - 100;
  var w = 100;
  var h = 200;
  c.ctxx.save();
  c.ctxx.setTransform(c.ctx.getTransform());
  c.ctxx.font = "160px Lucida Sans Typewriter";

  c.ctxx.globalAlpha = .7;
  c.ctxx.fillStyle = "#FFFF88";
  c.ctxx.strokeStyle = "black";

  var count = 0;
  var str = [];
  var i = 0;
  var offset = 0;
  var maxlen = 0;
  var lastoffset = 0;

  for (; ;) {
    if (!(offset !== -1 && offset !== (tooltip.length - 1)))
      break;

    offset++;
    count++;

    offset = tooltip.indexOf("<br>", offset);
    end = offset; if (offset === -1) end = tooltip.length;
    var tmpstr = tooltip.substring(lastoffset, end);
    maxlen = maxlen > tmpstr.length ? maxlen : tmpstr.length;
    str[count - 1] = tmpstr;
    lastoffset = offset + 4;
  }


  h *= count;
  w *= maxlen;
  c.ctxx.fillRect(x, y + 10, w, (h + 20));
  c.ctxx.lineWidth = 12;
  c.ctxx.strokeRect(x, y + 10, w, (h + 20));
  c.ctxx.fillStyle = "black";
  c.ctxx.globalAlpha = 1.0;
  for (i = 0; i < count; i++) {
    c.ctxx.fillText(str[i], x, y + ((i + 1) * 200));
  }
  c.ctxx.restore();
  return 0;

}


function tooltipText(texts, x, y1, angle, screenTip) {
  var y = y1 - 100;
  var w = 100;
  var h = 200;
  c.ctxx.save();
  c.ctxx.setTransform(c.ctx.getTransform());
  c.ctxx.font = "160px Lucida Sans Typewriter";

  c.ctxx.globalAlpha = .8;
  c.ctxx.fillStyle = "#FFFF88";
  c.ctxx.strokeStyle = "black";

  var count = 0;
  var str = [];
  var i = 0;
  var offset = 0;
  var maxlen = 0;
  var lastoffset = 0;
  var tooltip = texts;
  for (; ;) {
    if (!(offset !== -1 && offset !== (tooltip.length - 1)))
      break;

    offset++;
    count++;



    offset = tooltip.indexOf("<br>", offset);
    end = offset; if (offset === -1) end = tooltip.length;
    var tmpstr = tooltip.substring(lastoffset, end);
    maxlen = maxlen > tmpstr.length ? maxlen : tmpstr.length;
    str[count - 1] = tmpstr;
    lastoffset = offset + 4; // <br> is the linefeed character
  }

  h *= count;
  w *= maxlen;
  c.ctxx.fillRect(x, y + 10, w, (h + 20));
  c.ctxx.lineWidth = 12;
  c.ctxx.strokeRect(x, y + 10, w, (h + 20));
  c.ctxx.fillStyle = "black";
  c.ctxx.globalAlpha = 1.0;
  for (i = 0; i < count; i++) {
    c.ctxx.fillText(str[i], x, y + ((i + 1) * 200));
  }
  c.ctxx.restore();
  return 0;

}





function clearlinks() {
  // tryit();
  hotspot(1);
}

function follow_xml_link() {



}



//  window.open("images/fuse.htm"); //, "newWindow", "width=500,height=700");





/*

        var tooltip="this is\na string\nwith more\nasf";
        var count=0;
        var str=[];
        var offset= 0;
        var lastoffset=0;
       while (offset !== -1 && offset !== (tooltip.length-1) ){ 
                offset++;
                count++;
                
                offset = tooltip.indexOf("\n",offset) ;
                end=offset;if(offset === -1)end = tooltip.length;
                str[count-1] = tooltip.substring(lastoffset, end);
                lastoffset = offset ;
               
        }
        //if ( offset  != tooltip.length )count++;
        }
        */


function updateScreen() {

  location.reload();
}









function setfiledialog() {
  $('<input type="file" multiple>').on('change', function () {
    readhtmlfile(this.files[0]); //save selected files to the array   
  }).click();


}
 

function downloadCGMfile(file) {
  //var parm=getUrlVars()[main_cgm_file];
  if (file) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', file, true);
    xhr.responseType = 'blob';
    xhr.onload = function (e) {
      if (this.status == 200) {
        //open CGM file to be scanned   
        var blob = new Blob([this.response], { type: 'image/png' });
        getfilein(blob);
      }
    };
    xhr.send();
  }

}

function getUrlVars() {
  var vars = {};
  var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
    vars[key] = value;
  });
  return vars;
}
