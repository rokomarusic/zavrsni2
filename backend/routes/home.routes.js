var express = require('express');
var router = express.Router();
var Admin = require('../models/Admin')
var Igrac = require('../models/Igrac')
var Natjecanje = require('../models/Natjecanje')
var Penal = require('../models/Penal')
var Korner = require('../models/Korner');
const Udarac = require('../models/Udarac');
const SlobodanUdarac = require('../models/SlobodanUdarac');

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

router.get('/topstrijelcisezona', async(req, res) => {
    let data = await Igrac.dohvatiNajboljeStrijelceUSezoni(req.query.sezona);
    res.send(data);
})

router.get('/topstrijelcinatjecanje', async(req, res) => {
    let data = await Igrac.dohvatiNajboljeStrijelceUNatjecanju(req.query.natjecanje);
    res.send(data);
})

router.get('/topstrijelcipenali', async(req, res) => {
    let data = await Igrac.dohvatiNajboljeStrijelcePenala();
    res.send(data);
})

router.get('/topstrijelcipenalisezona', async(req, res) => {
    let data = await Igrac.dohvatiNajboljeStrijelcePenalaUSezoni(req.query.sezona);
    res.send(data);
})

router.get('/topstrijelcipenalinatjecanje', async(req, res) => {
    let data = await Igrac.dohvatiNajboljeStrijelcePenalaUNatjecanju(req.query.natjecanje);
    res.send(data);
})

router.get('/topstrijelcislobodni', async(req, res) => {
    let data = await Igrac.dohvatiNajboljeStrijelceSlobodnih()
    res.send(data);
})

router.get('/topstrijelcislobodnisezona', async(req, res) => {
    let data = await Igrac.dohvatiNajboljeStrijelceSlobodnihUSezoni(req.query.sezona)
    res.send(data);
})

router.get('/topstrijelcislobodninatjecanje', async(req, res) => {
    let data = await Igrac.dohvatiNajboljeStrijelceSlobodnihUNatjecanju(req.query.natjecanje)
    res.send(data);
})

router.get('/topstrijelciudarcisezona', async(req, res) => {
    let data = await Igrac.dohvatiNajboljeStrijelceSlobodnihUSezoni(req.query.sezona)
    res.send(data);
})

router.get('/topstrijelciudarcinatjecanje', async(req, res) => {
    let data = await Igrac.dohvatiNajboljeStrijelceSlobodnihUNatjecanju(req.query.natjecanje)
    res.send(data);
})


router.get('/svanatjecanja', async(req, res) => {
    let data = await Natjecanje.dohvatiSvaNatjecanja()
    res.send(data);
})

router.get('/igracstranepenala', async(req, res) => {
    let data = await Penal.dohvatiStraneIgracaPenala(req.query.igrac)
    res.send(data);
})

router.get('/igracvisinepenala', async(req, res) => {
    let data = await Penal.dohvatiVisineIgracaPenala(req.query.igrac)
    res.send(data);
})

router.get('/igracpreciznostpenala', async(req, res) => {
    let data = await Penal.dohvatiPreciznostPenalaIgraca(req.query.igrac)
    res.send(data);
})

router.get('/igracpreciznostudaraca', async(req, res) => {
    let data = await Udarac.dohvatiPreciznostUdaracaIgraca(req.query.igrac)
    res.send(data);
})

router.get('/igracprosjecnaudaljenostudaraca', async(req, res) => {
    let data = await Udarac.dohvatiIgracAvgUdaljenostUdarac(req.query.igrac)
    res.send(data);
})

router.get('/igracstraneudaraca', async(req, res) => {
    let data = await Udarac.dohvatiStraneIgracaUdaraca(req.query.igrac)
    res.send(data);
})

router.get('/igracudaracpokriven', async(req, res) => {
    let data = await Udarac.dohvatiIgracPokrivenUdarac(req.query.igrac)
    res.send(data);
})

router.get('/stativakorner', async(req, res) => {
    let data = await Korner.dohvatiStativeNaKorneru(req.query.igrac)
    res.send(data);
})

router.get('/izborendrugikorner', async(req, res) => {
    let data = await Korner.dohvatiIzborenDrugiKornerNaKorneru(req.query.igrac)
    res.send(data);
})

router.get('/golmanizletiokorner', async(req, res) => {
    let data = await Korner.dohvatiGolmanIzletioNaKorneru(req.query.igrac)
    res.send(data);
})

router.get('/stranaigracslobodni', async(req, res) => {
    let data = await SlobodanUdarac.dohvatiStranaSlobodanUdaracIgraca(req.query.igrac)
    res.send(data);
})

router.get('/stranagolmanslobodni', async(req, res) => {
    let data = await SlobodanUdarac.dohvatiStranaSlobodanUdaracGolmana(req.query.igrac)
    res.send(data);
})

router.get('/pogodiozivizid', async(req, res) => {
    let data = await SlobodanUdarac.dohvatiPogodioZiviZid(req.query.igrac)
    res.send(data);
})

router.get('/brojigracazivizid', async(req, res) => {
    let data = await SlobodanUdarac.dohvatiBrojIgracaZiviZid(req.query.igrac)
    res.send(data);
})

router.get('/preciznostslobodni', async(req, res) => {
    let data = await SlobodanUdarac.dohvatiPreciznostSlobodnihUdaracaIgraca(req.query.igrac)
    res.send(data);
})

router.get('/igracpreciznostkorner', async(req, res) => {
    let data = await Korner.dohvatiPreciznostKorneraIgraca(req.query.igrac)
    res.send(data);
})
//za sezone

router.get('/igracstranepenalasezona', async(req, res) => {
    let data = await Penal.dohvatiStraneIgracaPenalaZaSezonu(req.query.igrac, req.query.sezona)
    res.send(data);
})

router.get('/igracvisinepenalasezona', async(req, res) => {
    let data = await Penal.dohvatiVisineIgracaPenalaZaSezonu(req.query.igrac, req.query.sezona)
    res.send(data);
})

router.get('/igracpreciznostpenalasezona', async(req, res) => {
    let data = await Penal.dohvatiPreciznostPenalaIgracaZaSezonu(req.query.igrac, req.query.sezona)
    res.send(data);
})

router.get('/igracpreciznostudaracasezona', async(req, res) => {
    let data = await Udarac.dohvatiPreciznostUdaracaIgracaZaSezonu(req.query.igrac, req.query.sezona)
    res.send(data);
})

router.get('/igracprosjecnaudaljenostudaracasezona', async(req, res) => {
    let data = await Udarac.dohvatiIgracAvgUdaljenostUdaracZaSezonu(req.query.igrac, req.query.sezona)
    res.send(data);
})

router.get('/igracstraneudaracasezona', async(req, res) => {
    let data = await Udarac.dohvatiStraneIgracaUdaracaZaSezonu(req.query.igrac, req.query.sezona)
    res.send(data);
})

router.get('/igracudaracpokrivensezona', async(req, res) => {
    let data = await Udarac.dohvatiIgracPokrivenUdaracZaSezonu(req.query.igrac, req.query.sezona)
    res.send(data);
})

router.get('/stativakornersezona', async(req, res) => {
    let data = await Korner.dohvatiStativeNaKorneruZaSezonu(req.query.igrac, req.query.sezona)
    res.send(data);
})

router.get('/izborendrugikornersezona', async(req, res) => {
    let data = await Korner.dohvatiIzborenDrugiKornerNaKorneruZaSezonu(req.query.igrac, req.query.sezona)
    res.send(data);
})

router.get('/golmanizletiokornersezona', async(req, res) => {
    let data = await Korner.dohvatiGolmanIzletioNaKorneruZaSezonu(req.query.igrac, req.query.sezona)
    res.send(data);
})

router.get('/stranaigracslobodnisezona', async(req, res) => {
    let data = await SlobodanUdarac.dohvatiStranaSlobodanUdaracIgracaZaSezonu(req.query.igrac, req.query.sezona)
    res.send(data);
})

router.get('/stranagolmanslobodnisezona', async(req, res) => {
    let data = await SlobodanUdarac.dohvatiStranaSlobodanUdaracGolmanaZaSezonu(req.query.igrac, req.query.sezona)
    res.send(data);
})

router.get('/pogodiozivizidsezona', async(req, res) => {
    let data = await SlobodanUdarac.dohvatiPogodioZiviZidZaSezonu(req.query.igrac, req.query.sezona)
    res.send(data);
})

router.get('/brojigracazivizidsezona', async(req, res) => {
    let data = await SlobodanUdarac.dohvatiBrojIgracaZiviZidZaSezonu(req.query.igrac, req.query.sezona)
    res.send(data);
})

router.get('/preciznostslobodnisezona', async(req, res) => {
    let data = await SlobodanUdarac.dohvatiPreciznostSlobodnihUdaracaIgracaZaSezonu(req.query.igrac, req.query.sezona)
    res.send(data);
})

router.get('/igracpreciznostkornersezona', async(req, res) => {
    let data = await Korner.dohvatiPreciznostKorneraIgracaZaSezonu(req.query.igrac, req.query.sezona)
    res.send(data);
})

module.exports = router