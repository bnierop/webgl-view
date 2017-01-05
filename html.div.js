function Div(x,y,width,height){
	var self = this;
	Tag.call(this,x,y,width, height);
	self.clazz = arguments.callee.name;

}