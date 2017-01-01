var id = 0;
function View(x, y, width, height){
	
	var self = this;
	this.container = new PIXI.Container(0xffffff, true);
	
	this.x = x ? x : 0;
	this.y = y ? y : 0;
	this.width = width ? width : 0;
	this.height = height ? height : 0;
	this.color = 0xFF0000;
	this.children = [];
	this.id = id++;
	
	this.border = {
		width: 22
	};

	this.clazz = arguments.callee.name;
	
	this.name = function(){
		return this.clazz + ' @ ' + this.id;
	}
	
	this.log = function(msg){
		this.async(function(){
			console.log('[' +self.name() + ']', msg);
		});
	}

	this.setData = function(data){
		this.data = data;
	};
	
	this.create = function(){
		
		var self = this;
		var graphics = new PIXI.Graphics();
		graphics.beginFill(this.color);
		//graphics.fillAlpha = 0.5;

		// set the line style to have a width of 5 and set the color to red
		graphics.interactive = true;
		graphics.hitArea = new PIXI.Rectangle(0, 0, this.getWidth(), this.getHeight());
		
		function color(){
			return Math.random() * 0xFFFFFF;
		}
		
		graphics.click = function(mouseData){
			self.setColor(color());
			if(self.click)
				self.click();
		}
		
		graphics.mouseover = function(mouseData){
			self.setColor(color());
			if(self.mouseover)
				self.mouseover();
		}

		graphics.mouseout = function(mouseData){
			self.setColor(color());
			if(self.mouseout)
				self.mouseout();
		}
		
		graphics
		// events for drag start
        .on('mousedown', onDragStart)
        .on('touchstart', onDragStart)
        // events for drag end
        .on('mouseup', onDragEnd)
        .on('mouseupoutside', onDragEnd)
        .on('touchend', onDragEnd)
        .on('touchendoutside', onDragEnd)
        // events for drag move
        .on('mousemove', onDragMove)
        .on('touchmove', onDragMove);
		
		function onDragStart(event){
			
			this.dragging = true;
			this.data = event.data;
			this.start = this.data.getLocalPosition(self.container.parent);
			this.start.x -= self.container.position.x;
			this.start.y -= self.container.position.y;
		}
		
		function onDragEnd(event){
			this.dragging = false;
			this.data = null;
		}
		
		function onDragMove(event){
			if (this.dragging){
				var newPosition = event.data.getLocalPosition(self.container.parent);
				self.x = newPosition.x - this.start.x;
				self.y = newPosition.y - this.start.y;
				
				if(self.x < 0) self.x = 0;
				if(self.y < 0) self.y = 0;
				
				if(self.parent){
					
					var max = self.parent.width - this.width + self.border.width;
					if(self.x >= max)
						self.x = max;
					
					var may = self.parent.height - this.height + self.border.width;
					if(self.y >= may)
						self.y = may;
					
				}
			}
		}
		
		graphics.drawRect(0,0,this.getWidth(), this.getHeight());
		graphics.endFill();
		this.graphics = graphics;
		this.container.addChild(graphics);
	};

	this.move = function(dx,dy){
		if(dx)
			this.x += dx;
		if(dy)
			this.y += dy;
	};
	
	this.setRotation = function(r){
		if(r)
			this.container.rotation = r;
	};
	
	this.rotate = function(r){
		if(r)
			this.container.rotation += r;
	};
	
	this.setCenter = function(x, y){
		if(x && y){
			this.container.pivot.x = this.getWidth() * x;
			this.container.pivot.y = this.getHeight() * y;
		}else if(x){
			this.container.pivot.x = this.getWidth() * x;
			this.container.pivot.y = this.getHeight() * x;
		}
	};
	
	this.setColor = function(color){
		if(color){
			this.color = color;
			this.render();
		}
	};
	
	this.render = function(force){
		this.graphics.clear();
		this.graphics.beginFill(this.color);
		this.graphics.lineStyle(this.border.width, 0x000000);
		
		var w = this.getWidth();
		var h = this.getHeight();
		this.graphics.drawRect(0,0, w, h);
		this.graphics.endFill();
		this.mask(force);
	};

	this.getWidth = function(){
		if($.isNumeric(this.css.data.width))
			return this.css.data.width;
		return this.width;
	};

	this.getHeight = function(){
		if($.isNumeric(this.css.data.height))
			return this.css.data.height;
		return this.height;
	};
	
	this.setSize = function(width, height){
		this.ready();
		
		if(width && height){
			this.width = width;
			this.height = height;
		}else if(width){
			this.width = width;
			this.height = width;
		}

		var rectangle = new PIXI.Rectangle(0, 0, this.getWidth(), this.getHeight());
		this.graphics.hitArea = rectangle;
		this.render(true);
	};
	
	this.update = function(){
		this.ready();
		this.container.position.x = this.x;
		this.container.position.y = this.y;
		for(key in this.children){
			var child = this.children[key];
			child.update();
		}
	};
	
	this.ready = function(){
		if(!this.graphics)
			this.create();
	};
	
	this.appendTo = function(stage){
		this.ready();
		stage.addChild(this.container);
	};
	
	this.append = function( subview ){
		
		// if it is a subclass of View
		if(subview.ready){
			subview.ready();
			subview.parent = this;
			this.container.addChild(subview.container);
			this.children.push(subview);
			
		// if it is a PIXI class
		}else if(subview.position){
			subview.mask = this.mask.clip;
			this.container.addChild(subview);
		}
	};
	
	this.mask = function( force ){
		
		var g = null;
		var draw = false;
		
		// a clipping area is not set
		if(!this.mask.clip){
			g = new PIXI.Graphics();
			this.mask.clip = g;
			this.append(this.mask.clip);
			draw = true;
			
		// if clipping is forced
		}else if(force){
			g = this.mask.clip;
			draw = true;
		}
		
		// update the clipping mask
		if(draw){
			g.clear();
			g.beginFill(0x0);
			g.drawRect(0,0,this.getWidth(), this.getHeight());
			g.endFill();
		}
	};
	
	this.css = function(key, value){
		if(value){
			this.css.data[key] = value;
		}
		return this.css.data[key];
	};
	this.css.data = {};
	this.css.data.width = 'inherit';
	this.css.data.height = 'inherit';
	
	this.async = function(f){
		setTimeout(f);
	};

	this.setSize(width, height);
	
}