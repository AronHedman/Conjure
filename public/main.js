//Variables
let game = {
    player: {
        power: 1,
        isGathering: {
            energy: false,
        },
    },
    resources: {
        energy: {
            amount: 0,
            basePerSec: 0,
            perSec: 0,
            max: 100,
            cost: function() {
                null;
            },
        },
    },
    upgrades: {
        emc2: {
            unlocked: false,
            purchased: false,
            req: function() {
                return game.resources.energy.amount >= 20;
            },
            cost: function() {
                game.resources.energy.amount -= 20;
            }
        },
    },
    
};

function isGathering(resource, element) {

    switch (resource) {
        case "energy":
            game.player.isGathering[resource] = !game.player.isGathering[resource];
            element.innerHTML = game.player.isGathering[resource] ? "Gathering" : "Gather";
            break;

    }
};

function updateResourcePerSec() {

    //Base stats
    for (let key in game.resources) {
        game.resources[key].perSec = game.resources[key].basePerSec;
    };


    //Playergathering
   for(let key in game.player.isGathering){
        if(game.player.isGathering[key]){
           game.resources[key].perSec += game.player.power;
        } else {
            game.resources[key].perSec = game.resources[key].basePerSec;
        } 
    };
};

function resourceIncrease() {
    for (let key in game.resources) {
        let resource = game.resources[key];
        if ((resource.amount + resource.perSec) < resource.max) {
            resource.amount = resource.amount + resource.perSec; 
        } else {
            resource.amount = resource.max; 
        }
    }
};

function guiUpdate() {
    for (let key in game.resources) {
        let resource = game.resources[key];
    document.getElementById(key + "Amount").innerHTML = resource.amount;
    }
};

window.setInterval(function(){
	
    updateResourcePerSec();
    resourceIncrease();
	checkUnlocks();
    guiUpdate();

}, 1000);