//this is my cool ass "choose your own adventure story!!"

confirm("are you ready to go on an adventure?");
var name = prompt("what is your age:");

if (name >=18){
	console.log("OK let's Go!!");
}
else{
	console.log("you are too young for this adventure...");	
}

var play = prompt("Michaels Jordan just challenged you to a game of horse, do you want to accept the challenge?");


if (play == "yes"){
	var shoot = prompt("mike asks, do you want to shoot first?");
	if (shoot == "yes"){
		console.log("you missed...")
	}else{"you won!"}
}
else{
	console.log("you are a wimp...");	
}