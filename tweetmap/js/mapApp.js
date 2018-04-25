var mapApp = {};
(function(context) { 

    var width, height, centered, hovered;
    var projection;
    var path;
    var svgMap;
    var gMap;

    var svgPie;
    var gPie;
    var gLeg;
    var width2, height2, radius;

    var colorObj = {
       "-5 to -3": "negative",
       "-3 to -1": "cool",
       "-1 to +1": "neutral",
       "+1 to +3": "warm",
       "+3 to +5": "positive"
    };

    var pie = d3.layout.pie()
        .sort(null)
        .value(function(d) {
            return d.value;
        });
    var arc;
    var data;
    var distribution = null;
    var pieName;

context.map = function(name, w, h) {

    width = w;
    height = h;

    projection = d3.geo.albersUsa()
        .scale(width*1.3)
        .translate([width / 2, height / 2 ]);

    path = d3.geo.path()
        .projection(projection);

    var borderPad = 20;

    svgMap = d3.select(name).append("svg")
        .attr("width", width)
        .attr("height", height);

    svgMap.append("rect")
        .attr("class", "background")
        .attr("width", width)
        .attr("height", height);

    gMap = svgMap.append("g");

    d3.json("json/us.json", function(error, us) {
        gMap.append("g")
            .attr("id", "states")
            .selectAll("path")
            .data(topojson.feature(us, us.objects.states).features)
            /*us.objects : states, counties, what else? */
           .enter().append("path")
           .attr("d", path)
           .on("click", clicked)
           .on("mouseout",hover)
           .on("mouseover",hover);

        gMap.append("path")
            .datum(topojson.mesh(us, us.objects.states, function(a, b) { return a !== b; }))
            .attr("id", "state-borders") /* error with county borders? */
            .attr("d", path);
        /*
        gMap.selectAll("state-name")
            .data(topojson.feature(us, us.objects.states).features)
            .enter().append("text")
            .attr("class", "state-name")
            .attr("transform", function(d) {
                var center = path.centroid(d);
                var x_c = center[0]-25;
                var y_c = center[1];
                return "translate(" + x_c + "," + y_c + ")";
            })
            .attr("dy", ".35em")
            .text(function(d) { return d.properties.name; })
            .style("fill-opacity", 0)
            .style("fill-opacity", 1.0);
        */

    });


}//context.begin()

context.pieChart = function(name, w, h) {

    width2 = w;
    height2 = h;
    radius = Math.min(width2,height2) / 2;

    pieName = name;

    arc = d3.svg.arc()
        .outerRadius(radius - 20)
        .innerRadius(0);

    svgPie = d3.select(name).append("svg")
    .attr("width", width2)
    .attr("height", height2)
    .append("g")
    .attr("transform", 'translate(' + width2 / 2 + "," + height2 / 2 + ")");
  
    d3.json("json/distribution_11222013.json", function(error, json) {

        if (error) return console.warn(error);
            data = json;
        console.log(data);
        console.log(distribution);
        if (distribution === null)
            distribution = data.countrydist;

        gPie = svgPie.selectAll(".arc")
            .data(pie(d3.entries(distribution)))
            .enter().append("g")
            .attr("class", "arc");

        gPie.append("path")
       .attr("d", arc)
       .attr("class", function(d) {
           return colorObj[d.data.key];
       });
    
    });  

} // context pie

function clicked(d) {
    var x, y, k;

    var dist_id;

    if (d && centered !== d) {
        var centroid = path.centroid(d);
        x = centroid[0];
        y = centroid[1];
        k = 3;
        centered = d;
        dist_id = d.properties.name;
        console.log(dist_id)
        distribution = data.states[dist_id]
        console.log(distribution);

    } else {
        x = width / 2;
        y = height / 2;
        k = 1;
        centered = null;
        dist_id = "USA";
        distribution = data.countrydist;
        console.log(distribution);
        
    }
    d3.select("#piechart").select("svg").remove();
    context.pieChart("#piechart",width2,height2);
  
    d3.select("#title").text(dist_id);

  gMap.selectAll("path")
      .classed("active", centered && function(d) { return d === centered; });
  gMap.selectAll("path")
      .classed("hovered", false);

  gMap.transition()
      .duration(1750) //zoom speed
      .attr("transform", function(d) {
        if( centered === null) {
            //handles zooming out and recentering
            return "translate(" + width / 2 + "," + height / 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")"
        }
        else {
            //handles "state-hopping" and maintain state at arbitrary location
            return "translate(" + width / 2 + "," + height / 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")"
        }
    
      })
      .style("stroke-width", 1.5 / k + "px");
}

function hover(d) {
    console.log(hovered);
    if (d && hovered !== d) {
        hovered = d;
    } else {

        hovered = null;
        
    }
   gMap.selectAll("path")
      .classed("hovered", hovered && function(d) { return d === hovered; })
      .on("click", clicked);

}

})(mapApp);



