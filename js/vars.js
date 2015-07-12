var settings = {
	classPriority: 'first',
	selectorPriority: 'class',
	filterForms: [],
	excludedClasses: [],
	excludedIds: [],
	excludedTags: [],	
	rawTags: 'show_all',
	tagNameVisibility: 'raw',
	formattedHTML: '',
	prepareToPaste: false
};

function updateSettings() {
	settings.tagNameVisibility = $('input[name=sel_tag_name]:checked', '.advanced-settings-form').val();
	settings.classPriority = $('input[name=class_order]:checked', '.advanced-settings-form').val();
	settings.selectorPriority = $('input[name=sel_priority]:checked', '.advanced-settings-form').val();
	
	var filterFormsVal = $('select#filter_forms').val();
	filterFormsVal = filterFormsVal != null ? filterFormsVal : [];
	settings.filterForms = filterFormsVal;

	var excludedClassesVal = $('select#excluded_classes', '.advanced-settings-form').val();
	excludedClassesVal = excludedClassesVal != null ? excludedClassesVal : [];
	settings.excludedClasses = excludedClassesVal;

	var excludedIdsVal = $('select#excluded_ids', '.advanced-settings-form').val();
	excludedIdsVal = excludedIdsVal != null ? excludedIdsVal : [];
	settings.excludedIds = excludedIdsVal;

	var excludedTagsVal = $('select#excluded_tags', '.advanced-settings-form').val();
	excludedTagsVal = excludedTagsVal != null ? excludedTagsVal : [];
	settings.excludedTags = excludedTagsVal;

	settings.rawTags = $('input[name=raw_tags]:checked', '.advanced-settings-form').val();
}

