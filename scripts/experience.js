

// Radar Chart Experience
// TODO: Add buttons for the user to toggle years.



function CreateRadarChart() {
    "use strict";
    var RadarChartCanvas = document.getElementById("marksChart");
    var ColumnWidth = document.getElementById("experience").clientWidth;
    var BodyWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    var BodyHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    var chartFontSize = 10;
    var ColumnHeight = ColumnWidth;

    if (ColumnHeight > BodyHeight) {
        ColumnHeight = BodyHeight - document.getElementById("myNavbar").clientHeight;
    }

    document.getElementById("experience").style.height = ColumnHeight.toString() + "px";

    if ( BodyWidth >= 1200) {
        chartFontSize = 18;
    } else if (BodyWidth >= 768 && BodyWidth < 1200) {
        chartFontSize = 14;
    } else if (BodyWidth < 768) {
        chartFontSize = 8;
        Chart.defaults.global.defaultFontFamily = "'Arial Narrow', 'Arial', 'sans-serif'";
    }

    // 0 - 10: Interested
    // 10 - 30: Beginner
    // 30 - 60: Intermediate
    // 60 - 90: Expert
    // 100: Assassin

    var label0 = [	"ArcMap 10.6", "ArcGIS Pro", "ArcGIS Online", "Spatial Analyst", "Network Analyst", "3D Analyst"];
    var data2018a = [95,	      	40,          60,               85, 			      70,                35];
    var data2017a = [95,            20,          20,               80,                65,                35];
    var data2016a = [90,             0,           0,               75,                30,                30];

    var label1 = [	"Python", "T-SQL", "R", "HTML5", "CSS3", "JavaScript", "Dojo", "ArcGIS API for JavaScript", "Web AppBuilder"];
    var data2018b = [60,       45,      15,  60,      60,     35,           20,    35,                           60];
    var data2017b = [50,       40,      20,  30,      30,     20,           10,    10,                           20];
    var data2016b = [30,       30,      20,  20,      20,     10,            0,     0,                            0];

    var label2 = [	"Enterprise Deployment"];
    var data2018c = [30];
    var data2017c = [20];
    var data2016c = [10];

    var label3 = [	"UAS Remote Sensing", "GPS Data Collection"];
    var data2018d = [95,                   85];
    var data2017d = [95,                   80];
    var data2016d = [70,                   70];

    var labels = label0.concat(label1, label2, label3);
    var data2018 = data2018a.concat(data2018b, data2018c, data2018d);
    var data2017 = data2017a.concat(data2017b, data2017c, data2017d);
    var data2016 = data2016a.concat(data2016b, data2016c, data2016d);

    var color2018a = "rgba(245, 219, 115, 0.0)";
    var color2018 = "rgb(245, 219, 115)";
    var color2017a = "rgba(55, 87, 139, 0.2)";
    var color2017 = "rgb(55, 87, 139)";
    var color2016a = "rgba(129, 83, 164, 0.2)";
    var color2016 = "rgb(129, 83, 164)";

    var RadarChartData = {
        labels: labels,
        datasets: [
            {
                //255, 204, 0, 0.1
                label: "2018",
                fill:true,
                borderWidth: 2,
                backgroundColor: color2018a,
                borderColor: color2018,
                pointBackgroundColor: color2018,
                pointBorderColor: "#fff",
                pointHoverBackgroundColor: "#fff",
                pointHoverBorderColor: color2018,
                lineTension: 0.25,
                data: data2018
            },
            {
                //60, 141, 47, 0.2
                label: "2017",
                fill:true,
                borderWidth: 4,
                backgroundColor: color2017a,
                borderColor: color2017,
                pointBackgroundColor: color2017,
                pointBorderColor: "#fff",
                pointHoverBackgroundColor: "#fff",
                pointHoverBorderColor: color2017,
                lineTension: 0.25,
                data: data2017
            },
            {
                //29, 151, 224, 0.2
                label: "2016",
                fill:true,
                borderWidth: 2,
                backgroundColor: color2016a,
                borderColor: color2016,
                pointBackgroundColor: color2016,
                pointBorderColor: "#fff",
                pointHoverBackgroundColor: "#fff",
                pointHoverBorderColor: color2016,
                lineTension: 0.25,
                data: data2016
            }]
    };

    var RadarChartOptions = {
        scale: {
            pointLabels: {
                fontSize: chartFontSize
            },
            ticks: {
                beginAtZero: true,
                min: 0,
                max: 100,
                stepSize: 30
            }
        },
        legend: {
            display:true,
            position: "bottom",
            labels: {
                padding: 30
            }
        },
        layout: {
            padding: {
                top: 0,
                bottom: 0
            }
        },
        responsive: true,
        maintainAspectRatio: false
    };

    var radarChart = new Chart(RadarChartCanvas, {
    type: 'radar',
    data: RadarChartData,
    options: RadarChartOptions
    });
}

window.onload = CreateRadarChart;
window.onresize = CreateRadarChart;
