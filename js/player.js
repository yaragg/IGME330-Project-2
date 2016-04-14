"use strict";

window.Player = (function(){

	function Player(main, game, shots, x, y){
		Phaser.Sprite.call(this, game, x, y, 'player');
		this.main = main;
		this.shots = shots;
		this.speed = 200;
		this.magicDart = new MagicDart(this.main, this.game);
		this.mindBlast = new MindBlast(this.main, this.game);

		//We use the leftSpell and rightSpell variables to allow the player to swap equipped spells if more are added in the future
		this.leftSpell = this.magicDart;
		this.rightSpell = this.mindBlast;

		this.maxMana = 100;
		this.manaRegenRate = 2;
		this.mana = this.maxMana;
    	this.game.physics.arcade.enable(this);
    	this.anchor.setTo(0.5, 0.5);
    	this.body.collideWorldBounds = true;
    	this.manaBar = new Bar(game, 15, 50);
    	this.magicFail = this.game.add.audio('magicFail');

	}

	Player.prototype = Object.create(Phaser.Sprite.prototype);
	Player.prototype.constructor = Player;

	Player.prototype.update = function(){
		if(!this.alive) return;
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
        if(this.main.keyboard.shift.isDown){
        	this.body.velocity.x *= 1.6;
        	this.body.velocity.y *= 1.6;
        }

        this.rotation = Math.PI/2 + this.game.physics.arcade.angleToPointer(this);

        if(this.game.input.activePointer.leftButton.isDown || this.main.keyboard.space.isDown || this.main.keyboard.e.isDown ){
        	this.fire(this.leftSpell);
        }
        if(this.game.input.activePointer.rightButton.isDown || this.main.keyboard.q.isDown){
        	this.fire(this.rightSpell);
        }

        this.leftSpell.update();
        this.rightSpell.update();
	}

	Player.prototype.fire = function(spell){
		if(this.mana >= spell.cost){ //If player has enough mana, cast spell
			this.updateMana(-spell.fire());

		}
		else{
			if(!this.magicFail.isPlaying) this.magicFail.play();
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