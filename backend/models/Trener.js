const db = require('../db')

module.exports = class Trener{
    constructor(dbTrener){
        this.idtrener = dbTrener.idtrener;
        this.imetrener = dbTrener.imetrener;
        this.prezimetrener = dbTrener.prezimetrener;
        this.nadimaktrener = dbTrener.nadimaktrener;
        this.datumrodenjatrener = dbTrener.datumrodenjatrener;
        this.iddrzava = dbTrener.iddrzava;
        this.idtim = dbTrener.idtim
        this.nazivtim = dbTrener.nazivtim
        this.godinadolazaktrener = dbTrener.godinadolazaktrener
        this.godinaodlazaktrener = dbTrener.godinaodlazaktrener
        this.datumodtrenira = dbTrener.datumodtrenira;
        this.datumdotrenira= dbTrener.datumdotrenira;
    }

    static async dohvatiSveTrenere(){
        const sql = `select * from trener NATURAL JOIN drzava NATURAL JOIN tim` 
        const values = [];
        var treneri = [];
        try {
            const result = await db.query(sql, values);
            for(var i = 0; i < result.rows.length; i++){
                treneri[i] = new Trener(result.rows[i]);
            }
            return treneri;
        } catch (err) {
            console.log(err);
            throw err
        }
    }

    static async dohvatiSveTimoveTrenera(id){
        const sql = `select * from trenira natural join tim where idtrener = $1` 
        const values = [id];
        var treneri = [];
        try {
            const result = await db.query(sql, values);
            for(var i = 0; i < result.rows.length; i++){
                treneri[i] = new Trener(result.rows[i]);
            }
            return treneri;
        } catch (err) {
            console.log(err);
            throw err
        }
    }

    static async dohvatiTrenereUSezoni(idtim, godinasezona){
        const sql = `select * from trenira NATURAL JOIN trener WHERE idtim = $1
         AND godinadolazaktrener <= $2 
         AND (godinaodlazaktrener >= $2 OR godinaodlazaktrener IS NULL)` 
        const values = [idtim, godinasezona];
        var treneri = [];
        try {
            const result = await db.query(sql, values);
            for(var i = 0; i < result.rows.length; i++){
                treneri[i] = new Trener(result.rows[i]);
            }
            return treneri;
        } catch (err) {
            console.log(err);
            throw err
        }
    }

    static async dohvatiTreneraZaId(id){
        const sql = `select * from trener NATURAL JOIN drzava NATURAL JOIN tim WHERE idtrener = $1` 
        const values = [id];
        try {
            const result = await db.query(sql, values);
            return result.rows[0];
        } catch (err) {
            console.log(err);
            throw err
        }
    }

    static async ukloniTrenera(id){
        const sql = `DELETE FROM trener WHERE idtrener = $1` 
        const values = [id];
        try {
            const result = await db.query(sql, values);
            return result.rows[0];
        } catch (err) {
            console.log(err);
            throw err
        }
    }

    static async dodajTrenera(trener){
        const sql = `INSERT INTO trener(imetrener, prezimetrener, nadimaktrener, datumrodenjatrener, iddrzava) VALUES
        ($1, $2, $3, $4, $5)` 
        const values = [trener.imetrener, trener.prezimetrener, trener.nadimaktrener,
             trener.datumrodenjatrener, trener.iddrzava];
        try {
            await db.query(sql, values);
        } catch (err) {
            console.log(err);
            throw err
        }
    }

    static async izmjeniTrenera(trener){
        const sql = `UPDATE trener SET(imetrener, prezimetrener, nadimaktrener, datumrodenjatrener, iddrzava) =
        ($1, $2, $3, $4, $5) WHERE idtrener = $6` 
        const values = [trener.imetrener, trener.prezimetrener, trener.nadimaktrener,
             trener.datumrodenjatrener, trener.iddrzava, trener.idtrener];
        try {
            await db.query(sql, values);
        } catch (err) {
            console.log(err);
            throw err
        }
    }

    static async dodajPosao(posao){
        const sql = `INSERT INTO trenira(idtim, idtrener, datumodtrenira, datumdotrenira)
        VALUES($1, $2, $3, $4)` 
        const values = [posao.idtim, posao.idtrener, posao.datumodtrenira, posao.datumdotrenira];
        try {
            await db.query(sql, values);
        } catch (err) {
            console.log(err);
            throw err
        }
    }

    static async izmjeniPosao(posao){
        const sql = `UPDATE  trenira SET(idtim, idtrener, datumodtrenira, datumdotrenira)=
        ($1, $2, $3, $4) WHERE idtrener = $5 AND datumodtrenira = $6` 
        const values = [posao.idtim, posao.idtrener, posao.datumodtrenira, posao.datumdotrenira,
             posao.idtrener, posao.datumodtreniraprosli];
        try {
            await db.query(sql, values);
        } catch (err) {
            console.log(err);
            throw err
        }
    }

    static async ukloniPosao(posao){
        const sql = `DELETE FROM trenira WHERE idtrener = $1 AND datumodtrenira = $2` 
        const values = [posao.idtrener, posao.datumodtrenira];
        try {
            await db.query(sql, values);
        } catch (err) {
            console.log(err);
            throw err
        }
    }
}