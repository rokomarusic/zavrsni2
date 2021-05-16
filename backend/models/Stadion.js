const db = require('../db')

module.exports = class Stadion{

    constructor(dbStadion){
        this.idstadion = dbStadion.idstadion;
        this.nazivstadion = dbStadion.nazivstadion;
        this.kapacitet = dbStadion.kapacitet;
        this.idgrad = dbStadion.idgrad
        this.nazivgrad = dbStadion.nazivgrad
    }

    static async dohvatiStadioneUGradu(idgrad){
        const sql = `SELECT * FROM stadion NATURAL JOIN grad WHERE idgrad = $1` 
        const values = [idgrad];
        var stadioni = [];
        try {
            const result = await db.query(sql, values);
            for(var i = 0; i < result.rows.length; i++){
                stadioni[i] = new Stadion(result.rows[i]);
            }
            return stadioni;
        } catch (err) {
            console.log(err);
            throw err
        }
    }

    static async dohvatiStadioneUDrzavi(iddrzava){
        const sql = `select * from stadion natural join grad natural join drzava where iddrzava = $1` 
        const values = [iddrzava];
        var stadioni = [];
        try {
            const result = await db.query(sql, values);
            for(var i = 0; i < result.rows.length; i++){
                stadioni[i] = new Stadion(result.rows[i]);
            }
            return stadioni;
        } catch (err) {
            console.log(err);
            throw err
        }
    }

    static async dohvatiSveStadione(){
        const sql = `select * from stadion natural join grad` 
        const values = [];
        var stadioni = [];
        try {
            const result = await db.query(sql, values);
            for(var i = 0; i < result.rows.length; i++){
                stadioni[i] = new Stadion(result.rows[i]);
            }
            return stadioni;
        } catch (err) {
            console.log(err);
            throw err
        }
    }

    static async dodajStadion(nazivstadion, kapacitet, idgrad){
        const sql = `INSERT INTO stadion(nazivstadion, kapacitet, idgrad) VALUES ($1, $2, $3);` 
        const values = [nazivstadion, kapacitet, idgrad];
        try {
            await db.query(sql, values);
        } catch (err) {
            console.log(err);
            throw err
        }
    }

    static async izmjeniStadion(nazivstadion, kapacitet, idstadion){
        const sql1 = `UPDATE stadion SET nazivstadion = $1 WHERE idstadion = $2;` 
        const values1 = [nazivstadion, idstadion];
        const sql2 = `UPDATE stadion SET kapacitet = $1 WHERE idstadion = $2;` 
        const values2 = [kapacitet, idstadion];
        try {
            if(nazivstadion){
                await db.query(sql1, values1);
            }
            if(kapacitet){
                await db.query(sql2, values2);
            }
        } catch (err) {
            console.log(err);
            throw err
        }
    }

    static async ukloniStadion(idstadion){
        const sql = `DELETE FROM stadion WHERE idstadion = $1;` 
        const values = [idstadion];
        try {
            await db.query(sql, values);
        } catch (err) {
            console.log(err);
            throw err
        }
    }
}