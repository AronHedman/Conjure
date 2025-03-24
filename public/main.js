//Variables
let game = {
    player: {
        power: 1,
    },
    resources: {
        energy: {
            amount: 0,
            basePerSec: 0,
            perSec: 0,
            max: 100,
            cost: function () {
                return {}; //No cost
            },
            isGathering: false,
        },
        matter: {
            amount: 0,
            basePerSec: 0,
            perSec: 0,
            max: 100,
            cost: function () {
                return { energy: 2 };
            },
            isGathering: false,
        },
    },
    upgrades: {
        emc2: {
            unlocked: false,
            purchased: false,
            req: function () {
                return { energy: 20 }; //Requires 20 energy
            },
            cost: function () {
                return { energy: 20 }; //Costs 20 energy
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

function updateResourcePerSec() {
    for (let key in game.resources) {
        game.resources[key].perSec = game.resources[key].basePerSec; //Reset per sec
    }

    for (let key in game.resources) {
        if (game.resources[key].isGathering) {
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

//Game loop
window.setInterval(
    function () {

        updateResourcePerSec();
        resourceIncrease();
        checkUnlocks();
        guiUpdate();

    }, 1000);