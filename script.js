// toggle between tabs
function openTab(evt, tabName) {
  // Declare all variables
  let i, tabcontent, tablinks;

  // Get all elements with class="tabcontent" and hide them
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }

  // Get all elements with class="tablinks" and remove the class "active"
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }

  // Show the current tab, and add an "active" class to the button that opened the tab
  document.getElementById(tabName).style.display = "block";
  evt.currentTarget.className += " active";
}

// store options from csv file
const diseases = ["Uveal Melanoma", "Uterine Corpus Endometrioid Carcinoma", "Uterine Carcinosarcoma", "Thyroid Carcinoma", "Thymoma", "Testicular Germ Cell Tumor", "Stomach Adenocarcinoma", "Skin Cutaneous Melanoma", "Sarcoma", "Rectum Adenocarcinoma", "Prostate Adenocarcinoma", "Pheochromocytoma & Paraganglioma", "Pancreatic Adenocarcinoma", "Ovarian Serous Cystadenocarcinoma", "Mesothelioma", "Lung Squamous Cell Carcinoma", "Lung Adenocarcinoma", "Liver Hepatocellular Carcinoma", "Kidney Papillary Cell Carcinoma", "Kidney Clear Cell Carcinoma", "Kidney Chromophobe", "Head & Neck Squamous Cell Carcinoma", "Glioblastoma Multiforme", "Esophageal Carcinoma", "Diffuse Large B-Cell Lymphoma", "Colon Adenocarcinoma", "Cholangiocarcinoma", "Cervical & Endocervical Cancer", "Breast Invasive Carcinoma", "Brain Lower Grade Glioma", "Bladder Urothelial Carcinoma", "Adrenocortical Cancer", "Acute Myeloid Leukemia"];
const tissues = ["Fallopian Tube", "Kidney", "Cervix", "Bladder", "Prostate", "Minor Salivary Gland", "Small Intestine", "Adrenal Gland", "Breast", "Spleen", "Liver", "Adipose", "Stomach", "Pancreas", "Ovary", "Colon", "Vagina", "Heart", "Testis", "Pituitary", "Whole Blood", "Brain", "Esophagus", "Nerve", "Skin", "Lung", "Muscle", "Thyroid", "Uterus", "Artery" ];

// populate select options
const selectDisease = document.getElementById("disease");
diseases.forEach((disease) => {
  const option = new Option(disease);
  if (disease === "Breast Invasive Carcinoma") {
    option.setAttribute("selected", true);
  }
  selectDisease.add(option);
});

// set up constants for graphs
const width = 1000;
const height = 600;
const margin = { top: 50, right: 50, bottom: 50, left: 150 };
const innerWidth = width - margin.left - margin.right;
const innerHeight = height - margin.top - margin.bottom;
const radius = 5;

// monitor form for correlation plot
const correlationForm = document.getElementById("correlationForm");
correlationForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const gene1 = document.getElementById("gene1").value;
  const gene2 = document.getElementById("gene2").value;
  
  // load data and draw scatterplot
  d3.csv("data/data.csv", (d) => {
    // coerce data to numbers
    d.x = +d[`${gene1}`];
    d.y = +d[`${gene2}`];
    d.selected = false;
    d.tissue = d["Disease/Tissue"];
    return d;
  }).then((data) => {
  
    // print at least 10 lines of data to console
    console.log(data);
    
    // create SVG element
    const svgScatter = d3.select("#scatterplot")
      .attr("width", width)
      .attr("height", height);

    // remove previous SVG element
    svgScatter.selectAll("*").remove();
    
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
    svgScatter.append("g")
      .attr("transform", `translate(${margin.left}, ${innerHeight + margin.top})`)
      .call(xAxis);

    svgScatter.append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`)
      .call(yAxis);

    // add points to scatterplot
    svgScatter.selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", d => xScale(d.x) + margin.left)
      .attr("cy", d => yScale(d.y) + margin.top)
      .attr("r", radius)
      .attr("fill", d => {
        if (d.Study === "GTEX") {
          return "green";
        } else if (d.Study === "TARGET") {
          return "orange";
        } else {
          return "red";
        }
      })
      .attr("stroke", "white")
      .attr("stroke-width", 1)
      .attr("class", "point")
      .on("mouseover", (event, d) => {
        d3.select(event.currentTarget)
          .attr("stroke", "black");
        
      })
      .on("mouseout", (event, d) => {
        d3.select(event.currentTarget)
          .attr("stroke", "white");
      })
      .on("click", (event, d) => {
        const point = d3.select(event.currentTarget);
        const points = d3.selectAll(".point")
        // reset color of points
        points.attr("fill", d => {
          if (d.Study === "GTEX") {
            return "green";
          } else if (d.Study === "TARGET") {
            return "orange";
          } else {
            return "red";
          }
        });

        if (!d.selected) {
          point.attr("fill", "blue");
          d.selected = true;

          // add text for selected point
          d3.select("#selected-point")
            .text(`Selected point: ${d.Sample}, ${gene1} expression: ${d.x}, ${gene2} expression: ${d.y}`);
          d3.select("#highlighted-tissue")
            .text("");
        } else {
          d.selected = false;

          // remove text for selected point
          d3.select("#selected-point")
            .text("");
        }

      });

    // add title
    svgScatter.append("text")
      .attr("x", width / 2)
      .attr("y", margin.top / 2)
      .attr("text-anchor", "middle")
      .text(`${gene1} and ${gene2} Expression Correlation`);
    // add x axis title
    svgScatter.append("text")
      .attr("x", margin.left + innerWidth / 2)
      .attr("y", height - 10 )
      .attr("text-anchor", "middle")
      .text(`${gene1} Expression (log(counts))`);
    // add y axis title
    svgScatter.append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -margin.top - innerHeight / 2)
      .attr("y", margin.left / 2)
      .attr("text-anchor", "middle")
      .text(`${gene2} Expression (log(counts))`);
  });
});

// monitor form for overexpression plot
const overexpressionForm = document.getElementById("overexpressionForm");
overexpressionForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const gene = document.getElementById("gene").value;
  const disease = document.getElementById("disease").value;

  // load data and draw barplot
  d3.csv("data/data.csv", (d) => {
    // coerce data to numbers
    d.x = +d[`${gene}`];
    d.y = d["Disease/Tissue"];
    return d;
  }).then((data) => {
    // filter data only for disease selected
    const diseaseTissue = disease.concat(tissues);
    data = data.filter((d) => diseaseTissue.includes(d.y));

    // group data by Disease/Tissue and calculate maximum 
    const groupedData = d3.group(data, d => d.y);
    const averages = Array.from(groupedData, ([key, value]) => {
      return {
        "y": key,
        "x": d3.max(value, d => d.x),
        "selected": false,
        "tissue": key
      };
    });
    averages.pop();

    // create SVG element
    const svgBar = d3.select("#barplot")
      .attr("width", width)
      .attr("height", height);
    
    // remove previous SVG element
    svgBar.selectAll("*").remove();
    
    // create scales
    const xScale = d3.scaleLinear()
      .domain([0, d3.max(averages, d => d.x)])
      .range([0, innerWidth]);

    const yScale = d3.scaleBand()
      .domain(averages.map(d => d.y))
      .range([innerHeight, 0]);

    // create axes
    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    // add axes to SVG
    svgBar.append("g")
      .attr("transform", `translate(${margin.left}, ${innerHeight + margin.top})`)
      .call(xAxis);

    svgBar.append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`)
      .call(yAxis);
  
    const tooltip = d3.select("#tooltip")
      .style("opacity", 0)
      .attr("class", "tooltip")
      .style("position", "absolute")
      .style("background-color", "white")
      .style("border", "solid")
      .style("border-width", "1px")
      .style("border-radius", "5px")
      .style("padding", "10px");
    
    // add bars to SVG
    svgBar.selectAll("rect")
      .data(averages)
      .join("rect")
      .attr("x", margin.left)
      .attr("y", d => yScale(d.y) + margin.top)
      .attr("width", d => xScale(d.x))
      .attr("height", yScale.bandwidth())
      .attr("fill", d => d.y === disease ? "red" : "green")
      .attr("stroke", "#333")
      .attr("stroke-width", 1)
      .attr("opacity", 1)
      .attr("class", "bar")
      .on("mouseover", (event, d) => {
        d3.select(event.currentTarget)
          .attr("opacity", 0.7);
        tooltip
          .html(`${d.y}, ${gene} max expression: ${d.x}`)
          .style("opacity", 1);
      })
      .on("mousemove", (event, d) => {
        tooltip
          .style("left",`${event.x}px`)
          .style("top",`${event.y - 200}px`);
      })
      .on("mouseout", (event, d) => {
        d3.select(event.currentTarget)
          .attr("opacity", 1);
        tooltip
          .style("opacity", 0);
      })
      .on("click", (event, d) => {
        // get data
        const bars = d3.selectAll(".bar");
        const bar = d3.select(event.currentTarget);
        const tissue = d.tissue;
        const points = d3.selectAll(".point");

        // reset current color of points and bars
        points.attr("fill", d => {
          if (d.Study === "GTEX") {
            return "green";
          } else if (d.Study === "TARGET") {
            return "orange";
          } else {
            return "red";
          }
        })
        bars.attr("fill", d => d.y === disease ? "red" : "green");

        if (!d.selected) {
          bar.attr("fill", "black");
          d.selected = true;
          d3.select("#selected-bar")
            .text(`Selected bar: ${tissue.toLowerCase()}, ${gene} max expression: ${d.x}`);

          // make black the points with tisue that match selected
          // tissue in bar plot
          const selectedPoints = points.filter(d => d.tissue === tissue);
          selectedPoints.attr("fill", "black");
          
          // add text on scatterplot to indicate which tissue is highlighted
          if(points.size() > 0) {
          d3.select("#highlighted-tissue")
            .text(`Highlighted tissue: ${tissue.toLowerCase()}, # points highlighted: ${selectedPoints.size()} `);
          d3.select("#selected-point")
            .text("")
          }
        } else {
          d.selected = false;

          // remove text on scatterplot and barplot
          d3.select("#highlighted-tissue")
            .text("");
          d3.select("#selected-bar")
            .text("");
        }    
      });

    // add title
    svgBar.append("text")
      .attr("x", width / 2)
      .attr("y", margin.top / 2)
      .attr("text-anchor", "middle")
      .text(`${gene} Expression Across Normal and Tumor Tissue Types`);
    
    // add x axis title
    svgBar.append("text")
      .attr("x", margin.left + innerWidth / 2)
      .attr("y", height - 10 )
      .attr("text-anchor", "middle")
      .text(`${gene} Expression (log(counts))`);
  });
});

