
//Save game
function save() {
    localStorage.removeItem("gameSave");
    localStorage.setItem("gameSave",JSON.stringify(game));
}

//Load game
function loadGame() {
    let savegame = JSON.parse(localStorage.getItem("gameSave"));
    
    if (savegame) {

        //Reset function

        game.resources.energy.cost = function () { return {}; };
        game.resources.matter.cost = function () { return { energy: 2 }; };

        game.upgrades.emc2.req = function () { return { energy: 20 }; };
        game.upgrades.emc2.cost = function () { return { energy: 20 }; };

        //Reset gather-buttons
        for(let key in savegame.resources) {
            if(savegame.resources[key].isGathering) {
                isGathering(key);
            }
        }

        Object.assign(game, savegame); 
    }

}

//Autosave
window.setInterval(function(){
    
    save();

}, 300000); // 5 minutes