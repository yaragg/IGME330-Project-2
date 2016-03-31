"use strict";

window.Spell = (function(){

	function Spell(main, game, x, y){
		Phaser.Sprite.call(this, game, x, y, 'fire1s');
		// Phaser.Particles.Arcade.Emitter.call(this, game, x, y, 50);
		this.main = main;
    	this.anchor.setTo(0.5, 0.5);
		// this.shots = shots;
		// this.game = game;
    	// this.game.physics.arcade.enable(this);
    	this.game.physics.arcade.enableBody(this);
    	// this.body.collideWorldBounds = true;
    	this.outOfBoundsKill = true;
    	this.checkWorldBounds = true;

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

		// this.fireRate = 100;
		// this.nextFire = 0;
		// this.sprite = this.game.add.sprite(x, y, 'Spell');
		// this.scale.setTo(1.5, 1.5);
    	// this.anchor.setTo(0.5, 0.5);
    	// this.pivot.setTo(0.5, 0.5);
    	
    	// this.animations.add('shot', [0, 1, 2, 3, 4, 5, 6, 7] );
    	// this.play('shot', 30, true, false);
    	// this.pointerPosition = new Phaser.Point(0, 0);
    	this.kill();
	}

	Spell.prototype = Object.create(Phaser.Sprite.prototype);
	Spell.prototype.constructor = Spell;

	Spell.prototype.fire = function(x, y){
			this.reset(x, y);
			// shot.angle = this.angle;
			// this.game.physics.arcade.velocityFromAngle(shot.angle - 90, 500, shot.body.velocity);
			// shot.body.velocity.x += this.body.velocity.x;
    		// this.pointerPosition.x = this.game.input.activePointer.position.x;
    		// this.pointerPosition.y = this.game.input.activePointer.position.y;

			this.rotation = this.game.physics.arcade.moveToPointer(this, 500, this.game.input.activePointer) + Math.PI;

			// this.emitter.maxParticleSpeed = -1*this.body.velocity;
			// this.emitter.minParticleSpeed = -1*this.body.velocity;

			// this.emitter.maxParticleSpeed = new Phaser.Point(-this.body.velocity.x, -this.body.velocity.y)
			// this.emitter.minParticleSpeed = new Phaser.Point(-this.body.velocity.x, -this.body.velocity.y)

			// this.emitter.maxParticleSpeed = new Phaser.Point(this.body.velocity.x, this.body.velocity.y)
			// this.emitter.minParticleSpeed = new Phaser.Point(this.body.velocity.x, this.body.velocity.y)

			// this.emitter.start(false, 3000, 5);

			// this.emitter.rotation += Math.PI/2;


			// this.minParticleSpeed.set(this.)

			// this.game.physics.arcade.moveToPointer(shot, 500, this.game.input.activePointer);
			// shot.x -= Math.sin(shot.rotation)*15;
			// shot.rotation = this.game.physics.arcade.velocityFromAngle(this.game.physics.arcade.angleToPointer(shot), 500);
			// shot.play('shot', 30, true, false);
	}

	Spell.prototype.update = function(){
		// this.rotation = this.game.physics.arcade.moveToObject(this, 500, this.pointerPosition);
		// this.rotation = this.game.physics.arcade.moveToXY(this, this.pointerPosition.x, this.pointerPosition.y, 500);
    		// this.game.physics.arcade.velocityFromRotation(this.rotation, 500, this.body.velocity);

    	var camView = new Phaser.Rectangle();
    	this.game.world.camera.view.copyTo(camView);
    	camView.inflate(100, 100, 100, 100);

		// if(!this.game.world.camera.view.contains(this.position.x, this.position.y)) {
		if(!camView.contains(this.position.x, this.position.y)) {
			console.log("killed");
			this.kill();
		}
		// 	this.enemies.add(new Enemy(this, this.game, this.player, x, y));
		// 	// var enemy = new Enemy(this, this.game, this.player, x, y);
		// 	// this.enemies.push(enemy);
		// 	// this.game.world.add(enemy);
		// }

	}


	// Spell.prototype.update = function(){
	// 	this.body.velocity.x = 0;
 //    	this.body.velocity.y = 0;

	// 	if(this.main.keyboard.left.isDown || this.main.keyboard.a.isDown)
 //        	this.body.velocity.x = -this.speed;
	// 	else if (this.main.keyboard.right.isDown || this.main.keyboard.d.isDown)
 //        	this.body.velocity.x = this.speed;
 //        if (this.main.keyboard.up.isDown || this.main.keyboard.w.isDown)
 //        	this.body.velocity.y = -this.speed;
 //        else if (this.main.keyboard.down.isDown || this.main.keyboard.s.isDown)
 //        	this.body.velocity.y = this.speed;

 //        this.rotation = Math.PI/2 + this.game.physics.arcade.angleToPointer(this);

 //        if(this.game.input.activePointer.isDown){
 //        	this.fire();
 //        }
	// }

	return Spell;


}());