function Div(x,y,width,height){
	Tag.call(this,x,y,width, height);
	this.clazz = arguments.callee.name;

    var superSetData = this.setData;
	this.setData = function(data){
		superSetData(data);
	};
}