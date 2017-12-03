var game = new Phaser.Game(_config.world_width, _config.world_height, Phaser.AUTO, '', { preload: preload, create: create, update: update, render: render });

var aircraft = [];
var speak_key = null;
var begun_listening = false;
var opened_chat = false;
var recognition = null
var chat = [' ', ' ', ' ', ' ', ' '];
var chat_text = '';
var landings = 0;
var landing_count = null;
var box = null;

function preload() {
	game.add.plugin(PhaserInput.Plugin);
	game.load.image('a90', 'assets/maps/a90.png');
	game.load.image('westflow', 'assets/maps/westflow.png');
	game.load.image('northflow', 'assets/maps/northflow.png');
	game.load.image('southflow', 'assets/maps/southflow.png');
	game.load.image('greenline', 'assets/greenline.png');
	
	/*for(var i = 0; i < 20; i++) {
		var nac = {};

		nac.actype = aircraft_types[parseInt(Math.random() * aircraft_types.length)];
		nac.type = nac.actype.type;
		nac.alt = parseInt(Math.random() * (aircraft_classes[nac.actype.weight].altitude.max - aircraft_classes[nac.actype.weight].altitude.min) + aircraft_classes[nac.actype.weight].altitude.min) * 1000;
		nac.speed = aircraft_classes[nac.actype.weight].speeds.cruize + parseInt(Math.random() * 40 + 20);
		nac.ifr = !(nac.alt < 10000 && Math.random() > .3);

		nac.x = Math.random() * _config.world_width - _config.offset.x;
		nac.y = Math.random() * _config.world_height - _config.offset.y;
		nac.hdg = Math.random() * 360;
		nac.dest_alt = 0;
		nac.dest_hdg = nac.hdg;
		nac.callsign = get_random_airline() + Math.floor(Math.random() * 89 + 10);
		nac.elements = {};
		nac.data_block = {};
		nac.last_positions = [[_config.world_width*2,_config.world_height*2],[_config.world_width*2,_config.world_height*2],[_config.world_width*2,_config.world_height*2],[_config.world_width*2,_config.world_height*2],[_config.world_width*2,_config.world_height*2]];
		nac.last_position_blips = [];
		nac.dest = 'KBOS';
		nac.show_datablock = true;
		nac.warning = false;

		aircraft.push(nac);
	}*/

	initializeAircraftPool();

	/*
	 * Load the speech recognition module.
	 */
	recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition || window.mozSpeechRecognition || window.msSpeechRecognition)();
	recognition.lang = 'en-US';
	recognition.interimResults = false;
	recognition.maxAlternatives = 5;

}

function create() {
	game.add.sprite(-70, -70, 'a90');
	game.add.sprite(-70, -70, 'southflow');
	game.add.sprite(-70, -70, 'westflow');

	box = game.add.inputField(10, _config.world_height - 50, {
		font: '12px Arial',
		fill: 'rgba(0, 255, 0, 0.7)',
		backgroundColor: 'rgba(255, 0, 0, 0.1)',
		width: 500,
		padding: 10,
		borderWidth: 1,
		borderColor: '#3e8033',
		borderRadius: 0,
		placeHolder: '...',
	});

	$(document).on('change', box, function(e) {
		
		var command_attempt = parseCommand(box.value);
		if(command_attempt === true) {
			// nothing
		} else if(command_attempt != false) {
			chat = chat.splice(1);
			chat.push(command_attempt);
		} else {
			var val = box.value.substr(0, 3) + ' ' + box.value.substr(3);
			chat = chat.splice(1);
			chat.push(val);
			parseATCInstruction(val);
		}
		
		box.setText('');
		opened_chat = false;
	});

	//game.add.text(0 + _config.offset.x, 0 + _config.offset.y, "x", { font: "30px Arial", fill: "rgba(0, 0, 255, 1)" });
	
	initializeTracks();
	
	chat_text = game.add.text(10, _config.world_height - 170, "", { font: "14px Arial", fill: "rgba(0, 255, 0, 1)" });
	landing_count = game.add.text(_config.world_width - 100, 10, "Landings: ", { font: "16px Arial", fill: "rgba(0, 255, 50, 1)" });
	
	speak_key = game.input.keyboard.addKey(Phaser.Keyboard.CONTROL);
	chat_key = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);

	chat = chat.splice(1);
	chat.push('Use /load <1-3> to begin.');
}

var tick = 0;
function update() {
	if(tick % (60 * 1) == 0) {

		for(var i = 0; i < aircraft.length; i++) {
			var ac = aircraft[i];

			/*
			 * Save current position of aircraft.
			 */
			if(tick % (60 * (4 * 1)) == 0) {
				ac.last_positions = ac.last_positions.splice(1);
				ac.last_positions.push([ac.x + _config.offset.x, ac.y + _config.offset.y]);
			}

			/*
			 * Draw the path of the aircraft.
			 */
			for(var j = 0; j < ac.last_positions.length; j++) {
				var p = ac.last_positions[j];
				ac.last_position_blips[j].position.x = p[0];
				ac.last_position_blips[j].position.y = p[1];
			}
			
			/*
			 * Calculate the delta of the aircraft
			 */
			//var d =  ac.speed / 50;
			var d = ac.speed * (0.0038 * 1);
			var dx = d * Math.cos(toRadians(ac.hdg - 90));	//2
			var dy = d * Math.sin(toRadians(ac.hdg - 90));	//0

			/*
			 * Calculate the altitude change
			 */
			if(ac.dest_alt != 0) {
				if(ac.dest_alt > ac.alt) {
					ac.alt += aircraft_classes[ac.actype.weight].cr;
				} else if(ac.dest_alt < ac.alt) {
					ac.alt -= aircraft_classes[ac.actype.weight].cr;
				}

				if(Math.abs(ac.dest_alt - ac.alt) < aircraft_classes[ac.actype.weight].cr + 50) {
					ac.alt = ac.dest_alt;
					ac.dest_alt = 0;
				}
			}

			/*
			 * Calculate the heading change
			 */
			if(ac.dest_hdg != ac.hdg) {
				var hdg_delta = (aircraft_classes[ac.actype.weight].tr - (ac.speed / 50));
				//console.log("Heading delta for " + ac.callsign + ": " + hdg_delta + " - HDG: " + ac.hdg + " | DHDG: " + ac.dest_hdg);
				if(ac.dest_hdg > ac.hdg) {
					ac.hdg += hdg_delta;
				} else if(ac.dest_hdg < ac.hdg) {
					ac.hdg -= hdg_delta;
				}

				if(Math.abs(ac.dest_hdg - ac.hdg) < aircraft_classes[ac.actype.weight].tr- (ac.speed / 50)) {
					ac.hdg = ac.dest_hdg;
				}
			}

			/*
			 * Calculate speed change due to wind variation 
			 */
			ac.speed += parseInt(Math.random() * 4 - 2);

			/*
			 * Update the aircraft's position
			 */
			ac.x += dx;
			ac.y += dy;

			/*
			 * Update datablock text 
			 */
			ac.data_block.speed.setText(pad(Math.floor(ac.speed), 3));

			if(ac.dest_alt != 0) {
				if(ac.dest_alt > ac.alt) {
					ac.data_block.alt.setText(pad(Math.floor(ac.alt/100), 3) + "↑" + pad(Math.floor(ac.dest_alt/100), 3));
				} else {
					ac.data_block.alt.setText(pad(Math.floor(ac.alt/100), 3) + "↓" + pad(Math.floor(ac.dest_alt/100), 3));
				}
			} else {
				ac.data_block.alt.setText(pad(Math.floor(ac.alt/100), 3));
			}
			

			/*
			 * Update aircraft blip's position
			 */
			if(ac.ifr) {
				ac.elements.blip.position.x = ac.x + _config.offset.x;
				ac.elements.blip.position.y = ac.y + _config.offset.y;

				ac.elements.blip_line.position.x = ac.x + _config.offset.x + 5;
				ac.elements.blip_line.position.y = ac.y + _config.offset.y + 15;
				ac.elements.blip_line.angle = ac.hdg - 180;
			} else {
				ac.elements.blip.position.x = ac.x + _config.offset.x;
				ac.elements.blip.position.y = ac.y + _config.offset.y + 10;
			}

			/*
			 * Update te position of the datablock group
			 */
			if(ac.show_datablock) {
				ac.data_block.group.position.x = ac.x + dx;
				ac.data_block.group.position.y = ac.y + dy;
			} else {
				ac.data_block.group.position.x = _config.world_width * 2;
				ac.data_block.group.position.y = _config.world_height * 2;
			}

			/*
			 * Update the little line between the aircraft and its datablock
			 */
			ac.data_block.dataline.setTo(ac.x + _config.offset.x + 12, ac.y + _config.offset.y + 12, ac.x + _config.offset.x + 35, ac.y + _config.offset.y - 10);

			/*
			 * Show collision circles
			 */
			ac.elements.collision_circle.setTo(ac.x + _config.offset.x + 2, ac.y + _config.offset.y + 13, 41.1);

			var found_collision = false;
			for(var j = 0; j < aircraft.length; j++) {
				if(i != j) {
					var abc = ac.elements.collision_circle.distance(aircraft[j].elements.collision_circle);
					//console.log(ac.callsign + '-' + aircraft[j].callsign + ": " + abc);
					if(abc < (5 * 13.7)) {
						found_collision = true;
					}
				}
			}

			var landed = false;
			
			// KBOS
			if(Phaser.Math.distance(ac.x, ac.y, -71, -61) < 28 && ac.alt < 1000 && ac.dest == 'KBOS') {
				landed = true;
			}

			if(landed) {
				ac.x = _config.world_width * 2;
				ac.y = _config.world_height * 2;
				ac.hdg = 0;
				ac.dest_hdg = 0;
				ac.alt = 0;
				ac.dest_alt = 0;
				ac.speed = 0;
				ac.used = false;
				landings ++;
			}

			ac.warning = found_collision;
		}
	}

	chat_text.setText(chat.join('\n'));
	landing_count.setText("Landings: " + landings);

	if(speak_key.isDown && !begun_listening) {
		begun_listening = true;
		recognition.start();

		recognition.onresult = function(event) {
			var instruction = event.results[0][0].transcript;
			instruction = instruction.replace('-', '');
			instruction = instruction.replace(',', '');
			instruction = instruction.toLowerCase();

			chat = chat.splice(1);
			chat.push(instruction);

			parseATCInstruction(instruction);
			console.log('You said: ', instruction);
			
			begun_listening = false;
		};
	}

	if(chat_key.isDown && !opened_chat) {
		opened_chat = true;
		console.log('click');
		box.startFocus();
	}

	if(game.input.activePointer.leftButton.isDown) {
		var x = game.input.activePointer.position.x - _config.offset.x;
		var y = game.input.activePointer.position.y - _config.offset.y;
		game.add.text(game.input.activePointer.position.x, game.input.activePointer.position.y, '('+x+','+y+')', { font: "15px Arial", fill: "rgba(0, 0, 255, 1)" });
	}

	// engine bug
    box.update();

	tick++;
}

function render() {
	for(var i = 0; i < aircraft.length; i++) {
		var ac = aircraft[i];

		if(!ac.used)
			continue;

		if(ac.show_datablock) {
			game.debug.geom(ac.data_block.dataline);
		}

		if(ac.warning) {
			game.debug.geom(ac.elements.collision_circle, 'rgba(255, 0, 0, 0.2)');
		}
	}
}



function initializeAircraftPool() {
	for(var i = 0; i < 30; i++) {
		var nac = {};

		nac.used = true;

		nac.actype = aircraft_types[parseInt(Math.random() * aircraft_types.length)];
		nac.type = nac.actype.type;
		nac.alt = 0; //parseInt(Math.random() * (aircraft_classes[nac.actype.weight].altitude.max - aircraft_classes[nac.actype.weight].altitude.min) + aircraft_classes[nac.actype.weight].altitude.min) * 1000;
		nac.speed = 0; //aircraft_classes[nac.actype.weight].speeds.cruize + parseInt(Math.random() * 40 + 20);
		nac.ifr = true; //!(nac.alt < 10000 && Math.random() > .3);

		nac.x = 0; //_config.world_width * 2; // Math.random() * _config.world_width - _config.offset.x;
		nac.y = 0; //_config.world_height * 2; //Math.random() * _config.world_height - _config.offset.y;
		nac.hdg = 0; //Math.random() * 360;
		nac.dest_alt = 0;
		nac.dest_hdg = 0;
		nac.callsign = get_random_airline() + Math.floor(Math.random() * 89 + 10);
		nac.elements = {};
		nac.data_block = {};
		nac.last_positions = [[_config.world_width*2,_config.world_height*2],[_config.world_width*2,_config.world_height*2],[_config.world_width*2,_config.world_height*2],[_config.world_width*2,_config.world_height*2],[_config.world_width*2,_config.world_height*2]];
		nac.last_position_blips = [];
		nac.dest = 'KBOS';
		nac.show_datablock = true;
		nac.warning = false;

		aircraft.push(nac);
	}
}

function initializeScenario(scenario_id) {

	for(var i = 0; i < aircraft.length; i++) {
		var ac = aircraft[i];

		if(ac.used) {
			ac.alt = 0;
			ac.speed = 0;
			ac.hdg = 0;
			ac.dest_alt = 0;
			ac.dest_hdg = 0;
			ac.x = _config.world_width * 2;
			ac.y = _config.world_height * 2;
			ac.used = false;
		}
	}

	for(var i = 0; i < scenarios[scenario_id].aircraft.length; i++) {
		var nac = null;
		for(var j = 0; j < aircraft.length; j++) {
			if(!aircraft[j].used) {
				nac = aircraft[j];
				break;
			}
		}

		if(nac == null) {
			return;
		}

		var tpl = scenarios[scenario_id].aircraft[i];

		nac.actype = aircraft_types[tpl[5]];
		nac.type = nac.actype.type;
		nac.alt = tpl[3];
		nac.speed = tpl[4];
		nac.ifr = true;

		nac.x = tpl[0]
		nac.y = tpl[1];
		console.log("Setting HDG " + tpl[2] + " for " + nac.callsign);
		nac.hdg = tpl[2];
		nac.dest_alt = nac.alt;
		nac.dest_hdg = nac.hdg;
		nac.callsign = get_random_airline() + Math.floor(Math.random() * 89 + 10);
		nac.last_positions = [[_config.world_width*2,_config.world_height*2],[_config.world_width*2,_config.world_height*2],[_config.world_width*2,_config.world_height*2],[_config.world_width*2,_config.world_height*2],[_config.world_width*2,_config.world_height*2]];
		nac.dest = 'KBOS';
		nac.show_datablock = true;
		nac.warning = false;

		nac.data_block.callsign.setText(nac.callsign);

		nac.used = true;
	}

	chat = chat.splice(1);
	chat.push('Scenario #' + (scenario_id+1) + ' loaded.');
}

function initializeTracks() {
	for(var i = 0; i < aircraft.length; i++) {
		var ac = aircraft[i];
		
		/*
		 * Create a phaser group for the datablock
		 */
		ac.data_block.group = game.add.group();

		ac.data_block.dataline = new Phaser.Line(ac.x + _config.offset.x, ac.y + _config.offset.y, ac.x + _config.offset.x + 30, ac.y + _config.offset.y - 30);

		if(ac.ifr) {
			// Create the callsign datablock element
			ac.data_block.callsign = game.add.text(ac.x + _config.offset.x + 10 + 30, ac.y + _config.offset.y - 30, ac.callsign, { font: "12px Arial", fill: "rgba(0, 255, 50, 1)", fontWeight: "100"});
			ac.data_block.group.add(ac.data_block.callsign);
		}

		// Create the speed datablock element
		ac.data_block.speed = game.add.text(ac.x + _config.offset.x + 10 + 30, ac.y + _config.offset.y + 13 - 30, ac.speec, { font: "12px Arial", fill: "rgba(0, 255, 50, 1)" });
		ac.data_block.group.add(ac.data_block.speed);

		// Create the altitude datablock element
		ac.data_block.alt = game.add.text(ac.x + _config.offset.x + 45 + 30, ac.y + _config.offset.y + 13 - 30, Math.floor(ac.alt/100), { font: "12px Arial", fill: "rgba(0, 255, 50, 1)" });
		ac.data_block.group.add(ac.data_block.alt);

		if(ac.ifr) {
			// Create the a/c type datablock element
			ac.data_block.type = game.add.text(ac.x + _config.offset.x + 10 + 30, ac.y + _config.offset.y + 26 - 30, ac.type, { font: "12px Arial", fill: "rgba(0, 255, 50, 1)" });
			ac.data_block.group.add(ac.data_block.type);
			
			// Create the destination airport datablock element
			ac.data_block.dest = game.add.text(ac.x + _config.offset.x + 45 + 30, ac.y + _config.offset.y + 26 - 30, ac.dest, { font: "12px Arial", fill: "rgba(0, 255, 50, 1)" });
			ac.data_block.group.add(ac.data_block.dest);
		}

		// Creating last position blips
		for(var j = 0; j < ac.last_positions.length; j++) {
			var p = ac.last_positions[j];
			var color_string = 'rgba(0, 128, 253, ' + (0 + ((j+1)*0.15)) + ')';
			ac.last_position_blips.push(game.add.text(p[0] + _config.offset.x, p[1] + _config.offset.y, '•', { font: "25px Arial", fill: color_string,  }));
		}

		if(ac.ifr) {
			ac.elements.blip = game.add.text(ac.x + _config.offset.x, ac.y + _config.offset.y, '•', { font: "25px Arial", fill: "rgba(0, 255, 0, 1)" });
			//ac.elements.blip_line = game.add.text(ac.x + _config.offset.x, ac.y + _config.offset.y, '|', { font: "20px Arial", fill: "rgba(0, 255, 0, 1)" });
			ac.elements.blip_line = game.add.sprite(ac.x + _config.offset.x, ac.y + _config.offset.y, 'greenline');
			ac.elements.blip_line.anchor.setTo(0.5, 0.5);

		} else {
			ac.elements.blip = game.add.text(ac.x + _config.offset.x, ac.y + _config.offset.y + 15, '⊡', { font: "7px Arial", fill: "rgba(0, 255, 0, 1)" });
		}

		ac.elements.collision_circle = new Phaser.Circle(ac.x + _config.offset.x, ac.y + _config.offset.y, {radius: 222.1, empty: true});
		ac.elements.collision_circle.empty = true;
	
		ac.x = _config.world_width * 2;
		ac.y = _config.world_height * 2;
		ac.data_block.group.position.x = _config.world_width * 2;
		ac.data_block.group.position.y = _config.world_height * 2;
		ac.used = false;
	}

}

function parseCommand(command) {
	if(command.substr(0, 1) != "/") {
		return false;
	}

	if(command.substr(0, 5) == "/load") {
		var scenario_id = parseInt(command.substr(5));
		if(scenarios[scenario_id-1]) {
			initializeScenario(scenario_id-1);
			return true;
		} else {
			return "Error: Scenario doesn't exist.";
		}
	}

	return "Error: Command doesn't exist.";
}