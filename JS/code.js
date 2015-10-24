minL = 0.1; maxL = 0.9;
var colorObject = [];
th = 0; svg=0;
steps = 0, maxLvl = 0;
saturation = 0.5;
windowHeight = 0, windowWidth = 0;
$(document).ready(function() {
	windowHeight = $(document).height()+1;
	windowWidth = $(window).width()-17;
	svg = d3.select("body").append("svg").attr("width", windowWidth).attr("height", windowHeight);
	$('body').append('<div id="jsonObject"><textarea></textarea></div>');
	restart();
	$('input').change(function() {restart();});
});
function restart() {
	colorObject = [];
	osteps = steps; omaxLvl = maxLvl;
	steps = + $('#step').val();
	maxLvl = + $('#level').val();
	saturation = (+ $('#saturation').val())/10;
	if(steps!=osteps||omaxLvl!=maxLvl) th = Math.random(); // reseed
	$('#step').val(steps); $('#level').val(maxLvl);
	
	nextLevel(1, {min: 0, max: 1}, saturation, {min: minL, max: maxL}, colorObject);

	$('#jsonObject textarea').val(JSON.stringify(colorObject));
	$('svg').empty();
	for(var i = 1; i <= maxLvl; i ++) loadPie(i, maxLvl);
}
function loadPie(lvl, maxLvl) {
	data = buildLevelColorArray(lvl, [], colorObject);
	myRadius = radius(lvl); innerRadius = radius(lvl-1);
	if(lvl == maxLvl) myRadius = Math.max($(window).width(), $(window).height());
	var arc = d3.svg.arc().outerRadius(myRadius).innerRadius(innerRadius);
	pie = d3.layout.pie().sort(null).value(function(d) { return 1; });
	innerSvg = svg.append("g").attr('id', 'pie'+lvl).attr("transform", "translate(" + windowWidth/2 + "," + windowHeight/2 + ")");
	var g = innerSvg.selectAll(".arc").data(pie(data)).enter().append("g").attr('id', function(d) {return "clus"+d.data.color;}).attr('fill', function(d) {return "clus"+d.data.color;});
		g.attr("class", 'arc').append("path").attr("d", arc).style("fill", function(d) {return d.data.color;});
	// g.append('text').attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; }).text(function(d) {return "["+d.data.h+", "+d.data.s+", "+d.data.l+"]";});
}
function nextLevel(level, hRange, s, lRange, myObj) {
	pos = equidistance[steps];
	var hSize = hRange.max-hRange.min;
	shuffle(pos);
	for(var i = 0; i < steps; i ++) {
		posI = pos[i][0]; posJ = pos[i][1];
		h = hRange.min + hSize*(i+0.5)/steps;
		if(level == 1) {
			h = th+hRange.min + hSize*(i+0.5)/steps;
			l = Math.random()*0.5+0.3;
			hMin = th+hRange.min + i*hSize/steps; hMax = th+hRange.min + (i+1)*hSize/steps;
		}
		else {
			l = lRange.min + (lRange.max-lRange.min)*posJ;		
			hMin = hRange.min + i*hSize/steps; hMax = hRange.min + (i+1)*hSize/steps;
		}
		var s = 0.7 + 0.3*posI;
		col = HSLtoRGB(mod1(h),s,l);
		hex = toHex(col);
		myObj[i] = {level: level, c: hex, sub: []}; // , 'h': h, 's': s, 'l': l
		if(level < maxLvl) {
			lMin = minL; lMax = maxL;
			nextLevel(level+1, {min: hMin, max: hMax}, s, {min: lMin, max: lMax}, myObj[i].sub);
		}
	}
}
function openJson() {
	$('html, body').animate({
		scrollTop: $('#jsonObject').offset().top
	}, 500);
}
function radius(lvl) {
	return 0.1*Math.min($(window).width(), $(window).height())*lvl;
}
function buildLevelColorArray(lvl, objList, colorObject) {
	for(i in colorObject) {
		if(colorObject[i].level < lvl) objList = buildLevelColorArray(lvl, objList, colorObject[i].sub);
		else if(colorObject[i].level == lvl) objList.push({weight: 0, color: colorObject[i].c
			// ,h: Math.floor(100*colorObject[i].h),
			// s: Math.floor(100*colorObject[i].s),
			// l: Math.floor(100*colorObject[i].l)
		});
	}
	return objList;
}
function mod1(nb) {
	if(nb > 1) return nb-1;
	return nb;
}
function shuffle(o){
    for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
}