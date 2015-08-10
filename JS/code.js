pi = Math.PI;
steps = 4;
minL = 0.15; maxL = 0.85;
var colorObject = [];
tileSize = Math.min(200, Math.floor(0.8*$(window).width()/steps));
th = Math.random()/steps;
var colors = {}
$(document).ready(function() {
	toHTML = nextLevel(1, {min: 0, max: 1}, 0.7, {min: minL, max: maxL}, colorObject);
	$('#container').append(toHTML);
	var name = 'subcolor'.split('');
	titleHTML = '';
	for(i in name) {
		randomSeed = Math.floor(Math.random()*steps);
		c = colorObject[i%steps].sub[randomSeed].c;
		titleHTML += '<span style="color: '+c+';">'+name[i]+'</span>';
	}
	$('#title').html(titleHTML);
});
function nextLevel(level, hRange, s, lRange, myObj) {
	pos = equidistance[steps];
	toHTML = '';
	for(var i = 0; i < steps; i ++) {
		posI = pos[i][0]; posJ = pos[i][1];
		if(level == 1) {
			h = mod1(th+i/steps); l = 0.4;
		}
		else {
			h = hRange.min + (hRange.max-hRange.min)*posI;
			l = lRange.min + (lRange.max-lRange.min)*posJ;		
		}
		col = HSLtoRGB(h,s,l);
		hex = toHex(col);
		myObj[i] = {level: level, index: i, c: hex, sub: []};
		size = tileSize/Math.pow(steps, (level-1));
		toHTML += '<div class="cLevel'+level+'" style="width: '+Math.round(100/steps)+'%;">';
			toHTML += '<div class="color level'+level+'" style="background: '+hex+'; width: '+size+'px; height: '+size+'px;" title="s: '+s+', h: '+h+', l: '+l+'">&nbsp;</div>';
			if(level <= 2) {
				lMin = Math.max(minL, l-(maxL-minL)/level); lMax = Math.min(maxL, l+(maxL-minL)/level);
				hMin = Math.max(0, h-1/(2*Math.pow(steps,level))); hMax = Math.min(1, h+1/(2*Math.pow(steps,level)));
				toHTML += nextLevel(level+1, {min: hMin, max: hMax}, s, {min: lMin, max: lMax}, myObj[i].sub);
			}
		toHTML += '</div>';
	}
	return toHTML;
}
function mod1(nb) {
	if(nb > 1) return nb-1;
	return nb;
}