// ┌────────────────────────────────────────────────────────────────────┐ \\
// │ jSpider - Javascript Spider Charts Library                         │ \\
// ├────────────────────────────────────────────────────────────────────┤ \\
// │ Copyright © 2013 Maxime Alay-Eddine                                │ \\
// │ Copyright © 2013 SportinTown (http://www.sportintown.com)          │ \\
// ├────────────────────────────────────────────────────────────────────┤ \\
// │ Licensed under the MIT license.                                    │ \\
// └────────────────────────────────────────────────────────────────────┘ \\

function diagramme(div, width, height, radius, min, max, labels, labelsId, values, radiusbutton, isEditable) { // Generic diagram builder
  this.div = div;
	this.labels = labels;
	this.labelsId = labelsId;
	this.min = min;
	this.max = max;
	this.w = width;
	this.h = height;
	this.cx = width/2;
	this.cy = height/2;
	this.radius = radius;
	this.radiusButton = radiusbutton;
	this.chartColors = ["rgb(0,135,0)", "rgb(0,195,0)", "rgb(235,235,0)", "rgb(255,0,0)", "rgb(135, 0, 0)"];
	this.polygonAttr = {fill: "#0055FF", opacity: 0.6};
	this.polygonStrokeAttr = {stroke: "#FFFFFF", "stroke-opacity": 1, "stroke-width": 1};
	this.markersAttr = {fill: "rgb(0, 151, 255)", stroke: "#FFFFFF", opacity: 1};
	this.markers = new Array();
	this.arrows = new Array();
	this.arrowsAreas = new Array();
	if(typeof values == 'undefined') { // Allowing to create free diagrams
		var values = new Array();
		values.length = labels.length;
		for(var i=0;i<values.length;i++) {
			values[i] = 1;
		}
	}
	if(typeof isEditable == 'undefined') {
		isEditable = false;
	}
	this.values = values;
	if( typeof diagramme.initialized == "undefined" ) { // When implementing the class for first time
		diagramme.prototype.trace = function() { // plots the diagram
			var chaine = "";
			for(var i=0;i<this.labels.length;i++){
				if(i==0){chaine = chaine + "M"}else{chaine=chaine+"L"};
				 chaine = chaine+(this.cx + (this.values[i]/(this.max-this.min))*this.radius*Math.cos(Math.PI/2+2*Math.PI*i/this.labels.length))+" "+(this.cy + (this.values[i]/(this.max-this.min))*this.radius* Math.sin(Math.PI/2+2*Math.PI*i/this.labels.length))+" ";
				 }
				 chaine = chaine + "z";
			//this.paper.path(chaine).attr(this.polygonAttr);
			this.paper.path(chaine).attr(this.polygonStrokeAttr);
			for(var i=0;i<this.labels.length;i++){
				this.markers[i] = this.paper.circle((this.cx + (this.values[i]/(this.max-this.min))*this.radius*Math.cos(Math.PI/2+2*Math.PI*i/this.labels.length)), (this.cy + (this.values[i]/(this.max-this.min))*this.radius* Math.sin(Math.PI/2+2*Math.PI*i/this.labels.length)), this.radiusButton).attr(this.markersAttr);
				this.markers[i].iter = i;
			}
		}
		diagramme.prototype.tracePolygon = function() { // plots the diagram
			var chaine = "";
			for(var i=0;i<this.labels.length;i++){
				if(i==0){chaine = chaine + "M"}else{chaine=chaine+"L"};
				 chaine = chaine+(this.cx + (this.values[i]/(this.max-this.min))*this.radius*Math.cos(Math.PI/2+2*Math.PI*i/this.labels.length))+" "+(this.cy + (this.values[i]/(this.max-this.min))*this.radius* Math.sin(Math.PI/2+2*Math.PI*i/this.labels.length))+" ";
				 }
				 chaine = chaine + "z";
			this.paper.path(chaine).attr(this.polygonAttr);
        }
		diagramme.prototype.exporter = function () { // returns data with json
			console.log(this.values);
			console.log(this.labelsId);
		}
		diagramme.prototype.importer = function (val) { // open data
			this.values = val;
			return this;
		}
		diagramme.prototype.update = function () {
    		this.paper.remove();
    		this.init();
		}
	    diagramme.prototype.polygon = function (n, r, cx, cy, params) { // plot a polygon centered in cx cy with n edges and a radius of r
	    	var chaine = "M"+(cx)+" "+(cy+r)+" ";
	    	for(var i=1;i<n;i++) {
		    	chaine = chaine + "L"+(cx+r*Math.cos(Math.PI/2+2*Math.PI*i/n))+" "+(cy+r*Math.sin(Math.PI/2+2*Math.PI*i/n))+" ";
	    	}
	    	chaine = chaine+"z";
	    	return this.paper.path(chaine).attr(params);
	    }
		diagramme.prototype.drawBG = function () {
			for(var i=0;i<5;i++) {
				this.polygon(this.labels.length, (this.radius * (5-i) / 5), this.cx, this.cy, {fill: this.chartColors[i], stroke: "none"});
			}
			this.tracePolygon();
			var offset = (Math.min(this.h,this.w)/2-this.radius)/2;
			for(var i=0;i<this.labels.length;i++){
				this.paper.text(this.cx + (this.radius + offset) * Math.cos(Math.PI/2+2*Math.PI*i/this.labels.length), this.cy + (this.radius + offset) * Math.sin(Math.PI/2+2*Math.PI*i/this.labels.length), this.labels[i]);
				this.arrows[i] = this.paper.path("M"+this.cx+" "+this.cy+" L"+(this.cx + this.radius * Math.cos(Math.PI/2+2*Math.PI*i/this.labels.length))+" "+(this.cy + this.radius * Math.sin(Math.PI/2+2*Math.PI*i/this.labels.length))).attr("stroke", "#000000");
				this.arrows[i].iter = i;
				this.arrowsAreas[i] = this.paper.path("M"+this.cx+" "+this.cy+" L"+(this.cx + (this.radius+offset) * Math.cos(Math.PI/2+2*Math.PI*i/this.labels.length))+" "+(this.cy + (this.radius+offset) * Math.sin(Math.PI/2+2*Math.PI*i/this.labels.length))).attr({"stroke-opacity": 0, "stroke-width":10});
				this.arrowsAreas[i].iter = i;
			}
		}
		diagramme.prototype.init = function () {
				this.paper = new Raphael(this.div, this.w, this.h);
				this.drawBG();
				this.trace();
				if(isEditable) {
					var that = this;
					for(var i=0;i<this.labels.length;i++){
						this.paper.set(this.markers[i]).drag(
								//move part
								function (dx, dy, x, y) {
									var x = event.pageX - $('#'+that.div).offset().left;
									var y = event.pageY - $('#'+that.div).offset().top;
									var r = ((that.cy-y)*(-that.radius*Math.sin(Math.PI/2+2*Math.PI*this.iter/that.labels.length))-(that.cx-x)*(that.radius*Math.cos(Math.PI/2+2*Math.PI*this.iter/that.labels.length)))/((that.radius)^2);
									if (r<0){r=0;}
									if (r>that.radius){r=that.radius;}
									this.attr({
										cx: that.cx + (Math.cos(Math.PI/2+2*Math.PI*this.iter/that.labels.length))*r,
										cy: that.cy + (Math.sin(Math.PI/2+2*Math.PI*this.iter/that.labels.length))*r
										});
									that.values[this.iter] = r/that.radius*(that.max-that.min);
								},
								//start part
								function () {
									this.ox = this.attr("cx");
									this.oy = this.attr("cy");
									this.animate({r: 2*that.radiusButton, opacity: .8}, 500, ">");
									},
								//up part
								function () {
									this.animate({r: that.radiusButton, opacity: 1}, 500, ">");
									that.paper.remove();
									that.exporter();
									that.init();
									}
								);
					    this.paper.set(this.arrowsAreas[i]).click(function(event) {
					            var mouseX = event.pageX - $('#'+that.div).offset().left;
					            var mouseY = event.pageY - $('#'+that.div).offset().top;
					            var r = ((that.cy-mouseY)*(-that.radius*Math.sin(Math.PI/2+2*Math.PI*this.iter/that.labels.length))-(that.cx-mouseX)*(that.radius*Math.cos(Math.PI/2+2*Math.PI*this.iter/that.labels.length)))/((that.radius)^2);
									if (r<0){r=0;}
									if (r>that.radius){r=that.radius;}
									this.attr({
										cx: that.cx + (Math.cos(Math.PI/2+2*Math.PI*this.iter/that.labels.length))*r,
										cy: that.cy + (Math.sin(Math.PI/2+2*Math.PI*this.iter/that.labels.length))*r
										});
									that.values[this.iter] = r/that.radius*(that.max-that.min);
									that.paper.remove();
									that.exporter();
									that.init();
	 				        }
					    );
					}
				}
		}
		diagramme.initialized = true;
	}
}
