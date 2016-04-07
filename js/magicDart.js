"use strict";

//MagicDart class is the base spell, with small, quick, weak but cheap shots
window.MagicDart = (function(){

	function MagicDart(main, game){
		Spell.call(this, game);

		this.fireRate = 150;
		this.nextFire = 0;
		this.cost = 7;
		this.speed = 500;

		this.main = main;
		this.game = game;

		//Create shot pool
		this.shots = this.game.add.group();
		this.shots.enableBody = true;
		this.shots.createMultiple(30, 'fire1s');
		this.shots.callAll('kill');
	}

	MagicDart.prototype = Object.create(Spell.prototype);
	MagicDart.prototype.constructor = MagicDart;

	MagicDart.prototype.fireSpell = function(x, y){
		if(this.shots.countDead() > 0){ //Reuse one of the shots from the pool
			var shot = this.shots.getFirstDead();
			shot.reset(this.main.player.position.x, this.main.player.position.y);
			shot.rotation = this.game.physics.arcade.moveToPointer(shot, this.speed, this.game.input.activePointer);
			return this.cost;

		}
		else return 0;
	}

	MagicDart.prototype.update = function(){
		this.game.physics.arcade.overlap(this.shots, this.main.enemies, this.shotHitEnemy, this.main.isEnemyDead, this);

	}

	MagicDart.prototype.shotHitEnemy = function(_shot, _enemy){
		_enemy.fadeout();
		_shot.kill();
		this.main.score += 3;
		this.main.updateScore();
	}

	Spell.prototype.resetGame = function(){ 
		this.shots.callAll('kill');
	}
	return MagicDart;

}());