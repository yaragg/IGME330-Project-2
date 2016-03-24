"use strict";

window.Player = (function(){

	function Player(game, x, y){
		this.game = game;
		this.playerSpeed = 200;
		this.fireRate = 100;
		this.nextFire = 0;
		this.sprite = this.game.add.sprite(x, y, 'player');
		this.sprite.scale.setTo(1.5, 1.5);
    	this.game.physics.arcade.enable(this.sprite);
    	this.sprite.anchor.setTo(0.5, 0.5);
	}

	Player.prototype.update = function(){
		this.sprite.body.velocity.x = 0;
    	this.sprite.body.velocity.y = 0;

		if(app.main.keyboard.left.isDown || app.main.keyboard.a.isDown)
        	this.sprite.body.velocity.x = -this.playerSpeed;
		else if (app.main.keyboard.right.isDown || app.main.keyboard.d.isDown)
        	this.sprite.body.velocity.x = this.playerSpeed;
        if (app.main.keyboard.up.isDown || app.main.keyboard.w.isDown)
        	this.sprite.body.velocity.y = -this.playerSpeed;
        else if (app.main.keyboard.down.isDown || app.main.keyboard.s.isDown)
        	this.sprite.body.velocity.y = this.playerSpeed;

        this.sprite.rotation = Math.PI/2 + this.game.physics.arcade.angleToPointer(this.sprite);
	}

	return Player;

}());