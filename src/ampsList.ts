export type Amp = {
	id: string;
	name: string;
	buff?: {
		self?: number | Buff;
		opp?: number | Buff;
	};
};

export type Buff = {
	type: "all" | "min" | "max" | "selected";
	value: number | "custom";
};

export type TeamAmp = {
    name: string,
    ampsList: string[]
}

export const ampsList: Amp[] = [
	{
		id: "a1",
		name: "Cameraman x1.1",
		buff: {
			self: 1.1,
			opp: 1,
		},
	},
	{
		id: "a1",
		name: "Cameraman x0.9",
		buff: {
			self: 0.9,
			opp: 1,
		},
	},
	{
		id: "a2",
		name: "Booster 1",
		buff: {
			self: 1.1,
			opp: 1,
		},
	},
	{
		id: "a3",
		name: "Double-edge Sword 1",
		buff: {
			self: 1.15,
			opp: 1,
		},
	},
	{
		id: "a4",
		name: "Booster 2",
		buff: {
			self: 1.15,
			opp: 1,
		},
	},
	{
		id: "a5",
		name: "Double-edge Sword 2",
		buff: {
			self: 1.15,
			opp: 1,
		},
	},
	{
		id: "a6",
		name: "The Baron 1",
		buff: {
			self: 1.5,
			opp: 1,
		},
	},
	{
		id: "a7",
		name: "Booster 3",
		buff: {
			self: 1.3,
			opp: 1,
		},
	},
	{
		id: "a8",
		name: "Double-edge Sword 3",
		buff: {
			self: 1.33,
			opp: 1,
		},
	},
	{
		id: "a9",
		name: "The Baron 2",
		buff: {
			self: 1.75,
			opp: 1,
		},
	},
	{
		id: "a10",
		name: "Kryptonite",
		buff: {
			self: 1,
			opp: {
				type: "max",
				value: 0.8,
			},
		},
	},
	{
		id: "a11",
		name: "[X]",
		buff: {
			self: {
				type: "min",
				value: "custom",
			},
		},
	},
	{ id: "a12", name: "Scale Of Justice" },
	{ id: "b1", name: "Accuracy Cond" },
	{ id: "b2", name: "Max-combo Cond" },
	{ id: "b3", name: "Hiding In The Dark" },
	{
		id: "b4",
		name: "AFK",
		buff: {
			self: 1.25,
			opp: 1,
		},
	},
	{ id: "b5", name: "Flashback" },
	{ id: "b6", name: "Double Tap" },
	{ id: "b7", name: "Trade Offer" },
	{ id: "b8", name: "Leave it to Fate" },
	{
		id: "b9",
		name: "Pick your enemy",
		buff: {
			self: 1,
			opp: 1.15,
		},
	},
	{ id: "b10", name: "For The Greatest" },
	{
		id: "b11",
		name: "Solo Leveling",
		buff: {
			self: 1,
			opp: 1.15,
		},
	},
	{ id: "c1", name: "Quiet Batman" },
	{ id: "c2", name: "Mod Contract" },
	{ id: "c3", name: "Abyssal" },
	{ id: "c4", name: "Jack Of Mods" },
	{ id: "c5", name: "Swapperino" },
	{ id: "c6", name: "No Mod No Life", buff: {
        self: {
            type: "selected",
            value: 0.85
        },
    } },
	{ id: "d1", name: "Believe The Rainbow" },
	{
		id: "d2",
		name: "English or Spanish",
		buff: {
			self: 1.25,
			opp: 1,
		},
	},
	{
		id: "d3",
		name: "50-50 x1.15",
		buff: {
			self: 1.15,
			opp: 1,
		},
	},
	{
		id: "d3",
		name: "50-50 x0.85",
		buff: {
			self: 0.85,
			opp: 1,
		},
	},
	{ id: "d4", name: "Calculus" },
	{
		id: "d5",
		name: "Wheel of Fortune",
		buff: {
			self: 0.85,
			opp: 1,
		},
	},
	{ id: "d6", name: "Pot of Greed" },
	{ id: "t1", name: "Nope" },
	{ id: "t2", name: "Copycat" },
	{ id: "t3", name: "Reflection" },
	{ id: "t4", name: "Blueprint" },
    { id: "z0", name: "TRY-Z MODE", buff: {
        self: {
            type: "all",
            value: "custom"
        }
    }},
    { id: "z1", name: "TRY-Z MODE 2", buff: {
        opp: 10
    }}
];
