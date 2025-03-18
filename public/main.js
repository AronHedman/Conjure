//Variables
let game = {
    player: {
        power: 1,
        isGathering: {
            energy: false,
            matter: false,
        },
    },
    resources: {
        energy: {
            amount: 0,
            basePerSec: 0,
            perSec: 0,
            max: 100,
            cost: function() {
                    return {}; // Inga krav för energy
                },
            },
        matter: {
            amount: 0,
            basePerSec: 0,
            perSec: 0,
            max: 100,
            cost: function() {
                return {energy: 2};
            },
        },
    upgrades: {
        emc2: {
            unlocked: false,
            purchased: false,
            req: function () {
                    return { energy: 20 }; // Kräver 20 energy
                },
            cost: function () {
                    return { energy: 20 }; // Drar 20 energy vid köp
                },
            },
        },
    
    },
};

function canAfford(cost) {
    for (let resource in cost) {
        if (!game.resources[resource] || game.resources[resource].amount < cost[resource]) {
            return false;
        }
    }
    return true;
}

function payCost(cost) {
    if (canAfford(cost)) {
        for (let resource in cost) {
            game.resources[resource].amount -= cost[resource];
        }
        return true;
    }
    return false;
}

function isGathering(resource, element) {
    if(game.resources[resource]) {
        switch (resource) {
            case "energy":
                game.player.isGathering[resource] = !game.player.isGathering[resource];
                element.innerHTML = game.player.isGathering[resource] ? "Focusing" : "Focus";
                break;

            case "matter":
                game.player.isGathering[resource] = !game.player.isGathering[resource];
                element.innerHTML = game.player.isGathering[resource] ? "Gathering" : "Gather";
                break;
        };''
    }
};

function updateResourcePerSec() {
    for (let key in game.resources) {
        game.resources[key].perSec = game.resources[key].basePerSec;
    }

    for (let key in game.player.isGathering) {
        if (game.player.isGathering[key] && game.resources[key]) {
            let cost = game.resources[key].cost();
            if (canAfford(cost)) {
                game.resources[key].perSec += game.player.power;
                payCost(cost);
            }
        }
    }
}

function resourceIncrease() {
    for (let key in game.resources) {
        let resource = game.resources[key];
        if ((resource.amount + resource.perSec) < resource.max) {
            resource.amount += resource.perSec;
        } else {
            resource.amount = resource.max;
        }
    }
}

function guiUpdate() {
    for (let key in game.resources) {
        let resource = game.resources[key];
        let element = document.getElementById(key + "Amount");
        if (element) {
            element.innerHTML = resource.amount;
        }
    }
}

function checkUnlocks() {
    for (let key in game.upgrades) {
        let upgrade = game.upgrades[key];
        if (!upgrade.unlocked && canAfford(upgrade.req())) {
            upgrade.unlocked = true;
            document.getElementById(key + "Upgrade").style.display = "block";
        }
    }
}

//Game loop
window.setInterval(
    function(){
	
    updateResourcePerSec();
    resourceIncrease();
	checkUnlocks();
    guiUpdate();

}, 1000);