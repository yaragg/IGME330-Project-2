"use strict";

//Spell class represents the "bullets"
window.Spell = (function(){

	function Spell(main, game, x, y){
		Phaser.Sprite.call(this, game, x, y, 'fire1s');
		// Phaser.Particles.Arcade.Emitter.call(this, game, x, y, 50);
		this.main = main;
    	this.anchor.setTo(0.5, 0.5);
    	this.game.physics.arcade.enableBody(this);
    	this.outOfBoundsKill = true;
    	this.checkWorldBounds = true;

    	//Commented out code from when I was trying to use emitters.
    	//Leaving this here because I still intend to go back to it

		// this.emitter = this.game.add.emitter(0, 0, 100);
		// this.addChild(this.emitter);
		// this.emitter.makeParticles(['fire1', 'fire2', 'fire3']);
		// this.speed = 500;
		// this.emitter.lifespan = 500;
		// // this.emitter.width = 32;
		// // this.emitter.gravity = 200;
		// // this.emitter.rotation = - Math.PI/2;
		// this.emitter.setAlpha(1, 0, 3000);
		// // this.emitter.setScale(0.8, 0, 0.8, 0, 3000);
		// this.emitter.setScale(0.2, 1, 0.2, 1, 3000);
		// // this.emitter.start(false, 3000, 5);

		// this.emitter.minParticleSpeed = new Phaser.Point(50,50);
		// this.emitter.maxParticleSpeed = new Phaser.Point(100,50);

		// this.emitter.start(false, 3000, 5);

    	this.kill();
	}

	Spell.prototype = Object.create(Phaser.Sprite.prototype);
	Spell.prototype.constructor = Spell;

	Spell.prototype.fire = function(x, y){
			this.reset(x, y);

			this.rotation = this.game.physics.arcade.moveToPointer(this, 500, this.game.input.activePointer) + Math.PI;
	}

	return Spell;

}());