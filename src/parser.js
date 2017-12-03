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
				if(aircraft[i].callsign == actual_name) {
					aircraft[i].dest_alt = 500;
				}
			}
		}

	}

	var heading_match = /(\w+)(.*)\s(\d+)(.*)heading\s(\d+)(.*)/;
	var altitude_match = /(\w+)(.*)\s(\d+)(.*)(climb|descend|descent|maintain)(.*)/;
	var handoff_match = /(\w+)(.*)\s(\d+)(.*)(contact boston center|contact center|contact tower)(.*)/;

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
			if(aircraft[i].callsign == actual_name) {
				aircraft[i].dest_hdg = parseInt(heading_matched[5]);
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
				if(aircraft[i].callsign == actual_name) {
					aircraft[i].dest_alt = dest_alt;
					if(aircraft[i].dest_alt > aircraft[i].alt) {
						say("Descend and maintain " + aircraft[i].dest_alt + ", " + aircraft[i].callsign);
					} else {
						say("Climb and maintain " + aircraft[i].dest_alt + ", " + aircraft[i].callsign);
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
			if(aircraft[i].callsign == actual_name) {
				aircraft[i].show_datablock = false;
				say("Wilco, see ya, " + aircraft[i].callsign);
			}
		}
	}

}