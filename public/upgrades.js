function checkUnlocks() {
    for (let key in game.upgrades) {
        let upgrade = game.upgrades[key];
        if (!upgrade.unlocked && hasEnough(upgrade.req)) {
            upgrade.unlocked = true;
        }
    }
    for (let key in game.scalableUpgrades) {
        let upgrade = game.scalableUpgrades[key];
        if (!upgrade.unlocked && hasEnough(upgrade.req)) {
            upgrade.unlocked = true;
        }
    }
}

function displayUpgrade(key) {
    let upgrade = game.upgrades[key];

    if (upgrade.unlocked && !upgrade.displayed) {
        if ((upgrade.name != null) && (upgrade.id != null)) {
            upgrade.displayed = true;

            let upgradeElement = document.createElement("div");
            upgradeElement.id = upgrade.id;
            upgradeElement.className = "upgradeElement";

            let h = document.createElement("h2");
            h.innerHTML = upgrade.name;
            h.className = "upgradeName";
            upgradeElement.appendChild(h);

            let p = document.createElement("p");
            p.innerHTML = "Cost: " + Object.entries(upgrade.cost).map(entry => entry.join(": ")).join(", ");
            p.className = "upgradeCost";
            upgradeElement.appendChild(p);

            upgradeElement.addEventListener("click", function () {
                buyUpgrade(upgrade.id)
            });

            document.getElementById("upgradeContainer").appendChild(upgradeElement);
        }
    }
}

function removeUpgrade(key) {
    let upgrade = game.upgrades[key];
    if (upgrade) {
        if (upgrade.displayed && upgrade.purchased) {
            let upgradeElement = document.getElementById(upgrade.id);
            upgradeElement.parentNode.removeChild(upgradeElement);
            upgrade.displayed = false;
            upgrade.unlocked = false;   
        }
    }
}

function updateUpgradeGUI() {
    for (let key in game.upgrades) {
        //Display upgrades
        if (game.upgrades[key].unlocked) {
            displayUpgrade(key);
        }

        //Remove upgrades
        if (game.upgrades[key].displayed && game.upgrades[key].purchased) {
            removeUpgrade(key);
        }
    }
}

function upgrades() {
    checkUnlocks();
    updateUpgradeGUI();
}

//Buy upgrades

function buyUpgrade(key) {
    if (game.upgrades[key]) {
        if (hasEnough(game.upgrades[key].cost)) {
            payCost(game.upgrades[key].cost);
            game.upgrades[key].purchased = true;
        }
    }
}

