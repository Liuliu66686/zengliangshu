addLayer("p", {
    name: "p", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "P", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "cyan",
    requires: new Decimal(10), // Can be a function that takes requirement increases into account
    resource: "声望", // Name of prestige currency
    baseResource: "点数", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        if(hasUpgrade("p",12)) mult = mult.mul(upgradeEffect("p",12))
        if(hasUpgrade("p",18)) mult = mult.mul(upgradeEffect("p",18))
        if(hasUpgrade("p",22)) mult = mult.mul(upgradeEffect("p",22))
        if(hasUpgrade("p",31)) mult = mult.mul(upgradeEffect("p",31))
        if(hasUpgrade("p",32)) mult = mult.mul(upgradeEffect("p",32))
        if(hasUpgrade("p",28)) mult = mult.mul(upgradeEffect("p",28))
        mult = powsoftcap(mult,layers.p.multsoftcap(),new Decimal(3))
        //2软前
        if(player.c.yellow.gt(1)) mult = mult.mul(layers.c.yellowEffect())
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        exp = new Decimal(1)
        if(hasUpgrade("p",13)) exp = exp.mul(upgradeEffect("p",13))
        if(hasUpgrade("p",24)) exp = exp.mul(upgradeEffect("p",24))
        if(hasUpgrade("p",26)) exp = exp.mul(upgradeEffect("p",26))
        if(hasUpgrade("m",11)) exp = exp.mul(upgradeEffect("m",11))
        if(hasUpgrade("p",36)) exp = exp.mul(1.5)
        if(player.e.neutron.gte(1)) exp = exp.mul(layers.e.neutronEffect())
        if(inChallenge("e",41)) exp = layers.e.neutronEffect()
        exp = powsoftcap(exp,layers.p.expsoftcap(),new Decimal(10))
        //2软前
        if(hasMilestone("e",5)) exp = exp.mul(layers.e.atomEffect2())
        if(hasUpgrade("m",33)) exp = exp.mul(upgradeEffect("m",33))
        //2软
        if(exp.gte(334.56)) exp = powsoftcap(exp,layers.p.expsoftcap2(),new Decimal(10))
        //3软前
        if(hasUpgrade("r",11)) exp = exp.mul(1.05)
        //挑战
        if(inChallenge("e",21)) exp = exp.mul(0.1)
        if(inChallenge("c",13)) exp = exp.mul(0.2)
        return exp
    },
    expsoftcap(){
        let start = new Decimal(28)
        if(hasUpgrade("p",36)) start = start.add(upgradeEffect("p",36))
        if(hasUpgrade("m",15)) start = start.add(upgradeEffect("m",15))
        if(getBuyableAmount("p",13).gte(1)) start = start.add(buyableEffect("p",13))
        return start
    },
    expsoftcap2(){
        let start = new Decimal(334.56)
        return start
    },
    multsoftcap(){
        let start = new Decimal("1e37500")
        if(hasUpgrade("p",29)) start = start.mul(upgradeEffect("p",29))
        if(hasUpgrade("m",14)) start = start.mul(upgradeEffect("m",14))
        return start
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    doReset(resettingLayer) {
        if (layers[resettingLayer].row > layers[this.layer].row) {
            let kept = []
            if (resettingLayer == "m") {
                if (hasMilestone("m", 4)) kept.push("upgrades")
            }
            if (resettingLayer == "e") {
                
            }
            layerDataReset(this.layer, kept)
        }
    },
    hotkeys: [
        {key: "p", description: "P: 进行声望重置", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return player.points.gte(3)||player.p.unlocked},
    resetsNothing() { return hasMilestone("m",3) },
    passiveGeneration() { 
        let a = new Decimal(0)
        if(hasMilestone("m",3)) a = a.max(0.0001)
        if(hasMilestone("m",4)) a = a.max(100)
        if(hasMilestone("r",1)) a = a.max(0.0001)
        return a
     },
    update(diff){
        if(player.r.upgradespautobuy) {
            buyUpgrade("p",11);buyUpgrade("p",12);buyUpgrade("p",13);buyUpgrade("p",14);buyUpgrade("p",15);buyUpgrade("p",16);buyUpgrade("p",17);buyUpgrade("p",18);buyUpgrade("p",19);buyUpgrade("p",21);buyUpgrade("p",22);buyUpgrade("p",23);buyUpgrade("p",24);buyUpgrade("p",25);buyUpgrade("p",26);buyUpgrade("p",27);buyUpgrade("p",28);buyUpgrade("p",29);buyUpgrade("p",31);buyUpgrade("p",32);buyUpgrade("p",33);buyUpgrade("p",35);buyUpgrade("p",36)
        }
    },
    upgrades:{
        11:{
            title:"增量开始",
            description:"点数加成点数获取",
            effect(){
                let a = player.points.root(2).add(1)
                if(a.gte(11)) a = a.div(10).root(2).mul(10)
                if(a.gte(10001)) a = a.div(10000).root(4).mul(10000)
                if(a.gte(1e60)) a = a.div(new Decimal(1e60).sub(1)).log10().mul(1e60)
                return a
            },
            effectDisplay(){return format(this.effect()) + "x"},
            cost: new Decimal(1)
            ,unlocked(){return true},
        },
        12:{
            title:"增量自协同",
            description:"声望加成声望获取",
            effect(){
                let a = player.p.points.root(2).add(1)
                if(a.gte(1000)) a = a.div(1000).root(2).mul(1000)
                if(a.gte(1e20)) a = a.div(1e20).root(3).mul(1e20)
                if(a.gte(1e160)) a = a.div(new Decimal(1e160).sub(1)).root(100).mul(1e160)
                if(a.gte(1e300)) a = a.div(new Decimal(1e300).sub(1)).log10().mul(1e300)
                return a
            },
            effectDisplay(){return format(upgradeEffect("p",12)) + "x"},
            cost: new Decimal(3)
            ,unlocked(){return hasUpgrade("p",11)},
        },
        13:{
            title:"指数",
            description:"声望获取^2",
            effect(){
                let a = new Decimal(2)
                if(getBuyableAmount("p",12).gte(1)&&!hasMilestone("m",2)) a = a.add(buyableEffect("p",12))
                if(hasMilestone("m",2)) a = a.add(4.1)
                return a
            },
            effectDisplay(){return "^" + format(upgradeEffect("p",13)) },
            cost: new Decimal(15)
            ,unlocked(){return hasUpgrade("p",12)},
        },
        14:{
            title:"另一个指数",
            description:"点数获取^2",
            effect(){
                let a = new Decimal(2)
                if(getBuyableAmount("p",11).gte(1)&&!hasMilestone("m",2)) a = a.add(buyableEffect("p",11))
                if(hasMilestone("m",2)) a = a.add(5)
                return a
            },
            effectDisplay(){return "^" + format(upgradeEffect("p",14)) },
            cost: new Decimal(1000)
            ,unlocked(){return hasUpgrade("p",13)},
        },
        15:{
            title:"反增长",
            description:"点数增幅，但点数越多此效果越差",
            effect(){
                let a = new Decimal(5000).div(player.points.root(3).add(1))
                if(a.gt(5000)) a = new Decimal(5000)
                if(a.lt(1)) a = one
                return a
            },
            effectDisplay(){return format(upgradeEffect("p",15)) + "x"},
            cost: new Decimal(1e9)
            ,unlocked(){return hasUpgrade("p",14)},
        },
        16:{
            title:"重复",
            description:"解锁一个购买项",
            unlocked(){return hasUpgrade("p",15)},
            cost: new Decimal(1.8e18)
        },
        17:{
            title:"声望点数",
            description:"声望加成点数获取",
            effect(){
                let a = player.p.points.root(2).add(1)
                if(a.gte(5000)) a = a.div(5000).root(2).mul(5000)
                if(a.gte(1e20)) a = a.div(1e20).root(3).mul(1e20)
                if(a.gte(1e200)) a = a.div(new Decimal(1e200).sub(1)).root(100).mul(1e200)
                if(a.gte(1e300)) a = a.div(new Decimal(1e300).sub(1)).log10().mul(1e300)
                return a
            },
            effectDisplay(){return format(upgradeEffect("p",17)) + "x"},
            cost: new Decimal(4.9e49)
            ,unlocked(){return hasUpgrade("p",16)},
        },
        18:{
            title:"点数声望",
            description:"点数加成声望获取",
            effect(){
                let a = player.points.div(1e100).root(2).add(1)
                if(a.gte(5000)) a = a.div(5000).root(2).mul(5000)
                if(a.gte(1e20)) a = a.div(1e20).root(8).mul(1e20)
                if(a.gte(1e200)) a = a.div(new Decimal(1e200).sub(1)).root(100).mul(1e200)
                if(a.gte(1e300)) a = a.div(new Decimal(1e300).sub(1)).log10().mul(1e300)
                a = a.pow(5)
                return a
            },
            effectDisplay(){return format(upgradeEffect("p",18)) + "x"},
            cost: new Decimal("1.35e1035")
            ,unlocked(){return hasUpgrade("p",17)},
        },
        19:{
        title:"又一个？",
        description:"解锁另一个购买项",
        cost: new Decimal("2.369e2369")
        ,unlocked(){return hasUpgrade("p",18)},
        },
        21:{
            title:"2P?",
            description:"解锁M层",
            cost: new Decimal("5.934e5934")
            ,unlocked(){return hasUpgrade("p",19)},
            },
        22:{
            title:"增量声望",
            description:"增量点以同等倍数加成声望",
            effect(){
                let a = layers.m.effect()
                return a
            },
            effectDisplay(){return  format(upgradeEffect("p",22)) + "x"},
            cost: new Decimal("6e5975")
            ,unlocked(){return hasUpgrade("p",21)&&hasMilestone("m",0)},
        },
        23:{
            title:"增量声望点数",
            description:"基于声望乘方点数",
            effect(){
                let a = player.p.points.add(1).log10().root(4).add(1)
                if(a.gte(1)) a = a.sub(1).div(20).add(1)
                if(a.gte(2)) a = a.sub(2).div(5).add(2)
                if(a.gte(3)) a = a.sub(3).root(10).add(3)
                if(a.gte(5)) a = a.sub(5).log10().add(5)
                if(a.gte(20)) a = a.sub(20).log10().add(20)
                return a
            },
            effectDisplay(){return "^" + format(upgradeEffect("p",23)) },
            cost: new Decimal("6.36e6036")
            ,unlocked(){return hasUpgrade("p",22)&&hasMilestone("m",0)},
        },
        24:{
            title:"增量点数声望",
            description:"基于点数乘方声望",
            effect(){
                let a = player.points.add(1).log10().root(4).add(1)
                if(a.gte(1)) a = a.sub(1).div(20).add(1)
                if(a.gte(2)) a = a.sub(2).div(5).add(2)
                if(a.gte(3)) a = a.sub(3).root(10).add(3)
                if(a.gte(5)) a = a.sub(5).log10().add(5)
                if(a.gte(20)) a = a.sub(20).log10().add(20)
                return a
            },
            effectDisplay(){return "^" + format(upgradeEffect("p",24)) },
            cost: new Decimal("9.31e9310")
            ,unlocked(){return hasUpgrade("p",23)&&hasMilestone("m",0)},
        },
        25:{
            title:"再次点数自协同？",
            description:"点数增幅点数指数",
            effect(){
                let a = player.points.add(1).log10().root(5).add(1)
                if(a.gte(1)) a = a.sub(1).div(20).add(1)
                if(a.gte(2)) a = a.sub(2).div(5).add(2)
                if(a.gte(3)) a = a.sub(3).root(10).add(3)
                if(a.gte(5)) a = a.sub(5).log10().add(5)
                if(a.gte(20)) a = a.sub(20).log10().add(20)
                return a
            },
            effectDisplay(){return "^" + format(upgradeEffect("p",25)) },
            cost(){return !hasUpgrade("p",34)?new Decimal("2e82828"):new Decimal("e1e5")}
            ,unlocked(){return hasUpgrade("p",24)&&hasMilestone("m",0)},
        },
        26:{
            title:"再次声望自协同！",
            description:"声望增幅声望指数",
            effect(){
                let a = player.p.points.add(1).log10().root(5).add(1)
                if(a.gte(1)) a = a.sub(1).div(20).add(1)
                if(a.gte(2)) a = a.sub(2).div(5).add(2)
                if(a.gte(3)) a = a.sub(3).root(10).add(3)
                if(a.gte(5)) a = a.sub(5).log10().add(5)
                if(a.gte(20)) a = a.sub(20).log10().add(20)
                return a
            },
            effectDisplay(){return "^" + format(upgradeEffect("p",26)) },
            cost: new Decimal("7e171717")
            ,unlocked(){return hasUpgrade("p",25)&&hasMilestone("m",0)},
        },
        27:{
            title:"移除反转上限移除",
            description:"移除“反转上限移除”，并在第三行添加一个新升级",
            cost: new Decimal("4e8.6e5")
            ,unlocked(){return hasUpgrade("p",26)&&hasMilestone("m",0)},
        },
        28:{
            title:"1170711",
            description:"声望获取x1e17071",
            effect(){
                let a = new Decimal("e17071")
                return a
            },
            effectDisplay(){return format(upgradeEffect("p",28)) + "x"},
            cost: new Decimal("e1770771")
            ,unlocked(){return hasUpgrade("p",27)&&hasMilestone("m",0)},
        },
        29:{
            title:"最后的拓展乘数软上限",
            description:"声望乘数软上限基于声望拓展",
            effect(){
                let a = player.p.points.root(1e3)
                if(a.gte("ee5")) a = a.div("ee5").log(10).mul("ee5")
                if(a.gte("eee1")) a = a.div("eee1").log(10).mul("eee1")
                a = a.add(1).mul("ee4")
                return a
            },
            effectDisplay(){return format(upgradeEffect("p",29)) + "x" + "<br>当前软上限: " + format(layers.p.multsoftcap()) + "<br>当前声望乘数: " + format(layers.p.gainMult())},
            cost: new Decimal("e2020202")            
            ,unlocked(){return hasUpgrade("p",28)&&hasMilestone("m",0)},
        },
        31:{
            title:"反增长声望",
            description:"声望增幅，但声望越多此效果越差",
            effect(){
                let a = new Decimal(1e20).div(player.p.points.root(300).add(1))
                if(a.gt(1e20)) a = new Decimal(1e20)
                if(a.lt(1)) a = new Decimal(1)
                return a
            },
            effectDisplay(){return format(upgradeEffect("p",31)) + "x"},
            cost: new Decimal(10)
            ,unlocked(){return hasMilestone("m",1)},
        },
        32:{
            title:"正增长声望",
            description:"声望增幅，但声望越多此效果越好(有上限)",
            effect(){
                let a = player.p.points.root((hasUpgrade("p",33))?50:300).add(1)
                if(a.gt(1e20)&&!hasUpgrade("p",33)) a = new Decimal(1e20)
                if(hasUpgrade("p",34)) a = a.pow(2)
                if(a.gt("e3000")&&hasUpgrade("p",34)) a = new Decimal("e3000")
                if(a.lt(1)) a = new Decimal(1)
                if(a.gt("ee6")) a = a.div("ee6").log10().mul("ee6")
                return a
            },
            effectDisplay(){return format(upgradeEffect("p",32)) + "x"},
            cost: new Decimal(1e100)
            ,unlocked(){return hasUpgrade("p",31)&&hasMilestone("m",1)},
        },
        33:{
            title:"上限移除",
            description:"移除“正增长声望”的硬上限，并更改公式",
            cost: new Decimal("e9329")
            ,unlocked(){return hasUpgrade("p",32)&&hasMilestone("m",1)},
        },
        34:{
            title:"反转上限移除",
            description:"修复“正增长声望”的硬上限，但增加上限并再次更改公式，购买后修改“再次声望自协同”的价格",
            cost: new Decimal("6e66666")
            ,unlocked(){return hasUpgrade("p",33)&&hasMilestone("m",1)&&!hasMilestone("m",3)&&!hasUpgrade("p",27)},
        },
        35:{
            title:"1234567",
            description:"点数获取x9e80（是的，你可以不选择上一个升级）",
            effect(){
                let a = new Decimal(9e80)
                return a
            },
            effectDisplay(){return format(upgradeEffect("p",35)) + "x"},
            cost: new Decimal("3e127654")            
            ,unlocked(){return hasUpgrade("p",33)&&hasMilestone("m",1)},
        },
        36:{
            title:"拓展指数软上限",
            description:"声望指数软上限+2,同时^1.5声望获取",
            effect(){
                let a = new Decimal(2)
                return a
            },
            effectDisplay(){return "+" + format(upgradeEffect("p",36)) + "<br>当前软上限: " + format(layers.p.expsoftcap()) + "<br>当前声望指数: " + format(layers.p.gainExp())},
            cost: new Decimal("e860001")            
            ,unlocked(){return hasUpgrade("p",35)&&hasMilestone("m",1)&&hasUpgrade("p",27)},
        },
    },    
  buyables:{
        11:{           
            title: "点数增幅",
            cost(x) { 
                let a = new Decimal(10).pow(x.mul(x.sub(10).max(1))).add(x.pow(2).mul(30)).mul(1e12) 
                if(x.gte(100)) a = a.pow(x.root(2).floor().sub(8.5))
                return a},
            display() { return "每升一级`另一个指数`效果增加0.1<br>价格：" + format(this.cost()) + "声望<br>当前等级：" + format(getBuyableAmount(this.layer, this.id)) + "<br>当前效果：+" + format(this.effect()) + "<br>上限：" + format(this.purchaseLimit())},
            effect(x){
                let a = new Decimal(0.1).mul(x)
                if(a.gte(2)) a = a.sub(2).div(2).add(2)
                if(x.gte(3.5)) a = a.sub(3.5).div(5).add(3.5)
                if(a.gte(10)) a = a.sub(10).div(5).add(10)
                
                return a
            },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            unlocked(){return hasUpgrade("p",16)&&!hasMilestone("m",2)},
            purchaseLimit(){return new Decimal(200)},
        },
        12:{           
            title: "声望增幅",
            cost(x) { 
                let a = new Decimal(10).pow(x.mul(x.sub(10).max(1))).add(x.pow(2).mul(30)).mul("1e2360") 
                if(x.gte(100)) a = a.pow(x.root(2).floor().sub(8.58))
                return a},
            display() { return "每升一级`指数`效果增加0.1<br>价格：" + format(this.cost()) + "声望<br>当前等级：" + format(getBuyableAmount(this.layer, this.id)) + "<br>当前效果：+" + format(this.effect()) + "<br>上限：" + format(this.purchaseLimit())},
            effect(x){
                let a = new Decimal(0.1).mul(x)
                if(a.gte(1)) a = a.sub(1).div(2).add(1)
                if(x.gte(2.5)) a = a.sub(2.5).div(5).add(2.5)
                if(a.gte(10)) a = a.sub(10).div(5).add(10)
                
                return a
            },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            purchaseLimit(){return new Decimal(200)},
            unlocked(){return hasUpgrade("p",19)&&!hasMilestone("m",2)},
            
        },
        13:{           
            title: "声望指数软上限增幅",
            cost(x) { 
                let a = two.pow(two.pow(x.add(ten)))
                return a},
            display() { return "每升一级声望指数软上限增加0.5<br>价格：" + format(this.cost()) + "声望<br>当前等级：" + format(getBuyableAmount(this.layer, this.id)) + "<br>当前效果：+" + format(this.effect()) + "<br>上限：" + format(this.purchaseLimit())},
            effect(x){
                let a = x.mul(0.5)
                if(hasMilestone("e",6)) a = a.mul(1.5)
                return a
            },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            purchaseLimit(){
                let a = new Decimal(20)
                if(hasMilestone("e",6)) a = a.mul(1.5)
                return a},
            unlocked(){return hasUpgrade("m",21)},
            
        },
    },
})
addLayer("m", {
    name: "m", 
    symbol: "M", 
    position: 1, 
    branches:["p"],
    startData() { return {                      
        unlocked: false,
		points: new Decimal(0),
    }},
    color: "blue",
    requires: new Decimal("e5900"), 
    resource: "倍增点",
    baseAmount() {return player.p.points},
    baseResource: "声望", 
    type: "normal", 
    exponent: 1e-4,
    gainMult() {
        let mult = new Decimal(1)
        if(player.e.proton.gte(1)) mult = mult.mul(layers.e.protonEffect())
        if(hasUpgrade("m",32)) mult = mult.mul(upgradeEffect("m",32))
        return mult
    },
    gainExp() { 
        let exp = new Decimal(1)
        if(hasChallenge("c",12)) exp = exp.mul(1.5)
        if(hasChallenge("c",13)) exp = exp.mul(1.1)
        if(hasUpgrade("r",13)) exp = exp.mul(1.05)
        return exp
    },
    effect() {
        let effect = player.m.points.pow(5).add(1)
        if(effect.gte(1e100)) effect = effect.div(1e100).root(2).mul(1e100)
        if(effect.gte("e2000")) effect = effect.div("e2000").root(5).mul("e2000")
        if(effect.gte("e10000")) effect = effect.div("e10000").root("ee1").mul("e10000")
        if(effect.gte("ee6")) effect = effect.div("ee6").log10().mul("ee6")
        if(hasUpgrade("m",13)) effect = effect.mul(upgradeEffect("m",13))
        if(inChallenge("e",12)) effect = one
        if(inChallenge("c",14)) effect = effect.pow(0.01)
        return effect
    },
    effectDescription() {
        return "增幅点数获取 " + format(layers.m.effect()) + " x" 
    },
    row: 1,
    passiveGeneration() { 
        let a = new Decimal(0)
        if(hasMilestone("m",5)) a = a.max(0.0001)
        if(hasMilestone("r",1)) a = a.max(0.0001)
        return a
     },
    hotkeys: [
        {key: "m", description: "M: 进行倍增点重置", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return hasUpgrade("p",21)||player.m.unlocked},
    milestones: {
        0:{
            requirementDescription:"4倍增点",
            effectDescription:"解锁更多声望升级（8个）（在第十个升级后）",
            done(){return player.m.points.gte(4)},
            unlocked(){return true}
        },
        1:{
            requirementDescription:"10倍增点",
            effectDescription:"解锁第三行声望升级（5个）",
            done(){return player.m.points.gte(10)},
            unlocked(){return hasMilestone("m",0)}
        },
        2:{
            requirementDescription:"1e30倍增点",
            effectDescription:"移除2个购买项，但是效果仍以200级输出",
            done(){return player.m.points.gte(1e30)},
            unlocked(){return hasMilestone("m",1)}
        },
        3:{
            requirementDescription:"1e250倍增点",
            effectDescription:"每秒自动获取0.01%的声望，同时声望不再重置任何东西，且永久移除“反转上限移除”",
            done(){return player.m.points.gte(1e250)},
            unlocked(){return hasMilestone("m",2)}
        },
        4:{
            requirementDescription:"1e399倍增点",
            effectDescription:"每秒自动获取10000%的声望，同时倍增点不再重置声望升级",
            done(){return player.m.points.gte("e399")},
            unlocked(){return hasMilestone("m",3)}
        },
        5:{
            requirementDescription:"1e1000倍增点",
            effectDescription:"每秒自动获取0.01%的倍增点",
            done(){return player.m.points.gte("e1000")},
            unlocked(){return hasMilestone("m",4)}
        },
    },
    upgrades:{
        11:{
            title:"纯声望获取",
            description:"声望获取^1.5",
            effect(){
                let a = new Decimal(1.5)
                return a
            },
            effectDisplay(){return "^" + format(upgradeEffect("m",11)) },
            cost: new Decimal(20),
            unlocked(){return player.m.points.gte(4)||hasUpgrade("m",11)}
        },
        12:{
            title:"纯点数获取",
            description:"点数获取^1.5",
            effect(){
                let a = new Decimal(1.5)
                return a
            },
            effectDisplay(){return "^" + format(upgradeEffect("m",12)) },
            cost: new Decimal(500),
            unlocked(){return hasUpgrade("m",11)}
        },
        13:{
            title:"加成加成",
            description:"基于倍增点加成倍增点效果",
            effect(){
                let effect = player.m.points.pow(3)
                if(effect.gte(1.79e308)) effect = effect.div(1.79e308).root(100).mul(1.79e308)
                if(effect.gte("e2000")) effect = effect.div("e2000").root(5000).mul("e2000")
                if(effect.gte("e10000")) effect = effect.div("e10000").root("ee1").mul("e10000")
                if(effect.gte("ee6")) effect = effect.div("ee6").log10().mul("ee6")
                return effect
            },
            effectDisplay(){return format(upgradeEffect("m",13)) + "x" },
            cost: new Decimal(4.6e46),
            unlocked(){return hasUpgrade("m",12)}
        },
        14:{
            title:"声望软上限拓展",
            description:"基于倍增点拓展声望的乘数软上限",
            effect(){
                let a = player.m.points.pow(21)
                if(a.gte("1.79e30008")) a = a.div("1.79e30008").root(20).mul("1.79e30008")
                if(a.gte("ee6")) a = a.div("ee6").log10().mul("ee6")
                return a
            },
            effectDisplay(){return format(upgradeEffect("m",14)) + "x" },
            cost: new Decimal(2.51e251),
            unlocked(){return hasUpgrade("m",13)}
        },
        15:{
            title:"声望软上限拓展2",
            description:"基于倍增点拓展声望的指数软上限",
            effect(){
                let a = player.m.points.log10().root(3)
                if(a.gte(10)) a = a.sub(10).div(5).add(10)
                if(a.gte(100)) a = a.div(100).log10().add(100)
                return a
            },
            effectDisplay(){return "+" + format(upgradeEffect("m",15))},
            cost: new Decimal(2.7e270),
            unlocked(){return hasUpgrade("m",14)}
        },
        21:{
            title:"2^2^(x+10)",
            description:"解锁第三个声望层购买项",
            cost: new Decimal("e400"),
            unlocked(){return hasUpgrade("m",15)}
        },
        22:{
            title:"点数指数软上限拓展",
            description:"点数指数软上限+2,同时^1.5点数获取",
            effect(){
                let a = new Decimal(2)
                return a
            },
            effectDisplay(){return "+" + format(this.effect()) + "<br>当前软上限: " + format(pointgainsoftcaps.gainexpsoftcap1())},
            cost: new Decimal("3.23e645")            
            ,unlocked(){return hasUpgrade("m",21)},
        
        },
        23:{
            title:"元素价格降低",
            description:"基于声望和倍增点降低元素价格",
            effect(){
                let a = player.p.points.pow(player.m.points.log10().root(2))
                return a
            },
            effectDisplay(){return "/" + format(upgradeEffect("m",23))},
            cost: new Decimal("4.58e854"),
            unlocked(){return hasUpgrade("m",22)&&player.e.unlocked}
        },
        24:{
            title:"点数提升",
            description:"点数获取^2(在一软后)",
            effect(){
                let a = two
                return a
            },
            effectDisplay(){return "^" + format(this.effect())},
            cost: new Decimal("e13143"),
            unlocked(){return hasUpgrade("m",23)&&player.c.unlocked}
        },
        25:{
            title:"点数指数软上限拓展2",
            description:"点数获取指数第二重软上限基于倍增点拓展",
            effect(){
                let a = player.m.points.log10().log10()
                if(a.gt(10)) a = a.div(10).log10().add(10)
                if(a.gt(20)) a = a.div(20).log10().add(20)
                if(a.gt(100)) a = a.div(100).slog().add(100)
                return a
            },
            effectDisplay(){return "+" + format(this.effect()) + "<br>当前软上限: " + format(pointgainsoftcaps.gainexpsoftcap2())},
            cost: new Decimal("e17494"),
            unlocked(){return hasUpgrade("m",24)&&player.c.unlocked}
        },
        31:{
            title:"购买项？",
            description:"解锁粒子购买项",
            cost: new Decimal("1.77e1177"),
            unlocked(){return hasUpgrade("e",42)&&player.e.unlocked}
        },
        32:{
            title:"倍增？",
            description:"基于倍增点倍增倍增点获取",
            effect(){
                let a = player.m.points.root(10)
                if(a.gt("ee3")) a = a.div("ee3").root("e1").mul("ee3")
                return a
            },
            effectDisplay(){return format(this.effect()) + "x"},
            cost: new Decimal("e20367"),
            unlocked(){return hasUpgrade("m",31)&&player.e.unlocked}
        },
        33:{
            title:"增量！",
            description:"基于倍增点乘方声望获取(1软后)",
            effect(){
                let a = player.m.points.log10().log10()
                if(a.gt(5)) a = a.div(5).log10().log10().add(5)
                if(a.gt(20)) a = a.div(20).log10().log10().add(20)
                if(a.gt(100)) a = a.div(100).slog().add(100)
                return a
            },
            effectDisplay(){return "^" + format(this.effect())},
            cost: new Decimal("e37741"),
            unlocked(){return hasUpgrade("m",32)&&player.e.unlocked}
        },
        34:{
            title:"声望---点数",
            description:"基于声望和倍增点加成点数(1软后)",
            effect(){
                let a = player.p.points.add(1).log(2).mul(player.m.points.root(1000))
                return a
            },
            effectDisplay(){return format(this.effect()) + "x"},
            cost: new Decimal("e50620"),
            unlocked(){return hasUpgrade("m",33)&&player.c.unlocked}
        },
        35:{
            title:"点数+x^",
            description:"基于倍增点加成点数指数(1软后)",
            effect(){
                let a = player.m.points.log10().log10().root(2)
                if(a.gt(8)) a = a.div(8).log10().log10().add(8)
                if(a.gt(30)) a = a.div(30).log10().log10().add(30)
                if(a.gt(200)) a = a.div(200).slog().add(200)
                return a
            },
            effectDisplay(){return "^" + format(this.effect())},
            cost: new Decimal("e51520"),
            unlocked(){return hasUpgrade("m",34)&&player.c.unlocked}
        },
    },
})
addLayer("e", {
    name: "E", 
    symbol: "E", 
    position: 2, 
    branches:["p"],
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
        electron: new Decimal(0),//电子
        proton: new Decimal(0),//质子
        neutron: new Decimal(0),//中子
        atom: new Decimal(0),//原子
        electronOpen: false,//电子
        protonOpen: false,//质子
        neutronOpen: false,//中子
    }},
    color: "green",
    requires: new Decimal("e7188718"), 
    resource: "元素", 
    baseResource: "声望", 
    baseAmount() {return player.p.points},
    type: "static", 
    exponent: 15,
    gainMult() {
        mult = new Decimal(1)
        if(hasUpgrade("m",23)) mult = mult.div(upgradeEffect("m",23))
        if(hasUpgrade("e",13)) mult = mult.div(upgradeEffect("e",13))
        if(hasUpgrade("e",43)) mult = mult.div(upgradeEffect("e",43))
        if(hasUpgrade("e",73)) mult = mult.div(upgradeEffect("e",73))
        return mult
    },
    gainExp() { 
        return new Decimal(1)
    },
    electronGet(){
        let get = new Decimal(2).pow(player.e.points).mul(5)
        if(hasChallenge("e",11)) get = get.mul(100)
        if(hasUpgrade("e",11)) get = get.mul(upgradeEffect("e",11))
        if(hasUpgrade("e",12)) get = get.mul(upgradeEffect("e",12))
        if(getBuyableAmount("e",11).gte(1)) get = get.mul(buyableEffect("e",11))
        if(hasChallenge("e",41)) get = get.mul(challengeEffect("e",41))
        if(player.c.orange.gt(1)) get = get.mul(layers.c.orangeEffect())
        if(hasUpgrade("r",14)) get = get.mul(5)
        if(player.e.electron.gte(layers.e.electronLimit())) {
            get = zero
            player.e.electron = layers.e.electronLimit()
        }
        if(get.gte(layers.e.electronLimit())) get = layers.e.electronLimit()
        return get
    },
    protonGet(){
        let get = player.e.points
        if(hasChallenge("e",12)) get = get.mul(100)
        if(hasUpgrade("e",41)) get = get.mul(upgradeEffect("e",41))
        if(hasUpgrade("e",42)) get = get.mul(upgradeEffect("e",42))
        if(getBuyableAmount("e",12).gte(1)) get = get.mul(buyableEffect("e",12))
        if(hasChallenge("e",31)) get = get.mul(challengeEffect("e",31))
        if(hasUpgrade("r",14)) get = get.mul(5)
        if(player.e.proton.gte(layers.e.protonLimit())) {
            get = zero
            player.e.proton = layers.e.protonLimit()
        }
        if(get.gte(layers.e.protonLimit())) get = layers.e.protonLimit()
        return get
    },
    neutronGet(){
        let get = player.e.points.pow(2)
        if(hasChallenge("e",21)) get = get.mul(100)
        if(hasUpgrade("e",71)) get = get.mul(upgradeEffect("e",71))
        if(hasUpgrade("e",72)) get = get.mul(upgradeEffect("e",72))
        if(getBuyableAmount("e",13).gte(1)) get = get.mul(buyableEffect("e",13))
        if(hasChallenge("e",32)) get = get.mul(challengeEffect("e",32))
        if(hasUpgrade("r",14)) get = get.mul(5)
        if(player.e.neutron.gte(layers.e.neutronLimit())) {
            get = zero
            player.e.neutron = layers.e.neutronLimit()
        }
        if(get.gte(layers.e.neutronLimit())) get = layers.e.neutronLimit()
        return get
    },
    atomGet(){
        let a = player.e.electron.add(1).log(2).min(player.e.proton).min(player.e.neutron.root(2))
        return a
    },
    electronEffect(){
        let a = player.e.electron.mul(100).pow(100)
        if(a.gte("e1000")) a = a.div("e1000").root(5).mul("e1000")
        if(player.e.atom.gte(79)) a = a.pow(layers.e.atomEffect())
        if(inChallenge("c",12)) a = one
        return a
    },
    protonEffect(){
        let a = player.e.proton.mul(10)
        if(hasUpgrade("e",44)) a = a.pow(upgradeEffect("e",44))
        if(player.e.atom.gte(79)) a = a.pow(layers.e.atomEffect())
        return a
    },
    neutronEffect(){
       let a = player.e.neutron.add(1).log10()
       if(a.gte(10)) a = a.sub(10).div(5).add(10)
       if(a.lt(1)) a = new Decimal(1)
       if(hasUpgrade("e",74)) a = a.pow(upgradeEffect("e",74))
       if(player.e.atom.gte(79)) a = a.mul(layers.e.atomEffect2())
       return a
    },
    atomEffect(){
        let a = player.e.atom.sub(78).max(1).root(2)
        if(a.gte(18)) a = a.sub(18).div(1000).add(18)
        return a
    },
    atomEffect2(){
        let a = player.e.atom.sub(78).max(1).root(3)
        if(a.gte(8)) a = a.sub(8).div(1000).add(8)
        return a
    },
    electronLimit(){
        let a = new Decimal(2e35)
        return a
    },
    protonLimit(){
        let a = new Decimal(3e15)
        return a
    },
    neutronLimit(){
        let a = new Decimal(3e16)
        return a
    },
    row: 1,
    hotkeys: [
        {key: "e", description: "E: 进行元素重置", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return player.m.points.gte(two.pow(1024))||player.e.unlocked},
    milestones: {
        0:{
            requirementDescription:"2元素",
            effectDescription:"解锁电子",
            done(){return player.e.points.gte(2)},
            unlocked(){return true}
        },
        1:{
            requirementDescription:"3元素",
            effectDescription:"解锁质子",
            done(){return player.e.points.gte(3)},
            unlocked(){return hasMilestone("e",0)}
        },
        2:{
            requirementDescription:"4元素",
            effectDescription:"解锁中子",
            done(){return player.e.points.gte(4)},
            unlocked(){return hasMilestone("e",1)}
        },
        3:{
            requirementDescription:"5元素",
            effectDescription:"解锁挑战",
            done(){return player.e.points.gte(5)},
            unlocked(){return hasMilestone("e",2)}
        },
        4:{
            requirementDescription:"12元素",
            effectDescription:"(小小的挂一下吧)解锁新层级",
            done(){return player.e.points.gte(12)},
            unlocked(){return hasMilestone("e",3)}
        },
        5:{
            requirementDescription:"88.88原子",
            effectDescription:"生产中子时同时生产电子和质子（效果保持），原子的加成中子的效果乘方声望获取（在一重软上限后）",
            done(){return player.e.atom.gte(88.88)},
            unlocked(){return hasMilestone("e",4)}
        },
        6:{
            requirementDescription:"100原子",
            effectDescription:"声望指数软上限增幅购买上限x1.5，效果x1.5",
            done(){return player.e.atom.gte(100)},
            unlocked(){return hasMilestone("e",5)}
        },
    },
    clickables:{
        11:{
            title:"电子",
            display() {return "根据元素数量生产电子"},
            unlocked() {return hasMilestone("e",0)},
            style() { return { 'background-color': this.canClick()?"cyan":"#BF8F8F", filter: "brightness(" + new Decimal(100) + "%)", color: "#000000",'border-radius': "36px", height: "160px", width: "160px" } },
            canClick() { return hasMilestone("e",0)&&!player.e.electronOpen},
            onClick() {
                player.e.electronOpen = true
                player.e.protonOpen = false
                player.e.neutronOpen = false
            },
        },
        12:{
            title:"质子",
            display() {return "根据元素数量生产质子"},
            unlocked() {return hasMilestone("e",1)},
            style() { return { 'background-color': this.canClick()?"cyan":"#BF8F8F", filter: "brightness(" + new Decimal(100) + "%)", color: "#000000",'border-radius': "36px", height: "160px", width: "160px" } },
            canClick() { return hasMilestone("e",1)&&!player.e.protonOpen},
            onClick() {
                player.e.electronOpen = false
                player.e.protonOpen = true
                player.e.neutronOpen = false
            },
        },
        13:{
            title:"中子",
            display() {return "根据元素数量生产中子"},
            unlocked() {return hasMilestone("e",2)},
            style() { return { 'background-color': this.canClick()?"cyan":"#BF8F8F", filter: "brightness(" + new Decimal(100) + "%)", color: "#000000",'border-radius': "36px", height: "160px", width: "160px" } },
            canClick() { return hasMilestone("e",2)&&!player.e.neutronOpen},
            onClick() {
                player.e.electronOpen = false
                player.e.protonOpen = false
                player.e.neutronOpen = true
                if(hasMilestone("e",5)){
                    player.e.electronOpen = true
                    player.e.protonOpen = true
                }
            },
        },
        21:{
            title:"关闭",
            display() {return "关闭生产"},
            unlocked() {return hasMilestone("e",0)},
            canClick() { return player.e.neutronOpen||player.e.protonOpen||player.e.electronOpen},
            onClick() {
                player.e.electronOpen = false
                player.e.protonOpen = false
                player.e.neutronOpen = false
            },
        },
    },
    update(diff){
        if(player.e.electronOpen) player.e.electron = player.e.electron.add(layers.e.electronGet().mul(diff))//.mul(0)*/n(2e23)
        if(player.e.protonOpen) player.e.proton = player.e.proton.add(layers.e.protonGet().mul(diff))//.mul(0)*/n(8e13)
        if(player.e.neutronOpen) player.e.neutron = player.e.neutron.add(layers.e.neutronGet().mul(diff))//.mul(0)*/n(3e15)
        if(hasChallenge("e",42)) player.e.atom = layers.e.atomGet()
    },
    challenges: {
        11: {
            name: "电子挑战",
            challengeDescription(){ 
                let a = "点数获取^0.1"
                if(!hasChallenge("e",11)) a = a + "（未完成）"
                if(hasChallenge("e",11)) a = a + "（已完成）"
                return a },
                goalDescription(){return "获得1e13818点数"},
                rewardDescription(){return "电子获取x100"},
            canComplete: function() {return player.points.gte("e13818")},      
            unlocked(){return hasMilestone("e",3)},      
        },
        12: {
            name: "质子挑战",
            challengeDescription(){ 
                let a = "倍增点效果失效"
                if(!hasChallenge("e",12)) a = a + "（未完成）"
                if(hasChallenge("e",12)) a = a + "（已完成）"
                return a },
                goalDescription(){return "获得1e49767点数"},
                rewardDescription(){return "质子获取x100"},
            canComplete: function() {return player.points.gte("e49767")}, 
            unlocked(){return hasMilestone("e",3)},             
        },
        21: {
            name: "中子挑战",
            challengeDescription(){ 
                let a = "声望获取^0.1"
                if(!hasChallenge("e",21)) a = a + "（未完成）"
                if(hasChallenge("e",21)) a = a + "（已完成）"
                return a },
                goalDescription(){return "获得1e404764声望"},
                rewardDescription(){return "中子获取x100"},
            canComplete: function() {return player.p.points.gte("e404764")}, 
            unlocked(){return hasMilestone("e",3)},             
        },
        22: {
            name: "粒子挑战",
            challengeDescription(){ 
                let a = "上述挑战同时生效"
                if(!hasChallenge("e",22)) a = a + "（未完成）"
                if(hasChallenge("e",22)) a = a + "（已完成）"
                return a },
                goalDescription(){return "获得1e5705声望"},
                rewardDescription(){return "解锁粒子升级"},
                countsAs: [11,12,21],
            canComplete: function() {return player.p.points.gte("e5705")}, 
            unlocked(){return hasMilestone("e",3)},             
        },
        31: {
            name: "电子挑战II",
            challengeDescription(){ 
                let a = "点数获取指数为1"
                if(!hasChallenge("e",31)) a = a + "（未完成）"
                if(hasChallenge("e",31)) a = a + "（已完成）"
                return a },
                goalDescription(){return "获得1e4361点数"},
                rewardDescription(){return "电子加成质子获取<br>当前：" + format(this.rewardEffect()) + "x"},
                rewardEffect(){
                    let a = player.e.electron.add(1).log10()
                    return a
                },
            canComplete: function() {return player.points.gte("e4361")},      
            unlocked(){return hasUpgrade("e",15)},      
        },
        32: {
            name: "质子挑战II",
            challengeDescription(){ 
                let a = "倍增点效果失效,声望获取^0.1"
                if(!hasChallenge("e",32)) a = a + "（未完成）"
                if(hasChallenge("e",32)) a = a + "（已完成）"
                return a },
                countsAs: [12,21],
                goalDescription(){return "获得1e227134声望"},
                rewardDescription(){return "质子加成中子获取<br>当前：" + format(this.rewardEffect()) + "x"},
                rewardEffect(){
                    let a = player.e.proton.add(1).log10()
                    return a
                },
            canComplete: function() {return player.p.points.gte("e227134")},      
            unlocked(){return hasUpgrade("e",45)},      
        },
        41: {
            name: "中子挑战II",
            challengeDescription(){ 
                let a = "在第一层声望获取指数软上限前，只有中子可以加成声望获取指数"
                if(!hasChallenge("e",41)) a = a + "（未完成）"
                if(hasChallenge("e",41)) a = a + "（已完成）"
                return a },
                goalDescription(){return "获得e7301910声望,"},
                rewardDescription(){return "中子加成电子获取<br>当前：" + format(this.rewardEffect()) + "x，同时解锁一个新挑战"},
                rewardEffect(){
                    let a = player.e.neutron.add(1).log10()
                    return a
                },
            canComplete: function() {return player.p.points.gte("e7301910")},      
            unlocked(){return hasUpgrade("e",75)},      
        },
        42: {
            name: "粒子挑战II",
            challengeDescription(){ 
                let a = "上面三个挑战同时进行"
                if(!hasChallenge("e",42)) a = a + "（未完成）"
                if(hasChallenge("e",42)) a = a + "（已完成）"
                return a },
                countsAs: [31,12,21,41],
                goalDescription(){return "获得1e4755声望"},
                rewardDescription(){return "解锁原子"},
            canComplete: function() {return player.p.points.gte("e4755")},      
            unlocked(){return hasChallenge("e",41)},      
        },
    },
    upgrades: {
        11:{
            title:"电子I",
            description:"电子获取x100",
            effect(){
                let a = new Decimal(100)
                return a
            },
            effectDisplay(){return format(this.effect()) + "x"},
            cost: new Decimal(1600000),
            currencyDisplayName: "电子",
            currencyInternalName: "electron",
            currencyLayer: "e",
            unlocked(){return hasChallenge("e",22)},
        },
        12:{
            title:"电子II",
            description:"点数加成电子获取",
            effect(){
                let a = player.points.add(1).log10().root(3)
                if(a.gte("e1000")) a = a.div("e1000").log10().mul("e1000")
                return a
            },
            effectDisplay(){return format(this.effect()) + "x"},
            cost: new Decimal(1.6e8),
            currencyDisplayName: "电子",
            currencyInternalName: "electron",
            currencyLayer: "e",
            unlocked(){return hasUpgrade("e",11)},
        },
        13:{
            title:"电子III",
            description:"电子降低元素价格",
            effect(){
                let a = ten.pow(player.e.electron)
                if(a.gte("ee13")) a = a.div("ee13").root("ee2").mul("ee13")
                return a
            },
            effectDisplay(){return "/" + format(this.effect()) },
            cost: new Decimal(8e9),
            currencyDisplayName: "电子",
            currencyInternalName: "electron",
            currencyLayer: "e",
            unlocked(){return hasUpgrade("e",12)},
        },
        14:{
            title:"电子IV",
            description:"电子可购买效果基础+1",
            effect(){
                let a = one
                return a
            },
            effectDisplay(){return "+" + format(this.effect()) },
            cost: new Decimal(4.8e14),
            currencyDisplayName: "电子",
            currencyInternalName: "electron",
            currencyLayer: "e",
            unlocked(){return hasUpgrade("e",13)},
        },
        15:{
            title:"电子V",
            description:"解锁一个新挑战",
            cost: new Decimal(2.39e19),
            currencyDisplayName: "电子",
            currencyInternalName: "electron",
            currencyLayer: "e",
            unlocked(){return hasUpgrade("e",14)},
        },
        41:{
            title:"质子I",
            description:"质子获取x100",
            effect(){
                let a = new Decimal(100)
                return a
            },
            effectDisplay(){return format(this.effect()) + "x"},
            cost: new Decimal(50000),
            currencyDisplayName: "质子",
            currencyInternalName: "proton",
            currencyLayer: "e",
            unlocked(){return hasChallenge("e",22)},
        },
        42:{
            title:"质子II",
            description:"倍增点加成质子获取",
            effect(){
                let a = player.m.points.add(1).log10().root(2)
                if(a.gte("e1000")) a = a.div("e1000").log10().mul("e1000")
                return a
            },
            effectDisplay(){return format(this.effect()) + "x"},
            cost: new Decimal(5000000),
            currencyDisplayName: "质子",
            currencyInternalName: "proton",
            currencyLayer: "e",
            unlocked(){return hasUpgrade("e",41)},
        },
        43:{
            title:"质子III",
            description:"质子降低元素价格",
            effect(){
                let a = ten.pow(player.e.proton.mul(2))
                if(a.gte("e2e15")) a = a.div("e2e15").root("ee2").mul("e2e15")
                return a
            },
            effectDisplay(){return "/" + format(this.effect()) },           
            cost: new Decimal(1.5e7),
            currencyDisplayName: "质子",
            currencyInternalName: "proton",
            currencyLayer: "e",
            unlocked(){return hasUpgrade("e",42)},
        },
        44:{
            title:"质子IV",
            description:"质子效果^10",
            effect(){
                let a = ten
                return a
            },
            effectDisplay(){return "^" + format(this.effect()) },
            cost: new Decimal(8.52e10),
            currencyDisplayName: "质子",
            currencyInternalName: "proton",
            currencyLayer: "e",
            unlocked(){return hasUpgrade("e",43)},
        },
        45:{
            title:"质子V",
            description:"解锁一个新挑战",
            cost: new Decimal(4e12),
            currencyDisplayName: "质子",
            currencyInternalName: "proton",
            currencyLayer: "e",
            unlocked(){return hasUpgrade("e",44)},
        },
        71:{
            title:"中子I",
            description:"中子获取x100",
            effect(){
                let a = new Decimal(100)
                return a
            },
            effectDisplay(){return format(this.effect()) + "x"},
            cost: new Decimal(250000),
            currencyDisplayName: "中子",
            currencyInternalName: "neutron",
            currencyLayer: "e",
            unlocked(){return hasChallenge("e",22)},
        },
        72:{
            title:"中子II",
            description:"声望加成中子获取",
            effect(){
                let a = player.p.points.add(1).log10().root(4)
                if(a.gte("e1000")) a = a.div("e1000").log10().mul("e1000")
                return a
            },
            effectDisplay(){return format(this.effect()) + "x"},
            cost: new Decimal(25000000),
            currencyDisplayName: "中子",
            currencyInternalName: "neutron",
            currencyLayer: "e",
            unlocked(){return hasUpgrade("e",71)},
        },
        73:{
            title:"中子III",
            description:"中子降低元素价格",
            effect(){
                let a = ten.pow(player.e.neutron)
                if(a.gte("ee15")) a = a.div("ee15").root("ee1").mul("ee15")
                return a
            },
            effectDisplay(){return "/" + format(this.effect())},
            cost: new Decimal(1.25e8),
            currencyDisplayName: "中子",
            currencyInternalName: "neutron",
            currencyLayer: "e",
            unlocked(){return hasUpgrade("e",72)},
        },
        74:{
            title:"中子IV",
            description:"中子效果^1.5",
            effect(){
                let a = one.add(0.5)
                return a
            },
            effectDisplay(){return "^" + format(this.effect())},
            cost: new Decimal(7.2e12),
            currencyDisplayName: "中子",
            currencyInternalName: "neutron",
            currencyLayer: "e",
            unlocked(){return hasUpgrade("e",73)},
        },
        75:{
            title:"中子V",
            description:"解锁一个新挑战",
            cost: new Decimal(1e15),
            currencyDisplayName: "中子",
            currencyInternalName: "neutron",
            currencyLayer: "e",
            unlocked(){return hasUpgrade("e",74)},
        },
    },
    buyables: {
        11: {
            title: "电子加成",
            cost(x) { return ten.pow(x.add(1)) },
            display() { return "每级翻倍电子获取<br>价格：" + format(this.cost()) + "电子<br>当前等级：" + format(getBuyableAmount(this.layer, this.id)) + "<br>当前效果：" + format(this.effect()) + "x<br>上限：" + format(this.purchaseLimit())},
            canAfford() { return player[this.layer].electron.gte(this.cost()) },
            buy() {
                player[this.layer].electron = player[this.layer].electron.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect(x){
                let eff = two
                if(hasUpgrade("e",14)) eff = eff.add(1)
                eff = eff.pow(x)
                return eff
            },
            purchaseLimit(){return new Decimal(200)},
            unlocked(){return hasUpgrade("m",31)},
        },
    12: {
        title: "质子加成",
        cost(x) { return ten.pow(x.add(1)) },
        display() { return "每级翻倍质子获取<br>价格：" + format(this.cost()) + "质子<br>当前等级：" + format(getBuyableAmount(this.layer, this.id)) + "<br>当前效果：" + format(this.effect()) + "x<br>上限：" + format(this.purchaseLimit())},
        canAfford() { return player[this.layer].proton.gte(this.cost()) },
        buy() {
            player[this.layer].proton = player[this.layer].proton.sub(this.cost())
            setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
        },
        effect(x){
            let eff = two.pow(x)
            return eff
        },
        purchaseLimit(){return new Decimal(200)},
        unlocked(){return hasUpgrade("m",31)},
        },
    13: {
            title: "中子加成",
            cost(x) { return ten.pow(x.add(1)) },
            display() { return "每级翻倍中子获取<br>价格：" + format(this.cost()) + "中子<br>当前等级：" + format(getBuyableAmount(this.layer, this.id)) + "<br>当前效果：" + format(this.effect()) + "x<br>上限：" + format(this.purchaseLimit())},
            canAfford() { return player[this.layer].neutron.gte(this.cost()) },
            buy() {
                player[this.layer].neutron = player[this.layer].neutron.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect(x){
                let eff = two.pow(x)
                return eff
            },
            purchaseLimit(){return new Decimal(200)},
            unlocked(){return hasUpgrade("m",31)},
    },
    },
    tabFormat: {    
        "homepage": {   
            content: [
                "main-display",
                "prestige-button",
                "blank",
                ["clickables",[1,2]],
                "blank",
                ["display-text",
                    function(){
                        let a = ""
                        if(player.e.electronOpen) a = "电子"
                        if(player.e.protonOpen) a = "质子"
                        if(player.e.neutronOpen) a = "中子"
                        return "当前模式：生产" + a 
                    }],
                    ["display-text",function(){
                        let a = "你有" + format(player.e.electron) + "电子(+" + format(layers.e.electronGet()) + "/s)，加成点数" + format(layers.e.electronEffect()) + "x(在1重软上限后)"
                        if(player.e.electron.gte(layers.e.electronLimit())) a = a + "(电子数量已达硬上限)"
                        if(!hasMilestone("e",0)) a = ""
                        return a
                    }],
                    ["display-text",function(){
                        let a = "你有" + format(player.e.proton) + "质子(+" + format(layers.e.protonGet()) + "/s)，加成倍增点获取" + format(layers.e.protonEffect()) + "x"
                        if(player.e.proton.gte(layers.e.protonLimit())) a = a + "(质子数量已达硬上限)"
                        if(!hasMilestone("e",1)) a = ""
                        return a
                    }],
                    ["display-text",function(){
                        let a = "你有" + format(player.e.neutron) + "中子(+" + format(layers.e.neutronGet()) + "/s)，加成声望获取^" + format(layers.e.neutronEffect()) 
                        if(player.e.neutron.gte(layers.e.neutronLimit())) a = a + "(中子数量已达硬上限)"
                        if(!hasMilestone("e",1)) a = ""
                        return a
                    }],
                    ["display-text",function(){
                        let a = "你有" + format(player.e.atom) + "原子（基于电子，质子，中子），加成电子，质子效果^" + format(layers.e.atomEffect()) + "，中子效果" + format(layers.e.atomEffect2()) + "x(在79原子后开始)"
                        if(!hasChallenge("e",42)) a = ""
                        return a
                    }],
                    "blank",["challenges",[1,2,3,4]]
            ],
        },
        "milestones": {   
            content: [
                "main-display",
                "prestige-button",
                "blank",
                "milestones",
                
            ],
        },
        "particle-upgrades": {
            content: [
                "main-display",
                "prestige-button","blank",
                ["display-text",
                    function(){
                        let a = ""
                        if(player.e.electronOpen) a = "电子"
                        if(player.e.protonOpen) a = "质子"
                        if(player.e.neutronOpen) a = "中子"
                        return "当前模式：生产" + a 
                    }],
                    ["display-text",function(){
                        let a = "你有" + format(player.e.electron) + "电子(+" + format(layers.e.electronGet()) + "/s)，加成点数" + format(layers.e.electronEffect()) + "x(在1重软上限后)"
                        if(player.e.electron.gte(layers.e.electronLimit())) a = a + "(电子数量已达硬上限)"
                        if(!hasMilestone("e",0)) a = ""
                        return a
                    }],
                    ["display-text",function(){
                        let a = "你有" + format(player.e.proton) + "质子(+" + format(layers.e.protonGet()) + "/s)，加成倍增点获取" + format(layers.e.protonEffect()) + "x"
                        if(player.e.proton.gte(layers.e.protonLimit())) a = a + "(质子数量已达硬上限)"
                        if(!hasMilestone("e",1)) a = ""
                        return a
                    }],
                    ["display-text",function(){
                        let a = "你有" + format(player.e.neutron) + "中子(+" + format(layers.e.neutronGet()) + "/s)，加成声望获取^" + format(layers.e.neutronEffect()) 
                        if(player.e.neutron.gte(layers.e.neutronLimit())) a = a + "(中子数量已达硬上限)"
                        if(!hasMilestone("e",2)) a = ""
                        return a
                    }],
                    ["display-text",function(){
                        let a = "你有" + format(player.e.atom) + "原子（基于电子，质子，中子），加成电子，质子效果^" + format(layers.e.atomEffect()) + "，中子效果" + format(layers.e.atomEffect2()) + "x(在79原子后开始)"
                        if(!hasChallenge("e",42)) a = ""
                        return a
                    }],"blank",
                    ["upgrades",[1,2,3,4,5,6,7,8,9]],
                    "blank",["buyables",[1]]
            ],
            unlocked(){return hasChallenge("e",22)},
        },
    },
})
addLayer("c", {
    name: "C", 
    symbol: "C", 
    position: 3, 
    branches: ["e","p"],
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
        red: new Decimal(0),
        orange: new Decimal(0),
        yellow: new Decimal(0),
        green: new Decimal(0),
        cyan: new Decimal(0),
        blue: new Decimal(0),
        purple: new Decimal(0),
        pink: new Decimal(0),
        colorOpening: false,
    }},
    color: "red",
    requires: new Decimal("e222222"), 
    resource: "颜色", 
    baseResource: "点数", 
    baseAmount() {return player.points}, 
    type: "static", 
    exponent: 20,
    gainMult() {
        mult = new Decimal(1)
        if(hasChallenge("c",11)) mult = mult.div("e1.049e9")
        return mult
    },
    gainExp() { 
        return new Decimal(1)
    },
    redGet(){
        let a = two.pow(player.c.points)
        if(hasUpgrade("r",15)) a = a.mul(4)

        if(!player.c.colorOpening) a = zero
        if(player.c.red.gte(layers.c.redLimit())) {
            a = zero
            player.c.red = layers.c.redLimit()
        }
        return a
    },
    orangeGet(){
        let a = player.c.points.pow(4)
        if(hasUpgrade("r",15)) a = a.mul(4)

        if(!player.c.colorOpening) a = zero
        if(player.c.orange.gte(layers.c.orangeLimit())) {
            a = zero
            player.c.orange = layers.c.orangeLimit()
        }
        return a
    },
    yellowGet(){
        let a = player.c.points.pow(3)
        if(hasUpgrade("r",15)) a = a.mul(4)

        if(!player.c.colorOpening) a = zero
        if(player.c.yellow.gte(layers.c.yellowLimit())) {
            a = zero
            player.c.yellow = layers.c.yellowLimit()
        }
        return a
    },
    greenGet(){
        let a = player.c.points.pow(2)
        if(hasUpgrade("r",15)) a = a.mul(4)

        if(!player.c.colorOpening) a = zero
        if(player.c.green.gte(layers.c.greenLimit())) {
            a = zero
            player.c.green = layers.c.greenLimit()
        }
        return a
    },
    redEffect(){
        let a = ten.pow(player.c.red)
        if(player.c.green) a = a.pow(layers.c.greenEffect())
        if(a.gt("ee5")) a = a.div("ee5").root("ee1").mul("ee5")
        if(a.lt(1)) a = one
        return a
    },
    orangeEffect(){
        let a = player.c.orange
        if(player.c.green) a = a.pow(layers.c.greenEffect())
        if(a.gt(1048576)) a = a.div(1048576).root(5).mul(1048576)
        if(a.lt(1)) a = one
        return a
    },
    yellowEffect(){
        let a = ten.pow(player.c.yellow)
        if(player.c.green) a = a.pow(layers.c.greenEffect())
        if(a.gt("ee6")) a = a.div("ee6").root("ee1").mul("ee6")
        if(a.lt(1)) a = one
        return a
    },
    greenEffect(){
        let a = player.c.green.add(1).log10().root(4)
        if(a.gt(10)) a = a.div(10).log10().add(10)
        if(a.gt(100)) a = a.div(100).log10().add(100)
        if(a.gt(1e10)) a = a.div(1e10).slog().add(1e10)
        if(a.lt(1)) a = one
        return a
    },
    redLimit(){
        let a = new Decimal(4e3)
        return a
    },
    orangeLimit(){
        let a = new Decimal(4e4)
        return a
    },
    yellowLimit(){
        let a = new Decimal(2e4)
        return a
    },
    greenLimit(){
        let a = new Decimal(4e3)
        return a
    },
    row: 1,
    hotkeys: [
        {key: "c", description: "C: 进行颜色重置", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return hasMilestone("e",4)||player.c.unlocked},
    milestones: {
        0:{
            requirementDescription: "1颜色",
            effectDescription: "解锁红色",
            done(){return player.c.points.gte(1)},
            unlocked: true
        },
        1:{
            requirementDescription: "2颜色",
            effectDescription: "解锁橙色",
            done(){return player.c.points.gte(2)},
            unlocked: true
        },
        2:{
            requirementDescription: "3颜色",
            effectDescription: "解锁黄色",
            done(){return player.c.points.gte(3)},
            unlocked: true
        },
        3:{
            requirementDescription: "1000红色",
            effectDescription: "解锁红色挑战",
            done(){return player.c.red.gte(1000)},
            unlocked(){return hasMilestone("c",0)},
        },
        4:{
            requirementDescription: "4颜色",
            effectDescription: "解锁绿色",
            done(){return player.c.points.gte(4)},
            unlocked(){return hasMilestone("c",1)},
        },
        5:{
            requirementDescription: "20000橙色",
            effectDescription: "解锁橙色挑战",
            done(){return player.c.orange.gte(20000)},
            unlocked(){return hasMilestone("c",2)},
        },
        6:{
            requirementDescription: "9000黄色",
            effectDescription: "解锁黄色挑战",
            done(){return player.c.yellow.gte(9000)},
            unlocked(){return hasMilestone("c",3)},
        },
        7:{
            requirementDescription: "2000绿色",
            effectDescription: "解锁绿色挑战",
            done(){return player.c.green.gte(2000)},
            unlocked(){return hasMilestone("c",4)},
        },
    },
    clickables:{
        11:{
            title:"开启",
            display() {return "开启颜色生产"},
            unlocked() {return hasMilestone("c",0)},
            canClick() { return !player.c.colorOpening},
            onClick() {
                player.c.colorOpening = true
            },
        },
        12:{
            title:"关闭",
            display() {return "关闭颜色生产"},
            unlocked() {return hasMilestone("c",0)},
            canClick() { return player.c.colorOpening},
            onClick() {
                player.c.colorOpening = false
            },
        },
    },
    update(diff){
        if(player.c.colorOpening) {
            if(hasMilestone("c",0)) player.c.red = player.c.red.add(layers.c.redGet().mul(diff))
            if(hasMilestone("c",1)) player.c.orange = player.c.orange.add(layers.c.orangeGet().mul(diff))
            if(hasMilestone("c",2)) player.c.yellow = player.c.yellow.add(layers.c.yellowGet().mul(diff))
            if(hasMilestone("c",4)) player.c.green = player.c.green.add(layers.c.greenGet().mul(diff))
        }
    },
    challenges:{
        11:{
            name: "红色挑战",
            challengeDescription(){ 
                let a = "点数获取^0.05"
                if(!hasChallenge("c",11)) a = a + "（未完成）"
                if(hasChallenge("c",11)) a = a + "（已完成）"
                return a },
                goalDescription(){return "获得1e69895点数"},
                rewardDescription(){return "颜色价格/e1.049e9"},
            canComplete: function() {return player.points.gte("e69895")},      
            unlocked(){return hasMilestone("c",3)},
        },
        12:{
            name: "橙色挑战",
            challengeDescription(){ 
                let a = "红色挑战生效，且电子无效"
                if(!hasChallenge("c",12)) a = a + "（未完成）"
                if(hasChallenge("c",12)) a = a + "（已完成）"
                return a },
                countsAs:[11],
                goalDescription(){return "获得1e48888点数"},
                rewardDescription(){return "倍增点获取^1.5"},
            canComplete: function() {return player.points.gte("e48888")},      
            unlocked(){return hasMilestone("c",5)},
        },
        13:{
            name: "黄色挑战",
            challengeDescription(){ 
                let a = "橙色挑战生效，且声望获取^0.2"
                if(!hasChallenge("c",13)) a = a + "（未完成）"
                if(hasChallenge("c",13)) a = a + "（已完成）"
                return a },
                countsAs:[11,12],
                goalDescription(){return "获得1e54859点数"},
                rewardDescription(){return "倍增点获取^1.1"},
            canComplete: function() {return player.points.gte("e54859")},      
            unlocked(){return hasMilestone("c",6)},
        },
        14:{
            name: "绿色挑战",
            challengeDescription(){ 
                let a = "黄色挑战生效，倍增点效果^0.01"
                if(!hasChallenge("c",14)) a = a + "（未完成）"
                if(hasChallenge("c",14)) a = a + "（已完成）"
                return a },
                countsAs:[11,12,13],
                goalDescription(){return "获得1e21112点数"},
                rewardDescription(){return "解锁R层级"},
            canComplete: function() {return player.points.gte("e21112")},      
            unlocked(){return hasMilestone("c",7)},
        },
    },
    tabFormat: {    
        "homepage": {   
            content: [
                "main-display",
                "prestige-button",
                "blank",
                "clickables",
                ["display-text",function(){
                    let a = "你有" + format(player.c.red) + "红色(+" + format(layers.c.redGet()) + "/s)，加成点数" + format(layers.c.redEffect()) + "x(在第一层软上限后)"  
                    if(player.c.red.gte(layers.c.redLimit())) a = a + "(红色数量已达硬上限)"
                    if(!hasMilestone("c",0)) a = ""
                    return a
                }],["display-text",function(){
                    let a = "你有" + format(player.c.orange) + "橙色(+" + format(layers.c.orangeGet()) + "/s)，加成电子获取" + format(layers.c.orangeEffect()) + "x"  
                    if(player.c.orange.gte(layers.c.orangeLimit())) a = a + "(橙色数量已达硬上限)"
                    if(!hasMilestone("c",1)) a = ""
                    return a
                }],["display-text",function(){
                    let a = "你有" + format(player.c.yellow) + "黄色(+" + format(layers.c.yellowGet()) + "/s)，加成声望" + format(layers.c.yellowEffect()) + "x(在第一层软上限后)"  
                    if(player.c.yellow.gte(layers.c.yellowLimit())) a = a + "(黄色数量已达硬上限)"
                    if(!hasMilestone("c",2)) a = ""
                    return a
                }],["display-text",function(){
                    let a = "你有" + format(player.c.green) + "绿色(+" + format(layers.c.greenGet()) + "/s)，加成上面三个颜色效果^" + format(layers.c.greenEffect()) + ""  
                    if(player.c.green.gte(layers.c.greenLimit())) a = a + "(绿色数量已达硬上限)"
                    if(!hasMilestone("c",4)) a = ""
                    return a
                }],
            ],
        },
        "milestones":{
            content:[
                "main-display",
                "prestige-button",
                "blank",
                "milestones",
            ],
        },
        "challenges":{
            content:[
                "main-display",
                "prestige-button",
                "blank",
                "challenges",
            ],
            unlocked(){return hasMilestone("c",3)}
        },
    },
})

addLayer("r", {
    name: "r", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "R", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    branches:["p"],
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
        upgradespautobuy: false
    }},
    color: "#0080CE",
    requires: new Decimal("e2.9946e8"), // Can be a function that takes requirement increases into account
    resource: "重置点", // Name of prestige currency
    baseResource: "声望", // Name of resource prestige is based on
    baseAmount() {return player.p.points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: "e2", // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        exp = new Decimal(1)
        return exp
    },
    row: 1000000, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "r", description: "R: 进行大重置", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return hasChallenge("c",14)||player.r.unlocked},
    canBuyMax(){return hasMilestone("r",2)},
    milestones:{      
        0:{
            requirementDescription: "大重置！",
            effectDescription: "点数获取x100（无视软上限），自动购买声望升级",
            done(){return player.r.points.gte(1)},
            unlocked: true,
            toggles: [["r", "upgradespautobuy"]],
        },
        1:{
            requirementDescription: "2重置点",
            effectDescription: "初始状态下自动获取每秒0.01%的声望和倍增点",
            done(){return player.r.points.gte(2)},
            unlocked(){return hasMilestone("r",0)},
        },
        2:{
            requirementDescription: "获得第一行重置点升级",
            effectDescription: "最大购买重置点",
            done(){return hasUpgrade("r",11)&&hasUpgrade("r",12)&&hasUpgrade("r",13)&&hasUpgrade("r",14)&&hasUpgrade("r",15)},
            unlocked(){return hasMilestone("r",0)},
        },
    },
    upgrades:{
        11:{
            title:"声望加成",
            description:"声望获取^1.05(2软后)",
            effect(){
                let a = new Decimal(1.05)
                return a
            },
            effectDisplay(){return "^" + format(this.effect())},
            cost: new Decimal(1),
            unlocked(){return true},
        },
        12:{
            title:"点数加成",
            description:"点数获取^1.05(2软后)",
            effect(){
                let a = new Decimal(1.05)
                return a
            },
            effectDisplay(){return "^" + format(this.effect())},
            cost: new Decimal(1),
            unlocked(){return true},
        },
        13:{
            title:"倍增点加成",
            description:"倍增点获取^1.05",
            effect(){
                let a = new Decimal(1.05)
                return a
            },
            effectDisplay(){return "^" + format(this.effect())},
            cost: new Decimal(1),
            unlocked(){return true},
        },
        14:{
            title:"粒子加成",
            description:"电子质子中子获取x5",
            effect(){
                let a = new Decimal(5)
                return a
            },
            effectDisplay(){return format(this.effect()) + "x"},
            cost: new Decimal(1),
            unlocked(){return true},
        },
        15:{
            title:"颜色加成",
            description:"红色橙色黄色绿色获取x4",
            effect(){
                let a = new Decimal(4)
                return a
            },
            effectDisplay(){return format(this.effect()) + "x"},
            cost: new Decimal(1),
            unlocked(){return true},
        },
        16:{
            title:"你需要的---",
            description:"解锁一个新层级",
            cost: new Decimal(2),
            unlocked(){return hasUpgrade("r",11)&&hasUpgrade("r",12)&&hasUpgrade("r",13)&&hasUpgrade("r",14)&&hasUpgrade("r",15)},
        }
    },
    tabFormat:{
    "homepage":{
        content:[
            "main-display",
            "prestige-button",
            "blank",
            ["upgrades",[1,2,3]]
        ],
    },
    "milestones":{
        content:[
            "main-display",
            "prestige-button",
            "blank",
            "milestones",
        ],
    },
},
})
addLayer("ex", {
    name: "ex", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "Ex", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
    }},
    branches:["m"],
    color: "purple",
    requires: new Decimal("e61835"), // Can be a function that takes requirement increases into account
    resource: "幂增点", // Name of prestige currency
    baseResource: "倍增点", // Name of resource prestige is based on
    baseAmount() {return player.m.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 1e-5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        exp = new Decimal(1)
        return exp
    },
    row: 2, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "x", description: "X: 进行幂增点重置", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return hasUpgrade("r",16)||player.ex.unlocked},
})
addLayer("a", {
    startData() { return {
        unlocked: true,
        points: new Decimal(0),
    }},
    color: "yellow",
    resource: "achievement power", 
    row: "side",
    tooltip() { // Optional, tooltip displays when the layer is locked
        return ("成就")
    },
    achievementPopups: true,
    achievements: {
        11: {
            image: "成就图标/成就_11.png",
            name: "开始",
            done() {return player.p.points.gte(1)}, // This one is a freebie
            tooltip: "获得1声望", // Shows when achievement is not completed
        },
        12: {
            image: "成就图标/成就_12.png",
            name: "上涨",
            done() {return player.p.points.gte(3)},
            tooltip: "获得3声望",
        },
        13: {
            name: "更快的上涨",
            done() {return player.p.points.gte(1000)},
            tooltip: "获得1000声望",
        },
        14: {
            name: "更更快的上涨",
            done() {return player.p.points.gte(1e50)},
            tooltip: "获得1e50声望",
        },
        15: {
            name: "另一种上涨？",
            done() {return player.points.gte(1e100)},
            tooltip: "获得1e100点数",
        },
        16: {
            name: "第2层在哪？",
            done() {return player.p.points.gte(1.79e308)},
            tooltip: "获得1.79e308声望",
        },
        17: {
            name: "第一层的结束？",
            done() {return hasUpgrade("p",21)},
            tooltip: "购买升级：“2P?”",
        },
        21: {
            name: "第2层！",
            done() {return player.m.points.gte(1)},
            tooltip: "获得1倍增点",
        },
        22: {
            name: "再一次更多！",
            done() {return player.m.points.gte(2)},
            tooltip: "获得2倍增点",
        },
        23: {
            name: "第一层还没结束？",
            done() {return player.m.points.gte(4)},
            tooltip: "获得4倍增点",
        },
        24: {
            name: "第2层 膨胀！",
            done() {return player.m.points.gte(100)},
            tooltip: "获得100倍增点",
        },
        25: {
            name: "错误的选择",
            done() {return hasUpgrade("p",34)},
            tooltip: "购买升级：“反转上限移除”",
        },
        26: {
            name: "正确的选择",
            done() {return !hasUpgrade("p",34)&&hasUpgrade("p",25)},
            tooltip: "在不购买升级：“反转上限移除”的情况下购买升级：“再次点数自协同？”",
        },
        27: {
            name: "自动的另一种形式",
            done() {return player.m.points.gte(1e30)},
            tooltip: "获得1e30倍增点",
        },
        31: {
            name: "声望层自动？",
            done() {return hasMilestone("m",3)},
            tooltip: "获得m层第4个里程碑",
        },
        32: {
            name: "第3层？第2层！",
            done() {return player.p.points.gte("e7188718")},
            tooltip: "获得1e7188718声望",
        },
        33: {
            name: "带负电的",
            done() {return player.e.electron.gte(1)},
            tooltip: "获得1电子",
        },
        34: {
            name: "带正电的",
            done() {return player.e.proton.gte(1)},
            tooltip: "获得1质子",
        },
        35: {
            name: "不带电的",
            done() {return player.e.neutron.gte(1)},
            tooltip: "获得1中子",
        },
        36: {
            name: "挑战者",
            done() {return hasChallenge("e",11)},
            tooltip: "完成挑战：“电子挑战”",
        },
        37: {
            name: "挑战者II",
            done() {return hasChallenge("e",22)},
            tooltip: "完成挑战：“粒子挑战”",
        },
        41: {
            name: "其他的？",
            done() {return hasUpgrade("e",11)||hasUpgrade("e",41)||hasUpgrade("e",71)},
            tooltip: "购买任意粒子升级",
        },
        42: {
            name: "挑战者III",
            done() {return hasChallenge("e",42)},
            tooltip: "完成挑战：“粒子挑战II”",
        },
        43: {
            name: "what?",
            done() {return player.e.atom.gte(80)},
            tooltip: "拥有80个原子",
        },
        44: {
            name: "怎么还有第2层？",
            done() {return player.e.points.gte(12)&&player.points.gte("e222222")},
            tooltip: "完成解锁C层的条件",
        },
        45: {
            name: "这也挨得太近了",
            done() {return hasMilestone("c",0)&&hasMilestone("c",1)},
            tooltip: "解锁红色和橙色",
        },
        46: {
            name: "挑战者IV",
            done() {return hasChallenge("c",11)},
            tooltip: "完成挑战：“红色挑战”",
        },
        47: {
            name: "为何？",
            done() {return hasMilestone("c",4)},
            tooltip: "解锁绿色",
        },
        51: {
            name: "挑战者V",
            done() {return hasMilestone("c",4)},
            tooltip: "完成挑战：“绿色挑战”",
        },
        52: {
            name: "大重置<br>！！！！！！！<br>！！！！！！！<br>！！！！！！！<br>！！！！！！！",
            done() {return player.r.points.gte(1)},
            tooltip: "获得1重置点",
        },
        53: {
            name: "耐心或者...",
            done() {return hasUpgrade("r",11)||hasUpgrade("r",12)||hasUpgrade("r",13)||hasUpgrade("r",14)||hasUpgrade("r",15)},
            tooltip: "购买一个R层升级",
        },
        54: {
            name: "更多的耐心！",
            done() {return player.r.points.gte(2)},
            tooltip: "获得2重置点",
        },
        55: {
            name: "重置点不是第3层？",
            done() {return hasUpgrade("r",16)},
            tooltip: "购买升级：“你需要的---”",
        },
        56:{
            name: "真正的第3层！",
            done() {return player.ex.points.gte(1)},
            tooltip: "获得1幂增点",
        },
        57:{
            name: "完成完成",
            done() {return hasAchievement("a",11)&&hasAchievement("a",12)&&hasAchievement("a",15)&&hasAchievement("a",17)&&hasAchievement("a",27)&&hasAchievement("a",37)&&hasAchievement("a",47)&&hasAchievement("a",56)&&hasAchievement("a",55)},
            tooltip: "完成前面的所有成就",
        },
    },
    tabFormat: ["achievements"],
},
)


  
