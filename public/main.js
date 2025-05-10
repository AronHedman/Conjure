//Variables
let game = {
    player: {
        power: 1,
    },
    resources: {
        energy: {
            amount: 18,
            max: 100,
            perSec: 0,
            isGathering: false,
            cost: null,
        },
        matter: {
            amount: 0,
            max: 100,
            perSec: 0,
            isGathering: false,
            cost: { energy: 2 },
        },
    },
    upgrades: {
        upg1: {
            id: "upg1",
            name: "E=mc^2",
            description: "According to Einstein Energy = Masss. Somehow...",
            unlocked: false,
            purchased: false,
            req: { energy: 20 },
            cost: { energy: 20 },
        },
        upg2: {
            id: "upg2",
            name: null,
            description: null,
            unlocked: false,
            purchased: false,
            req: {},
            cost: {},
        },
    },
    scalableUpgrades: {
        sUpg1: {
            id: "sUpg1",
            name: "Workout",
            unlocked: false,
            purchased: false,
            req: { energy: 50 },
            cost: { energy: 50 },
            level: 0,
        },
    }

}

function hasEnough(cost) {
    if(cost == null) {
        return true;
    }
    for (let resource in cost) {
        if (!game.resources[resource] || game.resources[resource].amount < cost[resource]) {
            return false;
        }
    }
    return true;
}

function payCost(cost) {
    if(cost == null) {
        return true;
    }
    if (hasEnough(cost)) {
        for (let resource in cost) {
            game.resources[resource].amount -= cost[resource];
        }
        updateResourceGUI();
        updateUpgradeGUI();
        return true;
    }
    return false;
}

function resourceIncrease() {
    for (let key in game.resources) {
        let resource = game.resources[key];

        let gain = resource.perSec + game.player.power;

        if (resource.isGathering) {
            if(resource.amount + gain <= resource.max) {
                if(hasEnough(resource.cost)) {
                    payCost(resource.cost);
                    resource.amount += gain;
                }
            }
        } else {
            if(resource.perSec > 0) {
            if(resource.amount + resource.perSec <= resource.max) {
                if(hasEnough(resource.cost)) {
                    payCost(resource.cost);
                    resource.amount += resource.perSec;
                }
            }
        }
        }
    }
}

function updateResourceGUI() {
    for (let key in game.resources) {
        let resource = game.resources[key];
        let resourceElement = document.getElementById(key + "Amount");
        if (resourceElement) {
            resourceElement.innerHTML = resource.amount + "/" + resource.max;
        }
    }
}

function isGathering(resource) {
    if (game.resources[resource]) {
        //Toggle of selected resources
        if (game.resources[resource].isGathering) {
            game.resources[resource].isGathering = false;
        } else {
            //Toggle of all resources
            for (let key in game.resources) {
                game.resources[key].isGathering = false;
            }
            //Activate the chosen resource
            game.resources[resource].isGathering = true;
        }
        //Update gather-btn text
        updateGatherButtons();
    }
}

function updateGatherButtons() {
    for (let key in game.resources) {
        let button = document.getElementById(key + "Btn");
        if (button) {
            button.innerHTML = game.resources[key].isGathering ? gatheringText(key) : defaultText(key);
        }
    }
}

//Function to get the default text when gathering
function gatheringText(key) {
    switch (key) {
        case "energy": return "Focusing";
        case "matter": return "Gathering";
        default: return "Gathering";
    }
}

// Function to get the default text when not gathering
function defaultText(key) {
    switch (key) {
        case "energy": return "Focus";
        case "matter": return "Gather";
        default: return "Gather";
    }
}

window.setInterval(
    function () {
        resourceIncrease();
        updateResourceGUI();
        upgrades();
    }, 1000
);
