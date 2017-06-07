var myApp = {};
(function(context) { 
    
    var svg;
    var dataList;

    context.setData = function(d) {
        dataList = d;
        loop = 0;
    }

    context.rollData = function(name) {

        var N = Math.round( Math.random()*2 );
        h = 4; //for N = 3,4,5 this needs to be chagned
        w = 2 * h - 1;
        this.animate(name,h,w,dataList[N]);
    }

    context.animate = function(name, height, width, data) {

        var cell_w = 50;
        var cell_h = 50;
        var x_spac = 55;
        var y_spac = 55;
        
        // Create the svg element
        svg = d3.select(name).append("svg")
                .attr("width", x_spac*width)
                .attr("height", y_spac*height);

        // Create the lattice

        var lattice = svg.selectAll("rect")
            .data(data)
            .enter()
            .append("rect");
      
        var additional_time = 0;
        var time_step = Math.round(Math.random()*40+40);

        lattice.transition()
            .attr("x", function(d,i) { return  x_spac*d.cell[1] ; } )
            .attr("y", function(d,i) { return  y_spac*d.cell[0] ; } )
            .attr("width", cell_w)
            .attr("height", cell_h)
            .attr("class", function(d) {

                var t = d.type;
                var val = d.val;
                var ro = d.cell[0];
                var co = d.cell[1];

                if( t === "make" ) {
                    if( val === true ) {
                        return "available";
                    }
                    else {
                        return "restricted";
                    }
                }
                else if( t === "mark" ) {
                    if( val === true ) {
                        return "available";
                    }
                    else {
                        return "unavailable";
                    }
                }
                else if( t === "path" ) {
                    if( val === true ) {
                        if( (ro + co) % 2 === 1) {
                            return "onPath";
                        }
                        else {
                            return "onPath";
                        }
                    }
                    else {
                        return "unavailable";
                    }
                }
                else if( t === "neighbors" ) {
                    return "neighbor";
                }
            })
            .delay(function(d,i) {

                if( d.type === "path" && d.val == false )
                    additional_time += 5*time_step;
                if( d.type === "neighbors")
                    additional_time += 4*time_step;

                return i*time_step + additional_time;
            });
        //lattice.selectAll("rect").remove();

    }//animate

})(myApp);


