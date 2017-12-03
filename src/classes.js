var aircraft_classes = {
	'large': {
		'speeds': {
			'climb': 	180,
			'cruize': 	400,
			'descend': 	250,
			'approach': 200,
			'final': 	180,
		},
		'altitude': {
			'min': 		20,
			'max': 		40,
		},
		'cr': 			1500 / 60,
		'tr': 			17,
	},

	'heavy': {
		'speeds': {
			'climb': 	230,
			'cruize': 	500,
			'descend': 	250,
			'approach': 210,
			'final': 	180,
		},
		'altitude': {
			'min': 		26,
			'max': 		44,
		},
		'cr': 			1800 / 60,
		'tr': 			15,
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
		'cr': 			500 / 60,
		'tr': 			18,
	},

	'smallplus': {
		'speeds': {
			'climb': 	110,
			'cruize': 	250,
			'descend': 	230,
			'approach': 200,
			'final': 	140,
		},
		'altitude': {
			'min': 		12,
			'max': 		26,
		},
		'cr': 			700 / 60,
		'tr': 			20,
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

var airports = [
	'KBOS',
	'KOWD',
	'KBED',
	'KLWM',
	'KBVY',
	'KGHG'
];

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
		flow: 'northflow',
		name: 'Boeing FlyIn'
	}
];