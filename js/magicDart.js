"use strict";

//MagicDart class is the base spell, with small, quick, weak but cheap shots
window.MagicDart = (function(){

	function MagicDart(main, game){
		Spell.call(this, game);

		this.fireRate = 150;
		this.nextFire = 0;
		this.cost = 7;
		this.speed = 400;

		this.main = main;
		this.game = game;

		this.sound = this.game.add.audio('magicDart');

		//Create shot pool
		this.shots = this.game.add.group();
		this.shots.enableBody = true;
		this.shots.createMultiple(30, 'magicDart');
		var frames = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 18, 17, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1];
		this.shots.callAll('animations.add', 'animations', 'magicDart', frames, 1, true);
		this.shots.callAll('play', null, 'magicDart', 30, true);
		this.shots.callAll('kill');
	}

	MagicDart.prototype = Object.create(Spell.prototype);
	MagicDart.prototype.constructor = MagicDart;

	MagicDart.prototype.fireSpell = function(x, y){
		if(this.shots.countDead() > 0){ //Reuse one of the shots from the pool
			var shot = this.shots.getFirstDead();
			this.sound.play();
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
		this.main.blobSound.play();
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