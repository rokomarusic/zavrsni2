const db = require('../db')

module.exports = class Igrac{

    constructor(dbIgrac){
        this.idigrac = dbIgrac.idigrac;
        this.imeigrac = dbIgrac.imeigrac;
        this.prezimeigrac = dbIgrac.prezimeigrac;
        this.nadimakigrac = dbIgrac.nadimakigrac;
        this.jacanoga = dbIgrac.jacanoga;
        this.datumrodenja = dbIgrac.datumrodenja;
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


}