var express = require('express');
var router = express.Router();
var Igrac = require('../models/Igrac')
var Drzava = require('../models/Drzava')
var Grad = require('../models/Grad')
var Stadion = require('../models/Stadion')


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

router.post('/izmjenidrzavu/:id', async(req, res) => {
    //provjerava se sadrži li baza podataka već državu sa predanim FIFA kodom
    const check = await Drzava.provjeriFifaKod(req.body.fifakod.toUpperCase())
    if(check){
        await Drzava.izmjeniDrzavu(req.params.id, req.body.nazivtim.toLowerCase(), req.body.fifakod.toUpperCase())
        res.send("Drzava izmjenjena");
    }else{
        res.status(400).json({ 'error': 'drzava je vec dodana u bazu!' });
    }
    
})

router.delete('/drzava/:id', async(req, res) => {
    await Drzava.ukloniDrzavu(req.params.id);
    res.json("drzava izbrisana")
})

router.get('/drzava/:id', async (req, res) => {
    console.log("UNUTAR GET DRZAVA")
    console.log(req.params.id)
    let data = await Drzava.dohvatiDrzavuZaId(req.params.id);
    res.send(data);
});

router.get('/drzava/gradovi/:id', async(req, res, next) => {
    let data = await Grad.dohvatiGradoveUDrzavi(req.params.id);
    res.send(data);
})

router.get('/grad/:id', async(req, res, next) => {
    let data = await Grad.dohvatiGradZaId(req.params.id);
    res.send(data);
})

router.post('/dodajgrad', async(req, res) => {
        await Grad.dodajGrad(req.body.nazivgrad.toLowerCase(), req.body.iddrzava)
        res.send("Grad dodan");
});

router.post('/izmjenigrad/:id', async(req, res) => {
    await Grad.izmjeniGrad(req.body.nazivgrad.toLowerCase(), req.params.id);
    res.send("Grad izmjenjen");
});

router.delete('/grad/:id', async(req, res) => {
    await Grad.ukloniGrad(req.params.id);
    res.json("grad izbrisan")
})

router.get('/stadioni/:id', async(req, res) => {
    let data = await Stadion.dohvatiStadioneUGradu(req.params.id);
    res.send(data);
})

router.post('/dodajstadion', async(req, res) => {
    await Stadion.dodajStadion(req.body.nazivstadion.toLowerCase(), req.body.kapacitet, req.body.idgrad)
    res.send("Grad dodan");
});

router.delete('/stadion/:id', async(req, res) => {
    await Stadion.ukloniStadion(req.params.id);
    res.json("stadion izbrisan")
})

router.post('/izmjenistadion/:id', async(req, res) => {
    await Stadion.izmjeniStadion(req.body.nazivstadion, req.body.kapacitet, req.params.id);
    res.send("Stadion izmjenjen");
});

module.exports = router
