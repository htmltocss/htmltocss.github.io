

$(function() {				
	function sassRecurse($item) {  
		var result = '';
		var siblingTracker = [];
	    $item.each(function() { 	    	
	        var element = $(this);	        	       	        
	        // skip system tags (link, script, title etc)
	        if ($.inArray(element.tagNameLowerCase(), getSystemTags()) !== -1) {
	        	return '';
	        }	         
	        // get class, id or tag name of current element
	        var sassEl = getSassData(element);	        
	        // elements should not be repeated within same level
	        if ($.inArray(sassEl, siblingTracker) === -1) {
	        	// add current element to sibling tracker if it's not there so far
		        siblingTracker[siblingTracker.length] = sassEl;		
		        // get parents number to set indent per each element
		        var parentsCount = element.parents().length + 1;
		        var indent = Array(parentsCount).join('\t');		        
		        // if element has children - start resursion
		        if ( element.children().length > 0 ) {	        	
		        	result += '\n' + indent + sassEl + ' { \n' + sassRecurse(element.children()) + indent + '}\n';
		        } 
		        // empty element = text - skip it
		        else if (sassEl != '') {	        	
		        	result += '\n' + indent  + sassEl + ' { \n\n' + indent + '}\n';
		        }
		    }		    
	    });  

	    return result;  
	}
	
	function cssRecurse($item) {  
		var result = '';
		var siblingTracker = [];
	    $item.each(function() {  	        
	        var element = $(this);
	        // skip system tags (link, script, title etc)
	        if ($.inArray(element.tagNameLowerCase(), getSystemTags()) !== -1) {
	        	return '';
	        }
	        var cssEl = getCssData(element).trim();	  	        
	        indent = '';
	        // elements should not be repeated within same level
	        if ($.inArray(cssEl, siblingTracker) === -1) {
	        	// add current element to sibling tracker if it's not there so far
		        siblingTracker[siblingTracker.length] = cssEl;
		        
		        // if element has children - start resursion
		        if ( element.children().length > 0 ) {	        	
		        	result += cssEl + ' { \n\n' + indent + '}\n\n';
		        	result += cssRecurse(element.children());
		        } 
		        // empty element = text - skip it
		        else if (cssEl != '') {	        	
		        	result += indent  + cssEl + ' { \n\n' + indent + '}\n\n';
		        }		        
		    }		    
	    });  

	    return result;  
	} 

	function parseSassElement(element) {
		var selectorName = '';
		// get tag name
		tag = element.prop("tagName");
		// if element is not text...
		if (tag != undefined) {
			tag = tag.toLowerCase();
			var classLine = element.attr('class');
			var className = '';

			// Option: use first class if element has more than one
			// Updated: last class will be taken
			if (classLine) {
				classLine = classLine.trim();
				className = classLine.split(' ')[classLine.split(' ').length-1];
			}
			// Option: use all classes if element has more than one
			/*if (className) {
				className = className.replace(/ /g, '.');
			}*/

			selectorName = className ? '.' + className : '';
			// class is absent ?
			if (selectorName == '') {
				idName = element.attr('id');
				selectorName = idName ? '#' + idName : '';
			}
			// id is absent as well ?
			if (selectorName == '') {
				selectorName = tag;
			}
		}

		return selectorName;
	}

	function parseCssElement(element) {
		var selectorName = '';
		// get tag name
		tag = element.prop("tagName");
		// if element is not text...
		if (tag != undefined) {
			tag = tag.toLowerCase();
			var classLine = element.attr('class');
			var className = '';
			
			// Updated: last class will be taken
			if (classLine) {
				classLine = classLine.trim();
				className = classLine.split(' ')[classLine.split(' ').length-1];
			}
			// Option: use first class if element has more than one			
			//if (className) {
			//	className = className.split(' ')[0];
			//}
			// Option: use all classes if element has more than one
			/*if (className) {
				className = className.replace(/ /g, '.');
			}*/

			selectorName = className ? '.' + className : '';
			// class is absent ?
			if (selectorName == '') {
				idName = element.attr('id');
				selectorName = idName ? '#' + idName : '';
			}
			// id is absent as well ?
			if (selectorName == '') {
				selectorName = tag;
			}
		}

		return selectorName;
	}

	function parseParents(element) {
		return element.parents()
			.map(function() {					
				return parseCssElement($(this));
			})
			.get()
			.reverse()
			.join(" ");
	}

	function getSassData(element) {						
		var result = '';
		var selectorName = parseSassElement(element);		

		return selectorName;
	}

	function getCssData(element) {						
		var result = '';
		var selectorName = parseCssElement(element);
		if (selectorName != '') {
			var parentEls = parseParents(element);
			result = parentEls + ' ' + selectorName;
		}

		return result;
	}	

	/**
	 * get tag name by jQuery element
	 * @return {Tage name string or empty value '' if element is not a tag}
	 */
	jQuery.fn.tagNameLowerCase = function() {
		var el = this;
		var tag = this.prop("tagName");
		if (tag != undefined) {
        	tag = tag.toLowerCase();
        }
		return tag;
	}	

	function getSystemTags() {
		return ['head', 'script', 'title', 'meta', 'style', 'link'];
	}
	
	$(".e-generate-css").click(function() {		
		var htmlEditor = ace.edit("html-editor");
		var cssEditor = ace.edit("css-editor");		
		var strHtml = htmlEditor.session.getValue();
		
		var cssResult = cssRecurse($(strHtml));		

		// remove first-last new lines
		cssResult = cssResult.trim();		
		
		cssEditor.session.setValue(cssResult);	
	});

	$(".e-generate-sass").click(function() {
		var htmlEditor = ace.edit("html-editor");
		var cssEditor = ace.edit("css-editor");
		
		var strHtml = htmlEditor.session.getValue();
		
		var sassResult = sassRecurse($(strHtml));
		// remove first-last new lines
		sassResult = sassResult.trim();
		$('#e-css_input').val(sassResult);				
		cssEditor.session.setValue(sassResult);		
	});	

	$(".e-reset").click(function() {
		var htmlEditor = ace.edit("html-editor");
		var cssEditor = ace.edit("css-editor");
		htmlEditor.session.setValue('');
		cssEditor.session.setValue('');
	});

	var text = $('#html-editor').html();
    var htmlEditor = ace.edit("html-editor");
	htmlEditor.session.setValue(text);
    htmlEditor.setTheme("ace/theme/chrome");
    htmlEditor.getSession().setMode("ace/mode/html");
    var cssEditor = ace.edit("css-editor");
    cssEditor.setTheme("ace/theme/chrome");		        
    cssEditor.getSession().setMode("ace/mode/scss");
});