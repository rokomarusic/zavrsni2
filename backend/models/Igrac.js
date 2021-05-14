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
        this.godinadolazakigrac = dbIgrac.godinadolazakigrac
        this.godinaodlazakigrac = dbIgrac.godinaodlazakigrac
        this.datumodigra = dbIgrac.datumodigra;
        this.datumdoigra = dbIgrac.datumdoigra;
    }

    static async dohvatiSveIgrace(){
        const sql = `SELECT * FROM  igrac` 
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
        WHERE idklub = $1 AND igra_za_klub.godinadolazakigrac <= $2  AND (igra_za_klub.godinaodlazakigrac >= $2 OR igra_za_klub.godinaodlazakigrac IS NULL)` 
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


}