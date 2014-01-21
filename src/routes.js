"use strict";
var request = require('request');




exports.home = function(req, res){


	request.get(
		'http://216.70.108.50:7000/timeline/home',
		function (error, response, body){
			var data = {};
			if (!error && response.statusCode == 200) {
	          
				data = JSON.parse(body);

				var feeds = [];
				var last_feed = {};
				data.feeds.forEach(function(element, index, array){
					
					if(last_feed.type && last_feed.type === element.type){
						last_feed.elements.push( element );
					}else{
						last_feed = {};
						last_feed.type = element.type;
						last_feed.elements = [];
						last_feed.elements.push( element );
						feeds.push( last_feed );
					}
				});

				data.feeds_group = feeds;

	        }

	        delete data.feeds;
	        data = {
				timeline: data
	        };


			res.render('pages/home', {
			        isDev: process.env.NODE_ENV === "development",
					title: "About Me",
					data: data,
					helpers:{
						isFb: function(type){
							return type === "fb";
						},

				        fbStatusMsg: function(msg){
							if(msg){
								return msg.replace(/#(\S*)/g, function(match, p1, offset, string){
									return "<a href='https://www.facebook.com/hashtag/" + p1 + "?source=feed_text' target='_blank' >"+ match +"</a>";
								});
							}else{
								return "";
							}
				        },

				        fbPostImage: function(img){
				            if(!img){
				                return "";
				            }
				            return img.replace("_s.jpg","_n.jpg");
				        },

				        fbCommentMoreTotal: function(totalComment){
				            totalComment = totalComment - 4;
				            if(totalComment < 0){
				                return 0;
				            }
				            return totalComment;
				        }
			        },
			        layout: "main"
			});
	});
};
