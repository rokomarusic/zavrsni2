var express = require('express');
var router = express.Router();
var Igrac = require('../models/Igrac')
var Drzava = require('../models/Drzava')

router.get('/igraci', async (req, res) => {
    let data = await Igrac.dohvatiSveIgrace();
    res.send(data);
});

router.get('/igrac/:id', async (req, res) => {
    console.log("EVO GA")
    console.log(req.params.id)
    let data = await Igrac.dohvatiIgracaZaId(req.params.id);
    res.send(data);
});

router.get('/drzave', async(req, res) => {
    let data = await Drzava.dohvatiSveDrzave();
    res.send(data);
});

  router.post('/dodajdrzavu', async(req, res) => {
    //provjerava se sadrži li baza podataka već državu sa predanim FIFA kodom
    const check = await Drzava.provjeriFifaKod(req.body.fifakod.toUpperCase())
    if(check){
        await Drzava.dodajDrzavu(req.body.nazivtim.toLowerCase(), req.body.fifakod.toUpperCase())
        res.send("Drzava dodana");
    }else{
        res.status(400).json({ 'error': 'drzava je vec dodana u bazu!' });
    }
    
})

module.exports = router
