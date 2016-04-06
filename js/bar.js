"use strict";

window.Bar = (function(){

	function Bar(game, x, y, width, height, offset, bgColor, consumeColor, barColor){
		Phaser.Sprite.call(this, game, x, y);
		// this.x = x;
		// this.y = y;
		this.game = game;
		this.current = 100;
		// this.main = main;
		this.width = width;
		this.height = height;

		// this.barBg = this.createRect(x, y, width, height, bgColor);
		// this.barConsume = this.createRect(x+offset, y+offset, width-offset, height-offset, consumeColor);

		// this.barFill = this.createRect(x+offset, y+offset, width-offset, height-offset, barColor);

		this.barBg = this.game.add.sprite(x, y, 'manaBar_empty');
		this.barConsume = this.game.add.sprite(x, y, 'manaBar_consume');
		this.barFill = this.game.add.sprite(x, y, 'manaBar');
		this.cropFill = new Phaser.Rectangle(x, y, this.barFill.width, this.barFill.height);
		// this.cropFill.fixedToCamera = true;

		this.barBg.fixedToCamera = true;
		this.barConsume.fixedToCamera = true;
		this.barFill.fixedToCamera = true;

		// this.barFill.addChild(this.cropFill);

		this.barBg.bringToTop();
		this.barConsume.bringToTop();
		this.barFill.bringToTop();
		this.game.world.add(this);

		this.tweenConsume = undefined;


		// this.game.updateRect = function(){
		// console.log("updateRect");
		// 	this.cropRect.x = this.position.x;
		// 	this.cropRect.y = this.position.y;
		// 	this.updateCrop();
		// }

		// this.barFill.update = function(){this.game.updateRect.bind(this.barFill);};

	}

	Bar.prototype = Object.create(Phaser.Sprite.prototype);
	Bar.prototype.constructor = Bar;

	Bar.prototype.createRect = function(x, y, width, height, color){
		var bmd = this.game.add.bitmapData(width, height);
		bmd.ctx.fillStyle = color;
		bmd.ctx.beginPath();
		bmd.ctx.rect(x, y, width, height);
		bmd.ctx.fill();

		return this.game.add.sprite(x, y, bmd);
	}

	Bar.prototype.updateValue = function(value){
		this.current += value;
		if(this.tweenFill && this.tweenFill.isRunning) this.tweenFill.stop();
		this.game.add.tween(this.barFill).to({width: this.current}, 100, "Linear", true);
		if(this.tweenConsume && this.tweenConsume.isRunning) this.tweenConsume.stop();
		this.tweenConsume = this.game.add.tween(this.barConsume).to({width: this.current}, 500, "Linear", true, 500);

		// this.barFill.cropRect = this.cropFill;
		// this.game.add.tween(this.cropFill).to({width: this.current}, 1000, "Linear", true);
		// this.barFill.crop(this.cropFill);
		// this.game.add.tween(this.barFill.cropRect).to({width: this.current}, 1000, "Linear", true);
		// this.barFill.crop(this.barFill.cropRect);


		// this.game.add.tween(this.barConsume).to({width: this.barConsume.width-value}, 1000, "Linear", true, 2000);
	}

	Bar.prototype.increase = function(value){
		this.game.add.tween(this.barFill).to({width: this.barFill.width+value}, 1000, "easeIn", true);
		// this.game.add.tween(this.barConsume).to({width: this.barConsume.width+value}, 0, "easeIn", true);	
	}



	// Bar.prototype.update = 

	Bar.prototype.update = function(){
		// console.log(this.barFill);
		// if(this.barFill.cropRect){
		// 	this.barFill.cropRect.x = this.barFill.position.x;
		// 	this.barFill.cropRect.y = this.barFill.position.y;
		// 	this.barFill.updateCrop();
		// }

		this.cropFill.x = this.barFill.position.x;
			this.cropFill.y = this.barFill.position.y;
		this.cropFill.bottom = this.barFill.position.bottom;
		this.cropFill.right = this.barFill.position.right;

			this.barFill.updateCrop();
	}

	

	return Bar;

}());