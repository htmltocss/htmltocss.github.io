$(function() {	
	'use strict';

	var timer = undefined;

	$(".e-generate-full, .e-generate-base").click(function() {								
		$('.e-modes .btn').removeClass('active');
		$(this).addClass('active');

		generateStyles();

		return false;
	});

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
		generateBaseStyles();

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