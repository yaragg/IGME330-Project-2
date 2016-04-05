"use strict";

//Spell class represents the "bullets"
window.Spell = (function(){

	function Spell(main, game, x, y){
		Phaser.Sprite.call(this, game, x, y, 'fire1s');

		this.main = main;
    	this.anchor.setTo(0.5, 0.5);
    	this.game.physics.arcade.enableBody(this);
    	this.outOfBoundsKill = true;
    	this.checkWorldBounds = true;

    	// Commented out code from when I was trying to use emitters.
    	// Leaving this here because I still intend to go back to it

		this.emitter = this.game.add.emitter(0, 0, 100);
		this.addChild(this.emitter);
		this.emitter.makeParticles(['fire1', 'fire2', 'fire3']);
		this.speed = 500;
		this.emitter.lifespan = 500;
		// this.emitter.width = 32;
		// this.emitter.gravity = 200;
		this.emitter.setAlpha(1, 0, 3000);
		this.emitter.setScale(0.2, 1, 0.2, 1, 3000);
		// this.emitter.start(false, 3000, 5);

		// this.emitter.minParticleSpeed = new Phaser.Point(50,50);
		// this.emitter.maxParticleSpeed = new Phaser.Point(100,50);

		this.emitter.start(false, 3000, 5);

    	this.kill();
	}

	Spell.prototype = Object.create(Phaser.Sprite.prototype);
	Spell.prototype.constructor = Spell;

	Spell.prototype.fire = function(x, y){
		this.emitter.callAllExists("kill", true);
		this.reset(x, y);
			// this.emitter.at(this);

		this.rotation = this.game.physics.arcade.moveToPointer(this, 500, this.game.input.activePointer) + Math.PI;
		// var vel = this.body.velocity;
		var vel = this.game.physics.arcade.velocityFromRotation(this.body.rotation, 500) + this.body.position;
		// var vel = new Phaser.Point(this.body.velocity.x, this.body.velocity.y);
		// vel += this.position;

 		vel.normalize();
		this.emitter.minParticleSpeed = new Phaser.Point(-100*vel.x, -100*vel.y);
		this.emitter.maxParticleSpeed = new Phaser.Point(-200*vel.x, -200*vel.y);
		this.emitter.start(false, 3000, 5);

	}
	Spell.prototype.Update = function(){
		// this.emitter.minParticleSpeed = new Phaser.Point(50,50);
		// this.emitter.maxParticleSpeed = new Phaser.Point(100,50);
		var vel = this.game.physics.arcade.velocityFromRotation(this.rotation, 500) + this.position;
		// var vel = this.game.physics.arcade.velocityFromRotation(this.body.rotation, 500) + this.body.position;
		// this.emitter.setXSpeed(-vel.x*20, -vel.x*30);
		// this.emitter.setYSpeed(-vel.y*20, -vel.y*30);

		// this.emitter.setXSpeed(-vel.x, -vel.x*2);
		// this.emitter.setYSpeed(-vel.y, -vel.y*2);
		

		this.emitter.at(this);

			// this.emitter.minParticleSpeed = new Phaser.Point(50,50);
		// this.emitter.maxParticleSpeed = new Phaser.Point(100,50);
	}

	return Spell;

}());