var express = require('express');
var router = express.Router();
var db = require('../db');

router.get('/:id', (req, res, next) => {

    var countquery = "select * from items as i where i.sellerid='" + req.session.user.sellerid + "'";

    if (req.session.user && req.params.id === req.session.user.sellerid) {
        var countquery = "select * from items as i where i.sellerid='" + req.session.user.sellerid + "'";
        db.query(countquery, (err, result) => {
            res.render('viewItems', {title: '', items: result, loggedin: true, user: req.session.user});
        });
    }
    else if (req.session.user && req.params.id === req.session.user.custid) {
        res.render('viewItems', {title: 'Dashboard', items: result, loggedin: true, user: req.session.user});
    }

});

module.exports = router;