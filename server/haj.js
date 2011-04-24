var selectorChars = { '%': true, '#': true, '.': true },
	selectorRegExp = /([%#.])([^%#.]+)/g,
	nonContainerTags = { area: true, base: true, basefont: true, bgsound: true, br: true, col: true, command: true, embed: true, frame: true, hr: true, img: true, input: true, keygen: true, link: true, meta: true, param: true, source: true, track: true, wbr: true },
	newlineTags = { pre: true, textarea: true, listing: true },
	encodeHTML = (function(){
		var re = /[&\u00A0<>]/g,
			replacements = { '&': '&amp;', '\u00A0': '&nbsp;', '<': '&lt;', '>': '&gt;' };
		function replace(c){
			return replacements[c];
		}
		return function(s){
			return s.replace(re, replace);
		}
	})(),
	encodeAttribute = (function(){
		var re = /[&\u00A0"]/g,
			replacements = { '&': '&amp;', '\u00A0': '&nbsp;', '"': '&quot;' };
		function replace(c){
			return replacements[c];
		}
		return function(s){
			return s.replace(re, replace);
		}
	})();
function isPlainObject(object){
	return object && Object.prototype.toString.call(object) === '[object Object]';
}
function encodeHTML(string){
	string.replace()
}
function haj(template, flags){
	var i = (flags && flags.start || 0), selector = template[0], out = '';
	if (i === 0 && typeof selector === 'string' && selector.charAt(0) in selectorChars && selector.length > 1) {
		var tagName = 'div', attributes = {}, match;
		i++;
		if (template[1] && isPlainObject(template[1])) {
			var inAttributes = template[1];
			for (var key in inAttributes) {
				attributes[key] = inAttributes[key];
			}
			i++;
		}
		while ((match = selectorRegExp.exec(selector))) {
			switch(match[1]){
			case '%':
				tagName = match[2].toLowerCase();
				break;
			case '#':
				attributes.id = match[2];
				break;
			case '.':
				if (attributes['class']) {
					attributes['class'] += ' ' + match[2];
				} else {
					attributes['class'] = match[2];
				}
				break;
			}
		}
		out += '<' + tagName;
		for (var key in attributes) {
			out += ' ';
			out += encodeHTML(key);
			out += '="';
			out += encodeAttribute(attributes[key]);
			out += '"'
		}
		out += '>'
		if (!(tagName in nonContainerTags)) {
			if (tagName in newlineTags) {
				out += '\n';
			}
			out += (haj(template, { start: i }));
			out += '</';
			out += tagName;
			out += '>';
		}
		return out;
	}
	var element, length = template.length;
	while(i < length){
		element = template[i++];
		if (element !== null && element !== undefined) {
			out += Array.isArray(element) ? haj(element) : encodeHTML(element);
		}
	}
	return out;
}
module.exports = haj;
