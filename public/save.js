
//Save game
function save() {
    localStorage.removeItem("gameSave");
    localStorage.setItem("gameSave",JSON.stringify(game));
}

//Load game
function loadGame() {
    let savegame = JSON.parse(localStorage.getItem("gameSave"));
    
    if (savegame) {
        Object.assign(game, savegame);
    }

}

//Autosave
window.setInterval(function(){
    
    save();

}, 300000);

// window.onload = loadGame;