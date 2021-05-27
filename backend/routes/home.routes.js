var express = require('express');
var router = express.Router();
var Admin = require('../models/Admin')
var Igrac = require('../models/Igrac')
var Natjecanje = require('../models/Natjecanje')
var Penal = require('../models/Penal')
var Korner = require('../models/Korner');
var Klub = require('../models/Klub');
var Stadion = require('../models/Stadion');
const Udarac = require('../models/Udarac');
const SlobodanUdarac = require('../models/SlobodanUdarac');
const { dohvatiPreciznostSlobodnihUdaracaIgraca } = require('../models/SlobodanUdarac');
const bcrypt = require ('bcrypt');

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
    const saltRounds = 10;
    /*let password = 'lozinka123'
    let password2 = 'nekalozinka'
    let hash1 = '$2b$10$06rwaEfm9wFfR8tuo8Tr5OkMsuWlvnOGyFUDFFMtFjtWmGjpwppvq'
    let hash2 = '$2b$10$X5xt0ZP833Cot0bOK/HpwuF9EWzLRUwRMujTlQtjtDEjf45Wf06XS'*/
    /*bcrypt.genSalt(saltRounds, function(err, salt) {
        bcrypt.hash(password2, salt, function(err, hash) {
        console.log(hash);
        });
      });*/

      hash = await Admin.provjeriLogin(req.body.username)

      bcrypt.compare(req.body.password, hash, async function(err, result) {
        if (result) {
          console.log("It matches!")
          user = await Admin.napraviLogin(req.body.username);
          res.send(user);
        }
        else {
          console.log("Invalid password!");
          res.send(null)
        }
      });

    /*let check = await Admin.provjeriLogin(req.body.username, req.body.password);
    if(check){
        user = await Admin.napraviLogin(req.body.username);
        req.session.user = user;
        res.send(user);
    }else{
        res.send(null);
    }*/
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

router.get('/golmanstranepenala', async(req, res) => {
    let data = await Penal.dohvatiStraneGolmanaPenala(req.query.igrac)
    res.send(data);
})

router.get('/golmanstraneudarci', async(req, res) => {
    let data = await Udarac.dohvatiStraneGolmanaUdaraca(req.query.igrac)
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

router.get('/udaljenostslobodni', async(req, res) => {
    let data = await SlobodanUdarac.dohvatiIgracAvgUdaljenostSlobodanUdarac(req.query.igrac)
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

router.get('/golmanstranepenalasezona', async(req, res) => {
    let data = await Penal.dohvatiStraneGolmanaPenalaZaSezonu(req.query.igrac, req.query.sezona)
    res.send(data);
})

router.get('/golmanstraneudarcisezona', async(req, res) => {
    let data = await Udarac.dohvatiStraneGolmanaUdaracaZaSezonu(req.query.igrac, req.query.sezona)
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

router.get('/udaljenostslobodnisezona', async(req, res) => {
    let data = await SlobodanUdarac.dohvatiIgracAvgUdaljenostSlobodanUdaracZaSezonu(req.query.igrac, req.query.sezona)
    res.send(data);
})

router.get('/igracpreciznostkornersezona', async(req, res) => {
    let data = await Korner.dohvatiPreciznostKorneraIgracaZaSezonu(req.query.igrac, req.query.sezona)
    res.send(data);
})

router.get('/postotakobranapenal', async(req, res) => {
    let data = await Penal.dohvatiPostotakObranaPenala(req.query.igrac)
    res.send(data);
})

router.get('/postotakobranakorner', async(req, res) => {
    let data = await Korner.dohvatiPostotakObranaKornera(req.query.igrac)
    res.send(data);
})

router.get('/postotakobranaudarac', async(req, res) => {
    let data = await Udarac.dohvatiPostotakObranaUdaraca(req.query.igrac)
    res.send(data);
})

router.get('/postotakobranaslobodni', async(req, res) => {
    let data = await SlobodanUdarac.dohvatiPostotakObranaSlobodnih(req.query.igrac)
    res.send(data);
})


router.get('/postotakobranapenalsezona', async(req, res) => {
    let data = await Penal.dohvatiPostotakObranaPenalaZaSezonu(req.query.igrac, req.query.sezona)
    res.send(data);
})

router.get('/postotakobranakornersezona', async(req, res) => {
    let data = await Korner.dohvatiPostotakObranaKorneraZaSezonu(req.query.igrac, req.query.sezona)
    res.send(data);
})

router.get('/postotakobranaudaracsezona', async(req, res) => {
    let data = await Udarac.dohvatiPostotakObranaUdaracaZaSezonu(req.query.igrac, req.query.sezona)
    res.send(data);
})

router.get('/postotakobranaslobodnisezona', async(req, res) => {
    let data = await SlobodanUdarac.dohvatiPostotakObranaSlobodnihZaSezonu(req.query.igrac, req.query.sezona)
    res.send(data);
})

router.get('/goloviposezonama', async(req, res) => {
    let data = await Igrac.dohvatiGolovePoSezonama(req.query.igrac)
    res.send(data);
})

router.get('/drzavaroster/:id/', async(req, res) => {
    let data = await Igrac.dohvatiRosterZaDrzavu(req.params.id, req.query.sezona)
    res.send(data);
})

router.get('/najboljistrijelcitima/:id/', async(req, res) => {
    let data = await Igrac.dohvatiNajboljeStrijelceTimaUSezoni(req.params.id, req.query.sezona)
    res.send(data);
})

router.get('/penaliklub/:id/', async(req, res) => {
    let data = await Penal.dohvatiPenaleKluba(req.query.idklub, req.params.id, req.query.sezona)
    res.send(data);
})

router.get('/penalidrzava/:id/', async(req, res) => {
    let data = await Penal.dohvatiPenaleDrzave(req.query.iddrzava, req.params.id, req.query.sezona)
    res.send(data);
})

router.get('/korneriklub/:id/', async(req, res) => {
    let data = await Korner.dohvatiKornereKluba(req.query.idklub, req.params.id, req.query.sezona)
    res.send(data);
})

router.get('/korneridrzava/:id/', async(req, res) => {
    let data = await Korner.dohvatiKornereDrzave(req.query.iddrzava, req.params.id, req.query.sezona)
    res.send(data);
})

router.get('/udarciklub/:id/', async(req, res) => {
    let data = await Udarac.dohvatiUdarceKluba(req.query.idklub, req.params.id, req.query.sezona)
    res.send(data);
})

router.get('/udarcidrzava/:id/', async(req, res) => {
    let data = await Udarac.dohvatiUdarceDrzave(req.query.iddrzava, req.params.id, req.query.sezona)
    res.send(data);
})

router.get('/slobodniklub/:id/', async(req, res) => {
    let data = await SlobodanUdarac.dohvatiSlobodneUdarceKluba(req.query.idklub, req.params.id, req.query.sezona)
    res.send(data);
})

router.get('/slobodnidrzava/:id/', async(req, res) => {
    let data = await SlobodanUdarac.dohvatiSlobodneUdarceDrzave(req.query.iddrzava, req.params.id, req.query.sezona)
    res.send(data);
})

router.get('/goloviposezonamatim/:id/', async(req, res) => {
    let data = await Klub.dohvatiGolovePoSezonamaTima(req.params.id)
    res.send(data);
})

router.get('/brgolovadomasezona/:id/', async(req, res) => {
    let data = await Klub.dohvatiBrGolovaDoma(req.params.id, req.query.sezona)
    res.send(data);
})

router.get('/brgolovagostsezona/:id/', async(req, res) => {
    let data = await Klub.dohvatiBrGolovaUGostima(req.params.id, req.query.sezona)
    res.send(data);
})

router.get('/avgposjecenost/:id/', async(req, res) => {
    let data = await Klub.dohvatiProsjecnuPosjecenost(req.params.id, req.query.sezona)
    res.send(data);
})

router.get('/stadiontim/:id/', async(req, res) => {
    let data = await Stadion.dohvatiNajcesciStadion(req.params.id)
    res.send(data);
})

module.exports = router