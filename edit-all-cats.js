$j(document).ready(function() {
	window.setTimeout(prepAllCats, 1000);
});

var sections = null;
var categoryA = null;
var mapId = null;
var routeDivInput = null;
var lapsInput = null;
var kiloInput = null;

var insideUpdate = false;
var insideRouteChange = false;

var debugLogging = false;

function prepAllCats() {
	var buttons = $j("button:contains(Edit category)");
	if (buttons.length == 0) {
		window.setTimeout(prepAllCats, 1000);
		return;
	}

	$j("label:contains(Event Description)").parent().attr('style', 'display:none');

	if (debugLogging) console.log('have ' + buttons.length + ' buttons');

	for (var ix = 0; ix < buttons.length; ++ix) {
		buttons[ix].click();
	}

	sections = $j("section.club-form-section");

	if (debugLogging) console.log('sections:', sections);

	categoryA = $j(sections).first().next();
	mapId = $j(categoryA).find("select[name=mapId]");
	if (debugLogging) console.log('mapId element:', mapId);
	mapId.change(function() {
		if (insideUpdate) {
			insideUpdate = false;
			return;
		}
		
		insideUpdate = true;

		updateSelects( 'mapId', this.value);
	});

	var routeDiv = $j(categoryA).find("div.route-select-area");
	routeDivInput = $j(routeDiv).find("input");
	if (debugLogging) console.log('route input', routeDivInput);
	routeDivInput.blur(function(evnt) {
		if (insideRouteChange == true) {
			insideRouteChange = false;
			return;
		}

		insideRouteChange = true;

		setTimeout(updateCourse, 1000);
	});

	durationTypeInputs = $j(categoryA).find("input[name=durationType]");
	durationTypeInputs.change(function() {
		if (debugLogging) console.log('input radio group', this, this.value, this.checked);

		updateDurationType(this.value, this.checked);
	});

	attachDurationEvents();

	// move publish to after category A
	var container = document.getElementsByClassName('club-form-container')[1];
	container.insertBefore(container.lastChild, container.childNodes[2]);
}

function attachDurationEvents() {
	lapsInput = $j(categoryA).find("input[name=laps]");
	lapsInput.change(function() {
		if (insideUpdate) {
			insideUpdate = false;
			return;
		}

		insideUpdate = true;

		updateLaps(this.value);
	});

	kiloInput = $j(categoryA).find("input[name=distanceInMeters]");
	if (debugLogging) console.log(kiloInput);
	kiloInput.change(function() {
		if (insideUpdate) {
			insideUpdate = false;
			return;
		}

		insideUpdate = true;

		if (debugLogging) console.log('kilo', this, this.value);
		updateDistance(this.value);
	});
}

function updateDurationType(val, checked)
{
	for (var ix = 1; ix < sections.length; ++ix) {
		var section = sections[ix];

		var input = $j(section).find(`input[name=durationType][value=${val}]`);
		var evnt = document.createEvent('HTMLEvents');
		evnt.initEvent('click', true, true);
		input[0].checked = checked;
		input[0].dispatchEvent(evnt);
	}

	attachDurationEvents();
}

function updateCourse()
{
	var courseName = routeDivInput[0].placeholder;

	if (debugLogging) console.log('Course Name', courseName);

	var routes = $j(sections).find("div.route-select-area");
	var routeInputs = $j(routes).find("input");

	for (var ix = 0; ix < routeInputs.length; ++ix) {
		var input = routeInputs[ix];

		if (debugLogging) console.log('input', input);

		var evnt = document.createEvent('HTMLEvents');
		evnt.initEvent('change', true, true);
		input.placeholder = courseName;
		input.dispatchEvent(evnt);
	}

	insideRouteChange = false;
}

function updateSelects(name, newValue)
{
	if (debugLogging) console.log('new selected value:', newValue);
	for (var ix = 1; ix < sections.length; ++ix) {
		var section = sections[ix];
		if (debugLogging) console.log('section:', section);

		var select = $j(section).find(`select[name=${name}]`);
		if (debugLogging) console.log('select:', select[0]);
		var evnt = document.createEvent('HTMLEvents');
		evnt.initEvent('change', true, true);
		select[0].value = newValue;
		select[0].dispatchEvent(evnt);
	}
}

function updateLaps(newValue)
{
	for (var ix = 1; ix < sections.length; ++ix) {
		var section = sections[ix];

		var input = $j(section).find("input[name=laps]");
		var evnt = document.createEvent('HTMLEvents');
		evnt.initEvent('change', true, true);
		input[0].value = newValue;
		input[0].dispatchEvent(evnt);
	}
}

function updateDistance(newValue)
{
	for (var ix = 1; ix < sections.length; ++ix) {
		var section = sections[ix];

		var input = $j(section).find("input[name=distanceInMeters]");
		var evnt = document.createEvent('HTMLEvents');
		evnt.initEvent('change', true, true);
		input[0].value = newValue;
		input[0].dispatchEvent(evnt);
	}
}