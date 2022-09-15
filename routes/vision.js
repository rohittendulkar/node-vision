var express = require("express");
var router = express.Router();
var AWS = require("aws-sdk");

router.post("/classify", function (req, res, next) {
	// Your code starts here //

	//Throw error if no image upload
	if (!req.files || req.files.length == 0) {
		res.status(400).json({
			error: "You need to upload an image",
		});
	}

	//Check file data
	console.log(req.files.file);

	const file = req.files.file;
	const buffer = file.data;

	console.log(buffer);

	//AWS config
	const config = new AWS.Config({
		accessKeyId: process.env.AWS_ACCESS_KEY_ID,
		secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
		region: process.env.AWS_REGION,
	});

	console.log(config);

	const client = new AWS.Rekognition();

	var params = {
		Image: {
			Bytes: buffer,
		},
	};

	client.detectLabels(params, (err, response) => {
		if (err) {
			console.log(err, err.stack); // if an error occurred

			res.status(500).json({
				error: "Server side error",
			});
		} else {
			// console.log(`Successfully Detected labels for ${photo}`);
			console.log(response);
			res.status(200).json({
				labels: response.Labels.map((label) => {
					return label.Name;
				}),
			});
		}
	});
	// Your code ends here //
});

module.exports = router;
