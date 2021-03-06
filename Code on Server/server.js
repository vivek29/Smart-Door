var fs = require('fs');
var mqtt    = require('mqtt');
var cloudinary = require('cloudinary');
var client  = mqtt.connect('mqtt://52.33.59.166:1883');
var Kairos = require('kairos-api');
var kairosClient = new Kairos('APP ID', 'APP KEY');
var gcm = require('node-gcm');

 // the registration tokens of the devices you want to send to
var regTokens = ['*'];
 
// Set up the sender with you API key 
var sender = new gcm.Sender('API KEY');

var url;
 
client.on('connect', function () {
  console.log('Connected to Mosq');	
  client.subscribe('camera');
});

cloudinary.config({ 
  cloud_name: '*', 
  api_key: '*', 
  api_secret: '*' 
});


client.on('message', function (topic, message) {
  // message is Buffer 
  if(topic=="camera"){
    var base64data = new Buffer(message).toString('base64');
    base64_decode(base64data, 'match.jpg');    
  }

});

// function to create file from base64 encoded string and upload to cloudinary
function base64_decode(base64str, file) {
    // create buffer object from base64 encoded string, it is important to tell the constructor that the string is base64 encoded
    var bitmap = new Buffer(base64str, 'base64');
    // write buffer to file
    fs.writeFileSync(file, bitmap);    
    console.log('******** File created from base64 encoded string ********');

    // upload image to cloudinary
    cloudinary.uploader.upload("match.jpg", function(result) { 
	  console.log(result.url);
	  url = result.url;
	  kairos_recog(url); 
	});
}

function kairos_recog(url) {

    var params = {
	  image: url,
	  gallery_name: 'smartdoor'
	};

	kairosClient.recognize(params)   // return Promise 
	  //  result: { 
	  //    status: <http status code>, 
	  //    body: <data> 
	  //  } 
	  .then(function(result) {
	  	console.log("Inside then");
	  	console.log(result.body['images'][0]);
	  	console.log(result.body['images'][0]['transaction']['status']);

	  	// check if status is success
	  	if((result.body['images'][0]['transaction']['status']=="success")){
	  		// check the confidence
	  		if((parseInt((result.body['images'][0]['transaction']['confidence']).substring(2,4)))>80){
		  		client.publish('Result','Access Granted');
	  		}
	  		else {
	  			client.publish('Result','Sorry, Try Again');
	  		}
	  	}

	  	// If status failure, send a push notification (with the image)
	  	else {
		  	console.log("Inside failure, sending push notification");
		  	
		  	client.publish('Result','Wait, calling owner..');

		  	// create a message with some given values 
			var message = new gcm.Message({
			  collapseKey: 'demo',
			  priority: 'high',
			  contentAvailable: true,
			  delayWhileIdle: false,
			  data: {
			    'key1': url,
				'title': "New Message",
			    'icon': "ic_launcher",
			    'body': "Notice: Someone's at the door, Please accept or deny it."			    
			  }
			});

		  	// Send the message, trying only once
			sender.sendNoRetry(message, { registrationTokens: regTokens }, function(err, response) {
			  if(err){
			    console.log("Inside err");
			    console.error(err);
			  }  
			  else {
			    console.log("Inside response");
			    console.log(response);
			  }  
			});

	  	}

	  })
	  // err -> array: jsonschema validate errors 
	  //        or throw Error 
	  .catch(function(err) {
	  	console.log("Inside err");
	  	console.log(err);

	  	// Ask to take the picture again
	  	client.publish('Result','Take pic again');

	  });

}
