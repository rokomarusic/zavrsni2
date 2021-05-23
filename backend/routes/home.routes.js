var express = require('express');
var router = express.Router();
var Admin = require('../models/Admin')
var Igrac = require('../models/Igrac')

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

router.get('/topstrijelci', async(req, res) => {
    let data = await Igrac.dohvatiNajboljeStrijelce();
    res.send(data);
})

router.get('/topstrijelcinatjecanje/:id/', async(req, res) => {
    let data = await Igrac.dohvatiNajboljeStrijelceUNatjecanju(req.params.id);
    res.send(data);
})

router.get('/topstrijelcipenali', async(req, res) => {
    let data = await Igrac.dohvatiNajboljeStrijelcePenala();
    res.send(data);
})

router.get('/topstrijelcipenalinatjecanje/:id/', async(req, res) => {
    let data = await Igrac.dohvatiNajboljeStrijelcePenalaUNatjecanju(req.params.id);
    res.send(data);
})

router.get('/topstrijelcislobodni', async(req, res) => {
    let data = await Igrac.dohvatiNajboljeStrijelceSlobodnih()
    res.send(data);
})

router.get('/topstrijelcislobodninatjecanje/:id/', async(req, res) => {
    let data = await Igrac.dohvatiNajboljeStrijelceSlobodnihUNatjecanju(req.params.id)
    res.send(data);
})

module.exports = router