initializeChart = function(){

    var chartHeight = 400,
        chartWidth = 600;
    var xaxis, yaxis, zaxis;
    var svg = d3.select("#chart")
                .append("svg")
                .attr("id","svg")
                .attr("width",1000)
                .attr("height",1000);


    var categorical_X = d3.scalePoint().domain(['Apples','Oranges','Pears','Plums']).range([0,chartWidth]);
    var scale_Y = d3.scaleBand().domain([1, 2, 3, 4]).range([chartHeight,0]);
    var scale_Z = d3.scaleBand().domain([5, 6, 7, 8]).range([0,chartHeight]);




    var xAxis = d3.axisBottom(categorical_X);
    var svgGroup = svg.append("g").attr("transform","translate(0,50)");
    svgGroup.append("g").attr("transform","translate(90,400)").attr("class","axis").call(xAxis);

    var yAxis = d3.axisLeft(scale_Y);
    svgGroup.append("g").attr("transform","translate(90,0)").attr("class","axis").call(yAxis);

    var zAxis = d3.axisLeft(scale_Z);
    svgGroup.append("g").attr("transform","translate(90,400)").attr("class","axis").call(zAxis);


   

};


initializeChart();