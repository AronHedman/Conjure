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
            cost: function () {
                return {}; // Inga krav för energy
            },
        },
        matter: {
            amount: 0,
            basePerSec: 0,
            perSec: 0,
            max: 100,
            cost: function () {
                return { energy: 2 };
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
}

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
    if (game.resources[resource]) {
        // Om samma resurs klickas, stäng av den
        if (game.player.isGathering[resource]) {
            game.player.isGathering[resource] = false;
        } else {
            // Stäng av alla andra resurser
            for (let key in game.player.isGathering) {
                game.player.isGathering[key] = false;
            }
            // Aktivera den valda resursen
            game.player.isGathering[resource] = true;
        }
        // Uppdatera alla knappars text
        updateGatherButtons();
    }
}

function updateGatherButtons() {
    for (let key in game.player.isGathering) {
        let button = document.getElementById(key + "Btn");
        if (button) {
            button.innerHTML = game.player.isGathering[key] ? gatheringText(key) : defaultText(key);
        }
    }
}

function gatheringText(key) {
    switch (key) {
        case "energy": return "Focusing";
        case "matter": return "Gathering";
        default: return "Gathering";
    }
}

// Funktion för att hämta rätt text vid inaktivering
function defaultText(key) {
    switch (key) {
        case "energy": return "Focus";
        case "matter": return "Gather";
        default: return "Gather";
    }
}

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

function checkUnlocks() {
    for (let key in game.upgrades) {
        let upgrade = game.upgrades[key];
        if (!upgrade.unlocked && canAfford(upgrade.req())) {
            upgrade.unlocked = true;
            document.getElementById(key + "Upgrade").style.display = "block";
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