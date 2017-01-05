function Tag(x,y,width,height){
	
	var self = this;
	View.call(this,x,y,width,height);
	self.clazz = arguments.callee.name;

	self.superSetData = self.setData;
	self.setData = function(data){
		self.superSetData(data);
		if(data.width)
			self.setSize(data.width, data.height);
		self.render(true);
	};

	self.superMask = self.mask;
	self.mask = function(force){
		self.superMask(force);
	};
}