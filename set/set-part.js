let pi = Math.PI;
let tau = 2*pi;
let partColors = ["#812", "#26C", "#262"];
Particles = {
	parts: [],
	update: function(){
		let len = this.parts.length;
		for (let i = 0; i < len; i++) {
			if (this.parts[i].update) {
				this.parts[i].update();
			}
			else {
				this.parts.splice(i--, 1);
				len--;
			}
		}
	},
	
	draw: function(ctx){
		for (let p of this.parts) {
			if (p.draw) p.draw(ctx);
		}
	},
	addPart: function(x, y){
		this.parts.push(newSpiralPart(x,y));
	},
}

function newPart(x, y) {
	return {
		ox: x,
		oy: y,
		x: x,
		y: y,
		r: 1 + 7*Math.random(),
		v: .5,
		color: partColors[Math.floor(Math.random()*3)],
		theta: Math.random() * tau,
		draw: function(ctx){
			ctx.beginPath();
			ctx.lineWidth = .2;
			ctx.fillStyle = this.color;
			ctx.arc(this.x, this.y, this.r, 0, tau);
			ctx.fill();
			ctx.fillStyle = "black";
			ctx.stroke();
		},
		update: function(){
			this.x += this.v * this.r * Math.cos(this.theta);
			this.y += this.v * this.r * Math.sin(this.theta);
			this.r -= .1;
			if (this.r <= 0) {
				this.update = null;
				this.draw = () => {};
				return;
			}
			this.theta += .3-.6*Math.random();
		},
		
	}
}

function newSpiralPart(x, y) {
	return {
		ox: x,
		oy: y,
		x: x,
		y: y,
		r: 1 + 7*Math.random(),
		v: 10,
		color: colors[Math.floor(Math.random()*3)],
		theta: Math.random() * tau,
		draw: function(ctx){
			ctx.beginPath();
			ctx.lineWidth = .2;
			ctx.fillStyle = this.color;
			ctx.arc(this.x, this.y, this.r, 0, tau);
			ctx.fill();
			ctx.fillStyle = "black";
			ctx.stroke();
		},
		update: function(){
			this.x += this.r * Math.cos(this.theta);
			this.y += this.r * Math.sin(this.theta);
			this.r -= .1;
			if (this.r <= 0) {
				this.update = null;
				this.draw = () => {};
				return;
			}
			this.theta += .05;
		},
		
	}
}