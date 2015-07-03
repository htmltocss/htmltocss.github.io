var settings = {
	classPriority: 'first',
	selectorPriority: 'class',
	excludedClasses: [],
	excludedIds: [],
	rawTags: 'show_all'
};

function updateSettings() {
	settings.classPriority = $('input[name=class_order]:checked', '.advanced-settings-form').val();
	settings.selectorPriority = $('input[name=sel_priority]:checked', '.advanced-settings-form').val();
	
	var excludedClassesVal = $('select#excluded_classes', '.advanced-settings-form').val();
	excludedClassesVal = excludedClassesVal != null ? excludedClassesVal : [];
	settings.excludedClasses = excludedClassesVal;

	var excludedIdsVal = $('select#excluded_ids', '.advanced-settings-form').val();
	excludedIdsVal = excludedIdsVal != null ? excludedIdsVal : [];
	settings.excludedIds = excludedIdsVal;

	settings.rawTags = $('input[name=raw_tags]:checked', '.advanced-settings-form').val();
}

