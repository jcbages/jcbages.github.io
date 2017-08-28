// historic commands array
historicCommands = [];

// navigation commands
navigationCommands = ['home', 'about-me', 'projects', 'resume'];

// help response string
HELP_RESPONSE = [
	'navigation commands:',
	'&nbsp;&nbsp;home',
	'&nbsp;&nbsp;about-me',
	'&nbsp;&nbsp;projects',
	'&nbsp;&nbsp;resume'
];

// focus input when terminal is clicked
function focusInputOnTerminal() {
	$('#terminal').on('click', function () {
		$('input').focus();
	});
}

// scroll to given id
function scrollToView(id) {
	var view = $('#' + id);
	$('html, body').animate({scrollTop: view.offset().top-41}, 750);
}

// handle commands when enter is pressed
function handleCommand(command) {
	if (command === 'help') {
		return HELP_RESPONSE;
	} else if (navigationCommands.indexOf(command) !== -1) {
		scrollToView(command);
	} else if (command.length === 0) {
		return ' ';
	} else {
		return command + ': command not found';
	}
}

// clean historic commands if max height was reached
function cleanHistoricCommands() {
	// get max allowed items with current height
	var fontHeight = 23;
	var otherLines = 6;
	var maxNumber = window.innerHeight / fontHeight - otherLines;

	// clean historic array if there are more items
	while (historicCommands.length >= maxNumber) {
		historicCommands.splice(0, 1);
	}
}

// refresh historic view
function refreshHistoricView() {
	var history = '';
	for (var i = 0; i < historicCommands.length; i++) {
		history += '<p class="terminal-line">' + historicCommands[i] + '</p>';
	}
	$('#terminal-history').html(history);
}

// prepare input to answer when enter is clicked
function handleEnterKey() {
	$(document).keypress(function (e) {
		// ignore non-enter keys & non-focus input
		if (e.which !== 13) return;

		var input = $('#terminal input');
		if (!input.is(':focus')) return;

		// get command of the input & add it to historic array
		var command = input.val().trim();
		historicCommands.push('$&nbsp;' + command); // preppend $ sign 'cause its nice :)
		
		// clean input
		input.val('');

		// handle command appropriately & get answer, if not answer (best case), append nav msg
		var answer = handleCommand(command) || 'navigating to ' + command;
		if (typeof answer === 'string') {
			if (answer !== ' ') {
				historicCommands.push(answer);
			}
		} else {
			for (var i = 0; i < answer.length; i++) {
				historicCommands.push(answer[i]);
			}
		}

		// clean historic if max height was reached
		cleanHistoricCommands();
		
		// refresh historic view
		refreshHistoricView();
	});
}

// resize actions
function handleResize() {
	$(window).on('resize', function () {
		// clean historic commands & refresh view
		cleanHistoricCommands();
		refreshHistoricView();
	});
}

// perform actions when ready
$(window).ready(function() {
	focusInputOnTerminal();
	handleEnterKey();
	handleResize();
});
