function Img(){
	
	Tag.call(this);
	this.clazz = arguments.callee.name;
	
	var self = this;
	
	this.apply = function(){
		
		var texture = PIXI.Texture.fromImage(this.src);
		var img = new PIXI.Sprite(texture);
		
		img.position.x = 0;
		img.position.y = 0;
		img.scale.x = 1;
		img.scale.y = 1;
		
		this.append(img);

		// we need to wait until the element is initialized before we can
		// get a reliable width / height
		function set(){
			self.async(function(){
				if(img.width > 1){
					self.setSize(img.width, img.height);
				}else{
					set();
				}
			});
		}
		set();

		img.mask = self.graphics;
	}

	var superSetData = this.setData;
	this.setData = function(data){
		superSetData(data);

		if(data.src){
			this.setSrc(data.src);
		}

	};

	this.setSrc = function(url){
		if(url){
			this.src = url;
			if(PIXI.loader.resources[url]){
				this.async(function(){
					self.apply();		
				});
			}else{
				PIXI.loader.add(url, url).load(function (loader, resources) {
					self.apply();
				});
			}
		}
	};
	
}