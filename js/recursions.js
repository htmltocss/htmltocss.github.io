'use strict';

function generateBaseStyles() {
	var htmlEditor = ace.edit("html-editor");
	var cssEditor = ace.edit("css-editor");
	var strHtml = htmlEditor.session.getValue();
	//var tags = baseTagsRecurse($(strHtml));		
	var tags = getTagsFromHtml();
	var formTag = 'form';
	var formSelector = '';
	var inputTags = [
					 'label',
					 'select',
					 'button',
					 'textarea',					 
					 'input[type=text]',					 
					 'input[type=password]',
					 'input[type=email]',
					 'input[type=checkbox]',
					 'input[type=submit]',
					 'input[type=radio]',
					 'input[type=hidden]'
					 ];
	var inputSelector = '';
	var listTag = 'ul';
	var listSelector = '';
	var tableTag = 'table';
	var tableSelector = '';				

	var activeBtn = ($('.e-css-sass .active').hasClass('e-generate-scss') 
		|| $('.e-css-sass .active').hasClass('e-generate-sass')) ? 'scss_sass' : 'css';	


	// FORM, INPUTS present
	var formIndex = $.inArray(formTag, tags);
	if (formIndex !== -1) {
		// remove item from array
		tags.splice(formIndex, 1);			
							
		var inputCurrentTags = $.arrayIntersect(inputTags, tags);

		// start form selector
		formSelector = formTag + ' { \n\n';
		// rules of open-closing brackets are different for css and scss
		formSelector += (activeBtn == 'scss_sass') ? '' : '}\n\n';
		// go through all presented Input tags
		for (var i=0; i<inputCurrentTags.length; i++) {
			var inputIndex = $.inArray(inputCurrentTags[i], tags);
			//if (inputIndex !== -1) {
				tags.splice(inputIndex, 1);
				if (activeBtn == 'scss_sass') {
					formSelector += '\t' + inputCurrentTags[i] + ' { \n\n\t}';	
					formSelector += (i == inputCurrentTags.length - 1) ? '\n' : '\n\n';
				} else {
					formSelector += formTag + ' ' + inputCurrentTags[i] + ' { \n\n}';
					formSelector += (i == inputCurrentTags.length - 1) ? '\n' : '\n\n';
				}					
			//}					
		}				
		formSelector += (activeBtn == 'scss_sass') ? '}\n\n' : '\n';
	}
	
	// UL LI present
	var listIndex = $.inArray(listTag, tags);
	if (listIndex !== -1) {
		// remove item from array
		tags.splice($.inArray('ul', tags), 1);			
		
		// check if OL tag exists...
		if ($.inArray('ol', tags) !== -1) {
			// add ol tag
			listTag += ', ol';
			tags.splice($.inArray('ol', tags), 1);
		}			
		// common piece for css/scss
		listSelector = listTag + ' { \n\n';
		// rules of open-closing brackets are different for css and scss
		listSelector += (activeBtn == 'scss_sass') ? '' : '}\n\n';			
		if (activeBtn == 'scss_sass') {
			listSelector += '\tli { \n\n\t}\n';	
		} else {
			listSelector += listTag + ' li { \n\n}\n\n';
		}
		listSelector += (activeBtn == 'scss_sass') ? '}\n\n' : '';
	}

	// TABLE present
	var tableIndex = $.inArray(tableTag, tags);
	if (tableIndex !== -1) {
		// remove item from array
		tags.splice(tableIndex, 1);			

		// common piece for css/scss
		tableSelector = tableTag + ' { \n\n';
		// rules of open-closing brackets are different for css and scss
		tableSelector += (activeBtn == 'scss_sass') ? '' : '}\n\n';			
		if (activeBtn == 'scss_sass') {
			tableSelector += '\ttr { \n\n';
			tableSelector += '\t\tth { \n\n\t\t}\n\n';
			tableSelector += '\t\ttd { \n\n\t\t}\n';
			tableSelector += '\t}\n';	
		} else {
			tableSelector += tableTag + ' tr { \n\n}\n\n';
			tableSelector += tableTag + ' tr th, table tr td { \n\n}\n\n';
		}
		tableSelector += (activeBtn == 'scss_sass') ? '}\n\n' : '';
	}
	var stylesStr = '';
	if (tags.length > 0) {
		stylesStr = tags.join(' { \n\n}\n\n') + ' { \n\n}\n\n';
	}
	stylesStr += formSelector + listSelector + tableSelector;
	// clean space defects
	stylesStr = stylesStr.replace(/[\n]{3}/g,'\n\n');

	if ($('.e-css-sass .active').hasClass('e-generate-sass')) {
		stylesStr = stylesStr.replace(/[\s]{1}\{ \n/g,'\n');
		//stylesStr = stylesStr.replace(/[\n\t]/g,'\n\n');
		stylesStr = stylesStr.replace(/[\n\n]\}/g,'');
		stylesStr = stylesStr.replace(/[\s]{3}\}/g,'');
		stylesStr = stylesStr.replace(/[\s]\}\s/g,'');
		//stylesStr = stylesStr.replace(/\n\n/g,'\n');
	}		

	cssEditor.session.setValue(stylesStr);

	elementBlink($('#css-editor'));
}

function generateFullStyles() {
	// get updates from input form and put it 
	// into global variable
	updateSettings();

	var htmlEditor = ace.edit("html-editor");
	var cssEditor = ace.edit("css-editor");

	var strHtml = htmlEditor.session.getValue();
	var result = '';
	var activeBtn = $('.e-css-sass .active');
	if (activeBtn.hasClass('e-generate-scss') || activeBtn.hasClass('e-generate-sass')) {
		//
		result = sassRecurse($(strHtml));
		result = result.trim();
		// clean space defects
		result = result.replace(/[\n]{3}/g,'\n\n');
	} else if (activeBtn.hasClass('e-generate-css')) {
		//
		result = cssRecurse($(strHtml));
		result = result.replace(/[  ]{2}/g,' ');
		result = result.trim();
	}	

	elementBlink($('#css-editor'));

	$('#e-css_input').val(result);				
	cssEditor.session.setValue(result);	
}

function generateStyles() {
	if ($('.e-modes .active').hasClass('e-generate-full')) {		
		generateFullStyles();
		$('input[type=radio]').prop('disabled', false);
		$('#excluded_classes').prop('disabled', false).trigger("chosen:updated");
		$('#excluded_ids').prop('disabled', false).trigger("chosen:updated");
	} else if ($('.e-modes .active').hasClass('e-generate-base')) {
		generateBaseStyles();
		$('input[type=radio]').prop('disabled', true);
		$('#excluded_classes').prop('disabled', true).trigger("chosen:updated");
		$('#excluded_ids').prop('disabled', true).trigger("chosen:updated");
		
	}
}

function baseTagsRecurse($item) {
	var tags = [];
	var siblingTracker = [];
    $item.each(function() {  	        
        var element = $(this);               


        if ($.inArray(element.tagNameLowerCase(), getSystemTags()) !== -1) {
        	return [];
        }

        var tagName = element.tagNameLowerCase();        
        if (tagName == 'input') {
        	tagName = tagName + '[type=' + element.attr('type') + ']';
        }

        if (tagName != undefined && tagName != '') {        	        	
        	if (!tags.length) {
        		tags = $.merge([], [tagName]);
        	} else {
        		tags = $.merge(tags, [tagName]);
        	}        	
        }
                
        // if element has children - start resursion	        
        if ( element.children().length > 0 ) {	
        	if (!tags.length) {
        		tags = $.merge([], baseTagsRecurse(element.children()));
        	} else {
        		tags = $.merge(tags, baseTagsRecurse(element.children()));	
        	}        	        	
        } 	    
        
	   	// ' { \n\n}\n\n';
    });  

    return tags;
}

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
        var sassEl = getSassData(element).trim();	        
        
        // elements should not be repeated within same level
        // sassEl == '' means empty selector (RawTags = RemoveAll)
        if ($.inArray(sassEl, siblingTracker) === -1 || sassEl == '') {

        	// add current element to sibling tracker if it's not there so far
	        siblingTracker[siblingTracker.length] = sassEl;		
	        // get no Raw parents number to set indent per each element	        
	        var parentsCount = 0;
	        	        

	        // if RawTags = show_all - count all tags	       
	        if (settings.rawTags == 'show_all') {
	        	// excluded tags setup in the form ??
	        	if ($('#excluded_tags').val() !== null) {
	        		parentsCount = element.noExcludedParentsLength() + 1;		        	
		        	if (element.isExcludedTag()) {
			        	if (element.children().length > 0 && 
			        		(element.tagNameLowerCase() != 'ul' &&
			        		 element.tagNameLowerCase() != 'table' )) {		        		
			        		return result += sassRecurse(element.children());
			        	} 
			        	// remove raw tag
			        	else {	        				        		
			        		return '';
			        	}
			        }
	        	} else {
	        		parentsCount = element.parents().length + 1;	        	
	        	}	        	
	        } 
	        // otherwise - only non-raw Tags
	        else {	        	
	        	if ($('#excluded_tags').val() !== null) {
	        		parentsCount = element.noRawExcludedParentsLength() + 1;		        	
		        	if (element.isExcludedTag() || element.isRawTag()) {		        		
			        	if (element.children().length > 0 && 
			        		(element.tagNameLowerCase() != 'ul' &&
			        		 element.tagNameLowerCase() != 'table' )) {		        		
			        		return result += sassRecurse(element.children());
			        	} 
			        	// remove raw tag
			        	else {	        				        		
			        		return '';
			        	}
			        }
	        	} else {

			        parentsCount = element.noRawParentsLength() + 1;        			       
			        // if rawTags is in remove All state and tag is raw...
			        if (element.isRawTag()) {
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
		    }

			var activeBtn = $('.e-css-sass .active');

			var openedCurlyBrace = '';
			var closedCurlyBrace = '';
			var closedSpaces = '';			
			if (activeBtn.hasClass('e-generate-scss')) {
				openedCurlyBrace = ' { \n';
				closedCurlyBrace = '}';
				closedSpaces = '\n';			
			}

	        // indent = tab space
	        var indent = Array(parentsCount).join('\t');	        

	        if (element.children().length > 0) {		    		        	
        		result += '\n\n' + indent + sassEl + openedCurlyBrace + sassRecurse(element.children()) + closedSpaces + indent + closedCurlyBrace;		    	
		    } 
		    // empty element = text - skip it
		    else if (sassEl != '') {			    	
		    	result += '\n\n' + indent  + sassEl + openedCurlyBrace + '\n' + indent + closedCurlyBrace;
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
        var indent = '';
        var parentsCount;
        // elements should not be repeated within same level
        // sassEl == '' means empty selector (RawTags = RemoveAll)
        if ($.inArray(cssEl, siblingTracker) === -1 || cssEl == '') {
        	// add current element to sibling tracker if it's not there so far
	        siblingTracker[siblingTracker.length] = cssEl;

	        // if RawTags = show_all - count all tags	       
	        if (settings.rawTags == 'show_all') {
	        	// excluded tags setup in the form ??
	        	if ($('#excluded_tags').val() !== null) {
	        		parentsCount = element.noExcludedParentsLength() + 1;		        	
		        	if (element.isExcludedTag()) {
			        	if (element.children().length > 0 && 
			        		(element.tagNameLowerCase() != 'ul' &&
			        		 element.tagNameLowerCase() != 'table' )) {		        		
			        		return result += cssRecurse(element.children());
			        	} 
			        	// remove raw tag
			        	else {	        				        		
			        		return '';
			        	}
			        }
	        	} else {
	        		parentsCount = element.parents().length + 1;	        	
	        	}	        	
	        } 
	        // otherwise - only non-raw Tags
	        else {	        	
	        	if ($('#excluded_tags').val() !== null) {
	        		parentsCount = element.noRawExcludedParentsLength() + 1;		        	
		        	if (element.isExcludedTag() || element.isRawTag()) {		        		
			        	if (element.children().length > 0 && 
			        		(element.tagNameLowerCase() != 'ul' &&
			        		 element.tagNameLowerCase() != 'table' )) {		        		
			        		return result += cssRecurse(element.children());
			        	} 
			        	// remove raw tag
			        	else {	        				        		
			        		return '';
			        	}
			        }
	        	} else {

			        parentsCount = element.noRawParentsLength() + 1;        			       
			        // if rawTags is in remove All state and tag is raw...
			        if (element.isRawTag()) {
			        	// remove and digging deep to find children..
			        	if (element.children().length > 0) {		        		
			        		return result += cssRecurse(element.children());
			        	} 
			        	// remove raw tag
			        	else {	        				        		
			        		return '';
			        	}	      
			        }	  
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

			// show tag name if visibility is sent correctly
			if (settings.tagNameVisibility == 'all' || 
				settings.tagNameVisibility == 'id') {
				return tag + selectorPrefix + selectorName;
			}
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

			// show tag name if visibility is sent correctly
			if (settings.tagNameVisibility == 'all' || 
				settings.tagNameVisibility == 'classes') {
				return tag + selectorPrefix + selectorName;
			}
			return selectorPrefix + selectorName;
		}

		// if element has no classes/id
		if (settings.rawTags == 'show_all') {
			// use only tag for elements that has no classes or ids
			return tag;
		}
	}

	return '';
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

function getTagList($tag) {
	var htmlEditor = ace.edit("html-editor");
	var text = htmlEditor.session.getValue();
	var container = $(text);
	var elements = [];
	var index = 1;
	container.find($tag).each(function() {
		var item = $(this);
		if (item.attr('id') != undefined) {
			elements.push('#' + item.attr('id'));
		} else if (item.attr('class')) {
			elements.push('#' + item.attr('class').split(' ')[0]);
		} else {
			index++;
		}
	});
}

function getTagsFromHtml() {
	var htmlEditor = ace.edit("html-editor");
	var text = htmlEditor.session.getValue();
	var tags = baseTagsRecurse($(text));
	$.unique(tags);
	tags.sort();	

	//tags.splice($.inArray('li', tags), 1);
	var excludedBaseTags = ['li', 'tr', 'th', 'td', 'thead', 'tbody', 'tfoot'];
	var excludedTagsFieldValue = $('#excluded_tags').val();
	if (excludedTagsFieldValue !== null) {
		excludedBaseTags = $.merge(excludedTagsFieldValue, excludedBaseTags);
	}
	
	for (var i=0; i < excludedBaseTags.length; i++) {
		if ($.inArray(excludedBaseTags[i], tags) !== -1) {
			tags.splice($.inArray(excludedBaseTags[i], tags), 1);
		}
	}
		
	return tags;
}

function updateExcludedClasses() {
	var items = getClassesFromHtml();
	var field_select = $('#excluded_classes');	
	var selected_items = field_select.val();
		
	field_select.html('');
	$.each(items, function (i, className) {
	    // don't need to clean classes that are 
	    // present in html after editing
	    if ($.inArray(className, selected_items) !== -1) {
	    	field_select.append($('<option>', { 
		        value: className,
		        text : className,
		        selected : 'selected'
		    }));	
	    } else {
	    	field_select.append($('<option>', { 
		        value: className,
		        text : className 
		    }));	
	    }
	    
	});
}

function updateExcludedIds() {
	var items = getIdsFromHtml();	
	var field_select = $('#excluded_ids');
	var selected_items = field_select.val();

	field_select.html('');
	$.each(items, function (i, className) {
		if ($.inArray(className, selected_items) !== -1) {
			field_select.append($('<option>', { 
		        value: className,
		        text : className,
		        selected : 'selected'
		    }));
		} else {
			field_select.append($('<option>', { 
		        value: className,
		        text : className 
		    }));
		}	    
	});
}

function updateExcludedTags() {
	var items = getTagsFromHtml(true);	
	var field_select = $('#excluded_tags');
	var selected_items = field_select.val();

	field_select.html('');
	$.each(items, function (i, className) {
		if ($.inArray(className, selected_items) !== -1) {
			field_select.append($('<option>', { 
		        value: className,
		        text : className,
		        selected : 'selected'
		    }));
		} else {
			field_select.append($('<option>', { 
		        value: className,
		        text : className 
		    }));
		}	    
	});
}

function updateSettingsFields() {
	updateExcludedClasses();  
	updateExcludedIds();
	updateExcludedTags();
	setTimeout(function() {
		$('#excluded_classes').trigger("chosen:updated");
		$('#excluded_ids').trigger("chosen:updated");
		$('#excluded_tags').trigger("chosen:updated");
	}, 50);	
}

function elementBlink(element) {
	element.addClass('updated');
	setTimeout(function() {
		element.removeClass('updated');
	}, 450);
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
    	if (tag == 'input' && $(this).attr('type') != '') {
			tag = tag + '[type=' + $(this).attr('type') + ']';
		}
    }
	return tag;
}

jQuery.arrayIntersect = function(a, b) {
    return $.grep(a, function(i) {
        return $.inArray(i, b) > -1;
    });
};

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

jQuery.fn.isExcludedTag = function() {
	return $.inArray($(this).tagNameLowerCase(), $('#excluded_tags').val()) !== -1;
}

/*
 * Get number of No Raw Parents tags
 */
jQuery.fn.noRawParentsLength = function() {
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

jQuery.fn.noExcludedParentsLength = function() {
	var element = $(this);
	var parents = element.parents();
	var count = 0;	
	$.each(parents, function(index, parent) {			
		if (!$(parent).isExcludedTag()) {
			count++;
		}
	});	

	return count;
}

jQuery.fn.noRawExcludedParentsLength = function() {
	var element = $(this);
	var parents = element.parents();
	var count = 0;	
	$.each(parents, function(index, parent) {			
		if (!$(parent).isExcludedTag() && !$(parent).isRawTag()) {
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
		if ($(child).isRawTag() && !$(child).children().length) {
			count++;
		}
	});

	return count;
}

$.arrayIntersect = function(a, b)
{
    return $.grep(a, function(i)
    {
        return $.inArray(i, b) > -1;
    });
};

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

