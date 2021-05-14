var express = require('express');
var router = express.Router();
var Igrac = require('../models/Igrac')
var Drzava = require('../models/Drzava')
var Grad = require('../models/Grad')
var Stadion = require('../models/Stadion')
var Natjecanje = require('../models/Natjecanje');
var Klub = require('../models/Klub')
var Sezona = require('../models/Sezona')


router.get('/igraci', async (req, res) => {
    let data = await Igrac.dohvatiSveIgrace();
    res.send(data);
});

router.get('/igrac/:id', async (req, res) => {
    console.log("EVO GA")
    console.log(req.params.id)
    let data = await Igrac.dohvatiIgracaZaId(req.params.id);
    if(data.datumrodenjaigrac){
        let temp3 = new Date(data.datumrodenjaigrac);
        let date3 = temp3.getDate()+"/"+(temp3.getMonth() + 1)+"/"+temp3.getFullYear();
        data.datumrodenjaigrac = date3;
    }
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
        await Drzava.dodajDrzavu(req.body.nazivtim, req.body.fifakod.toUpperCase())
        res.send("Drzava dodana");
    }else{
        res.status(400).json({ 'error': 'drzava je vec dodana u bazu!' });
    }
    
})

router.post('/izmjenidrzavu/:id', async(req, res) => {
    //provjerava se sadrži li baza podataka već državu sa predanim FIFA kodom
    const check = await Drzava.provjeriFifaKod(req.body.fifakod.toUpperCase())
    if(check){
        await Drzava.izmjeniDrzavu(req.params.id, req.body.nazivtim, req.body.fifakod.toUpperCase())
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

router.get('/gradovi/:id', async(req, res, next) => {
    let data = await Grad.dohvatiGradoveUDrzavi(req.params.id);
    res.send(data);
})

router.get('/grad/:id', async(req, res, next) => {
    let data = await Grad.dohvatiGradZaId(req.params.id);
    res.send(data);
})

router.post('/dodajgrad', async(req, res) => {
        await Grad.dodajGrad(req.body.nazivgrad, req.body.iddrzava)
        res.send("Grad dodan");
});

router.post('/izmjenigrad/:id', async(req, res) => {
    await Grad.izmjeniGrad(req.body.nazivgrad, req.params.id);
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
    await Stadion.dodajStadion(req.body.nazivstadion, req.body.kapacitet, req.body.idgrad)
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

router.get('/drzava/natjecanja/:id', async(req, res) => {
    let data = await Natjecanje.dohvatiNatjecanjaUDrzavi(req.params.id);
    res.send(data);
})

router.get('/natjecanje/:id', async(req, res, next) => {
    let data = await Natjecanje.dohvatiNatjecanjeZaId(req.params.id);
    res.send(data);
})

router.get('/drzava/klubovi/:id', async(req, res) => {
    let data = await Klub.dohvatiKluboveUDrzavi(req.params.id)
    res.send(data);
})

router.post('/dodajklub', async(req, res) => {
    await Klub.dodajKlub(req.body.nazivklub, req.body.godosnutka, req.body.idgrad);
    res.send("Klub dodan");
});

router.get('/klub/:id', async(req, res) => {
    let data = await Klub.dohvatiKlubZaId(req.params.id)
    console.log("+++++++")
    console.log(data)
    res.send(data);
    console.log("+++++++")
})

router.delete('/klub/:id', async(req, res) => {
    await Klub.ukloniKlub(req.params.id)
    res.json("klub izbrisan")
})

router.get('/sezone', async(req, res) => {
    let data = await Sezona.dohvatiSveSezone()
    res.json(data)
})

router.post('/dodajnatjecanje', async(req, res) => {
    let data = await Natjecanje.dodajNatjecanje(req.body.nazivnatjecanje, req.body.brojtimova, req.body.godinasezona, req.body.iddrzava)
    if(data === null){
        res.status(400).json({ 'error': 'drzava je vec dodana u bazu!' })
    }else{
        res.send("OK")
    }
});

router.delete('/natjecanje/:id', async(req, res) => {
    await Natjecanje.ukloniNatjecanje(req.params.id)
    res.json("klub izbrisan")
})

router.post('/izmjeniklub/:id', async(req, res) => {
    console.log("req params id " + req.params.id)
    await Klub.izmjeniKlub(req.params.id, req.body.nazivklub, req.body.godosnutka, req.body.idgrad)
    res.send("Klub izmjenjen");
});

router.get('/roster/:id', async(req, res) => {
    let data = await Igrac.dohvatiRosterZaSezonu(req.params.id, req.query.sezona)
    res.send(data);
})

router.get('/igracklubovi/:id', async(req, res) => {
    let data = await Igrac.dohvatiSveKluboveIgraca(req.params.id);
    for(let row in data){
        let temp1 = new Date(data[row].datumodigrazaklub);
        let date1 = temp1.getDate()+"/"+(temp1.getMonth() + 1)+"/"+temp1.getFullYear();
        console.log(date1);
        console.log(temp1);
        data[row].datumodigrazaklub = date1;
        if(data[row].datumdoigrazaklub){
            let temp2 = new Date(data[row].datumdoigrazaklub);
            let date2 = temp2.getDate()+"/"+(temp2.getMonth() + 1)+"/"+temp2.getFullYear();
            data[row].datumdoigrazaklub = date2;
        }

    }
    res.send(data);
})


router.post('/dodajigraca', async(req, res) => {
    await Igrac.dodajIgraca(req.body)
    res.send("Grad dodan");
});


router.post('/izmjeniigraca', async(req, res) => {
    console.log(req.body);
    await Igrac.izmjeniIgraca(req.body)
});

router.delete('/igrac/:id', async(req, res) => {
    await Igrac.ukloniIgraca(req.params.id);
    res.json("klub izbrisan")
})

router.post('/izmjeniboravakuklubu', async(req, res) => {
    console.log(req.body);
    await Igrac.izmjeniBoravakUKlubu(req.body)
    res.send("boravak u klubu izmjenjen!")
});

router.post('/dodajboravakuklubu', async(req, res) => {
    console.log(req.body);
    await Igrac.dodajBoravakUKlubu(req.body)
    res.send("boravak u klubu izmjenjen!")
});

router.get('/sviklubovi', async(req, res) => {
    let data = await Klub.dohvatiSveKlubove();
    res.send(data);
})


module.exports = router
