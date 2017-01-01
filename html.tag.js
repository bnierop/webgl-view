function Tag(x,y,width,height){
	
	var self = this;
	View.call(this,x,y,width,height);
	this.clazz = arguments.callee.name;

	var superSetData = this.setData;
	this.setData = function(data){
		superSetData(data);
		if(data.width)
			self.setSize(data.width, data.height);
		self.render(true);
	};
}