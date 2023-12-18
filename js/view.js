
function SDIglobal() {
	this.fcanvas;
	this.canvas;
	this.canvas1;
	this.canvas2;
	this.canvas3;
	this.ctx;
	this.ctxx;
	this.ctx2;
	this.ctx3;

	this.global_vdc_xs;
	this.global_vdc_ys;
	this.global_vdc_xe;
	this.global_vdc_ye;

	this.global_vdc_cxs;
	this.global_vdc_cys;
	this.global_vdc_cxe;
	this.global_vdc_cye;
	this.dragDownX;
	this.dragDownY;
	this.h;
	this.w;

	this.zoomtype;
	this.power;
	this.xdown;
	this.ydown;
	this.lastX;
	this.lastY;
	this.drawmode;
	this.XML;
	this.w1;
	this.w2;
	this.iptr;
	this.sizein1;
	this.hotspotlist = [];

	this.ratio = 10;

	this.canvasRatio = 1;
	this.originalCanvasWidth = -1;
	this.originalCanvasHeight = -1;

	this.dragStart;
	this.dragged;
	this.vdcppx ;
	this.vdcppy ;

	this.originalVdcWidth;
	this.originalVdcHeight;

	this.calculateOnce = false;
	this.isDragging = false;

	this.firstTimeFileLoad = false;
	this.redrawTimer = null;
	this.clipx;
	this.clipy;
	this.clipex;
	this.clipey; 
}
	     var started=false ;
             var sdi_printpdf;		// draw CGM
			 var sdi_printcgm;
	     var  wasm_set_viewport; // pass vdc viewport to draw
             var set_screen_dimensions;	// pass size of canvas in pixels
             var load_hotspot;
			 var hl_hotspot;
			 var hl_hotspot_index;
	
			 var hotspot ;
			 var sdi_set_picture  ;
			 var sdi_mouse_motion  ;
			 var get_version  ;
			 var get_link   ;

			 var getvdc;
			 var getvdcX;
			 var getvdcY;
			 var getpixel;
			 var getfitpixelX;
			 var getfitpixelY;
			  var set_fit_transform;
		function zoomarea(q, p) {

			

				if (c.w1.x === -9898)return;

				var x =  p[0] < q[0] ? p[0] : q[0] ;
				var y =  p[1] < q[1] ? q[1] : p[1] ;
				x  *= c.ratio ;
				y  *= c.ratio ;
				c.w1.x = getvdcX(x,y);
				c.w1.y = getvdcY(x,y);
				 
				var x2 =  p[0] < q[0] ? q[0] : p[0] ;
				var y2 =  p[1] < q[1] ? p[1] : q[1] ;
				x2  *= c.ratio ;
				y2  *= c.ratio ;
				c.w2.x = getvdcX(x2,y2);
				c.w2.y = getvdcY(x2,y2);
				 
				redraw();

				sdiZoomFabric();

				
		}



		function calc_extent() {

			var scry =c.h * c.ratio ;
			var scrx =c.w * c.ratio ;

			if (c.w1.x === -9898) {
				c.w1.x = c.global_vdc_xs;
				c.w1.y = c.global_vdc_ys;
				c.w2.x = c.global_vdc_xe;
				c.w2.y = c.global_vdc_ye;

				c.zoomtype = 0;

			}

			var dx = c.w2.x - c.w1.x;
			var dy = c.w2.y - c.w1.y;

			if ( c.h/dy  > c.w/dx  ){
			  c.vdcppx = dx / c.w ;
			  c.vdcppy = c.vdcppx  ;
			}else{
			  c.vdcppy = dy / c.h ;
			  c.vdcppx = c.vdcppy ;
			}




		 




 			/*
			if (dx > dy) {
				scrx = scrx * 10.;
				scry = (scrx * dy) / dx;
			}
			else {
				scry = scry * 10.;
				scrx = (scry * dx) / dy;

			}
			 

			if (c.zoomtype == 1) {  // not zoom area

				var transform = c.ctx.getTransform();



				var ddx = dx / (transform.a * c.ratio);
				var ddy = dy / (transform.a * c.ratio);

				var x = c.lastX / c.pmax;
				var y = 1.0 - (c.lastY / c.pmax);


				c.w2.x = (c.w1.x + (dx * x)) + ddx / 2;
				c.w2.y = (c.w1.y + (dy * y)) + ddy / 2;
				c.w1.x = (c.w1.x + (dx * x)) - ddx / 2;
				c.w1.y = (c.w1.y + (dy * y)) - ddy / 2;

				var scl = transform.a * c.ratio;

				var ns = 1 / scl;
				var a = (transform.e + (c.pmax/2));
				c.ctx.scale(ns, ns);


			}
			*/
			var s = get_version();
			var version = UTF8ToString(s);
		//	document.getElementById("copyright").innerHTML = "SDI (C) Copyright 2020-2021 - CGM Viewer " + version;

			sdi_set_picture(1);
				 
			set_screen_dimensions(scrx,scry);
			c.firstTimeFileLoad = false; 
			wasm_set_viewport(c.w1.x, c.w1.y, c.w2.x, c.w2.y);
			//wasm_set_viewport(2500,5000,17500,35000);
			//wasm_set_viewport(  c.global_vdc_xs, c.global_vdc_ys,c.global_vdc_xe,c.global_vdc_ye);

			//if (c.firstTimeFileLoad)
				set_fit_transform(10000, 10000);
			c.firstTimeFileLoad = false;

		}




		function redraw() {

			// Clear the entire canvas
			//var p1 = c.ctx.transformedPoint(0, 0);
			//var p2 = c.ctx.transformedPoint(c.canvas1.width, c.canvas1.height);

			//c.ctx.clearRect(0, 0, c.vmax, c.vmax);
			// c.ctx.setTransform(1, 0, 0, 1, 0, 0);
			// c.ctx.scale(0.1, 0.1);


			c.ctx.clearRect(0,0,c.w*10,c.h*10);


			 

			var status = sdi_printcgm(c.iptr, c.sizein1, 0,0,0,0);

		}



		
		function initapp(w,h) {

			c = new SDIglobal();
			d = new SDIdraw();
		
		 
 
			c.zoomtype = 1;
			c.power = 1;

			c.drawmode = false ;
			c.XML = 0;
			 
			c.iptr = null;		// CGM object memory
			c.sizein1 = 0;		// size of CGM object 

			c.w1 = { x: -9898, y: -1 };
			c.w2 = { x: 0, y: 0 };

			c.canvas1 = document.getElementById('canvas1');
			c.canvas2 = document.getElementById('canvas2');
			c.canvas3 = document.getElementById('canvas3');
			c.ctx =  c.canvas1.getContext('2d');
			c.ctxx = c.canvas2.getContext('2d');
			c.ctx3 = c.canvas3.getContext('2d');

			var zapf = new FontFace('zapf-dingbats','url(fonts/wingding.ttf)');
			zapf.load().then(function(font){
					document.fonts.add(font);
			});

			var ocrb = new FontFace('ocrb','url(fonts/Ocrbata.ttf)');
			ocrb.load().then(function(font){
					document.fonts.add(font);
			});
			var palatino = new FontFace('palatino','url(fonts/pala.ttf)');
			palatino.load().then(function(font){
					document.fonts.add(font);
			});
			var palatino_italic = new FontFace('palatino_italic','url(fonts/palai.ttf)');
			palatino_italic.load().then(function(font){
					document.fonts.add(font);
			});
			var palatino_bold = new FontFace('palatino_bold','url(fonts/palab.ttf)');
			palatino_bold.load().then(function(font){
					document.fonts.add(font);
			});
			var palatino_bold_italic = new FontFace('palatino_bold_italic','url(fonts/palabi.ttf)');
			palatino_bold_italic.load().then(function(font){
					document.fonts.add(font);
			});
			var arial = new FontFace('arial','url(fonts/ARIALUNI.ttf)');
			arial.load().then(function(font){
					document.fonts.add(font);
			});
			var arial_bold = new FontFace('arial_bold','url(fonts/ARIALBD.ttf)');
			arial_bold.load().then(function(font){
					document.fonts.add(font);
			});
			var arial_bold_italic = new FontFace('arial_bold_italic','url(fonts/ARIALBI.ttf)');
			arial_bold_italic.load().then(function(font){
					document.fonts.add(font);
			});
			var arial_italic = new FontFace('arial_italic','url(fonts/ARIALI.ttf)');
			arial_italic.load().then(function(font){
					document.fonts.add(font);
			});
			var arial_narrow = new FontFace('arial_narrow','url(fonts/ARIALN.ttf)');
			arial_narrow.load().then(function(font){
					document.fonts.add(font);
			});
			var arial_narrow_bold = new FontFace('arial_narrow_bold','url(fonts/ARIALNB.ttf)');
			arial_narrow_bold.load().then(function(font){
					document.fonts.add(font);
			});
			var arial_narrow_bold_italic = new FontFace('arial_narrow_bold_italic','url(fonts/ARIALNBI.ttf)');
			arial_narrow_bold_italic.load().then(function(font){
					document.fonts.add(font);
			});
			var arial_narrow_italic = new FontFace('arial_narrow_italic','url(fonts/ARIALNI.ttf)');
			arial_narrow_italic.load().then(function(font){
					document.fonts.add(font);
			});
			var bookman = new FontFace('bookman','url(fonts/BOOKOS.ttf)');
			bookman.load().then(function(font){
					document.fonts.add(font);
			});
			var bookman_bold = new FontFace('bookman_bold','url(fonts/BOOKOSB.ttf)');
			bookman_bold.load().then(function(font){
					document.fonts.add(font);
			});
			var bookman_bold_italic = new FontFace('bookman_bold_italic','url(fonts/BOOKOSBI.ttf)');
			bookman_bold_italic.load().then(function(font){
					document.fonts.add(font);
			});
			var bookman_italic = new FontFace('bookman_italic','url(fonts/BOOKOSI.ttf)');
			bookman_italic.load().then(function(font){
					document.fonts.add(font);
			});
			var century = new FontFace('century','url(fonts/CENSCBK.ttf)');
			century.load().then(function(font){
					document.fonts.add(font);
			});
			var century_bold = new FontFace('century_bold','url(fonts/SCHLBKB.ttf)');
			century_bold.load().then(function(font){
					document.fonts.add(font);
			});
			var century_bold_italic = new FontFace('century_bold_italic','url(fonts/SCHLBKBI.ttf)');
			century_bold_italic.load().then(function(font){
					document.fonts.add(font);
			});	
			var century_italic = new FontFace('century_italic','url(fonts/SCHLBKI.ttf)');
			century_italic.load().then(function(font){
					document.fonts.add(font);
			});		
			var courier = new FontFace('courier','url(fonts/COUR.ttf)');
			courier.load().then(function(font){
					document.fonts.add(font);
			});
			var courier_bold = new FontFace('courier_bold','url(fonts/COURBD.ttf)');
			courier_bold.load().then(function(font){
					document.fonts.add(font);
			});
			var courier_bold_italic = new FontFace('courier_bold_italic','url(fonts/COURBI.ttf)');
			courier_bold_italic.load().then(function(font){
					document.fonts.add(font);
			});	
			var courier_italic = new FontFace('courier_italic','url(fonts/COURI.ttf)');
			courier_italic.load().then(function(font){
					document.fonts.add(font);
			});		
			var symbol = new FontFace('symbol','url(fonts/SYMBOL.ttf)');
			symbol.load().then(function(font){
					document.fonts.add(font);
			});	
			var zapf_dingbats = new FontFace('zapf_dingbats','url(fonts/ZapfDingbats.ttf)');
			zapf_dingbats.load().then(function(font){
					document.fonts.add(font);
			});		





			
			initDrawing();
			sdiSetCanvasSize(w,h);
			 
			  getvdcY = Module.cwrap('getvdcY', 'number', ['number','number']);
			  getvdcX = Module.cwrap('getvdcX', 'number', ['number','number']);
			 
			//getpixel = Module.cwrap('getpixel', 'number', ['number','number']);
			  getfitpixelX = Module.cwrap('getfitpixelX', 'number', ['number','number']);
			  getfitpixelY = Module.cwrap('getfitpixelY', 'number', ['number','number']);
			

			 
		 
			c.canvas = c.canvas1;
			c.ctx.scrollTop = 0;
			c.ctxx.scrollTop = 0;
			c.ctx3.scrollTop = 0;

			c.global_vdc_xs = 0;
			c.global_vdc_ys = 0;
			c.global_vdc_xe = 0;
			c.global_vdc_ye = 0;
			c.global_vdc_cxs = -1;
			c.global_vdc_cys = -1;
			c.global_vdc_cxe = 0;
			c.global_vdc_cye = 0;


 
			
			set_screen_dimensions = Module.cwrap('set_screen_dimensions', 'number', ['number', 'number']);
			wasm_set_viewport = Module.cwrap('wasm_set_viewport', 'number', ['number', 'number', 'number', 'number']);
			printcgm = Module.cwrap('printcgm', 'number', ['number', 'number', 'number']);
		 
			sdi_printcgm = Module.cwrap('sdi_printcgm', 'number', ['number', 'number', 'number', 'number', 'number','number']);
			
			hotspot = Module.cwrap('sdi_highlight_all_regions', 'number', ['number']);
			sdi_set_picture = Module.cwrap('sdi_set_picture', 'number', ['number']);
			sdi_mouse_motion = Module.cwrap('sdi_mouse_motion', 'number', ['number', 'number']);
			get_version = Module.cwrap('sdi_get_wasm_version', 'number', [null]);
			get_link = Module.cwrap('sdi_get_link', 'number', ['number', 'number', 'number']);
			hl_hotspot = Module.cwrap('highlight_hotspotid', 'number', ['number', 'number']);
			hl_hotspot_index = Module.cwrap('highlight_hotspotid_index', 'number', ['number']);
			set_fit_transform = Module.cwrap('set_fit_transform', 'number', ['number'], ['number']);

			  

			initzoom();

			 

			 


		}

		function sdiTextAtr( fontn, fontsize, bold, hjust,vjust) {
			var fnt;
					var fsize = fontsize.toString()  + "px" ;
					var horizontal = ["left" ,"left", "center" , "right"];
					var vertical = ["top" ,"hanging" ,"middle" ,"ideographic", "alphabetic" ,"bottom"];
					var font = fontn.toLowerCase();
					 
			
					var bld = ( font.includes("bold") || font.includes("_demi")  ? "_bold" : "") ;
					var itc = ( font.includes("italic") || font.includes("oblique")   ? "_italic" : "" ) ;
					if( font.includes("palatino") )
							fnt =  "palatino" ;
					else if ( font.includes("times") )
							fnt = "Times";
					else if ( font.includes("helvetic_narrow" ) )
							fnt = "arial_narrow";
					else if ( font.includes("helvetica") )
							fnt = "arial";
							 
					else if ( font.includes("ocrb") )
							fnt = "ocrb";
					else if ( font.includes("zapf_dingbats") )
							fnt = "zapf_dingbats";
					else if ( font.includes("century") )
							fnt = "century";
					   else if ( font.includes("bookman") )
							fnt = "bookman";
					else if ( font.includes("arial") )
							fnt = "arial";  
					else if ( font.includes("dingbat") )
							fnt = "zapf-dingbats";
					else if ( font.includes("century") )
							fnt = "century";
					else if ( font.includes("courier") )
							fnt = "courier";
					else if ( font.includes("symbol") )
							fnt = "symbol";
					else
							fnt = "arial";
					var fullfont =  fsize + " " + fnt + bld + itc ;
					c.ctx.font = fullfont ;
					 
					c.ctx.textAlign = horizontal[hjust]; 
					c.ctx.textBaseline = vertical[vjust];
			
		}
		function getOriginalHeightWidth() {
			c.originalCanvasWidth = 1000;
			c.originalCanvasHeight = 1000;
		}

	
		function mousedown(which,offsetX,offsetY ) {

			if (which != 1) return;//if not left button

			//document.body.style.mozUserSelect = document.body.style.webkitUserSelect = document.body.style.userSelect = 'none';			
			c.dragStart = [offsetX,offsetY];
			c.dragged = false;
			c.isDragging = true;
		}

		function mousemove(which, offsetX, offsetY) {

			if (which != 1) return;

			if (c.w1.x === -9898)return;

			if(!c.isDragging)return;

			var dx = offsetX - c.dragStart[0];
			var dy = offsetY - c.dragStart[1];

			if (Math.abs(dx) < 1 && Math.abs(dy) < 1) return;

			c.dragged = true;

			var dragmode = setdragmode();
			console.log("value of dragmode" + dragmode);
			if (dragmode === 0) { //pan

				 var delta = new fabric.Point(dx, dy);
				 c.fcanvas.relativePan(delta);

				c.dragStart[0] = offsetX;
				c.dragStart[1] = offsetY;

				c.zoomtype = 2;

				c.w2.x -= c.vdcppx * dx;
				c.w2.y += c.vdcppy * dy;
				c.w1.x -= c.vdcppx * dx;
				c.w1.y += c.vdcppy * dy;

				redraw();
				c.fcanvas.renderAll();
			} else if (dragmode === 1) {

				//c.ctxx.clearRect(0, 0, c.canvas2.width, c.canvas2.height);
				c.ctxx.strokeStyle = "orange";
				console.log(" view " + c.ctxx );
				c.ctxx.strokeRect(c.dragStart[0] , c.dragStart[1] , dx, dy);
				console.log("size of rect "  + dx + " " + dy );
			}

		}

		function mouseup(which,offsetX,offsetY ) {

			c.isDragging = false;
			if (which != 1) return;
			//c.ctxx.clearRect(0, 0, c.canvas.width, c.canvas.height);
			var dragmode = setdragmode();
			if (dragmode === 1 && c.dragged) zoomarea([offsetX,offsetY], c.dragStart);
			else if (dragmode === 0) { //pan redraw area to reset hot spots
					redraw();
					c.fcanvas.setViewportTransform(c.fcanvas.viewportTransform);
			}
			c.dragStart = null;
			 
		}

		function zoom(clicks) {  // one button zoom about lastX,lastY

			if (c.w1.x === -9898)return;

			if (clicks === 1) {
				var dx = c.w2.x - c.w1.x ;
				var dy = c.w2.y - c.w1.y ;
				c.w1.x += (0.1 * dx);
				c.w1.y += (0.1 * dy);
				c.w2.x -= (0.1 * dx);
				c.w2.y -= (0.1 * dy);
				redraw();
			}
			else {
				var dx = c.w2.x - c.w1.x ;
				var dy = c.w2.y - c.w1.y ;
				c.w1.x -= (0.1 * dx);
				c.w1.y -= (0.1 * dy);
				c.w2.x += (0.1 * dx);
				c.w2.y += (0.1 * dy);
				redraw();
			}		 

			sdiZoomFabric();
		}

		function sdiZoomFabric() {
			/* var vdc = getvdc(0, 0);
			var vdcString = UTF8ToString(vdc);
			var vdcStringArray = vdcString.split(",");

			var vdcLeft = parseFloat(vdcStringArray[0]);
			var vdcTop = parseFloat(vdcStringArray[1]);
			*/
			var vdcLeft = getvdcX(0,0);
			var vdcTop =  getvdcY(0,0);
			/*
			var pixel = getfitpixel(vdcLeft, vdcTop);
			var pixelString = UTF8ToString(pixel);
			var pixelStringArray = pixelString.split(",");

			var pixelLeft = parseFloat(pixelStringArray[0]) / c.ratio;
			var pixelTop = parseFloat(pixelStringArray[1]) / c.ratio;
			*/
			var pixelLeft = getfitpixelX(vdcLeft,vdcTop) / c.ratio ;
			var pixelTop = getfitpixelY(vdcLeft,vdcTop) / c.ratio ;



			c.fcanvas.setZoom(1);
			c.fcanvas.absolutePan({ x: pixelLeft, y: pixelTop});
/*
			var vdc = getvdc(c.w, c.h);
			var vdcString = UTF8ToString(vdc);
			var vdcStringArray = vdcString.split(",");

			var vdcRight = parseFloat(vdcStringArray[0]);
			var vdcBottom = parseFloat(vdcStringArray[1]);
*/
			var vdcRight = getvdcX(c.w,c.h);
			var vdcBottom =  getvdcY(c.w,c.h);
			var zoomPower;


			var dx = c.global_vdc_xe - c.global_vdc_xs;
			var dy = c.global_vdc_ye - c.global_vdc_ys;
			if (c.originalCanvasHeight / dy < c.originalCanvasWidth / dx) {
				zoomPower = (Math.abs(c.global_vdc_ye - c.global_vdc_ys) / c.originalVdcHeight) * (c.originalVdcHeight / Math.abs(vdcBottom - vdcTop) / c.ratio)
				c.fcanvas.setZoom(zoomPower * (c.h / c.originalCanvasHeight));
			}
			else {
				zoomPower = (Math.abs(c.global_vdc_xe - c.global_vdc_xs) / c.originalVdcWidth) * (c.originalVdcWidth / Math.abs(vdcRight - vdcLeft) / c.ratio)
				c.fcanvas.setZoom(zoomPower * (c.w / c.originalCanvasWidth));
			}
		}

		function handleScroll(evt) {
			var delta = evt.wheelDelta ? evt.wheelDelta / 150 : evt.detail ? -evt.detail : 0;
			if (delta) zoom(delta);
			return evt.preventDefault() && false;
		};

		function initzoom() {


			c.canvas2.style.background = 'transparent';
			c.canvas1.style.background = 'transparent';
			c.canvas3.style.background = 'transparent';

			trackTransforms(c.ctx);



			lastX = c.canvas.width / 2;
			lastY = c.canvas.height / 2;
			
			c.canvas = c.canvas3;

		 

			// canvas.addEventListener('DOMMouseScroll',handleScroll,false); // FireFox

			document.addEventListener('mousewheel', function (ev) {
				var travel = ev.deltaY;
			}, false);

		};


		function trackTransforms(x) {
			var svg = document.createElementNS("http://www.w3.org/2000/svg", 'svg');
			var xform = svg.createSVGMatrix();
			x.getTransform = function () { return xform; };

			var savedTransforms = [];
			var save = x.save;
			x.save = function () {
				savedTransforms.push(xform.translate(0, 0));
				return save.call(x);
			};

			var restore = x.restore;
			x.restore = function () {
				xform = savedTransforms.pop();
				return restore.call(x);
			};

			var scale = x.scale;
			x.scale = function (sx, sy) {
				xform = xform.scaleNonUniform(sx, sy);
				return scale.call(x, sx, sy);
			};

			var rotate = x.rotate;
			x.rotate = function (radians) {
				xform = xform.rotate(radians * 180 / Math.PI);
				return rotate.call(x, radians);
			};

			var translate = x.translate;
			x.translate = function (dx, dy) {

				xform = xform.translate(dx, dy);
				return translate.call(x, dx, dy);
			};

			var transform = x.transform;
			x.transform = function (a, b, c, d, e, f) {
				var m2 = svg.createSVGMatrix();
				m2.a = a; m2.b = b; m2.c = c; m2.d = d; m2.e = e; m2.f = f;
				xform = xform.multiply(m2);
				return transform.call(x, a, b, c, d, e, f);
			};

			var setTransform = x.setTransform;
			x.setTransform = function (a, b, c, d, e, f) {
				xform.a = a;
				xform.b = b;
				xform.c = c;
				xform.d = d;
				xform.e = e;
				xform.f = f;
				return setTransform.call(x, a, b, c, d, e, f);
			};

			var pt = svg.createSVGPoint();
			x.transformedPoint = function (x, y) {
				pt.x = x; pt.y = y;

				return pt.matrixTransform(xform.inverse());
			}
		}

	  

		function tryit() {




			var ful = document.getElementById('menuitems');

		 
			var ful = document.getElementById('menuitems');
			var listLength = ful.children.length;
			for (i = 0; i < listLength; i++) ful.removeChild(ful.children[0]);


		}
		function dr(pt, len) {
			for (i = 0; i < len; i++)pt[i] /= c.ratio ;
			var points = [{ x: pt[0], y: pt[1] }];
			for (i = 2; i < len; i += 2)
				points.push({ x: pt[i], y: pt[i + 1] });
			var poly = new fabric.Polyline(points, { fill: 'transparent', stroke: 'black' });
			c.fcanvas.add(poly);

			var p = new fabric.Polyline([{ x: pt[0], y: pt[1] }, { x: pt[2], y: pt[3] }, { x: pt[4], y: pt[5] }], { fill: 'transparent', stroke: 'black' });
			c.fcanvas.add(p);
		}


function saveRedline() {

	if (c.fcanvas !== null) {
		var png = c.canvas1.toDataURL("image/png");

		c.fcanvas.forEachObject(function (object) {
			if (object.sdiType === "sdiNote") {
				object.set({excludeFromExport: true});
			}
		});

		var svg = c.fcanvas.toSVG();

		c.fcanvas.forEachObject(function (object) {
			if (object.sdiType === "sdiNote") {
				object.set({excludeFromExport: false});
			}
		});

		var noteHeight = 0;
		var noteCount = 1;

		var n = svg.search('viewBox="');
		var str = svg.slice(n + 9);
		var a = str.split(" ");

		var h = a[3];
		var i = h.search('"');
		h = h.slice(0, i);

		c.fcanvas.forEachObject(function (object) {

			if (object.sdiType === "sdiNote") {

				var words = object.sdiNoteString.replace(/\n/g, " ");
				if (words !== "") {

					noteCount.toString() + ") " + words
					noteHeight += 25;

					var tempString3 = '</svg>'
					var tempString4 = "<text xml:space = \"preserve\" x=\"" + (parseInt(a[0]) + 10).toString() + "\" y=\"" + (parseInt(a[3]) + parseInt(a[1]) + noteHeight).toString() + "\" lengthAdjust=\"spacingAndGlyphs\"  font-size=\"20\" fill=\"#000000\" style=\"font-family:\'Times New Roman\',serif;font-style:normal;font-weight:normal;\">" + noteCount.toString() + ") " + words + "</text>\n</svg>"

					svg = svg.replace(tempString3, tempString4);

					noteCount++;
				}
			}
		});

		noteHeight += 50;

		npng = "</defs><image x='" + a[0] + "' y='" + a[1] + "' width='" + a[2] + "' height='" + h + "' xlink:href='" + png + "'></image>";
		svg = svg.replace("</defs>", npng);

		var tempString1 = 'viewBox=\"' + a[0] + ' ' + a[1] + ' ' + a[2] + ' ' + a[3]; //already has quote on end of a[3]
		var tempString2 = 'viewBox=\"' + a[0] + " " + a[1] + " " + (parseInt(a[2]) + noteHeight).toString() + " " + (parseInt(a[3]) + noteHeight).toString() + "\"";

		svg = svg.replace(tempString1, tempString2);

		svg = svg.replace("width=\"" + c.fcanvas.getWidth().toString() + "\"", "width=\"" + (c.fcanvas.getWidth() + noteHeight).toString() + "\"")
		svg = svg.replace("height=\"" + c.fcanvas.getHeight().toString() + "\"", "height=\"" + (c.fcanvas.getHeight() + noteHeight).toString() + "\"")

		var data = new Blob([svg], { type: 'text/plain' });

		var isIE = /*@cc_on!@*/false || !!document.documentMode;

		if (isIE )
			window.navigator.msSaveOrOpenBlob(data, 'redline.svg');
		else{
	 		var url = window.URL.createObjectURL(data);
 			document.getElementById('download_link').href = url;
		}
	}
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

		function wasm_add_xmltt(id ){

		}
















