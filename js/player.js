"use strict";

window.Player = (function(){

	function Player(main, game, shots, x, y){
		Phaser.Sprite.call(this, game, x, y, 'player');
		this.main = main;
		this.shots = shots;
		// this.game = game;
		this.speed = 200;
		this.fireRate = 100;
		this.nextFire = 0;
		// this.sprite = this.game.add.sprite(x, y, 'player');
		this.scale.setTo(1.5, 1.5);
    	this.game.physics.arcade.enable(this);
    	this.anchor.setTo(0.5, 0.5);
    	this.body.collideWorldBounds = true;
	}

	Player.prototype = Object.create(Phaser.Sprite.prototype);
	Player.prototype.constructor = Player;

	Player.prototype.update = function(){
		this.body.velocity.x = 0;
    	this.body.velocity.y = 0;

		if(this.main.keyboard.left.isDown || this.main.keyboard.a.isDown)
        	this.body.velocity.x = -this.speed;
		else if (this.main.keyboard.right.isDown || this.main.keyboard.d.isDown)
        	this.body.velocity.x = this.speed;
        if (this.main.keyboard.up.isDown || this.main.keyboard.w.isDown)
        	this.body.velocity.y = -this.speed;
        else if (this.main.keyboard.down.isDown || this.main.keyboard.s.isDown)
        	this.body.velocity.y = this.speed;

        this.rotation = Math.PI/2 + this.game.physics.arcade.angleToPointer(this);

        if(this.game.input.activePointer.isDown){
        	this.fire();
        }
	}

	Player.prototype.fire = function(){
		if(this.game.time.now > this.nextFire && this.shots.countDead() > 0){
			this.nextFire = this.game.time.now + this.fireRate;
			var shot = this.shots.getFirstExists(false);
			shot.reset(this.x, this.y);
			// shot.angle = this.angle;
			// this.game.physics.arcade.velocityFromAngle(shot.angle - 90, 500, shot.body.velocity);
			// shot.body.velocity.x += this.body.velocity.x;
			shot.rotation = this.game.physics.arcade.moveToPointer(shot, 500, this.game.input.activePointer);
			// this.game.physics.arcade.moveToPointer(shot, 500, this.game.input.activePointer);
			// shot.x -= Math.sin(shot.rotation)*15;
			// shot.rotation = this.game.physics.arcade.velocityFromAngle(this.game.physics.arcade.angleToPointer(shot), 500);
			shot.play('shot', 30, true, false);
		}
	}

	return Player;

}());