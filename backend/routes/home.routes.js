var express = require('express');
var router = express.Router();
var Admin = require('../models/Admin')

router.get('/logout', async(req, res, next) =>{
    req.session.user = undefined;
    req.session.destroy((err) => {
        if(err) {
          //report possible error
          console.log(err)
        }
        else {
            res.send("logged out!");
        }
      })   
});

router.post('/login', async(req, res) => {
    let check = await Admin.provjeriLogin(req.body.username, req.body.password);
    if(check){
        user = await Admin.napraviLogin(req.body.username);
        req.session.user = user;
        res.send(user);
    }else{
        res.send(null);
    }
})

module.exports = router