let modInfo = {
	name: "The Factory Clicker Tree",
	author: "mixmstr08",
	pointsName: "factory points",
	modFiles: ["layers.js", "tree.js"],

	discordName: "",
	discordLiClicker: "",
	initialStartPoints: new Decimal (10), // Used for hard resets and new players
	offlineLimit: 24,  // In hours
}

// Set your version in num and name
let VERSION = {
	num: "1.0",
	name: "Alpha",
}

let Alphalog = `<h1>Changelog:</h1><br>
	<h3>v1.0 - Alpha</h3><br>
		- Added the beginning.<br>
		- Added stuff`;

let winText = "Congratulations! You have reached the end and beaten this game, but for now..."

// If you add new functions anywhere inside of a layer, and those functions have an effect when called, add them here.
// (The ones here are examples, all official functions are already taken care of)
var doNotCallTheseFunctionsEveryTick = ["blowUpEverything"]

function getStartPoints(){
    return new Decimal(modInfo.initialStartPoints)
}

// Determines if it should show points/sec
function canGenPoints(){
	return true
}

// Calculate points/sec!
function getPointGen() {
	if(!canGenPoints())
		return new Decimal(0)

	let gain = new Decimal(1)
	if(hasUpgrade('m', 11)) gain = gain.gain.mul(2);
	if(player.player.l && player.player.l.unlocked){
		gain = gain.mul(player.l.points.mul(0.1).add(1));
	}
	if(player.pr && player.pr.unlocked){
		gain = gain.mul(player.pr.points.add(1).pow(2));
	}
	if(player.s && player.s.unlocked){
		gain = gain.mul(player.s.satellites.add(1).pow(1.5));
	}
	if(player.q && player.q.unlocked){
		gain = gain.mul(player.q.points.mul(0.05).add(1));
	}
	if(player.c && player.c.unlocked){
		gain = gain.mul(player.c.points.add(1).pow(5));
	}


	return gain;
}

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function startPlayerBase(){
	return {
		points: new Decimal(0),
		copperOre: new Decimal(0),
		ironOre: new Decimal(0),
		coal: new Decimal(0),
		copperWire: new Decimal(0),
		ironBar: new Decimal(0),
		steel: new Decimal(0),
		gear: new Decimal(0),
		motor: new Decimal(0),
		electronicBoard: new Decimal(0)
	}
}

// Display extra things at the top of the page
var displayThings = [
]

// Determines when the game "ends"
function isEndgame() {
	return player.points.gte(new Decimal("e280000000"))
}



// Less important things beyond this point!

// Style for the background, can be a function
var backgroundStyle = {

}

// You can change this if you have things that can be messed up by long tick lengths
function maxTickLength() {
	return(3600) // Default is 1 hour which is just arbitrarily large
}

// Use this if you need to undo inflation from an older version. If the version is older than the version that fixed the issue,
// you can cap their current resources with this.
function fixOldSave(oldVersion){
}