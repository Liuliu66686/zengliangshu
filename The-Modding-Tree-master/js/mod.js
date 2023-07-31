let modInfo = {
	name: "增量树",
	id: "liumymod",
	author: "溜溜球",
	pointsName: "点数",
	modFiles: ["layers.js", "tree.js","someUsefulFunctions_QwQe308.js"],

	discordName: "",
	discordLink: "",
	initialStartPoints: new Decimal (10), // Used for hard resets and new players
	offlineLimit: 1,  // In hours
}

// Set your version in num and name
let VERSION = {
	num: "0.1.5",
	name: "成就与第？层",
}

let changelog = `<h1>更新日志:</h1><br>
	<h3>v0.1.5</h3><br>	
		- 添加两个（实际是1.00001个）新的层级<br>
		- 制作大重置！<br>
		- 添加5行成就！（后续添加图片） <br> 
		- 版本终点：获得1幂增点<br>
	<h3>v0.1.4</h3><br>	
		- 新的层级，新的货币，新的加成！<br>
		- 完成倍增点层制作！<br>
		- 新的4个挑战！<br>
		- 版本终点：完成挑战“绿色挑战”<br>	
	<h3>v0.1.3</h3><br>	
		- 新的15个升级，新的3个buyable！<br>
		- 新的4个挑战！<br>
		- 版本终点：完成挑战“粒子挑战II”<br>
	<h3>v0.1.2</h3><br>	
		- 新的1个层级！<br>
		- 新的4个挑战！<br>
		- 版本终点：完成挑战“粒子挑战”<br>
	<h3>v0.1.1</h3><br>	
		- 完善平衡，完成声望层制作<br>
		- 版本终点：拥有1元素<br>
	<h3>v0.1</h3><br>	
		- 增加5p+1m个升级！<br>
		- 版本终点：拥有e2500000声望<br>
	<h3>v0.0.1</h3><br>	
		- 加入M层级<br>
		- 增加8p+4m个升级！<br>
		- 版本终点：拥有e100000声望<br>
	<h3>v0.0</h3><br>
		- 加入P层级<br>
		- 10个升级！<br>
		- 2个buyable！<br>
		- 版本终点：1倍增点<br>
	
	
		
		`

let winText = `恭喜！你 >暂时< 通关了！`

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
	let gainexp = new Decimal(1)
	if(hasUpgrade("p",11)) gain = gain.mul(upgradeEffect("p",11))
	if(hasUpgrade("p",15)) gain = gain.mul(upgradeEffect("p",15))
	if(hasUpgrade("p",17)) gain = gain.mul(upgradeEffect("p",17))
	if(hasUpgrade("p",35)) gain = gain.mul(upgradeEffect("p",35))
	if(player.m.unlocked) gain = gain.mul(layers.m.effect())	
    if(hasUpgrade("p",14)) gainexp = gainexp.mul(upgradeEffect("p",14))
	if(hasUpgrade("p",23)) gainexp = gainexp.mul(upgradeEffect("p",23))
	if(hasUpgrade("p",25)) gainexp = gainexp.mul(upgradeEffect("p",25))
	if(hasUpgrade("m",12)) gainexp = gainexp.mul(upgradeEffect("m",12))
	if(hasUpgrade("m",22)) gainexp = gainexp.mul(1.5)
	//1软前
	if(gain.gte("e11688")) gain = powsoftcap(gain,pointgainsoftcaps.gainsoftcap1(),new Decimal(3))
	if(gainexp.gte(36)) gainexp = powsoftcap(gainexp,pointgainsoftcaps.gainexpsoftcap1(),new Decimal(10))
	//1软
	if(player.e.electron.gte(1)) gain = gain.mul(layers.e.electronEffect())
	if(player.c.red.gt(1)) gain = gain.mul(layers.c.redEffect())
	if(hasUpgrade("m",34)) gain = gain.mul(upgradeEffect("m",34))
	if(hasUpgrade("m",24)) gainexp = gainexp.mul(upgradeEffect("m",24))
	if(hasUpgrade("m",35)) gainexp = gainexp.mul(upgradeEffect("m",35))
	//2软前
	gain = powsoftcap(gain,pointgainsoftcaps.gainsoftcap2(),new Decimal(5))
	gainexp = powsoftcap(gainexp,pointgainsoftcaps.gainexpsoftcap2(),new Decimal(20))
	//2软
	if(hasUpgrade("r",12)) gainexp = gainexp.mul(1.05)
	//3软前
	if(inChallenge("e",11)) gainexp = gainexp.mul(0.1)
	if(inChallenge("c",11)) gainexp = gainexp.mul(0.05)
	if(inChallenge("e",31)) gainexp = new Decimal(1)
	//挑战中
	if(hasMilestone("r",0)) gain = gain.mul(100)
	//无视任何软上限（包括挑战）
	gain = gain.pow(gainexp)
	//结算
	//gain = new Decimal(0)//暂停术
	return gain//exp
}

let pointgainsoftcaps = {
	gainsoftcap1(){
		let a = new Decimal("e17688")
		return a
	},
	gainexpsoftcap1(){
		let a = new Decimal(36)
		if(hasUpgrade("m",22)) a = a.add(upgradeEffect("m",22))
		return a
	},
	gainsoftcap2(){
		let a = new Decimal("e30008")
		return a
	},
	gainexpsoftcap2(){
		let a = new Decimal(64)
		if(hasUpgrade("m",25)) a = a.add(upgradeEffect("m",25))
		return a
	},
}
// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
}}

// Display extra things at the top of the page
var displayThings = [
]

// Determines when the game "ends"
function isEndgame() {
	return player.ex.points.gte(1)
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