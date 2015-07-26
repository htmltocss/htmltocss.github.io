$(function() {	
	'use strict';

	var timer = undefined;

	$(".e-generate-full, .e-generate-base").click(function() {								
		$('.e-modes .btn').removeClass('active');
		$(this).addClass('active');

		generateStyles();

		return false;
	});

	$(".e-generate-css, .e-generate-scss, .e-generate-sass").click(function() {								
		$('.e-css-sass .btn').removeClass('active');
		$(this).addClass('active');		

		var cssEditor = ace.edit("css-editor");
		if ($(this).hasClass('e-generate-css')) {
			cssEditor.getSession().setMode("ace/mode/css");
		} else if ($(this).hasClass('e-generate-scss')) {
			cssEditor.getSession().setMode("ace/mode/scss");
		} else if ($(this).hasClass('e-generate-sass')) {
			cssEditor.getSession().setMode("ace/mode/sass");
		}		

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
		setTimeout(function() {			
			htmlEditor.session.setValue(settings.formattedHTML);	
		}, 50);	

		elementBlink($('#html-editor'));

		$('.html-status').text('Tabs updated'); 

		return false;
	});		

	$("#e-select-all").click(function() {
		var htmlEditor = ace.edit("html-editor");
		htmlEditor.selectAll();
		htmlEditor.focus();
		settings.prepareToPaste = true;

		//getTagList('form');

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
        	updateSettingsFields();
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
		cleanHTML(text);
		
		
		setTimeout(function() {			
			htmlEditor.session.setValue(settings.formattedHTML);

			$("#e-select-all").trigger('click');	
		}, 10);			

   		setTimeout(function() {
   			$('#excluded_classes').chosen({ allow_single_deselect:true });   			
   			$('#excluded_ids').chosen({ allow_single_deselect:true });
   			$('#excluded_tags').chosen({ allow_single_deselect:true });
   			//$('#filter_forms').chosen({ allow_single_deselect:true });
   			// update Styles field after switching between "Chosen" fields
   			$('#excluded_classes, #excluded_ids, #excluded_tags').chosen().change(function() { 
   				generateStyles();    				
   			});
   		}, 10);

	    var htmlEditor = ace.edit("html-editor");

	    htmlEditor.on('paste', function(e) {	
	    	setTimeout(function() {
	    		if (settings.prepareToPaste) {	    			
	    			$(".e-format-html").trigger('click');
	    			settings.prepareToPaste = false;
	    		}
	    	}, 100);	    	
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
		
		updateSettingsFields();
	    
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