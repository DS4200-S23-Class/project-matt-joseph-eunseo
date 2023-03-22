// set up constants
const width = 600;
const height = 600;
const margin = { top: 50, right: 50, bottom: 50, left: 100 };
const innerWidth = width - margin.left - margin.right;
const innerHeight = height - margin.top - margin.bottom;
const radius = 5;

// create SVG element
const svgScatter = d3.select('#scatterplot')
  .attr('width', width)
  .attr('height', height);


// load data and draw scatterplot
d3.csv('data/scatterplot.csv', (d) => {
    // coerce data to numbers
    d.x = +d.ERBB2;
    d.y = +d.EGFR;
    d.selected = false;
    return d;
  }).then((data) => {

    // print at least 10 lines of data to console
    console.log(data)
    
    // create scales
    const xScale = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.x)])
    .range([0, innerWidth]);

    const yScale = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.y)])
    .range([innerHeight, 0]);

    // create axis
    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    // add axis to SVG
    svgScatter.append('g')
    .attr('transform', `translate(${margin.left}, ${innerHeight + margin.top})`)
    .call(xAxis);

    svgScatter.append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`)
    .call(yAxis);

    // add points to scatterplot
    svgScatter.selectAll('circle')
      .data(data)
      .enter()
      .append('circle')
      .attr('cx', d => xScale(d.x) + margin.left)
      .attr('cy', d => yScale(d.y) + margin.top)
      .attr('r', radius)
      .attr('fill', d => {
        if (d.Study === 'GTEX') {
          return 'green';
        } else if (d.Study === 'TARGET') {
          return 'orange';
        } else {
          return 'red'
        }
      })
      .attr('stroke', 'black')
      .attr('stroke-width', 1)
      .on('click', (event, d) => {
        const point = d3.select(event.currentTarget);
        if (!d.selected) {
          point.attr('fill', 'blue');
          d.selected = true;
          d3.select('#selected-point')
            .text(`Selected point: ${d.Sample}, ERBB2 Expression: ${d.x}, EGFR Expression: ${d.y}`);
        } else {
          point.attr('fill', d => {
            if (d.Study === 'GTEX') {
              return 'green';
            } else if (d.Study === 'TARGET') {
              return 'orange';
            } else {
              return 'red'
            }
          });
          d.selected = false;
        }
      });
    // add title
    svgScatter.append('text')
      .attr('x', width / 2)
      .attr('y', margin.top / 2)
      .attr('text-anchor', 'middle')
      .text('EGFR and ERBB2 Expression Correlation');
    // add x axis title
    svgScatter.append('text')
      .attr('x', margin.left + innerWidth / 2)
      .attr('y', height - 10 )
      .attr('text-anchor', 'middle')
      .text('ERBB2 Expression (log(counts))');
    // add y axis title
    svgScatter.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -margin.top - innerHeight / 2)
      .attr('y', margin.left / 2)
      .attr('text-anchor', 'middle')
      .text('EGFR Expression (log(counts))');
  });

// create SVG element
const svgBox = d3.select('#boxplot')
  .attr('width', width)
  .attr('height', height);

// load data and draw scatterplot
d3.csv('data/boxplot.csv', (d) => {
    // coerce data to numbers
    d.x = +d.Expression;
    d.y = d["Disease/Tissue"];
    return d;
  }).then((data) => {

    // create scales
    const xScale = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.x)])
    .range([0, innerWidth]);

    const yScale = d3.scaleBand()
    .domain(data.map(d => d.y))
    .range([innerHeight, 0]);

    // create axis
    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    // add axis to SVG
    svgBox.append('g')
    .attr('transform', `translate(${margin.left}, ${innerHeight + margin.top})`)
    .call(xAxis);

    svgBox.append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`)
    .call(yAxis);

    // add title
    svgBox.append('text')
      .attr('x', width / 2)
      .attr('y', margin.top / 2)
      .attr('text-anchor', 'middle')
      .text('ERBB2 Expression Across Normal and Tumor Tissue Types');
    // add x axis title
    svgBox.append('text')
      .attr('x', margin.left + innerWidth / 2)
      .attr('y', height - 10 )
      .attr('text-anchor', 'middle')
      .text('ERBB2 Expression (log(counts))');

    // TODO: Calculate summary statistics to create boxplot and
    // add boxplots to figure
  })





  
// d3.select("#blueCircle")    // select the element using a css selector
//   .transition() 
//   .duration(3000)     // this transition will last 1500 seconds
//   .attr("cx", 250)    // transition the cx attribute to 250




// function expandShrink(){
//                 d3.select("#blueCircle")
//                   .transition()
//                   .duration(1600)
//                   .attr("r", 50)    // increase radius to 50px
//                     .transition()
//                     .duration(800)
//                     .attr("fill", "yellow")   // change to yellow (why not!)
//                       .transition()
//                       .duration(800)
//                       .attr("r", 20)            // shrink radius back to 20px
//                       .attr("fill","lightblue") // change back to blue
//               };



// let svg = d3.select("#plotSVG")

// // //
// // svg.selectAll(".bubble")
// //     .data(articleData)    // bind each element of the data array to one SVG circle
// //     .join("circle")
// //     .attr("class", "bubble")
// //     .attr("cx", d => d.views)   // set the x position based on the number of claps
// //     .attr("cy", d => d.reads)   // set the y position based on the number of views
// //     .attr("r", d => d.readingTime)  // set the radius based on the article reading time
// //     .attr("stroke", "darkblue")
// //     .attr("fill", d => "lightblue")  



// let xScale = d3.scaleLinear()
//     .domain([0, 3000])   // my x-variable has a max of 3000
//     .range([0, 600]);   // my x-axis is 600px wide
  
// let yScale = d3.scaleLinear()
//     .domain([0, 1000])   // my y-variable has a max of 1000
//     .range([400, 0]);   // my y-axis is 400px high
//                         // (the max and min are reversed because the 
//                         // SVG y-value is measured from the top)



// // svg.selectAll(".bubble")
// //     .data(articleData)    // bind each element of the data array to one SVG circle
// //     .join("circle")
// //     .attr("class", "bubble")
// //     .attr("cx", d => xScale(d.views))   // set the x position based on the number of claps
// //     .attr("cy", d => yScale(d.reads))   // set the y position based on the number of views
// //     .attr("r", d => d.readingTime)  // set the radius based on the article reading time
// //     .attr("stroke", "darkblue")
// //     .attr("fill", d => "lightblue")  

// svg.append("g")       // the axis will be contained in an SVG group element
//     .attr("id","yAxis")
//     .call(d3.axisLeft(yScale))
    
// svg.append("g")       
//     .attr("transform", "translate(0,400)")    // translate x-axis to bottom of chart
//     .attr("id","xAxis")
//     .call(d3.axisBottom(xScale))



// let xVar = document.getElementById("select-x-var").value;

// document.getElementById("select-x-var").addEventListener("change", (e)=>{
      
//       // update the x-variable based on the user selection
//       xVar = e.target.value   
    
//       // rescale the x-axis
//       xScale = d3.scaleLinear()
//         .domain([0, 1000])    
//         .range([0, 600]);
    
//         d3.select("#xAxis")
//         .call(d3.axisBottom(xScale)
//               .tickFormat(d3.timeFormat("%b %d")) )  
//               //see here for time formatting options: 
//               // https://github.com/d3/d3-time-format
//     })
//     if(xVar === "publication"){
               
//       xScale = d3.scaleBand()
//         .domain(Object.keys(pubColors))
//         .range([0, 600])
//         .padding(1) // space them out so the bubble appears in the centre
      
//       svg.select("#xAxis")            
//         .call(d3.axisBottom(xScale).tickSize(0))
//         .selectAll("text")
//           // offset the publication names to fit them in horizontally
//           .attr("transform", (d,i)=>`translate(0, ${(i%2)*20})`)
//           .style("fill", d => pubColors[d])
//     }
//     else{
//       // rescale the x-axis
//       xScale = d3.scaleLinear()
//         .domain([0, 1000])
//         .range([0, 600]);
  
//       // redraw the x-axis
//       svg.select("#xAxis")            
//         .call(d3.axisBottom(xScale)
//             .ticks(5)
//             .tickFormat(d3.format("d"))
//             .tickSizeOuter(0)
//          )
    
//     }
//     // transition each circle element
//       svg.selectAll(".bubble")
//         .transition()
//         .duration(1000)
//         .attr("cx", (d) => xScale(d[xVar]) )
    
//     // transition each tooltip
//       svg.selectAll(".bubble-tip")
//         .transition()
//         .duration(1000)
//         .attr("transform", d => "translate(" + (xScale(d[xVar])+20) + ", " +  yScale(d[yVar]) + ")" )




