$(function() {	
	'use strict';

	var timer = undefined;

	$(".e-generate-css, .e-generate-sass").click(function() {								
		$('.e-css-sass .btn').removeClass('active');
		$(this).addClass('active');

		generateStyles();

		// refresh css status to "Ready for Coping"		
		$("#e-copy").addClass('btn-danger');

		return false;
	});	
	
	$('input[type=radio]').change(function() {
	 	generateStyles();	 	
	 });
	
	$(".e-format-html").click(function() {
		var htmlEditor = ace.edit("html-editor");
		var code = htmlEditor.session.getValue();
		$('.html-status').text('Tabs updating...'); 
		
		cleanHTML(code);	
		elementBlink($('#html-editor'));

		$('.html-status').text('Tabs updated'); 

		return false;
	});		

	$("#e-select-all").click(function() {
		var htmlEditor = ace.edit("html-editor");
		htmlEditor.selectAll();
		htmlEditor.focus();

		return false;
	});		

	$(".e-generate-base").click(function() {
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

		var activeBtn = $('.e-css-sass .active');

		// FORM, INPUTS present
		var formIndex = $.inArray(formTag, tags);
		if (formIndex !== -1) {
			// remove item from array
			tags.splice(formIndex, 1);			
								
			var inputCurrentTags = $.arrayIntersect(inputTags, tags);

			// start form selector
			formSelector = formTag + ' { \n\n';
			// rules of open-closing brackets are different for css and scss
			formSelector += activeBtn.hasClass('e-generate-sass') ? '' : '}\n\n';
			// go through all presented Input tags
			for (var i=0; i<inputCurrentTags.length; i++) {
				var inputIndex = $.inArray(inputCurrentTags[i], tags);
				//if (inputIndex !== -1) {
					tags.splice(inputIndex, 1);
					if (activeBtn.hasClass('e-generate-sass')) {
						formSelector += '\t' + inputCurrentTags[i] + ' { \n\n\t}';	
						formSelector += (i == inputCurrentTags.length - 1) ? '\n' : '\n\n';
					} else {
						formSelector += formTag + ' ' + inputCurrentTags[i] + ' { \n\n}';
						formSelector += (i == inputCurrentTags.length - 1) ? '\n' : '\n\n';
					}					
				//}					
			}				
			formSelector += activeBtn.hasClass('e-generate-sass') ? '}\n\n' : '\n';
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
			listSelector += activeBtn.hasClass('e-generate-sass') ? '' : '}\n\n';			
			if (activeBtn.hasClass('e-generate-sass')) {
				listSelector += '\tli { \n\n\t}\n';	
			} else {
				listSelector += listTag + ' li { \n\n}\n\n';
			}
			listSelector += activeBtn.hasClass('e-generate-sass') ? '}\n\n' : '';
		}

		// TABLE present
		var tableIndex = $.inArray(tableTag, tags);
		if (tableIndex !== -1) {
			// remove item from array
			tags.splice(tableIndex, 1);			

			// common piece for css/scss
			tableSelector = tableTag + ' { \n\n';
			// rules of open-closing brackets are different for css and scss
			tableSelector += activeBtn.hasClass('e-generate-sass') ? '' : '}\n\n';			
			if (activeBtn.hasClass('e-generate-sass')) {
				tableSelector += '\ttr { \n\n';
				tableSelector += '\t\tth { \n\n\t\t}\n\n';
				tableSelector += '\t\ttd { \n\n\t\t}\n';
				tableSelector += '\t}\n';	
			} else {
				tableSelector += tableTag + ' tr { \n\n}\n\n';
				tableSelector += tableTag + ' tr th, table tr td { \n\n}\n\n';
			}
			tableSelector += activeBtn.hasClass('e-generate-sass') ? '}\n\n' : '';
		}
		var stylesStr = '';
		if (tags.length > 0) {
			stylesStr = tags.join(' { \n\n}\n\n') + ' { \n\n}\n\n';
		}
		stylesStr += formSelector + listSelector + tableSelector;
		// clean space defects
		stylesStr = stylesStr.replace(/[\n]{3}/g,'\n\n');

		cssEditor.session.setValue(stylesStr);

		elementBlink($('#css-editor'));

		return false;
	});		 

	$('#bookmarkme').click(function(){
        alert('Press ' + (navigator.userAgent.toLowerCase().indexOf('mac') != - 1 ? 'Command/Cmd' : 'CTRL') + ' + D to bookmark this Generator.');
        return false;
    }); 

	$("#e-copy").zclip({ 
		path: '/js/lib/zeroclipboard/ZeroClipboard.swf', 
		copy: function() {
			var cssEditor = ace.edit("css-editor");
			return cssEditor.session.getValue();
		},
		afterCopy: function() { 
			$("#e-copy").removeClass('btn-danger'); 
			var cssEditor = ace.edit("css-editor");
			cssEditor.selectAll();
			cssEditor.focus();
		}
	});	

	function init() {
		var htmlEditor = ace.edit("html-editor");
		var cssEditor = ace.edit("css-editor");		
		
		timer = $.timer(function() {			
        	updateExclusionsFields();
        	generateStyles();
        	elementBlink($('.chosen-container'));
        	$('.html-status').text('Styles updated');
        	timer.stop();
        }); 
        timer.set({ time : 1000, autostart : false });
        timer.stop();
		             

		// Editor - Редактор : Свои API
		// Session - Сессия : Cвои API	 
		var text = '<div class="parent"><label>Title</label><div><a id="ssss" class="fff ccc lll" href="#">aaa</a></div></div>';		
		//var text = '<div class="   first my-class last" id="my-id"><a id="ssss" class="fff ccc lll" href="#">aaa</a></div>\n<div class="first my-class-2 center-1 center-2 last-2">\n\tHello\n</div>';
		/*+'<select size="3" multiple name="hero[]">'
    	+'<option disabled>Choose your hero</option>'
    	+'<option value="dragon">Dragon</option>'
    	+'<option selected value="gena">Gena</option>'
    	+'<option value="zombie">Zombie</option>'
   		+'</select>';*/
   		//updateExcludedClasses();
   		//updateExcludedIds();   		


   		setTimeout(function() {
   			$('#excluded_classes').chosen({ allow_single_deselect:true });   			
   			$('#excluded_ids').chosen({ allow_single_deselect:true });
   			$('#excluded_tags').chosen({ allow_single_deselect:true });
   			// update Styles field after switching between "Chosen" fields
   			$('#excluded_classes, #excluded_ids, #excluded_tags').chosen().change(function() { 
   				generateStyles();    				
   			});
   		}, 10);

	    var htmlEditor = ace.edit("html-editor");



	    htmlEditor.on('paste', function() {	    	
	    	//generateStyles();
	    });
	    htmlEditor.on('input', function() {	
	    	$('.html-status').text('Updating styles...');    	
	    	if (timer.isActive) {
				timer.stop();
				timer.play(true);			
			} else {					
		        timer.play();
		    }  
	    });
		htmlEditor.session.setValue(text);
		//updateExcludedClasses();
		//updateExcludedIds();
		updateExclusionsFields();
	    htmlEditor.setTheme("ace/theme/chrome");
	    htmlEditor.getSession().setMode("ace/mode/html");
	    
	    htmlEditor.getSession().setTabSize(2);
	    htmlEditor.selectAll();
		htmlEditor.focus();


	    var cssEditor = ace.edit("css-editor");
	    cssEditor.setTheme("ace/theme/chrome");		        
	    cssEditor.getSession().setTabSize(2);
	    cssEditor.getSession().setMode("ace/mode/scss");

	    //generateStyles();
	}	

	//
	init();
	
});