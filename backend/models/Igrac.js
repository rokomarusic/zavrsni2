const db = require('../db')

module.exports = class Igrac{

    constructor(dbIgrac){
        this.idigrac = dbIgrac.idigrac;
        this.imeigrac = dbIgrac.imeigrac;
        this.prezimeigrac = dbIgrac.prezimeigrac;
        this.nadimakigrac = dbIgrac.nadimakigrac;
        this.jacanoga = dbIgrac.jacanoga;
        this.datumrodenjaigrac = dbIgrac.datumrodenjaigrac;
        this.pozicija = dbIgrac.pozicija;
        this.iddrzava = dbIgrac.iddrzava;
        this.fifakod = dbIgrac.fifakod
        this.godinadolazakigrac = dbIgrac.godinadolazakigrac
        this.godinaodlazakigrac = dbIgrac.godinaodlazakigrac
        this.datumodigra = dbIgrac.datumodigra;
        this.datumdoigra = dbIgrac.datumdoigra;
        this.brgolova = dbIgrac.count
        this.brgolovakorner = dbIgrac.brgolovakorner
        this.dob = dbIgrac.dob
    }   

    static async dohvatiSveIgrace(){
        const sql = `SELECT * FROM  igrac NATURAL JOIN drzava ORDER BY prezimeigrac` 
        const values = [];
        var igraci = [];
        try {
            const result = await db.query(sql, values);
            for(var i = 0; i < result.rows.length; i++){
                igraci[i] = new Igrac(result.rows[i]);
            }
            return igraci;
        } catch (err) {
            console.log(err);
            throw err
        }
    }

    static async dohvatiSveKluboveIgraca(idigrac){
        const sql = `SELECT * FROM igra_za_klub NATURAL JOIN igrac NATURAL JOIN klub NATURAL JOIN tim WHERE idigrac = $1
        ORDER BY igra_za_klub.datumodigrazaklub` 
        const values = [idigrac];
        var igraci = [];
        try {
            const result = await db.query(sql, values);
            return result.rows;
        } catch (err) {
            console.log(err);
            throw err
        }
    }

    static async dohvatiIgraceIzKluba(idklub){
        const sql = `SELECT * FROM  igrac WHERE idklub = $1` 
        const values = [idklub];
        var igraci = [];
        try {
            const result = await db.query(sql, values);
            for(var i = 0; i < result.rows.length; i++){
                igraci[i] = new Igrac(result.rows[i]);
            }
            return igraci;
        } catch (err) {
            console.log(err);
            throw err
        }
    }

    static async dohvatiRosterZaSezonu(idklub, godinasezona){
        const sql = `SELECT * FROM igra_za_klub NATURAL JOIN igrac NATURAL JOIN klub NATURAL JOIN tim
        WHERE idtim = $1 AND igra_za_klub.godinadolazakigrac <= $2  AND (igra_za_klub.godinaodlazakigrac >= $2 OR igra_za_klub.godinaodlazakigrac IS NULL)` 
        const values = [idklub, godinasezona];
        var igraci = [];
        try {
            const result = await db.query(sql, values);
            for(var i = 0; i < result.rows.length; i++){
                igraci[i] = new Igrac(result.rows[i]);
            }
            return igraci;
        } catch (err) {
            console.log(err);
            throw err
        }
    }

    static async dohvatiRosterZaTim(idtim, godinasezona){
        const sql = `SELECT *, ((CURRENT_DATE - datumrodenjaigrac) / 365) AS dob FROM igra_za_klub NATURAL JOIN igrac NATURAL JOIN klub NATURAL JOIN tim
        WHERE idtim = $1 AND igra_za_klub.godinadolazakigrac <= $2  AND (igra_za_klub.godinaodlazakigrac >= $2 OR igra_za_klub.godinaodlazakigrac IS NULL)` 
        const values = [idtim, godinasezona];
        var igraci = [];
        try {
            const result = await db.query(sql, values);
            for(var i = 0; i < result.rows.length; i++){
                igraci[i] = new Igrac(result.rows[i]);
            }
            return igraci;
        } catch (err) {
            console.log(err);
            throw err
        }
    }

    static async dohvatiRosterZaDrzavu(iddrzava, godinasezona){
        const sql = `SELECT * FROM igrac NATURAL JOIN drzava
        WHERE iddrzava = $1 AND EXTRACT(YEAR FROM datumodigrazadrzavu) <= $2
		AND (EXTRACT(YEAR FROM datumdoigrazadrzavu) >= $2 OR datumdoigrazadrzavu IS NULL)` 
        const values = [iddrzava, godinasezona];
        var igraci = [];
        try {
            const result = await db.query(sql, values);
            for(var i = 0; i < result.rows.length; i++){
                igraci[i] = new Igrac(result.rows[i]);
            }
            return igraci;
        } catch (err) {
            console.log(err);
            throw err
        }
    }

    static async jeliDrzava(idtim){
        const sql = `select count(idtim) from drzava where idtim = $1` 
        const values = [idtim];
        try {
            const result = await db.query(sql, values);
            console.log("rez " + result.rows[0].count)
            console.log("rez " + parseInt(result.rows[0].count) > 0)
            return parseInt(result.rows[0].count) > 0;
        } catch (err) {
            console.log(err);
            throw err
        }
    }

    
    static async dohvatiRosterZaDrzavu(idtim, godinasezona){
        const sql = `select *, ((CURRENT_DATE - datumrodenjaigrac) / 365) AS dob from igrac NATURAL JOIN drzava JOIN tim ON tim.idtim = drzava.idtim WHERE EXTRACT(YEAR FROM datumodigrazadrzavu) < $2
        AND (EXTRACT(YEAR FROM datumdoigrazadrzavu) > $2 OR datumdoigrazadrzavu IS NULL) AND tim.idtim = $1` 
        const values = [idtim, godinasezona];
        var igraci = [];
        try {
            const result = await db.query(sql, values);
            for(var i = 0; i < result.rows.length; i++){
                igraci[i] = new Igrac(result.rows[i]);
            }
            return igraci;
        } catch (err) {
            console.log(err);
            throw err
        }
    }

    static async dohvatiIgracaZaId(idigrac){
        const sql = `SELECT * FROM  igrac WHERE idigrac = $1` 
        const values = [idigrac];
        try {
            const result = await db.query(sql, values);
            return new Igrac(result.rows[0]);
        } catch (err) {
            console.log(err);
            throw err
        }
    }

    static async izmjeniIgraca(igrac){
        const sql = `UPDATE IGRAC SET (imeigrac, prezimeigrac, nadimakigrac, jacanoga, datumrodenjaigrac, pozicija, iddrzava, datumodigrazadrzavu, datumdoigrazadrzavu) =
        ($1, $2, $3, $4, $5, $6, $7, $8, $9) WHERE idigrac = $10` 
        const values = [igrac.imeigrac, igrac.prezimeigrac, igrac.nadimakigrac, igrac.jacanoga ,igrac.datumrodenjaigrac, 
        igrac.pozicija, igrac.iddrzava, igrac.datumodigrazadrzavu, igrac.datumdoigrazadrzavu, igrac.idigrac];
        try {
            const result = await db.query(sql, values);
        } catch (err) {
            console.log(err);
            throw err
        }
    }

    static async dodajIgraca(igrac){
        const sql = `INSERT INTO  IGRAC(imeigrac, prezimeigrac, nadimakigrac, jacanoga, datumrodenjaigrac, pozicija, iddrzava, datumodigrazadrzavu, datumdoigrazadrzavu) 
        VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9)` 
        const values = [igrac.imeigrac, igrac.prezimeigrac, igrac.nadimakigrac, igrac.jacanoga ,igrac.datumrodenjaigrac, 
        igrac.pozicija, igrac.iddrzava, igrac.datumodigrazadrzavu, igrac.datumdoigrazadrzavu];
        try {
            const result = await db.query(sql, values);
        } catch (err) {
            console.log(err);
            throw err
        }
    }

    static async ukloniIgraca(idigrac){
        const sql = `DELETE FROM igrac WHERE idigrac = $1` 
        const values = [idigrac];
        try {
            const result = await db.query(sql, values);
        } catch (err) {
            console.log(err);
            throw err
        }
    }

    static async izmjeniBoravakUKlubu(podaci){
        const sql = `UPDATE igra_za_klub SET(idklub, idigrac, datumodigrazaklub, datumdoigrazaklub) =
        ($1, $2, $3, $4) WHERE idklub = $5 AND idigrac = $2 AND datumodigrazaklub = $6` 
        const values = [podaci.idklub, podaci.idigrac, podaci.datumodigrazaklub,
        podaci.datumdoigrazaklub, podaci.idklubprosli, podaci.datumodigrazaklubprosli];
        try {
            const result = await db.query(sql, values);
        } catch (err) {
            console.log(err);
            throw err
        }
    }

    static async dodajBoravakUKlubu(podaci){
        const sql = `INSERT INTO igra_za_klub(idklub, idigrac, datumodigrazaklub, datumdoigrazaklub)
        VALUES($1, $2, $3, $4)` 
        const values = [podaci.idklub, podaci.idigrac, podaci.datumodigrazaklub, podaci.datumdoigrazaklub];
        try {
            const result = await db.query(sql, values);
        } catch (err) {
            console.log(err);
            throw err
        }
    }

    static async izbrisiBoravakUKlubu(idklub, idigrac, datumodigrazaklub){
        const sql = `DELETE FROM igra_za_klub WHERE idklub = $1 AND idigrac = $2 AND datumodigrazaklub = $3` 
        const values = [idklub, idigrac, datumodigrazaklub];
        try {
            const result = await db.query(sql, values);
        } catch (err) {
            console.log(err);
            throw err
        }
    }

    static async dohvatiNajboljeStrijelceTimaUSezoni(idtim, godinasezona){
        const sql = `select igrac.idigrac, igrac.imeigrac, igrac.prezimeigrac, igrac.pozicija, count(*) from dogadaj natural join utakmica natural join natjecanje join igrac
        on igrac.idigrac = dogadaj.idigrac
        where (iddomacin = $1 OR idgost = $1) and godinasezona = $2 and zabijengol = 1
        and NOT EXISTS(select * from korner where korner.rednibrojuutakmici = dogadaj.rednibrojuutakmici AND
                      korner.idutakmica = dogadaj.idutakmica)
        group by igrac.idigrac, igrac.imeigrac, igrac.prezimeigrac, igrac.pozicija LIMIT 5` 
        const values = [idtim, godinasezona];
        var igraci = [];
        try {
            const result = await db.query(sql, values);
            for(var i = 0; i < result.rows.length; i++){
                igraci[i] = new Igrac(result.rows[i]);
            }
            return igraci;
        } catch (err) {
            console.log(err);
            throw err
        }
    }

    static async dohvatiNajboljeStrijelce(){
        const sql = `select idigrac, imeigrac, prezimeigrac, nadimakigrac, pozicija, (select count(*)from dogadaj
        where idigrac = igrac.idigrac and zabijengol = 1), (select count(*)from dogadaj natural join korner
        where idigrac = igrac.idigrac and zabijengol = 1) as brgolovakorner
        from igrac
        WHERE  (select count(*)from dogadaj 
        where idigrac = igrac.idigrac and zabijengol = 1) > 0
order by (select count(*) from dogadaj where idigrac = igrac.idigrac and zabijengol = 1) - (select count(*)from dogadaj natural join korner
        where idigrac = igrac.idigrac and zabijengol = 1) DESC LIMIT 50` 
        const values = [];
        var igraci = [];
        try {
            const result = await db.query(sql, values);
            for(var i = 0; i < result.rows.length; i++){
                igraci[i] = new Igrac(result.rows[i]);
            }
            return igraci;
        } catch (err) {
            console.log(err);
            throw err
        }
    }

    static async dohvatiNajboljeStrijelcePenala(){
        const sql = `select idigrac, imeigrac, prezimeigrac, nadimakigrac, pozicija, (select count(*)from dogadaj 
        natural join penal where idigrac = igrac.idigrac and zabijengol = 1) 
        from igrac
        where (select count(*) from dogadaj natural join penal where idigrac = igrac.idigrac and zabijengol = 1) > 0
order by (select count(*) from dogadaj natural join penal where idigrac = igrac.idigrac and zabijengol = 1) DESC LIMIT 50` 
        const values = [];
        var igraci = [];
        try {
            const result = await db.query(sql, values);
            for(var i = 0; i < result.rows.length; i++){
                igraci[i] = new Igrac(result.rows[i]);
            }
            return igraci;
        } catch (err) {
            console.log(err);
            throw err
        }
    }

    static async dohvatiNajboljeStrijelceSlobodnih(){
        const sql = `select idigrac, imeigrac, prezimeigrac, nadimakigrac, pozicija, (select count(*)from dogadaj 
        natural join slobodanudarac where idigrac = igrac.idigrac and zabijengol = 1) 
        from igrac
        where (select count(*) from dogadaj natural join slobodanudarac where idigrac = igrac.idigrac and zabijengol = 1) > 0
order by (select count(*) from dogadaj natural join slobodanudarac where idigrac = igrac.idigrac and zabijengol = 1) DESC LIMIT 50` 
        const values = [];
        var igraci = [];
        try {
            const result = await db.query(sql, values);
            for(var i = 0; i < result.rows.length; i++){
                igraci[i] = new Igrac(result.rows[i]);
            }
            return igraci;
        } catch (err) {
            console.log(err);
            throw err
        }
    }

    static async dohvatiNajboljeStrijelceUNatjecanju(idnatjecanje){
        const sql = `select idigrac, imeigrac, prezimeigrac, nadimakigrac, pozicija, (select count(*)from dogadaj natural join utakmica
        where idigrac = igrac.idigrac and zabijengol = 1 and idnatjecanje = $1), (select count(*)from dogadaj natural join utakmica natural join korner
        where idigrac = igrac.idigrac and zabijengol = 1 and idnatjecanje = $1) as brgolovakorner
        from igrac
        WHERE  (select count(*)from dogadaj natural join utakmica 
        where idigrac = igrac.idigrac and zabijengol = 1 and idnatjecanje = $1) > 0
        order by (select count(*) from dogadaj natural join utakmica  where idigrac = igrac.idigrac and zabijengol = 1 and idnatjecanje = $1) 
        - (select count(*)from dogadaj natural join korner natural join utakmica 
        where idigrac = igrac.idigrac and zabijengol = 1 and idnatjecanje = $1) DESC LIMIT 50` 
        const values = [idnatjecanje];
        var igraci = [];
        try {
            const result = await db.query(sql, values);
            for(var i = 0; i < result.rows.length; i++){
                igraci[i] = new Igrac(result.rows[i]);
            }
            return igraci;
        } catch (err) {
            console.log(err);
            throw err
        }
    }

    static async dohvatiNajboljeStrijelcePenalaUNatjecanju(idnatjecanje){
        const sql = `select idigrac, imeigrac, prezimeigrac, nadimakigrac, pozicija,
        (select count(*)from dogadaj natural join penal natural join utakmica where idigrac = igrac.idigrac and zabijengol = 1 and idnatjecanje = $1)
        from igrac
        where (select count(*) from dogadaj natural join penal natural join utakmica where idigrac = igrac.idigrac and zabijengol = 1 and idnatjecanje = $1) > 0
        order by (select count(*) from dogadaj natural join penal natural join utakmica where idigrac = igrac.idigrac and zabijengol = 1 and idnatjecanje = $1)
        DESC LIMIT 50` 
        const values = [idnatjecanje];
        var igraci = [];
        try {
            const result = await db.query(sql, values);
            for(var i = 0; i < result.rows.length; i++){
                igraci[i] = new Igrac(result.rows[i]);
            }
            return igraci;
        } catch (err) {
            console.log(err);
            throw err
        }
    }

    static async dohvatiNajboljeStrijelceSlobodnihUNatjecanju(idnatjecanje){
        const sql = `select idigrac, imeigrac, prezimeigrac, nadimakigrac, pozicija,
        (select count(*)from dogadaj natural join slobodanudarac natural join utakmica where idigrac = igrac.idigrac and zabijengol = 1 and idnatjecanje = $1)
        from igrac
        where (select count(*) from dogadaj natural join slobodanudarac natural join utakmica where idigrac = igrac.idigrac and zabijengol = 1 and idnatjecanje = $1) > 0
        order by (select count(*) from dogadaj natural join slobodanudarac natural join utakmica where idigrac = igrac.idigrac and zabijengol = 1 and idnatjecanje = $1)
        DESC LIMIT 50` 
        const values = [idnatjecanje];
        var igraci = [];
        try {
            const result = await db.query(sql, values);
            for(var i = 0; i < result.rows.length; i++){
                igraci[i] = new Igrac(result.rows[i]);
            }
            return igraci;
        } catch (err) {
            console.log(err);
            throw err
        }
    }

    static async dohvatiNajboljeStrijelceUSezoni(godinasezona){
        const sql = `select idigrac, imeigrac, prezimeigrac, nadimakigrac, pozicija, (select count(*)from dogadaj natural join utakmica natural join natjecanje
        where idigrac = igrac.idigrac and zabijengol = 1 and godinasezona = $1), (select count(*)from dogadaj natural join utakmica natural join korner 
		natural join natjecanje																			
        where idigrac = igrac.idigrac and zabijengol = 1 and godinasezona = $1) as brgolovakorner
        from igrac
        WHERE  (select count(*)from dogadaj natural join utakmica  natural join natjecanje
        where idigrac = igrac.idigrac and zabijengol = 1 and godinasezona = $1) > 0
order by (select count(*) from dogadaj natural join utakmica natural join natjecanje
		  where idigrac = igrac.idigrac and zabijengol = 1 and godinasezona = $1) 
- (select count(*)from dogadaj natural join korner natural join utakmica natural join natjecanje
        where idigrac = igrac.idigrac and zabijengol = 1 and godinasezona = $1) DESC LIMIT 50` 
        const values = [godinasezona];
        var igraci = [];
        try {
            const result = await db.query(sql, values);
            for(var i = 0; i < result.rows.length; i++){
                igraci[i] = new Igrac(result.rows[i]);
            }
            return igraci;
        } catch (err) {
            console.log(err);
            throw err
        }
    }

    static async dohvatiNajboljeStrijelcePenalaUSezoni(godinasezona){
        const sql = `select idigrac, imeigrac, prezimeigrac, nadimakigrac, pozicija,
        (select count(*)from dogadaj natural join penal natural join utakmica natural join natjecanje 
         where idigrac = igrac.idigrac and zabijengol = 1 and godinasezona = $1)
        from igrac
        where (select count(*) from dogadaj natural join penal natural join utakmica natural join natjecanje 
        where idigrac = igrac.idigrac and zabijengol = 1 and godinasezona = $1) > 0
        order by (select count(*) from dogadaj natural join penal natural join utakmica natural join natjecanje 
                  where idigrac = igrac.idigrac and zabijengol = 1 and godinasezona = $1)
        DESC LIMIT 50` 
        const values = [godinasezona];
        var igraci = [];
        try {
            const result = await db.query(sql, values);
            for(var i = 0; i < result.rows.length; i++){
                igraci[i] = new Igrac(result.rows[i]);
            }
            return igraci;
        } catch (err) {
            console.log(err);
            throw err
        }
    }

    static async dohvatiNajboljeStrijelceSlobodnihUSezoni(godinasezona){
        const sql = `select idigrac, imeigrac, prezimeigrac, nadimakigrac, pozicija,  
        (select count(*)from dogadaj natural join slobodanudarac natural join utakmica natural join natjecanje 
         where idigrac = igrac.idigrac and zabijengol = 1 and godinasezona = $1)
        from igrac
        where (select count(*) from dogadaj natural join slobodanudarac natural join utakmica natural join natjecanje 
        where idigrac = igrac.idigrac and zabijengol = 1 and godinasezona = $1) > 0
        order by (select count(*) from dogadaj natural join slobodanudarac natural join utakmica natural join natjecanje 
                  where idigrac = igrac.idigrac and zabijengol = 1 and godinasezona = $1)
        DESC LIMIT 50` 
        const values = [godinasezona];
        var igraci = [];
        try {
            const result = await db.query(sql, values);
            for(var i = 0; i < result.rows.length; i++){
                igraci[i] = new Igrac(result.rows[i]);
            }
            return igraci;
        } catch (err) {
            console.log(err);
            throw err
        }
    }

    static async dohvatiGolovePoSezonama(idigrac){
        const sql = `select godinasezona, count (*) from dogadaj natural join utakmica
         natural join natjecanje where zabijengol = 1 and idigrac = $1
        GROUP BY godinasezona` 
        const values = [idigrac];
        try {
            const result = await db.query(sql, values);
            return result.rows
        } catch (err) {
            console.log(err);
            throw err
        }
    }


}