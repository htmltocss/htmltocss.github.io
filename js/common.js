$(function() {	
	'use strict';

	$(".e-generate-css").click(function() {				
		var htmlEditor = ace.edit("html-editor");
		var cssEditor = ace.edit("css-editor");		
		var strHtml = htmlEditor.session.getValue();
		// get updates from input form and put it 
		// into global variable
		updateSettings();		

		var cssResult = cssRecurse($(strHtml));
		// remove first-last new lines
		cssResult = cssResult.trim();				
		cssEditor.session.setValue(cssResult);	

		// refresh css status to "Ready for Coping"
		$("#e-copy").addClass('btn-danger');
		return false;
	});

	$(".e-generate-sass").click(function() {
		var htmlEditor = ace.edit("html-editor");
		var cssEditor = ace.edit("css-editor");		
		var strHtml = htmlEditor.session.getValue();		
		// get updates from input form and put it 
		// into global variable
		updateSettings();

		var sassResult = '';
		/*if (settings.rawTags == 'show_all') {
			sassResult = sassRecurse($(strHtml));	
		} else if (settings.rawTags == 'remove_all') {
			
		}*/

		sassResult = sassRecurse($(strHtml));			
		// remove first-last new lines
		sassResult = sassResult.trim();
		sassResult = sassResult.replace(/[\n]{3}/g,'\n\n');
		
		$('#e-css_input').val(sassResult);				
		cssEditor.session.setValue(sassResult);		

		// refresh css status to "Ready for Coping"
		$("#e-copy").addClass('btn-danger');
		return false;
	});	

	$(".e-reset").click(function() {
		var htmlEditor = ace.edit("html-editor");
		var cssEditor = ace.edit("css-editor");
		htmlEditor.session.setValue('');
		htmlEditor.focus();
		cssEditor.session.setValue('');
		updateExclusionsFields();
		return false;
	});	

	$("#e-paste").click(function() {
		var htmlEditor = ace.edit("html-editor");
		htmlEditor.selectAll();
		htmlEditor.focus();
		return false;
	});

	$("#e-update-excluded-fields").click(function() {
		updateExclusionsFields();
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

		// Editor - Редактор : Свои API
		// Session - Сессия : Cвои API	 
		var text = '<div><a id="ssss" class="fff ccc lll" href="#">aaa</a></div>';
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
   			$('#excluded_classes').chosen({allow_single_deselect:true});
   			$('#excluded_ids').chosen({allow_single_deselect:true});
   		}, 10);

	    var htmlEditor = ace.edit("html-editor");

	    htmlEditor.on('paste', function() {	    	
	    	setTimeout(function() {
	    		updateExclusionsFields();			
	    	}, 50);
	    });

		htmlEditor.session.setValue(text);
		updateExcludedClasses();
		updateExcludedIds();
	    htmlEditor.setTheme("ace/theme/chrome");
	    htmlEditor.getSession().setMode("ace/mode/html");
	    
	    htmlEditor.getSession().setTabSize(2);
	    htmlEditor.selectAll();
		htmlEditor.focus();


	    var cssEditor = ace.edit("css-editor");
	    cssEditor.setTheme("ace/theme/chrome");		        
	    cssEditor.getSession().setTabSize(2);
	    cssEditor.getSession().setMode("ace/mode/scss");
	}	

	//
	init();
	
});