"use strict";

//This is the base class for all spells
window.Spell = (function(){

	function Spell(main, game){
		this.fireRate = 100;
		this.nextFire = 0;
		this.cost = 10;
		this.main = main;
	}

	//To be overwritten by extended class
	//This is the specific implementation for each spell. 
	//For example, the Magic Dart spell will take one shot from its pool and fire it,
	//while the Mind Blast spell will have its particle emitter explode
	Spell.prototype.fireSpell = function(){ }

	//Spell-specific method that checks for collisions, etc
	Spell.prototype.update = function(){ }

	//Spell-specific method that resets pools and emitters if need be
	Spell.prototype.resetGame = function(){ }

	//Generic firing method, checks if the spell can be used according to its fire rate then leaves the rest up to the specific implementation
	//Returns the spell cost if it was successfully cast, and 0 if it failed for one or another reason
	Spell.prototype.fire = function(x, y){
		if(this.main.game.time.now > this.nextFire){
			this.nextFire = this.main.game.time.now + this.fireRate;
			return (this.fireSpell());
		}
		else return 0;
	}

	return Spell;

}());