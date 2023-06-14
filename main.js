d3.csv("https://raw.githubusercontent.com/tzuie99/final/main/data/Spotify_Youtube.csv").then(
    data => {
    // 資料處理
    data.forEach(function (d) {
        d.Artist = d.Artist.toString();;
        d.Views = +d.Views;
    });

    // 加總每位artist的views
    const artistViews = data.reduce(function (acc, d) {
        if (acc[d.Artist]) {
            acc[d.Artist] += d.Views;
        } else {
            acc[d.Artist] = d.Views;
        }
        return acc;
    },{});

    // 輸出每位artist的總views數(檢查用)
    for (const artist in artistViews) {
        console.log("Artist:", artist, "Total views:", artistViews[artist]);
    }
    // 儲存top_10的artist及其views
    const top_10_data = Object.entries(artistViews)
        .map(([artist, views]) => ({ label: artist, value: views }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 10);
    console.log(top_10_data);

    // SVG 圖表尺寸
    const width = 600;
    const height = 600;
    const radius = Math.min(width, height) / 2.5;

    // 顏色比例尺
    //const color = d3.scaleOrdinal(d3.schemeCategory10);
    const customcolor = ["#999EA2","#93939B","#CCD2CC","#7A848D","#94726B","#C09D9B","#BEBEBE","#DBD2C9","#A9B7AA","#DBD4C6",]
    const color=d3.scaleOrdinal().range(customcolor)
    // 建立 SVG 元素
    const svg = d3.select("body")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("class", "chart-container") 
        .append("g")
        .attr("transform", `translate(${width / 2}, ${height / 2})`);

    // 繪製圓餅圖
    const pie = d3.pie()
        .value(d => d.value);
    const arc = d3.arc()
        .innerRadius(0)
        .outerRadius(radius);
    const arcs = svg.selectAll("arc")
        .data(pie(top_10_data))
        .enter()
        .append("g")
        .on("mouseover", function (d) {
            d3.select(this)
                .select("path")
                .attr("transform", "scale(1.1)") 
                .transition()
                .duration(500)
                .style("filter", "drop-shadow(2px 4px 6px black)")
                .style('transform', 'scale(1.1)')
            d3.select(this)
                .select("text")
                .style("display", "block"); 
        })
        .on("mouseout", function (d) {
            d3.select(this)
                .select("path")
                .attr("transform", "scale(1)") 
                .transition()
                .duration(500)
                .style("filter", "drop-shadow(0 0 0 black)")
                .style('transform', 'scale(1)')
            d3.select(this)
                .select("text")
                .style("display", "none"); 
        });
    arcs.append("path")
        .attr("d", arc)
        .attr("fill", (d, i) => color(i));

       

    // 加入圓餅圖標籤
    arcs.append("text")
        .attr("dy", "290px") 
        .attr("text-anchor", "middle")
        .style("display", "none") 
        .style("font-size", "20px")  
        .style("font-weight", "bold") 
        .text(d => `Artist:  ${d.data.label},Views: ${d.data.value}`);
    arcs.append("text")
        .attr("transform", d => `translate(${arc.centroid(d)})`)
        .attr("text-anchor", "middle")
        .style("font-size", "18px")  
        .style("font-weight", "bold") 
        .text((d, i) => `Top ${i + 1}`);

    // 加入圓餅圖標題
    const title = "Top 10 Artists' Views";
    svg.append("text")
        .attr("text-anchor", "middle")
        .attr("dy", "-280px") 
        .style("font-weight", "bold")
        .style("font-size", "20px")
        .text(title);
});


import {
    prepareChartData,
    processMap
} from "./func/converter.js";

import {
    setupCanvas_teach
} from "./func/plot.js";

import {
    type,
    filterData,
    preprocess
} from "./func/preprocess.js";


d3.csv("https://raw.githubusercontent.com/tzuie99/final/main/data/Spotify_Youtube.csv", type).then(
    res => {
        const filtered = filterData(res);
        const processed = preprocess(filtered);
        const prepared = prepareChartData(processed);

        const data = processMap(prepared);
        console.log(data);
        setupCanvas_teach(data, filtered);
    }
);

//time get!!
// 獲取當前時間
function getCurrentTime() {
    var currentTime = new Date();
    var hours = currentTime.getHours();
    var minutes = currentTime.getMinutes();
    var seconds = currentTime.getSeconds();
  
    // sprintf 0 (美觀用)
    hours = addLeadingZero(hours);
    minutes = addLeadingZero(minutes);
    seconds = addLeadingZero(seconds);
  
    // 時間字串
    var timeString = hours + ":" + minutes + ":" + seconds;
  
    return timeString;
  }
  
  // sprintf 0
  function addLeadingZero(number) {
    return number < 10 ? "0" + number : number;
  }
  
  // 更新function
  function updateTime() {
    var currentTimeElement = document.getElementById("current-time");
    currentTimeElement.innerHTML = getCurrentTime();
  }
  
  // 每秒更新
  setInterval(updateTime, 1000);


  //bubble


  "use strict";

import "https://unpkg.com/d3@7.8.2";


(() => {

const cfg = {
    data: {
        path: "https://raw.githubusercontent.com/tzuie99/final/main/data/Spotify_Youtube.csv",
        filter: d =>
            d.yt_views > 100000000 &&
            d.yt_likes > 0         &&
            d.yt_comments > 0
    },
    chart: {
        title: {
            primary: d =>
                `The Bubble Chart of Views-Likes on YouTube`,
            secondary: d =>
                `For ${d.length} Top 10 songs of various artist on Spotify`
        },
        width:  700,
        height: 500,
        margin: {
            top:    140,
            bottom: 120,
            left:   100,
            right:   60
        },
        dot: {
            min_r:  3,
            max_r: 40
        },
        legend: {
            x:     550,
            y:     400,
            width:  50
        },
        x: {
            title: "YT. Views",
            value: d => d.yt_views,
            log: true
        },
        y: {
            title: "YT. Likes",
            value: d => d.yt_likes,
            log: true
        },
        z: {
            title: "YT. Comment Ratio",
            value: d => d.yt_comments / d.yt_views,
            log: false
        },
        c: {
            title: undefined,
            value: d => d.yt_offical ? "#69b3a2" : "#e78ac3",
            log: undefined
        }
    },
    container: {
        id: "bubble-chart-container",
        tooltip_id: "bubble-chart-tooltip",
        width:  0,  // Manually generated
        height: 0   // Manually generated
    },
    tooltip: {
        list: [{
            title: "Title",
            data: d => d.sp_title
        }, {
            title: "Artist",
            data: d => d.sp_artist
        }, {
            title: "Sp. Streams",
            data: d => big_num_format(d.sp_stream)
        }, {
            title: "YT. Views",
            data: d => big_num_format(d.yt_views)
        }, {
            title: "YT. Likes",
            data: d => big_num_format(d.yt_likes)
        }, {
            title: "YT. Like Ratio",
            data: d => percent_format(d.yt_likes / d.yt_views)
        }, {
            title: "YT. Comments",
            data: d => big_num_format(d.yt_comments)
        }, {
            title: "YT. Comment Ratio",
            data: d => percent_format(d.yt_comments / d.yt_views)
        }, {
            title: "YT. Official",
            data: d => d.yt_offical.toString()
        }]
    }
};
cfg.container.width =
    cfg.chart.width + cfg.chart.margin.left + cfg.chart.margin.right;
cfg.container.height =
    cfg.chart.height + cfg.chart.margin.top + cfg.chart.margin.bottom;
Object.freeze(cfg);


function big_num_format(d) {
    return d3.format(".3s")(d)
        .replace("M", " mil")
        .replace("G", " bil")
        .replace("T", " tri");
}


function percent_format(d) {
    return d3.format(".3%")(d);
}


async function load_data() {
    console.group("Loading data");
    console.log("Start loading...");
    console.time("All loaded");

    const data = await d3.csv(cfg.data.path,
        d => ({
            sp_title:       d.Track,
            sp_artist:      d.Artist,
            sp_stream:      +d.Stream,
            yt_views:       +d.Views,
            yt_likes:       +d.Likes,
            yt_comments:    +d.Comments,
            yt_offical:     d.official_video === "True"
        })
    );

    console.timeEnd("All loaded");
    console.log(data);
    console.groupEnd();

    return data;
}


function filter_data(data) {
    console.group("Filtering data");
    console.log("Start filtering...");
    console.time("All filtered");

    data = data.filter(cfg.data.filter);

    console.timeEnd("All filtered");
    console.log(data);
    console.groupEnd();

    return data
}


function draw_chart(data) {
    console.group("Drawing buble chart");
    console.log("Start drawing...");
    console.time("All drawn");

    /**
     * Create the SVG
     */
    const svg = d3.select(`#${cfg.container.id}`)
        .append("svg")
        .attr("width", cfg.container.width)
        .attr("height", cfg.container.height)
        .append("g")
        .attr("transform", 
              `translate(${cfg.chart.margin.left},${cfg.chart.margin.top})`);
    
    /**
     * Create the Header
     */
    const header = svg.append("g")
        .attr("class", "header")
        .attr("transform", `translate(0,${-cfg.chart.margin.top / 2})`)
        .append("text");
    header.append("tspan")
        .attr("class", "primary")
        .text(cfg.chart.title.primary(data));
    header.append("tspan")
        .attr("class", "secondary")
        .attr("x", 0)
        .attr("y", 25)
        .text(cfg.chart.title.secondary(data));

    /**
     * Create Axes
     */
    const x_scale = cfg.chart.x.log ? d3.scaleLog() : d3.scaleLinear();
    x_scale.domain(d3.extent(data, d => cfg.chart.x.value(d)))
        .range([0, cfg.chart.width]);
    const y_scale = cfg.chart.y.log ? d3.scaleLog() : d3.scaleLinear();
    y_scale.domain(d3.extent(data, d => cfg.chart.y.value(d)))
        .range([cfg.chart.height, 0]);
    const z_scale = cfg.chart.z.log ? d3.scaleLog() : d3.scaleLinear();
    z_scale.domain(d3.extent(data, d => cfg.chart.z.value(d)))
        .range([cfg.chart.dot.min_r, cfg.chart.dot.max_r]);

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", `translate(0,${cfg.chart.height})`)
        .call(d3.axisBottom(x_scale).tickFormat(big_num_format))
        .selectAll("text")
        .style("text-anchor", "start")
        .attr("transform", "translate(10,10)rotate(90)");
    svg.append("g")
        .attr("class", "y axis")
        .call(d3.axisLeft(y_scale).tickFormat(big_num_format));

    svg.append("text")
        .attr("class", "x label")
        .attr("text-anchor", "end")
        .attr("x", cfg.chart.width)
        .attr("y", cfg.chart.height + 70)
        .text(`X axis: ${cfg.chart.x.title}`);
    svg.append("text")
        .attr("class", "y label")
        .attr("text-anchor", "end")
        .attr("transform", "rotate(-90)")
        .attr("x", 0)
        .attr("y", -60)
        .text(`Y axis: ${cfg.chart.y.title}`);

    /**
     * Create bubbles
     */
    const dots = svg.append('g')
        .selectAll(".bubble")
        .data(data)
        .join("circle")
        .attr("class", "bubble")
        .attr("cx", d => x_scale(cfg.chart.x.value(d)))
        .attr("cy", d => y_scale(cfg.chart.y.value(d)))
        .attr("r",  d => z_scale(cfg.chart.z.value(d)))
        .style("fill", d => cfg.chart.c.value(d))
        .style("opacity", 0.7)
        .attr("stroke", "black");
    
    /**
     * Create the Legend
     */
    const legend_value = d3.ticks(z_scale.domain()[0], z_scale.domain()[1], 4);
    const legend = svg.append("g")
        .attr("class", "legend")
        .attr("transform", `translate(${cfg.chart.legend.x}, ${cfg.chart.legend.y})`);
    legend.selectAll(".circle")
        .data(legend_value)
        .join("circle")
        .attr("class", "circle")
        .attr("cx", 0)
        .attr("cy", d => -z_scale(d))
        .attr("r", d => z_scale(d));
    legend.selectAll(".segment")
        .data(legend_value)
        .join("line")
        .attr("class", "segment")
        .attr("x1", d => z_scale(d))
        .attr("x2", cfg.chart.legend.width)
        .attr("y1", d => -z_scale(d))
        .attr("y2", d => -z_scale(d));
    legend.selectAll(".text")
        .data(legend_value)
        .join("text")
        .attr("class", "text")
        .attr("x", cfg.chart.legend.width)
        .attr("y", d => -z_scale(d))
        .text(d => percent_format(d))
        .attr("alignment-baseline", "middle");
    legend.append("text")
        .attr("class", "title")
        .attr("transform", `translate(0,30)`)
        .attr("text-anchor", "middle")
        .text(`Radius: ${cfg.chart.z.title}`);

    /**
     * Create the Tooltip
     */
    const tip = d3.select(`#${cfg.container.tooltip_id}`);

    function show_tooltip(e, d) {
        tip.transition().duration(200);

        tip.style("opacity", 0.9)
            .style("left", (e.x) + "px")
            .style("top", (e.y + 15) + "px");
        tip.selectAll(".tip-row")
            .data(cfg.tooltip.list)
            .join("p")
            .attr("class", "tip-row")
            .html(l => `<b>${l.title}</b>: <i>${l.data(d)}</i>`);
    }

    function move_tooltip(e) {
        tip.style("left", (e.x) + "px")
            .style("top", (e.y + 30) + "px");
    }

    function hide_tooltip(e) {
        tip.transition()
            .style("opacity", 0);
    }

    dots.on("mouseover", show_tooltip)
        .on("mousemove", move_tooltip)
        .on("mouseout", hide_tooltip);

    console.timeEnd("All drawn");
    console.groupEnd();
}


async function main() {
    console.group("Bubble Chart Drawer");
    console.log("Start peocessing...");
    console.time("All processed");

    let data = await load_data();
    data = filter_data(data);
    draw_chart(data);

    console.timeEnd("All processed");
    console.groupEnd();
}


main();

})();
  

  