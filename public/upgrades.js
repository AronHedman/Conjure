
function checkUnlocks() {
   try{ 
    for (let key in game.upgrades) {
        let upgrade = game.upgrades[key];
        if ((!upgrade.unlocked) && upgrade.req()) {
            upgrade.unlocked = true;
            document.getElementById(key + "Upgrade").style.display = "block"; // Gör uppgraderingen synlig
        }
    }
} catch (e) {
    null;
}
};