"use strict";

window.Player = (function(){

	function Player(main, game, shots, x, y){
		Phaser.Sprite.call(this, game, x, y, 'player');
		this.main = main;
		this.shots = shots;
		this.speed = 200;
		this.rightSpell;
		this.magicDart = new MagicDart(this.main, this.game);
		this.leftSpell = this.magicDart;
		this.maxMana = 100;
		this.manaRegenRate = 2;
		this.mana = this.maxMana;
    	this.game.physics.arcade.enable(this);
    	this.anchor.setTo(0.5, 0.5);
    	this.body.collideWorldBounds = true;
    	this.manaBar = new Bar(game, 15, 50);

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
        	this.fire(this.leftSpell);
        }

        this.leftSpell.update();
	}

	Player.prototype.fire = function(spell){
		//If ready to fire, recycle shot from pool
		if(this.mana >= spell.cost){
			// this.nextFire = this.game.time.now + this.fireRate;
			// this.shots.getFirstExists(false).fire(this.x, this.y);
			// this.manaBar.updateValue(-10);
			this.updateMana(-spell.fire());

		}
	}

	Player.prototype.updateMana = function(value){
		this.mana += value;
		if(this.mana > this.maxMana) this.mana = this.maxMana;
		this.manaBar.updateValue(this.mana);
	}

	Player.prototype.resetGame = function(){
		this.magicDart.resetGame();
	}

	return Player;

}());