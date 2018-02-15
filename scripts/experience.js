        //Radar Chart Experience

		//TODO: Add buttons for the user to toggle years.
        window.onload = function() {
            var marksCanvas = document.getElementById("marksChart");
            
            
            chartFontSize = 10;
            
            if ( windowW >= 1200) {
            	chartFontSize = 18;
            } else if (windowW >= 768) {
            	chartFontSize = 14;
            } else {
            	 chartFontSize = 10;
            }
            
            
            
//            0 - 10: Interested
//            10 - 30: Beginner
//            30 - 60: Intermediate
//            60 - 90: Expert
//            100: Assasin 
//
//			"ArcMap 10", "Spatial Analyst", "Network Analyst", "3D Analyst",   "ArcGIS Pro", "Cartography",
//          95,			  85, 				65,					35,				20,			  70,			
//			95,           85,               65,                 35,             20,           70,
//			90,           60,               30,                 30,              0,           60,
//			"Python 2.7", "T-SQL", "R", "HTML5", "CSS3", "JavaScript", "JQuery", "Dojo", "ArcGIS API for JavaScript 3.23",
//			50,			  40,	   15,	 40,	 40,	 30, 			35, 	  20, 	 35,            
//			50,           40,	   20,   30,     30,     20,       		30,       10,	 10,
//			30,           30,	   20,   20,     20,     10,       		10,       0,	  0,
//			"Portal/ArcGIS Online","Enterprise Deployment/Admin", "Database Design", "SSMS", "Toad",
//			30, 					20, 						   40, 				 20,	 50,
//			20, 					20,                            40,               20,     50,
//			0, 						10,                            40, 			  	 20,     30, 
//			"UAS Mapping",  "Agisoft Photoscan", "Pix4D", "Drone2Map", "Trimble Pathfinder", "GPS Data Collection"
//			95,				 100,				  60, 	    50,			60,					  80 		
//			95,            	 100,                 60,       50,         60,                   80
//			70,              90, 			      50,       10,         40, 				  70
			var color2018a = "rgba(245, 219, 115, 0.0)";
			var color2018 = "rgb(245, 219, 115)";
			var color2017a = "rgba(55, 87, 139, 0.2)";
			var color2017 = "rgb(55, 87, 139)";
			var color2016a = "rgba(129, 83, 164, 0.2)";
			var color2016 = "rgb(129, 83, 164)";
            var marksData = {
                labels: ["ArcMap 10", "Spatial Analyst", "Network Analyst", "3D Analyst",   "ArcGIS Pro", "Cartography",
                	"Python 2.7", "T-SQL", "R", "HTML5", "CSS3", "JavaScript", "JQuery", "Dojo", "ArcGIS JavaScript API 3.23",
                	"Portal/ArcGIS Online","Enterprise Deployment", "Database Design", "SSMS", "Toad",
                	"UAS Mapping", "Agisoft Photoscan", "Pix4D", "Drone2Map", "Trimble Pathfinder", "GPS Data Collection"
                	],
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
	                    data: [95,			  85, 				65,					35,				20,			  70, 
	                    	50,			  40,	   15,	 40,	 40,	 30, 			35, 	  20, 	 35, 
	                    	30, 					20, 						   40, 				 20,	 50,
	                    	95,				 100,				  60, 	    50,			60,					  80]
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
	                   	data: [95,           85,               65,                 35,             20,           70,
	                   		50,           40,	   20,   30,     30,     20,       		30,       10,	 10,
	                   		20, 					20,                            40,               20,     50,
	                   		95,            	 100,                 60,       50,         60,                   80]
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
	                    data: [90,           60,               30,                 30,              0,           60, 
	                    	30,           30,	   20,   20,     20,     10,       		10,       0,	  0,
	                    	0, 						10,                            40, 			  	 20,     30,
	                    	70,              90, 			      50,       10,         40, 				  70]
	                }
            	]
            };
            
            marksOptions = {
            		
            			  scale: {
            			    pointLabels: {
            			      fontSize: chartFontSize,
            			    },
						  	ticks: {
							  beginAtZero: true,
							  min: 0,
							  max: 100,
							  stepSize: 30
						  	},
						  	//gridLines: {
								//color: "black",
								//lineWidth: 2
							//}
            			  },
            			  legend: {
            				  display:true,
            				  position: "bottom",
            				  labels: {
            					  padding: 30,
            				  }
            			  },
            			  layout: {
        					  padding: {
        						  top: 0,
        						  bottom: 0
        					  }
        				  },
        			      responsive: true,
        			      maintainAspectRatio: false,
            			          
            };

            var radarChart = new Chart(marksCanvas, {
                type: 'radar',
                data: marksData,
                options: marksOptions

            });
        }
