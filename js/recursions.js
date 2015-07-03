'use strict';

function classesRecurse($item) {  		
	var siblingTracker = [];	
	var classes = [];
	//console.log($item);
    $item.each(function() { 	    	
        var element = $(this);	        	       	        
        // skip system tags (link, script, title etc)
        if ($.inArray(element.tagNameLowerCase(), getSystemTags()) !== -1) {
        	return [];
        }	         
        
        // get class, id or tag name of current element        
        var classesStr = element.attr('class');
        if (classesStr != undefined && classesStr != '') {
        	classesStr = $.trim(classesStr);
        	var splitted = classesStr.split(/\s+/);
        	
        	if (!classes.length) {
        		classes = $.merge([], splitted);
        	} else {
        		classes = $.merge(classes, splitted);
        	}
        }
                
        // if element has children - start resursion	        
        if ( element.children().length > 0 ) {	
        	if (!classes.length) {
        		classes = $.merge([], classesRecurse(element.children()));
        	} else {
        		classes = $.merge(classes, classesRecurse(element.children()));	
        	}        	        	
        } 	        
	    
    });

    return classes;
}

function idsRecurse($item) {
	var siblingTracker = [];
	var ids = [];
	
    $item.each(function() {    	
        var element = $(this);
        // skip system tags (link, script, title etc)
        if ($.inArray(element.tagNameLowerCase(), getSystemTags()) !== -1) {
        	return [];
        }
        
        // get class, id or tag name of current element        
        var idsStr = element.attr('id');        

        if (idsStr != undefined && idsStr != '') {
        	idsStr = $.trim(idsStr);
        	var splitted = idsStr.split(/\s+/);
        	
        	if (!ids.length) {
        		ids = $.merge([], splitted);
        	} else {
        		ids = $.merge(ids, splitted);
        	}        	
        }
                
        // if element has children - start resursion	        
        if ( element.children().length > 0 ) {	
        	if (!ids.length) {
        		ids = $.merge([], idsRecurse(element.children()));
        	} else {
        		ids = $.merge(ids, idsRecurse(element.children()));	
        	}        	        	
        } 	        
	    
    });
	//console.log(ids);

    return ids;
}

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
	        // get no Raw parents number to set indent per each element	        
	        var parentsCount = 0;
	        // if RawTags = show_all - count all tags
	        if (settings.rawTags == 'show_all') {
	        	parentsCount = element.parents().length + 1;	        
	        } 
	        // otherwise - only non-raw Tags
	        else {	        	
		        parentsCount = element.noRawParentslength() + 1;	        
		        // if rawTags is in remove All state and tag is raw...
		        if (settings.rawTags == 'remove_all' && element.isRawTag()) {
		        	// remove and digging deep to find children..
		        	if (element.children().length > 0) {	        			        	
		        		return result += sassRecurse(element.children());
		        	} 
		        	// remove raw tag
		        	else {	        		
		        		return '';
		        	}	      
		        }	  
		    }
	        // indent = tab space
	        var indent = Array(parentsCount).join('\t');	        

	        if (element.children().length > 0) {		    	
		    	result += '\n\n' + indent + sassEl + ' { \n' + sassRecurse(element.children()) + '\n' + indent + '}';
		    } 
		    // empty element = text - skip it
		    else if (sassEl != '') {	        	
		    	result += '\n\n' + indent  + sassEl + ' { \n\n' + indent + '}';
		    }
	    }		    
    });  


	/*	
    // if tag is placeholder's type -- like 'select'
    if ($.inArray(element.tagNameLowerCase(), getPlaceholderTags()) !== -1) {
    	console.log('1ccc');
    	result += '\n' + indent + sassEl + ' { \n\n' + sassRecurse(element.children()) + indent + '}\n\n';	        
    } 
    // if element has children (or in some cases non-raw children) - start resursion
    else if (settings.rawTags == 'remove_all' && element.rawTailChildrenLength() == element.children().length) {
    	console.log('2ccc');
    	result += '\n' + indent + sassEl + ' { \n\n' + sassRecurse(element.children()) + indent + '}\n';	        	
    } 
    // default variant - element has children - dig into them 
    else if (element.children().length > 0) {	        	
    	console.log('3ccc');
    	result += '\n' + indent + sassEl + ' { \n' + sassRecurse(element.children()) + indent + '}\n';
    } 
    // empty element = text - skip it
    else if (sassEl != '') {	        	
    	result += '\n' + indent  + sassEl + ' { \n\n' + indent + '}\n';
    }
	*/

    return result;
}

/*
function sassRecurse($item) {  //sassNotRawRecurse	
	console.log('Any');
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
	        // indent = tab space
	        var indent = Array(parentsCount).join('\t');	        	        	        
	        // if tag is placeholder's type -- like 'select'
	        if ($.inArray(element.tagNameLowerCase(), getPlaceholderTags()) !== -1) {
	        	result += '\n' + indent + sassEl + ' { \n\n' + sassRecurse(element.children()) + indent + '}\n\n';
	        // if element has children - start resursion
	        } else if ( element.children().length > 0 ) {	        	
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
*/

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
        var indent = '';
        // elements should not be repeated within same level
        if ($.inArray(cssEl, siblingTracker) === -1) {
        	// add current element to sibling tracker if it's not there so far
	        siblingTracker[siblingTracker.length] = cssEl;

	        // if rawTags is in remove All state and tag is raw...
	        if (settings.rawTags == 'remove_all' && element.isRawTag()) {
	        	// remove and digging deep to find children..
	        	if (element.children().length > 0) {	        			        	
	        		return result += cssRecurse(element.children());
	        	} 
	        	// remove raw tag
	        	else {	        		
	        		return '';
	        	}	      
	        }
	        
	        if ( element.children().length > 0 ) {	        	
	        	result += cssEl + ' { \n\n}\n\n';
	        	result += cssRecurse(element.children());
	        } 
	        // empty element = text - skip it
	        else if (cssEl != '') {	        	
	        	result += cssEl + ' { \n\n}\n\n';
	        }		        
	    }		    
    });  

    return result;  
} 

function parseSassElement(element) {
	var selectorName = '';
	// get tag name
	var tag = element.prop("tagName");
	// if element is not text...
	if (tag != undefined) {
		tag = tag.toLowerCase();

		var classesLine = element.attr('class');
		// if 'class' attribute contain some data - diff 
		// classes with excluded classes
		if (classesLine !== undefined) {
			classesLine = classesLine.trim();
			var classesArray = classesLine.split(' ');
			// array_diff implementation in jQuery
			var difference = $.grep(classesArray,function(x) { return $.inArray(x, settings.excludedClasses) < 0} );
			classesLine = difference.join(' ');
			// save in element to be used for finding new Raw tags
			element.attr('class', classesLine);
		}		

		// if 'id' attribute contain some data - compare
		// id with excluded ids
		var id = element.attr('id');
		if (id !== undefined) {
			var id = id.trim();			
			if ($.inArray(id, settings.excludedIds) !== -1) {				
				id = '';
				// save in element to be used for finding new Raw tags
				element.attr('id', id);
			}			
		}	

		// check if element has any classes or id
		var hasClasses = (classesLine !== undefined && classesLine !== '');
		var hasId = element.attr('id') !== undefined && id !== '';			
		
		var selectorName = '';
		var selectorPrefix = '';
		// if Id priority check if element has Id - if No than use class selector
		if ((settings.selectorPriority == 'id' && hasId) || 
		// if tag has Id but don't have classes - use Id
			(!hasClasses && hasId)) {
			selectorName = element.attr('id');
			selectorPrefix = '#';

			return selectorPrefix + selectorName;			
		} else if (hasClasses) {
			selectorPrefix = '.';						
			// first class priority by default
			var classPriorityIndex = 0;						
			if (settings.classPriority == 'last') {
				// last index depending on input data
				classPriorityIndex = classesLine.split(' ').length - 1;
			}
			selectorName = classesLine.split(' ')[classPriorityIndex];			

			return selectorPrefix + selectorName;
		}  
		// use only tag for elements that has no classes or ids
		return tag;


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
	var tag = element.prop("tagName");
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
			return parseSassElement($(this)); // parseCssElement
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
	var selectorName = parseSassElement(element); // parseCssElement
	if (selectorName != '') {
		var parentEls = parseParents(element);
		result = parentEls + ' ' + selectorName;
	}

	return result;
}	

function getClassesFromHtml() {
	var htmlEditor = ace.edit("html-editor");
	var text = htmlEditor.session.getValue();
	var classes = classesRecurse($(text));
	$.unique(classes);

	return classes;
}

function getIdsFromHtml() {
	var htmlEditor = ace.edit("html-editor");
	var text = htmlEditor.session.getValue();
	var ids = idsRecurse($(text));
	$.unique(ids);

	return ids;
}

function updateExcludedClasses() {
	var items = getClassesFromHtml();
	var field_select = $('#excluded_classes');
	field_select.html('');
	$.each(items, function (i, className) {
	    field_select.append($('<option>', { 
	        value: className,
	        text : className 
	    }));
	});
}

function updateExcludedIds() {
	var items = getIdsFromHtml();	
	var field_select = $('#excluded_ids');
	field_select.html('');
	$.each(items, function (i, className) {
	    field_select.append($('<option>', { 
	        value: className,
	        text : className 
	    }));
	});
}

function updateExclusionsFields() {
	updateExcludedClasses();  
	updateExcludedIds();
	setTimeout(function() {
		$('#excluded_classes').trigger("chosen:updated");
		$('#excluded_ids').trigger("chosen:updated");
	}, 50);	
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

jQuery.fn.isRawTag = function() {
	var element = $(this);

	var classesLine = element.attr('class');
	// if 'class' attribute contain some data - diff 
	// classes with excluded classes
	/*if (classesLine !== undefined) {
		classesLine = classesLine.trim();
		var classesArray = classesLine.split(' ');
		// array_diff implementation in jQuery
		var difference = $.grep(classesArray,function(x) { return $.inArray(x, settings.excludedClasses) < 0} );
		classesLine = difference.join(' ');
		// save in element to be used for finding new Raw tags
		element.attr('class', classesLine);
	}	
	// if 'id' attribute contain some data - compare
	// id with excluded ids
	var id = element.attr('id');
	if (id !== undefined) {
		var id = id.trim();			
		if ($.inArray(id, settings.excludedIds) !== -1) {				
			id = '';
			// save in element to be used for finding new Raw tags
			element.attr('id', id);
		}			
	}*/

	if ((element.attr('class') === undefined || element.attr('class').trim() == '') &&
		(element.attr('id') === undefined || element.attr('id').trim() == '')) {
		return true;
	}

	return false;
}	

/*
 * Get number of No Raw Parents tags
 */
jQuery.fn.noRawParentslength = function() {
	var element = $(this);
	var parents = element.parents();
	var count = 0;
	$.each(parents, function(index, parent) {		
		if (!$(parent).isRawTag()) {
			count++;
		}
	});

	return count;
}

/*
 * Get number of No Raw Children tags
 */
jQuery.fn.rawTailChildrenLength = function() {
	var element = $(this);
	var children = element.children();
	var count = 0;
	$.each(children, function(index, child) {	
		console.log('r:');
		console.log($(child).isRawTag());
		console.log('ch:');
		console.log($(child).children().length);
		if ($(child).isRawTag() && !$(child).children().length) {
			count++;
		}
	});

	return count;
}

/**
 * List of tags that should be excluded from CSS
 */
function getSystemTags() {
	return ['head', 'script', 'title', 'meta', 'style', 'link', 'option'];
}

/**
 * List of tags that contains another tags that shouldn't be described in CSS
 * For example: select > option -- option tags isn't described in css (it's not make sense)
 */
function getPlaceholderTags() {
	return ['select'];
}

