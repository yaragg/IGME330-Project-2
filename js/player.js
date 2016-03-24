"use strict";

window.Player = (function(){

	function Player(main, game, shots, x, y){
		this.main = main;
		this.shots = shots;
		this.game = game;
		this.playerSpeed = 200;
		this.fireRate = 100;
		this.nextFire = 0;
		this.sprite = this.game.add.sprite(x, y, 'player');
		this.sprite.scale.setTo(1.5, 1.5);
    	this.game.physics.arcade.enable(this.sprite);
    	this.sprite.anchor.setTo(0.5, 0.5);
    	this.sprite.body.collideWorldBounds = true;
	}

	Player.prototype.update = function(){
		this.sprite.body.velocity.x = 0;
    	this.sprite.body.velocity.y = 0;

		if(this.main.keyboard.left.isDown || this.main.keyboard.a.isDown)
        	this.sprite.body.velocity.x = -this.playerSpeed;
		else if (this.main.keyboard.right.isDown || this.main.keyboard.d.isDown)
        	this.sprite.body.velocity.x = this.playerSpeed;
        if (this.main.keyboard.up.isDown || this.main.keyboard.w.isDown)
        	this.sprite.body.velocity.y = -this.playerSpeed;
        else if (this.main.keyboard.down.isDown || this.main.keyboard.s.isDown)
        	this.sprite.body.velocity.y = this.playerSpeed;

        this.sprite.rotation = Math.PI/2 + this.game.physics.arcade.angleToPointer(this.sprite);

        if(this.game.input.activePointer.isDown){
        	this.fire();
        }
	}

	Player.prototype.fire = function(){
		if(this.game.time.now > this.nextFire && this.shots.countDead() > 0){
			this.nextFire = this.game.time.now + this.fireRate;
			var shot = this.shots.getFirstExists(false);
			shot.reset(this.sprite.x, this.sprite.y);
			shot.rotation = this.game.physics.arcade.moveToPointer(shot, 500, this.game.input.activePointer);
			// shot.rotation = this.game.physics.arcade.velocityFromAngle(this.game.physics.arcade.angleToPointer(shot), 500);
			shot.play('shot', 30, true, false);
		}
	}

	return Player;

}());