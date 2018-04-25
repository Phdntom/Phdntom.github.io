var myApp = {};
(function(context) { 
    
    var data;

    var width;
    var height;

    var svgGrid;
    var svgLeg;
    var svgTile;

    var lattice;
    var param;

    var space;
    var cell_size;
    
    
    context.setData = function(d, w) {
        width = w;


        var N = Math.round(Math.random()*8);
        data = d[N];
        // N
        if( N === 0) param = [4,"polyomino"];
        else if( N === 1) param = [4,"polyhex"];
        else if( N === 2) param = [4,"polyplet"];

        else if( N === 3) param = [5,"polyomino"];
        else if( N === 4) param = [5,"polyhex"];
        else if( N === 5) param = [5,"polyplet"];

        else if( N === 6) param = [6,"polyomino"];
        else if( N === 7) param = [6,"polyhex"];
        else if( N === 8) param = [6,"polyplet"];

        space = Math.round(width/(2*param[0]-1));
        cell_size = space-5;
        height = space*param[0]
        
    }

    context.tiling = function(name) {

        svgTile = d3.select(name).append("svg")
            .attr("width", space*3)
            .attr("height", space*3);

        cell_list = [ [1,1] ];
        if( param[1] === "polyomino" )
            n_list = [ [0,1], [1,2], [1,0], [2,1] ];
        else if( param[1] === "polyhex" )
            n_list = [ [0,0], [0,1], [1,2], [1,0], [2,1], [2,2] ];
        else if( param[1] === "polyplet" ) 
            n_list = [ [0,0], [0,1], [0,2], [1,2], [1,0], [2,0], [2,1], [2,2] ];

        neigh_list = cell_list;
        for(var i = 0; i < n_list.length; i++)
            neigh_list.push(n_list[i]);

        this.check = neigh_list;

        tiling = svgTile.selectAll("rect")
            .data(neigh_list)
            .enter()
            .append("rect")
            .attr("x", function(d,i) { return space*d[1] ; } )
            .attr("y", function(d,i) { return space*d[0] ; } )
            .attr("width", cell_size)
            .attr("height", cell_size)
            .attr("class", function(d) {
                if(d[0]===1 && d[1]===1)
                    return "generic";
                else
                    return "neighbor";
            });
        //d3.select(name).text(param[1]);
    }

    context.param = function(name) {
        d3.select(name).text(param[1]);

    }

    context.legend = function(name) {
        key = [
        {"cell": 0, "type": "restricted"},
        {"cell": 1, "type": "available"},
        {"cell": 2, "type": "unavailable"},
        {"cell": 3, "type": "onPath"},
        {"cell": 4, "type": "neighbor"}];
        
        svgLeg = d3.select(name).append("svg")
                .attr("width", space*4)
                .attr("height", space*5);

        tile = svgLeg.selectAll("rect")
            .data(key)
            .enter()
            .append("rect")
            .attr("x", space - cell_size )
            .attr("y", function(d,i) { return space*i; } )
            .attr("width", cell_size)
            .attr("height", cell_size)
            .attr("class", function(d) { return d.type });

        label = svgLeg.selectAll("text")
            .data(key)
            .enter()
            .append("text")
            .attr("x", space + space-cell_size )
            .attr("y", function(d,i) { return space*i + space/2; } )
            .text( function(d) { return d.type });

    }

    context.animate = function(name) {

        
        // Create the svg element
        svgGrid = d3.select(name).append("svg")
                .attr("width", width)
                .attr("height", height);

        // Create the lattice

        lattice = svgGrid.selectAll("rect")
            .data(data)
            .enter()
            .append("rect");

      
        var additional_time = 0;
        var time_step = 50;

        lattice.transition()
            .attr("x", function(d,i) { return space*d.cell[1] ; } )
            .attr("y", function(d,i) { return space*d.cell[0] ; } )
            .attr("width", cell_size)
            .attr("height", cell_size)
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

                if( d.type === "path" )
                    additional_time += 10*time_step;
                if( d.type === "neighbors")
                    additional_time += 5*time_step;

                return i*time_step + additional_time;
            });

    }//animate

})(myApp);


