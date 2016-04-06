"use strict";

window.Player = (function(){

	function Player(main, game, shots, x, y){
		Phaser.Sprite.call(this, game, x, y, 'player');
		this.main = main;
		this.shots = shots;
		this.speed = 200;
		this.fireRate = 100;
		this.nextFire = 0;
    	this.game.physics.arcade.enable(this);
    	this.anchor.setTo(0.5, 0.5);
    	this.body.collideWorldBounds = true;
    	// this.manaBar = new Bar(game, 10, 100, 100, 50, 10, "rgba(97, 170, 255, 0.65)", "#f84d4d", "#1414ff");
    	this.manaBar = new Bar(game, 10, 100, 100, 50, 10, "#000", "#F00", "#00F");

	}

	Player.prototype = Object.create(Phaser.Sprite.prototype);
	Player.prototype.constructor = Player;

	Player.prototype.update = function(){
		this.body.velocity.x = 0;
    	this.body.velocity.y = 0;

    	//Control movement
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
		//If ready to fire, recycle shot from pool
		if(this.game.time.now > this.nextFire && this.shots.countDead() > 0){
			this.nextFire = this.game.time.now + this.fireRate;
			this.shots.getFirstExists(false).fire(this.x, this.y);
			this.manaBar.updateValue(-10);

		}
	}

	return Player;

}());