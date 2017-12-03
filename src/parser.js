function parseATCInstruction(instruction) {
	console.log("Parser received: '" + instruction + "'");

	if((instruction.indexOf("cleared") > 0 || instruction.indexOf("clear") > 0) && instruction.indexOf("approach") > 0) {
		var callsign_search = instruction.match(/(\w+)\s(\d+)(.*)/);
		console.log(callsign_search);
		if(callsign_search && callsign_search.length == 4) {
			var matched_name = airline_dictionary(callsign_search[1]);

			if(!matched_name) {
				matched_name = callsign_search[1];
			}

			console.log(matched_name);

			var actual_name = matched_name + callsign_search[2];

			console.log(actual_name);
			for(var i = 0; i < aircraft.length; i++) {
				if(aircraft[i].callsign == actual_name && !aircraft[i].crashed) {
					aircraft[i].dest_alt = 500;
				}
			}
		}

	}

	var heading_match = /(\w+)(.*)\s(\d+)(.*)heading\s(\d+)(.*)/;
	var altitude_match = /(\w+)(.*)\s(\d+)(.*)(climb|descend|descent|maintain)(.*)/;
	var handoff_match = /(\w+)(.*)\s(\d+)(.*)(contact boston center|contact center|contact tower|contact boston tower|contact the tower)(.*)/;
	var hold_match = /(\w+)(.*)\s(\d+)\s(enter)\s(left|right)\s(hold)(.*)/;
	var speed_match = /(\w+)(.*)\s(\d+)\s(reduce|increase)\s(speed)\s(to)\s(\d+)(.*)/;

	var heading_matched = instruction.match(heading_match);
	if(heading_matched && heading_matched.length == 7) {
		console.log('test');
		var matched_name = airline_dictionary(heading_matched[1]);
		
		if(!matched_name) {
			matched_name = heading_matched[1];
		}

		console.log('test2');
		console.log(heading_matched);

		var actual_name = matched_name + heading_matched[3];

		console.log(actual_name);

		for(var i = 0; i < aircraft.length; i++) {
			if(aircraft[i].callsign == actual_name && !aircraft[i].crashed) {

				aircraft[i].dest_hdg = parseInt(heading_matched[5]);
				aircraft[i].holding = false;
				
				aircraft[i].hdg = (aircraft[i].hdg + 360) % 360;
				
				var delta_cw = aircraft[i].hdg + aircraft[i].dest_hdg;
				delta_cw = (delta_cw + 360) % 360;

				var delta_ccw = aircraft[i].hdg - aircraft[i].dest_hdg;
				delta_ccw = (delta_ccw + 360) % 360;

				if(instruction.indexOf('left') > 0) {
					console.log("found lefT");
					aircraft[i].delta_dir = -1;
				} else if(instruction.indexOf('right') > 0) {
					console.log("found right");
					aircraft[i].delta_dir = 1;
				} else {
					console.log("found nothing");
					aircraft[i].delta_dir = (delta_cw < delta_ccw) ? 1 : -1;
				}
			
				say("Fly heading " + aircraft[i].dest_hdg + ", " + aircraft[i].callsign);

				console.log('Changing ' + aircraft[i].callsign + '\'s heading from ' + aircraft[i].hdg + ' to ' + aircraft[i].dest_hdg);
			}
		}
	}

	var altitude_matched = instruction.match(altitude_match);
	if(altitude_matched && altitude_matched.length == 7) {
		var matched_name = airline_dictionary(altitude_matched[1]);
		if(!matched_name) {
			matched_name = altitude_matched[1];
		}
			
		var actual_name = matched_name + altitude_matched[3];
		var dest_alt = null;

		var fl_match = /(.*)(flight level)\s(\d+)/;
		var fl_matched = altitude_matched[6].match(fl_match);
		if(fl_matched && fl_matched.length == 4) {
			dest_alt = parseInt(fl_matched[3]) * 100;
		}

		var thsnd_match = /(.*)\s(\d+)/;
		var thsnd_matched = altitude_matched[6].match(thsnd_match);
		if(thsnd_matched && thsnd_matched.length == 3) {
			dest_alt = parseInt(thsnd_matched[2]);
		}

		if(dest_alt != null) {
			for(var i = 0; i < aircraft.length; i++) {
				if(aircraft[i].callsign == actual_name && !aircraft[i].crashed) {
					aircraft[i].dest_alt = dest_alt;
					if(aircraft[i].dest_alt > aircraft[i].alt) {
						say("Climb and maintain " + aircraft[i].dest_alt + ", " + aircraft[i].callsign);
					} else {
						say("Descend and maintain " + aircraft[i].dest_alt + ", " + aircraft[i].callsign);
					}
				}
			}
		}
	}


	var handoff_matched = instruction.match(handoff_match);
	if(handoff_matched && handoff_matched.length == 7) {
		var matched_name = airline_dictionary(handoff_matched[1]);
		
		if(!matched_name) {
			matched_name = handoff_matched[1];
		}

		var actual_name = matched_name + handoff_matched[3];

		for(var i = 0; i < aircraft.length; i++) {
			if(aircraft[i].callsign == actual_name && !aircraft[i].crashed) {
				aircraft[i].show_datablock = false;
				say("Wilco, see ya, " + aircraft[i].callsign);
			}
		}
	}

	var hold_matched = instruction.match(hold_match);
	console.log(hold_matched);
	if(hold_matched && hold_matched.length == 8) {

		var matched_name = airline_dictionary(hold_matched[1]);
		
		if(!matched_name) {
			matched_name = hold_matched[1];
		}

		var actual_name = matched_name + hold_matched[3];

		for(var i = 0; i < aircraft.length; i++) {
			if(aircraft[i].callsign == actual_name && !aircraft[i].crashed) {
				if(hold_matched[5] == 'left') {
					aircraft[i].delta_dir = -1;
				} else if(hold_matched[5] == 'right') {
					aircraft[i].delta_dir = 1;
				} else {
					aircraft[i].delta_dir = Math.random() > .5 ? -1 : 1;
				}

				aircraft[i].holding = true;
				aircraft[i].dest_hdg = aircraft[i].hdg + 100;
				say("Alright, holding " + hold_matched[5] + " " + aircraft[i].callsign);
			}
		}
	}

	var speed_matched = instruction.match(speed_match);
	console.log(speed_matched);
	if(speed_matched && speed_matched.length == 9) {

		var matched_name = airline_dictionary(speed_matched[1]);
		
		if(!matched_name) {
			matched_name = speed_matched[1];
		}

		var actual_name = matched_name + speed_matched[3];

		for(var i = 0; i < aircraft.length; i++) {
			if(aircraft[i].callsign == actual_name && !aircraft[i].crashed) {
				var target_speed = parseInt(speed_matched[7]);
				if(target_speed >= aircraft_classes[aircraft[i].actype.weight].speeds.final
					&& target_speed <= aircraft_classes[aircraft[i].actype.weight].speeds.cruize) {
					aircraft[i].dest_speed = target_speed;
					say("Maintain " + speed_matched[7] + "kt, " + aircraft[i].callsign);
				} else {
					say("Unable, " + aircraft[i].callsign);
				}
			}
		}
	}

}