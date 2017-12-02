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
		'tr': 			20,
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
		'tr': 			23,
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
		'tr': 			25,
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

var airports = {
	'KBOS': {
		'position': {
			'x': 0,
			'y': 0,
		},
	},
	'KOWD': {
		'position': {
			'x': 0,
			'y': 0,
		},
	},
	'KBED': {
		'position': {
			'x': 0,
			'y': 0,
		},
	},
	'KLWM': {
		'position': {
			'x': 0,
			'y': 0,
		},
	},
	'KBVY': {
		'position': {
			'x': 0,
			'y': 0,
		},
	},
	'KGHG': {
		'position': {
			'x': 0,
			'y': 0,
		},
	},
}