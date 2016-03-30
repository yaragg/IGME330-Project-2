"use strict";

window.Spell = (function(){

	function Spell(main, game, x, y){
		Phaser.Sprite.call(this, game, x, y, 'shot', [0]);
		this.main = main;
		// this.shots = shots;
		// this.game = game;
		this.speed = 500;
		// this.fireRate = 100;
		// this.nextFire = 0;
		// this.sprite = this.game.add.sprite(x, y, 'Spell');
		// this.scale.setTo(1.5, 1.5);
    	this.game.physics.arcade.enable(this);
    	// this.anchor.setTo(0.5, 0.5);
    	// this.pivot.setTo(0.5, 0.5);
    	this.body.collideWorldBounds = true;
    	this.outOfBoundsKill = true;
    	this.checkWorldBounds = true;
    	this.animations.add('shot', [0, 1, 2, 3, 4, 5, 6, 7] );
    	this.play('shot', 30, true, false);
    	this.pointerPosition = new Phaser.Point(0, 0);
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

			// this.game.physics.arcade.moveToPointer(shot, 500, this.game.input.activePointer);
			// shot.x -= Math.sin(shot.rotation)*15;
			// shot.rotation = this.game.physics.arcade.velocityFromAngle(this.game.physics.arcade.angleToPointer(shot), 500);
			// shot.play('shot', 30, true, false);
	}

	Spell.prototype.update = function(){
		// this.rotation = this.game.physics.arcade.moveToObject(this, 500, this.pointerPosition);
		// this.rotation = this.game.physics.arcade.moveToXY(this, this.pointerPosition.x, this.pointerPosition.y, 500);
    		// this.game.physics.arcade.velocityFromRotation(this.rotation, 500, this.body.velocity);

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