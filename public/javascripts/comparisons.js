/*
 * Input: Array< Object >: array where each object represents the amount of each microbe collected for that date
*/

function renderComparisons(data){

  var parseTime = d3.timeParse("%Y");
  data.forEach(function(d,i){ d['year'] = parseTime(d['year']);}); // Convert year to a date object

  //Sort by chronological order
  data.sort(function(a,b){
    return new Date(b.year) - new Date(a.year);
  });

  var keys = Object.keys(data[0]);
  keys = removeValueFromArray(keys,'year');

  var stack = d3.stack()
    .keys(keys)
    .order(d3.reverse)
    .offset(d3.silhouette),
  series = stack(data);

  var margin = {top: 20, right: 20, bottom: 50, left: 70},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

  // Coloring
  var color = d3.scaleLinear()
    .range(["#51D0D7", "#31B5BB"]);

  // Setup axis

  var x =  d3.scaleTime().domain(d3.extent(data, function(d){ return d.year; })).range([0, width]);//d3.scaleLinear().domain(d3.extent(data, function(d){ console.log(d.year); return d.year; })).range([0, width]);
  var xAxis = d3.axisBottom(x);

  var min = d3.min(series, function(layer) { return d3.min(layer, function(d) { return d[0]; }); });
  var max = d3.max(series, function(layer) { return d3.max(layer, function(d) { return d[1]; }); });

  console.log(series);

  var y = d3.scaleLinear()
    .domain([ min , max ])
    .range([height, 0]);


  var area = d3.area()
    .x(function(d) { return x(d.data.year); })
    .y0(function(d) { return y(d[0]); })
    .y1(function(d) { return y(d[1]); })
    .curve(d3.curveBasis);

  var svg = d3.select("#chart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform","translate(" + margin.left + "," + margin.top + ")");

  svg.selectAll("path")
    .data(series)
    .enter().append("path")
    .attr("d", function(d){ return area(d); })
    .style("fill", function() { return color(Math.random()); });

  svg.append("g")
    .attr("class", "axis axis--x")
    .attr("transform", "translate(0," + (height) + ")")
    .call(xAxis); 

  function update(data){
    d3.selectAll("path")
      .data(data)
      .transition()
        .duration(2500)
        .attr("d", area);
  }

  function removeValueFromArray(array,value){
    var position = array.indexOf(value);
    array.splice(position,1);
    return array;
  }
};


