const url = 'https://toil-flask.onrender.com/genes'

d3.json(url, (data) => {
	console.log(data)
})

// set up constants
const width = 1000;
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
      .attr('stroke', 'white')
      .attr('stroke-width', 1)
      .on('mouseover', (event, d) => {
        d3.select(event.currentTarget)
          .attr('stroke', 'black');
        
      })
  
      .on('mouseout', (event, d) => {
        d3.select(event.currentTarget)
          .attr('stroke', 'white');
      })
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
