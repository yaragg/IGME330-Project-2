"use strict";

window.Enemy = (function(){

	function Enemy(main, game, player, x, y){
		this.main = main;
		// this.shots = shots;
		this.game = game;
		this.player = player;
		this.speed = 300;
		// this.fireRate = 100;
		// this.nextFire = 0;
		this.sprite = this.game.add.sprite(x, y, 'enemy');
		// this.sprite.scale.setTo(1.5, 1.5);
    	this.game.physics.arcade.enable(this.sprite);
    	this.sprite.anchor.setTo(0.5, 0.5);
    	this.sprite.body.collideWorldBounds = true;
    	this.sprite.animations.add('enemy', [0,1]);
    	this.sprite.play('enemy', 1, true, false);
	}

	Enemy.prototype.update = function(){

        this.game.physics.arcade.moveToObject(this.sprite, this.player.sprite, this.speed);
	}
	return Enemy;

}());