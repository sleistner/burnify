// This file was generated by Dashcode from Apple Inc.
// DO NOT EDIT - This file is maintained by Dashcode.

if (!window.dashcode) {
    dashcode = new Object();
}

//
// setupParts(string)
// Uses the dashcodePartsSpec dictionary, declared in the automatically generated file setup.js to instantiate 
// all the parts in the project.
//
dashcode.setupParts = function () {
    if (setupParts.called) return;
    setupParts.called = true;
    var partsToGetFinishLoading = [];
    for (var id in dashcodePartSpecs) {
        if (id == '***end***') continue;
        var specDict = dashcodePartSpecs[id];
        var createFunc = window[specDict.creationFunction];
        var object = createFunc(id, specDict);
        if (object && object.finishLoading) {
            partsToGetFinishLoading[partsToGetFinishLoading.length] = object;
        }
    }
    // Call finishedLoading callbacks.
    for (i=0; i<partsToGetFinishLoading.length; i++) {
        partsToGetFinishLoading[i].finishLoading();
    }
}
window.addEventListener('load', dashcode.setupParts, false);

//
// getLocalizedString(string)
// Pulls a string out an array named localizedStrings.  Each language project directory in this widget
// contains a file named "localizedStrings.js", which, in turn, contains an array called localizedStrings.
// This method queries the array of the file of whichever language has highest precedence, according to
// your preference set in the language toolbar item
//
// string: the key to the array
//
dashcode.getLocalizedString = function (string) {
	try { string = localizedStrings[string] || string; } catch (e) {}
	return string;
}

//
// createInstancePreferenceKey(key)
// Returns a unique preference key that is based on a instance of an opened widget.
// The returned value can then be used in widget.setPreferenceForKey()
// and widget.preferenceForKey() so that the value that is set or retrieved is
// only for a particular opened widget.
//
// key: preference key
//
dashcode.createInstancePreferenceKey = function (key) {
	return widget.identifier + "-" + key;
}

//
// getElementHeight(mainElement)
// Get the height of a part even if it's hidden (by 'display: none').
//
// mainElement: Part element
//
dashcode.getElementHeight = function (mainElement) {
	var height = mainElement.offsetHeight;
	
	if (!height || height == 0) {
		height = getElementSize(mainElement).height;
	}
	
	return height;	
}

//
// getElementWidth(mainElement)
// Get the width of a part even if it's hidden (by 'display: none').
//
// mainElement: Part element
//
dashcode.getElementWidth = function (mainElement) {
	var width = mainElement.offsetWidth;
	
	if (!width || width == 0) {
		width = getElementSize(mainElement).width;
	}
	
	return width;	
}

//
// getElementSize(mainElement)
// Get the size of a part even if it's hidden (by 'display: none').
//
// mainElement: Part element
//
dashcode.getElementSize = function (mainElement) {
	var width = mainElement.offsetWidth;
	var height = mainElement.offsetHeight;

	if (!width || width == 0 || !height || height == 0) {
		var displayNoneElements = new Array();

		var parentNode = mainElement;
		while (parentNode && (parentNode != document)) {
			var displayValue;
			var style = document.defaultView.getComputedStyle(parentNode, null);
			if (style) {
				displayValue = style.getPropertyValue("display");
			} else {
				// for Tiger
				displayValue = parentNode.style.display;
			}

			if (displayValue != "block") {
				displayNoneElements.push({node:parentNode, display:parentNode.style.display});
				parentNode.style.display = "block";
			}
			parentNode = parentNode.parentNode;
		}

		if (!width || width == 0) width = mainElement.offsetWidth;
		if (!height || height == 0) height = mainElement.offsetHeight;

		for (var i=0; i<displayNoneElements.length; i++) {
			var element = displayNoneElements[i].node;
			element.style.display = displayNoneElements[i].display;
			// clean up
			if (element.getAttribute("style") == "") {
				element.removeAttribute("style");
			}
		}
	}

	return {width:width, height:height};
}

//
// cloneTemplateElement(element)
// Clone an element and initialize the parts it contains. The new element is simply returned and not added to the DOM.
//
// element: element to clone
//
dashcode.cloneTemplateElement = function (element, isTemplate) {
    // clone the node and its subtree
    var newElement = isTemplate ? element : element.cloneNode(true);
    var templateElements = new Object();
    this.processClonedTemplateElement(newElement, templateElements, isTemplate);
    newElement.object = {templateElements: templateElements};
    return newElement;
}

//
// processClonedTemplateElement(element, templateElements)
// Recursively process a newly cloned template element to remove IDs and initialize parts.
//
// element: element to process
// templateElements: list of references to template objects to populate
//
dashcode.processClonedTemplateElement = function (element, templateElements, isTemplate) {
    var children = element.childNodes;
    for (var f=0; f<children.length; f++) {
        arguments.callee(children[f], templateElements, isTemplate);
    }
    var originalID = element.id;
    if (originalID) {
        templateElements[originalID] = element;
        if (!isTemplate) { 
            element.removeAttribute("id");
            // if it's a 'part', initialize it
            var partSpec = dashcodePartSpecs[originalID];
            if (partSpec) {
                partSpec.originalID = originalID;
                var createFunc = window[partSpec.creationFunction];
                if (createFunc && createFunc instanceof Function) {
                    createFunc(element, partSpec);
                }
            }
        }
    }
}

// Old function names for backwards compatibility
var setupParts = dashcode.setupParts;
var getLocalizedString = dashcode.getLocalizedString;
var createInstancePreferenceKey = dashcode.createInstancePreferenceKey;
var getElementHeight = dashcode.getElementHeight;
var getElementWidth = dashcode.getElementWidth;
var getElementSize = dashcode.getElementSize;
