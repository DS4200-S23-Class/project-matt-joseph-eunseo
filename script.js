const url = 'http://127.0.0.1:8000/data'

fetch(url)
  .then(response => response.json())
  .then(d => console.log(d))


  
d3.select("#blueCircle")    // select the element using a css selector
            .transition() 
            .duration(3000)     // this transition will last 1500 seconds
            .attr("cx", 250)    // transition the cx attribute to 250




function expandShrink(){
                d3.select("#blueCircle")
                  .transition()
                  .duration(1600)
                  .attr("r", 50)    // increase radius to 50px
                    .transition()
                    .duration(800)
                    .attr("fill", "yellow")   // change to yellow (why not!)
                      .transition()
                      .duration(800)
                      .attr("r", 20)            // shrink radius back to 20px
                      .attr("fill","lightblue") // change back to blue
              };



let svg = d3.select("#plotSVG")

// //
// svg.selectAll(".bubble")
//     .data(articleData)    // bind each element of the data array to one SVG circle
//     .join("circle")
//     .attr("class", "bubble")
//     .attr("cx", d => d.views)   // set the x position based on the number of claps
//     .attr("cy", d => d.reads)   // set the y position based on the number of views
//     .attr("r", d => d.readingTime)  // set the radius based on the article reading time
//     .attr("stroke", "darkblue")
//     .attr("fill", d => "lightblue")  



let xScale = d3.scaleLinear()
    .domain([0, 3000])   // my x-variable has a max of 3000
    .range([0, 600]);   // my x-axis is 600px wide
  
let yScale = d3.scaleLinear()
    .domain([0, 1000])   // my y-variable has a max of 1000
    .range([400, 0]);   // my y-axis is 400px high
                        // (the max and min are reversed because the 
                        // SVG y-value is measured from the top)



// svg.selectAll(".bubble")
//     .data(articleData)    // bind each element of the data array to one SVG circle
//     .join("circle")
//     .attr("class", "bubble")
//     .attr("cx", d => xScale(d.views))   // set the x position based on the number of claps
//     .attr("cy", d => yScale(d.reads))   // set the y position based on the number of views
//     .attr("r", d => d.readingTime)  // set the radius based on the article reading time
//     .attr("stroke", "darkblue")
//     .attr("fill", d => "lightblue")  

svg.append("g")       // the axis will be contained in an SVG group element
    .attr("id","yAxis")
    .call(d3.axisLeft(yScale))
    
svg.append("g")       
    .attr("transform", "translate(0,400)")    // translate x-axis to bottom of chart
    .attr("id","xAxis")
    .call(d3.axisBottom(xScale))



let xVar = document.getElementById("select-x-var").value;

document.getElementById("select-x-var").addEventListener("change", (e)=>{
      
      // update the x-variable based on the user selection
      xVar = e.target.value   
    
      // rescale the x-axis
      xScale = d3.scaleLinear()
        .domain([0, d3.max(articleData, d => d[xVar]) ])    
        .range([0, 600]);
    
        d3.select("#xAxis")
        .call(d3.axisBottom(xScale)
              .tickFormat(d3.timeFormat("%b %d")) )  
              //see here for time formatting options: 
              // https://github.com/d3/d3-time-format
    })
    if(xVar === "publication"){
               
      xScale = d3.scaleBand()
        .domain(Object.keys(pubColors))
        .range([0, 600])
        .padding(1) // space them out so the bubble appears in the centre
      
      svg.select("#xAxis")            
        .call(d3.axisBottom(xScale).tickSize(0))
        .selectAll("text")
          // offset the publication names to fit them in horizontally
          .attr("transform", (d,i)=>`translate(0, ${(i%2)*20})`)
          .style("fill", d => pubColors[d])
    }
    else{
      // rescale the x-axis
      xScale = d3.scaleLinear()
        .domain([0, d3.max(articleData, d => d[xVar]) ])    
        .range([0, 600]);
  
      // redraw the x-axis
      svg.select("#xAxis")            
        .call(d3.axisBottom(xScale)
            .ticks(5)
            .tickFormat(d3.format("d"))
            .tickSizeOuter(0)
         )
    
    }
    // transition each circle element
      svg.selectAll(".bubble")
        .transition()
        .duration(1000)
        .attr("cx", (d) => xScale(d[xVar]) )
    
    // transition each tooltip
      svg.selectAll(".bubble-tip")
        .transition()
        .duration(1000)
        .attr("transform", d => "translate(" + (xScale(d[xVar])+20) + ", " +  yScale(d[yVar]) + ")" )




