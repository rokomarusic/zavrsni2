const db = require('../db')

module.exports = class Klub{
    
    constructor(dbKlub){
        this.idklub = dbKlub.idklub
        this.idtim = dbKlub.idtim
        this.godinaosnutka = dbKlub.godinaosnutka
        this.nazivtim = dbKlub.nazivtim
        this.idgrad = dbKlub.idgrad
        this.nazivgrad = dbKlub.nazivgrad
        this.iddrzava = dbKlub.iddrzava
    }

    static async dohvatiKluboveUDrzavi(iddrzava){
        const sql = `SELECT klub.*, grad.*, tim.nazivtim FROM klub NATURAL JOIN tim NATURAL JOIN grad JOIN DRZAVA 
        ON grad.iddrzava = drzava.iddrzava WHERE drzava.iddrzava = $1 ORDER BY tim.nazivtim` 
        const values = [iddrzava];
        var klubovi = [];
        try {
            const result = await db.query(sql, values);
            for(var i = 0; i < result.rows.length; i++){
                klubovi[i] = new Klub(result.rows[i]);
            }
            return klubovi;
        } catch (err) {
            console.log(err);
            throw err
        }
    }

    static async dohvatiSveKlubove(){
        const sql = `SELECT tim.nazivtim, klub.idklub, tim.idtim FROM klub NATURAL JOIN tim ORDER BY tim.nazivtim` 
        const values = [];
        var klubovi = [];
        try {
            const result = await db.query(sql, values);
            for(var i = 0; i < result.rows.length; i++){
                klubovi[i] = new Klub(result.rows[i]);
            }
            return klubovi;
        } catch (err) {
            console.log(err);
            throw err
        }
    }

    static async dohvatiSveTimove(){
        const sql = `SELECT tim.nazivtim, tim.idtim FROM tim ORDER BY tim.nazivtim` 
        const values = [];
        var klubovi = [];
        try {
            const result = await db.query(sql, values);
            for(var i = 0; i < result.rows.length; i++){
                klubovi[i] = new Klub(result.rows[i]);
            }
            return klubovi;
        } catch (err) {
            console.log(err);
            throw err
        }
    }

    static async dodajKlub(nazivtim, godinaosnutka, idgrad){
        const sql1 = `INSERT INTO tim(nazivtim) VALUES ($1);`
        const sql2 = `SELECT MAX(idtim) FROM tim WHERE nazivtim = $1;`
        const sql3 = `INSERT INTO klub(godinaosnutka, idgrad, idtim) VALUES ($1, $2, $3);` 
        const values1 = [nazivtim];
        try {
            const result1 = await db.query(sql1, values1);
            const result2 = await db.query(sql2, values1);
            const values2 = [godinaosnutka, idgrad, result2.rows[0].max]
            const result3 = await db.query(sql3, values2)
        } catch (err) {
            console.log(err);
            throw err
        }
    }

    static async ukloniKlub(idtim, nazivtim, godinaosnutka, idgrad){
        const sql = `DELETE FROM tim WHERE idtim = $1` 
        const values = [idtim];
        try {
            await db.query(sql, values);
        } catch (err) {
            console.log(err);
            throw err
        }
    }

    static async dohvatiKlubZaId(idtim){
        const sql = `SELECT klub.*, grad.*, tim.nazivtim FROM klub NATURAL JOIN tim NATURAL JOIN grad JOIN DRZAVA 
        ON grad.iddrzava = drzava.iddrzava WHERE tim.idtim=$1` 
        const values = [idtim];
        try {
            let result = await db.query(sql, values);
            return result.rows[0];
        } catch (err) {
            console.log(err);
            throw err
        }
    }

    static async izmjeniKlub(idtim, nazivtim, godinaosnutka, idgrad){
        console.log("UNUTAR IZMJENI KLUB")
        console.log(idtim, nazivtim, godinaosnutka, idgrad)
        const sql1 = `UPDATE tim SET nazivtim = $2 WHERE idtim = $1` 
        const values1 = [idtim, nazivtim];
        const sql2 = `UPDATE klub set godinaosnutka = $1 where idtim = $2` 
        const values2 = [godinaosnutka, idtim];
        const sql3 = `UPDATE klub set idgrad = $1 where idtim = $2` 
        const values3 = [idgrad, idtim];
        try {
            if(nazivtim.trim()){
                await db.query(sql1, values1);
            }

            if(godinaosnutka.trim()){
                await db.query(sql2, values2);
            }

            if(idgrad){
                await db.query(sql3, values3)
            }
            
        } catch (err) {
            console.log(err);
            throw err
        }
    }



}