
//xml stuff


const reader = new FileReader();

$(function () {

  // $( ".selection" ).button().click( function(e){
  //    alert('yikes');  
  //   });  

  $("#fselection input[type='file']").on('change', function () { parseit() });


});



function parseit(file) {


  // const file = document.getElementById('xmlfile').files[0];

  reader.readAsText(file);
};


function highlightID(str) {


  //var index = document.getElementById("menuitem2").selectedIndex;

  //if (index === 0) hotspot(0);
   
  if (str === 'allhotspots' ) hotspot(0);
    
    

   strascii = [];
   for( i = 0; i < str.length; i ++) strascii.push(str[i].charCodeAt(0));
     const tarr = new Uint32Array(strascii.length)
   for( i=0; i<strascii.length; i++) { 
     tarr[i] = strascii[i] ;}
     strbuf= Module._malloc(tarr.length * tarr.BYTES_PER_ELEMENT);
     Module.HEAP32.set(tarr, strbuf >> 2);
     hl_hotspot(strbuf,str.length);
    
  
};



 








reader.onerror = function () {
  console.log(readerin.error.message);
};





reader.onload = function () {
  var batch=1;
  $xml = $($.parseXML(reader.result));



  var begin = reader.result.search("!ENTITY");
  var start = reader.result.indexOf("SYSTEM", begin);
  var end = reader.result.indexOf(" ", begin);
  var cgmfilename = reader.result.substring(start, end - 1) + '.cgm';


  var myselect = $('#menuitem2');
  $xml.find('hotspot').each(function () {


    $id = $(this).attr('id');
    $temp = $(this).attr('applicationStructureIdent');


    if (batch) {
      hotspot_userid.push($id);
      hotspot_value.push($temp);

    }
    else

      myselect.append($('<option></option>').val($temp).html($id));


    // var menuitem = document.createElement('LI');                
    // menuitem.addEventListener('click', action,false);
    // menuitem.myParam = $temp ;
    //  menuitem.classList.add("contextmenu__item");
    // menuitem.innerHTML += '<a href="#" >' + $id + '</a>';
    // ful.appendChild(menuitem);


  });


};







function wasmXMLtooltip(x, y1, angle, tid) {




  tooltip = scanTooltip(tid);


  var y = y1 - 100;
  var w = 100;
  var h = 200;
  c.ctxx.save();
  c.ctxx.setTransform(c.ctx.getTransform());
  c.ctxx.font = "120px Lucida Sans Typewriter";

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
