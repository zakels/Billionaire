var express = require('express');
var router = express.Router();
var stockInfo = require('../model/stockInfo');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index-6', { title: 'Express' });
});
 
router.post('/', function(req, res, next){
	console.log('search course');
	//console.log(req.body.coursename);
	stockInfo.searchStockBySymbl(req.body.stockName, function(err, infom) {
		if (err) {
			//res.redirect('/error');
		}
		else {
		//	localStorage.setItem('Course',JSON.stringify(course));
			res.redirect('/stock');
		}
	});
});


module.exports = router;
