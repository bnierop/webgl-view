function TableView(x,y,w,h){

    var self = this;
    View.call(this,x,y,w,h);
    
    this.offset = 0;
    this.contentHeight = 0;

    this.clazz = arguments.callee.name;

    this.superAppend = this.append;
    this.append = function(subview){
        self.superAppend(subview);

    };

    this.mousewheel = function(e){
        self.offset += e.delta;
        
        if(self.offset > 0) self.offset = 0;
        
        var content = (-self.contentHeight + self.height);
        if(self.offset < content)
            self.offset = content;

        self.async(self.layout());
    };

	this.layout = function(){

        var y = self.offset;
        var ch = 0;

		for(var k in self.children){
			
            var child = self.children[k];
            var h = child.height;
            ch += h;

            child.x = 0;
            child.y = y;
            y += h;

            var renderable = true;
            if(child.y < -h){
                renderable = false;
            }else if(child.y - child.height > self.height){
                renderable = false;
            }

            if(!renderable){
                child.container.renderable = false;
            }else{
                child.container.renderable = true;
            }

		}

        self.contentHeight = ch;
	};
}