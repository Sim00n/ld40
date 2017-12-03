var aircraft_classes = {
	'large': {
		'speeds': {
			'climb': 	180,
			'cruize': 	400,
			'descend': 	250,
			'approach': 200,
			'final': 	130,
		},
		'altitude': {
			'min': 		20,
			'max': 		40,
		},
		'cr': 			3000 / 60,
		'tr': 			17,
		'sc': 			1,
	},

	'heavy': {
		'speeds': {
			'climb': 	230,
			'cruize': 	500,
			'descend': 	250,
			'approach': 210,
			'final': 	140,
		},
		'altitude': {
			'min': 		26,
			'max': 		44,
		},
		'cr': 			4000 / 60,
		'tr': 			15,
		'sc': 			0.8,
	},

	'small': {
		'speeds': {
			'climb': 	70,
			'cruize': 	120,
			'descend': 	110,
			'approach': 90,
			'final': 	70,
		},
		'altitude': {
			'min': 		 3,
			'max': 		10,
		},
		'cr': 			1500 / 60,
		'tr': 			18,
		'sc': 			0.5,
	},

	'smallplus': {
		'speeds': {
			'climb': 	110,
			'cruize': 	250,
			'descend': 	230,
			'approach': 200,
			'final': 	100,
		},
		'altitude': {
			'min': 		12,
			'max': 		26,
		},
		'cr': 			2000 / 60,
		'tr': 			20,
		'sc': 			0.6,
	}
};

var aircraft_types = [
	{
		'type': 	'B737',
		'weight': 	'large'
	},
	{
		'type': 	'A320',
		'weight': 	'large'
	},
	{
		'type': 	'A330',
		'weight': 	'heavy'
	},
	{
		'type': 	'B747',
		'weight': 	'heavy'
	},
	{
		'type': 	'B787',
		'weight': 	'heavy'
	},
	{
		'type': 	'C172',
		'weight': 	'small'
	},
	{
		'type': 	'P28A',
		'weight': 	'small'
	},
	{
		'type': 	'PA31',
		'weight': 	'smallplus'
	},
	{
		'type': 	'BE58',
		'weight': 	'smallplus'
	},
];


var remotes = ['KJFK', 'KATL', 'CYYZ', 'EPWA', 'EGLL', 'KMIA'];
var airports_indexes = ['KBOS', 'KOWD', 'KBED', 'KLWM', 'KBVY', 'KGHG'];
var airports = {
	'KBOS': {
		'name': 'KBOS',
		'x': -71,
		'y': -61
	},
	'KOWD': {
		'name': 'KOWD',
		'x': -228,
		'y': 43
	},
	'KBED': {
		'name': 'KBED',
		'x': -233,
		'y': -183
	},
	'KLWM': {
		'name': 'KLWM',
		'x': -57,
		'y': -339
	},
	'KBVY': {
		'name': 'KBVY',
		'x': 58,
		'y': -206
	},
	'KGHG': {
		'name': 'KGHG',
		'x': 97,
		'y': 206
	}
};

var scenarios = [
	{
		aircraft: [
			[-521, -340, 140, 12000, 400, 0],
			[-462, -288, 140, 11000, 400, 1],
			[-399, -242, 140, 10000, 400, 1],

			[303, -119, 300, 5000, 200, 5],

			[-204, 304, 360, 5500, 160, 6],
			[-210, 416, 5, 5000, 180, 7]
		],
		departures: [
			['KBOS', 246, 22000, 0, 'KJFK'],
			['KOWD', 250, 32000, 2, 'KATL'],
			['KGHG', 300, 28000, 1, 'CYYZ'],
			['KLWM', 061, 35000, 2, 'EPWA'],
			['KBED', 061, 35000, 3, 'EPWA'],
			['KBVY', 061, 35000, 4, 'EPWA'],
		],
		flow: 'westflow',
		name: 'Easy North Flow 1'
	},
	{
		aircraft: [
			[-521, -340, 140, 12000, 400, 0],
			[-462, -288, 140, 11000, 400, 1],
			[-399, -242, 140, 10000, 400, 1],
			[-221, -340, 140, 12000, 400, 0],
			[-162, -288, 140, 11000, 400, 1],
			[-99, -242, 140, 10000, 400, 1],

			[603, -119, 300, 5000, 200, 5],

			[-204, 304, 360, 5500, 360, 5],
			[-210, 416, 5, 5000, 380, 4]
		],
		departures: [
			['KBOS', 246, 22000, 0, 'KJFK'],
			['KOWD', 250, 32000, 2, 'KATL'],
			['KGHG', 300, 28000, 1, 'CYYZ'],
			['KLWM', 061, 35000, 2, 'EPWA'],
			['KBED', 061, 35000, 3, 'EPWA'],
			['KBVY', 061, 35000, 4, 'EPWA'],
		],
		flow: 'southflow',
		name: 'Easy North Flow 2'
	},
	{
		aircraft: [
			//[-521, -340, 140, 12000, 400, 0]
			[92, -137, 310, 2000, 170, 0],
			[138, -100, 310, 3000, 170, 1],
			[117, -56, 40, 4000, 170, 2],
			[87, -16, 40, 5000, 170, 3],
			[57, 36, 40, 6000, 170, 4],
			
			[5, -347, 140, 5000, 200, 2],
			[-184, -274, 50, 8000, 180, 5],

		],
		departures: [
			['KBOS', 246, 22000, 0, 'KJFK'],
			['KOWD', 250, 32000, 2, 'KATL'],
			['KGHG', 300, 28000, 1, 'CYYZ'],
			['KLWM', 061, 35000, 2, 'EPWA'],
			['KBED', 061, 35000, 3, 'EPWA'],
			['KBVY', 061, 35000, 4, 'EPWA'],
		],
		flow: 'northflow',
		name: 'Busy Night'
	},
	{
		aircraft: [
			//[-521, -340, 140, 12000, 400, 0]
			[-336, -129, 100, 8000, 400, 0],
			[-428, -148, 100, 9000, 400, 0],
			[-510, -172, 100, 10000, 410, 0],
			
			[-312, 4, 70, 8000, 380, 0],
			[-386, 36, 70, 9000, 390, 0],
			[-454, 79, 70, 10000, 380, 0],
			

			[18, -163, 230, 2000, 170, 0],
			[152, -137, 310, 3000, 190, 0],
			[211, -214, 200, 4000, 190, 0],
			[353, -179, 320, 5000, 190, 0],
			[386, -63, 35, 6000, 220, 0],
			[335, 29, 35, 7000, 230, 0],
			[260, 91, 35, 7000, 230, 0],


			[-52, -82, 240, 800, 300, 1],


		],
		departures: [
			['KBOS', 246, 22000, 0, 'KJFK'],
			['KOWD', 250, 32000, 2, 'KATL'],
			['KGHG', 300, 28000, 1, 'CYYZ'],
			['KLWM', 061, 35000, 2, 'EPWA'],
			['KBED', 061, 35000, 3, 'EPWA'],
			['KBVY', 061, 35000, 4, 'EPWA'],
		],
		flow: 'northflow',
		name: 'Boeing FlyIn'
	}
];

var cheat_sheet_text = '\
Instruction cheat sheet:\n\
  DAL10 turn left\\right heading 120\n\
  AAL10 fly heading 190\n\
  JBU10 climb and maintain 12000\n\
  SWA10 descend and maintain 3000\n\
  LOT10 cleared for the approach\n\
  JBU10 enter left\\right hold\n\
  AAL10 reduce\\increase speed to 200\n\
  DAL10 contact boston center\n\
  SWA10 contact tower\n\n\
Airlines:\n\
  AAL - american\n\
  DAL - delta\n\
  JBU - jetblue\n\
  LOT - lot\n\
  SWA - southwest\
';

var help_text = '\
Instructions:\n\n\
Use turns, descends and speed adjustments to vector aircraft\n\
to their destinations. Avoid collisions and watch out for \n\
departures from Boston and airports around it. An aircraft\n\
will land if it is within 1 miles of the airport and below 1000ft.\n\n\
        Callsign-->        DAL52\n\
        Speed----->       400   050          <---Altitude (in 100s of feet)\n\
        A/C Type-->      B737 EPWA     <---Destination Airport\n\
\n\
       120↑200   <-- aircraft at 12,000ft, climbing to 20,000ft\n\
\n\n\
APPROACHING OVERLOAD\n\
  - made by Szymon Puzdrowski for Ludum Dare 40.\
';