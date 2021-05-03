const db = require('../db')

module.exports = class Drzava{

    constructor(dbDrzava){
        this.idtim = dbDrzava.idtim
        this.iddrzava = dbDrzava.iddrzava
        this.fifakod = dbDrzava.fifakod
        this.nazivtim = dbDrzava.nazivtim
    }

    static async dohvatiSveDrzave(){
        const sql = `SELECT * FROM  drzava NATURAL JOIN tim` 
        const values = [];
        var drzave = [];
        try {
            const result = await db.query(sql, values);
            for(var i = 0; i < result.rows.length; i++){
                drzave[i] = new Drzava(result.rows[i]);
            }
            return drzave;
        } catch (err) {
            console.log(err);
            throw err
        }
    }

    static async dohvatiDrzavuZaId(idtim){
        const sql = `SELECT * FROM  drzava NATURAL JOIN tim WHERE idtim=$1` 
        const values = [idtim];
        try {
            const result = await db.query(sql, values);
            let drzava = new Drzava(result.rows[0]);
            return drzava;
        } catch (err) {
            console.log(err);
            throw err
        }
    }

    static async dodajDrzavu(nazivdrzava, fifakod){
        const sql1 = `INSERT INTO tim(nazivtim) VALUES ($1);`
        const sql2 = `SELECT MAX(idtim) FROM tim WHERE nazivtim = $1;`
        const sql3 = `INSERT INTO drzava(fifakod, idtim) VALUES($1, $2);` 
        const values1 = [nazivdrzava];
        try {
            const result1 = await db.query(sql1, values1);
            const result2 = await db.query(sql2, values1);
            const values2 = [fifakod, result2.rows[0].max]
            const result3 = await db.query(sql3, values2)
        } catch (err) {
            console.log(err);
            throw err
        }
    }

    static async provjeriFifaKod(fifakod){
        const sql = `SELECT COUNT(*) FROM drzava WHERE fifakod = $1` 
        const values = [fifakod];
        try {
            const result = await db.query(sql, values);
            return result.rows[0].count == 0
        } catch (err) {
            console.log(err);
            throw err
        }
    }

    static async ukloniDrzavu(idtim){
        console.log("UNUTAR UKLONI DRZAVU")
        const sql = `DELETE FROM tim WHERE idtim = $1` 
        const values = [idtim];
        try {
            await db.query(sql, values);
        } catch (err) {
            console.log(err);
            throw err
        }
    }

    static async izmjeniDrzavu(idtim, nazivtim, fifakod){
        console.log("UNUTAR IZMJENI DRZAVU")
        const sql1 = `UPDATE tim SET nazivtim = $2 WHERE idtim = $1` 
        const values1 = [idtim, nazivtim];
        const sql2 = `update drzava set fifakod = $2 WHERE idtim = $1` 
        const values2 = [idtim, fifakod];
        try {
            if(nazivtim){
                await db.query(sql1, values1);
            }
            if(fifakod){
                await db.query(sql2, values2);
            }
            
        } catch (err) {
            console.log(err);
            throw err
        }
    }
}