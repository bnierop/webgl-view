function Img(){
	
	Tag.call(this, 0, 0, 100, 100);
	this.clazz = arguments.callee.name;
	
	var self = this;
	
	var url = 'https://images-na.ssl-images-amazon.com/images/I/51PP5pz2lEL._AC_UL320_SR224,320_.jpg'; 

	this.apply = function(){
		
		var texture = PIXI.Texture.fromImage(url);
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
		if(this.width == 0 && this.height == 0)
			set();
		
	}
	
	//this.apply();
	
	//*
	if(PIXI.loader.resources[url]){
		this.async(function(){
			self.apply();		
		});
	}else{
		PIXI.loader.add(url, url).load(function (loader, resources) {
			self.apply();
		});
	}
//*/	
}