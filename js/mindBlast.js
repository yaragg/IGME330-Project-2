"use strict";

//MindBlast class is a quick AoE spell centered around the player
window.MindBlast = (function(){

	function MindBlast(main, game){
		Spell.call(this, game);

		//This spell's stats
		this.fireRate = 300;
		this.nextFire = 0;
		this.cost = 20;

		this.main = main;
		this.game = game;
		this.sound = this.game.add.audio('mindBlast');

		//Create emitter
		this.emitter = this.game.add.emitter(0, 0, 100);
		this.emitter.makeParticles(['mind1', 'mind2', 'mind3']);
		this.emitter.gravity = 0;
		this.emitter.setAlpha(1, 0, 3000);
		this.emitter.setScale(0.2, 0.5, 0.2, 0.5, 1000);

		this.emitter.minParticleSpeed = new Phaser.Point(-250,-250);
		this.emitter.maxParticleSpeed = new Phaser.Point(250,250);

		
	}

	MindBlast.prototype = Object.create(Spell.prototype);
	MindBlast.prototype.constructor = MindBlast;

	MindBlast.prototype.fireSpell = function(x, y){
		this.sound.play();
		this.emitter.x = this.main.player.position.x ;
		this.emitter.y = this.main.player.position.y ;
		this.emitter.explode(350, 100);
		return this.cost;
	}

	//Check collisions for each particle
	MindBlast.prototype.update = function(){
		this.game.physics.arcade.collide(this.emitter, this.main.enemies, this.particleHitEnemy, this.main.isEnemyDead, this);

	}

	MindBlast.prototype.particleHitEnemy = function(_part, _enemy){
		this.main.blobSound.play();
		_enemy.fadeout();
		this.main.score += 3;
		this.main.updateScore();
	}

	Spell.prototype.resetGame = function(){ 
	}
	return MindBlast;

}());