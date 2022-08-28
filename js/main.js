// Load CSV file
d3.csv("data/wealth-health-2014.csv", d => {
	// convert
	d.Income = +d.Income;
	d.LifeExpectancy = +d.LifeExpectancy;
	d.Population = +d.Population;

	// return
	return d;

}).then(data => {

	// sort data - countries descending by population
	let sortedData = data.sort((a, b) => b.Population - a.Population);

	// draw chart
	const chart1 = new Scatter(
		sortedData,
		{
			m_top:20,
			m_right:20,
			m_bottom:20,
			m_left:25,
			width:700,
			height:400
		},
		{
			draw_on: "#chart-area",
			x_col_name: "Income",
			x_col_label: "Income",
			y_col_name: "LifeExpectancy",
			y_col_label: "Life Expectancy",
			size_col_name: "Population"
		}
	);

	// draw chart
	const chart2 = new Scatter(
		sortedData,
		{
			m_top:50,
			m_right:20,
			m_bottom:20,
			m_left:110,
			width:700,
			height:400
		},
		{
			draw_on: "#chart-area2",
			x_col_name: "Income",
			x_col_label: "Income",
			y_col_name: "Population",
			y_col_label: "Population",
			size_col_name: null
		}
	);

	// draw chart
	const chart3 = new Scatter(
		sortedData,
		{
			m_top:50,
			m_right:20,
			m_bottom:20,
			m_left:110,
			width:700,
			height:400
		},
		{
			draw_on: "#chart-area3",
			x_col_name: "LifeExpectancy",
			x_col_label: "Life Expectancy",
			y_col_name: "Population",
			y_col_label: "Population",
			size_col_name: null
		}
	);
});

class Scatter {
	sizes;
	labels;

	/**
	 * data
	 * sizes: {m_top:, m_right:, m_bottom:, m_left:, width:, height:} //m = margin
	 * // names as they appear in file
	 * labels: {draw_on:, x_col_name, y_col_name, size_col_name, x_col_label, y_col_label} 
	 * */
	constructor(data, sizes, labels) {
		this.sizes = sizes;
		this.labels = labels;
		
		this.drawChart(data);
	}

	drawChart(data) {
		// SVG Size
		let width = this.sizes.width - this.sizes.m_left - this.sizes.m_right,
			height = this.sizes.height - this.sizes.m_top - this.sizes.m_bottom;

		// Append a new SVG area
		let svg = d3.select(this.labels.draw_on).append("svg")
			.attr("width", width + this.sizes.m_left + this.sizes.m_right)
			.attr("height", height + this.sizes.m_top + this.sizes.m_bottom)
			.append("g")
			.attr("transform", "translate(" + this.sizes.m_left + "," + this.sizes.m_top + ")");

		// X scale
		let incomeScale = d3.scaleLinear()
			.domain(d3.extent(data, d => d[this.labels.x_col_name]))
			.range([0, width]);

		// Y scale
		let lifeExpectancyScale = d3.scaleLinear()
			.domain(d3.extent(data, d => d[this.labels.y_col_name]))
			.range([height, 0]);

		// Radius Scale
		let populationScale;
		if (this.labels.size_col_name !== null) {
			populationScale = d3.scaleLinear()
				.domain(d3.extent(data, d => d[this.labels.size_col_name]))
				.range([5, 30]);
		}

		// Region Scale (ordinal)
		// let regionScale = d3.scaleOrdinal(d3.schemeCategory10);


		// Map data to visual elements (SVG circles)
		let circles = svg.selectAll("circle")
			.data(data)
			.enter()
			.append("circle")
			.attr("class", "a-circle")
			.attr("cx", d => incomeScale(d[this.labels.x_col_name]))
			.attr("cy", d => lifeExpectancyScale(d[this.labels.y_col_name]))
			.attr("r", d => {
				if (this.labels.size_col_name === null) {
					return 5;
				} else {
					return populationScale(d[this.labels.size_col_name])
				}
			})
			.attr("opacity", 0.7)
			// .attr("fill", d => regionScale(d.Region))
			.on('mouseover', (event, d) => {
				console.log(event, d, this)
			})


		// Create axes functions
		let xAxis = d3.axisBottom()
			.scale(incomeScale)
			// .tickFormat(d3.format(",d"))
			// .tickValues([1000, 2000, 4000, 8000, 16000, 32000, 100000]);

		let yAxis = d3.axisLeft()
			.scale(lifeExpectancyScale)
			.ticks(10);

		// Append axes to the SVG drawing area
		svg.append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(0," + height + ")")
			.call(xAxis)
			.append("text")
			.attr("class", "axis-label")
			.attr("y", -15)
			.attr("x", width)
			.attr("dy", ".71em")
			.style("text-anchor", "end")
			.text(this.labels.x_col_label);

		svg.append("g")
			.attr("class", "y axis")
			.call(yAxis)
			.append("text")
			.attr("class", "axis-label")
			.attr("transform", "rotate(-90)")
			.attr("y", 6)
			.attr("dy", ".71em")
			.style("text-anchor", "end")
			.text(this.labels.y_col_label);
	}
}