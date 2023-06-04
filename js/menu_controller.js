function play(){
	name = prompt("User name");
	
	sessionStorage.setItem("username", name);
	loadpage("./html/game.html");
}

function exit (){
	if (name != ""){
		alert("Leaving " + name + "'s game");
	}
	name = "";
	loadpage("../index.html");
}

function options(){
	loadpage("./html/options.html");
}

function parida_guardada(){
	var json = localStorage.getItem("partida_g")
	if(json){
		localStorage.setItem("c_partida", "yes");
		loadpage("./html/game.html")
	}
	else{
		alert("No hi ha cap partida guardada");
	}
}