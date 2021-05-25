const db = require('../db')

module.exports = class Natjecanje{

    constructor(dbNatjecanje){
        this.idnatjecanje = dbNatjecanje.idnatjecanje
        this.nazivnatjecanje = dbNatjecanje.nazivnatjecanje
        this.brojtimova = dbNatjecanje.brojtimova
        this.godinasezona = dbNatjecanje.godinasezona
        this.iddrzava = dbNatjecanje.iddrzava
        this.nazivtim = dbNatjecanje.nazivtim
    }

    static async dohvatiNatjecanjaUDrzavi(iddrzava){
        const sql = `SELECT * FROM natjecanje  NATURAL JOIN sezona WHERE iddrzava = $1` 
        const values = [iddrzava];
        var natjecanja = [];
        try {
            const result = await db.query(sql, values);
            for(var i = 0; i < result.rows.length; i++){
                natjecanja[i] = new Natjecanje(result.rows[i]);
            }
            return natjecanja;
        } catch (err) {
            console.log(err);
            throw err
        }
    }

    static async dohvatiSvaNatjecanja(){
        const sql = `SELECT * FROM natjecanje  NATURAL JOIN drzava NATURAL JOIN tim ORDER BY nazivnatjecanje` 
        const values = [];
        var natjecanja = [];
        try {
            const result = await db.query(sql, values);
            for(var i = 0; i < result.rows.length; i++){
                natjecanja[i] = new Natjecanje(result.rows[i]);
            }
            return natjecanja;
        } catch (err) {
            console.log(err);
            throw err
        }
    }

    static async dohvatiNatjecanjeZaId(idnatjecanje){
        const sql = `SELECT * FROM natjecanje WHERE idnatjecanje = $1` 
        const values = [idnatjecanje];
        try {
            const result = await db.query(sql, values);
            let natjecanje = new Natjecanje(result.rows[0]);
            return natjecanje;
        } catch (err) {
            console.log(err);
            throw err
        }
    }

    static async dodajNatjecanje(nazivnatjecanje, brojtimova, godinasezona, iddrzava){
        const sql = `INSERT INTO natjecanje(nazivnatjecanje, brojtimova, godinasezona, iddrzava)
        VALUES($1, $2, $3, $4)` 
        const values = [nazivnatjecanje, brojtimova, godinasezona, iddrzava];
        try {
            await db.query(sql, values);
        } catch (err) {
            console.log(err);
            return null;
        }
    }

    static async ukloniNatjecanje(idnatjecanje){
        const sql = `DELETE FROM natjecanje WHERE idnatjecanje = $1` 
        const values = [idnatjecanje];
        try {
            await db.query(sql, values);
        } catch (err) {
            console.log(err);
            return null;
        }
    }

    static async dohvatiKluboveUNatjecanju(idnatjecanje){
        const sql = `select tim.* FROM Sudjeluje_u_natjecanju NATURAL JOIN 
        tim NATURAL JOIN natjecanje WHERE idnatjecanje = $1 ORDER BY tim.nazivtim` 
        const values = [idnatjecanje];
        try {
            const result = await db.query(sql, values);
            return result.rows;
        } catch (err) {
            console.log(err);
            throw err
        }
    }

    static async ukloniSudionika(idtim, idnatjecanje){
        const sql = `DELETE FROM Sudjeluje_u_natjecanju WHERE idtim = $1 AND idnatjecanje= $2` 
        const values = [idtim, idnatjecanje];
        try {
            const result = await db.query(sql, values);
            return result.rows;
        } catch (err) {
            console.log(err);
            throw err
        }
    }

    static async dodajSudionika(idtim, idnatjecanje){
        const sql = `INSERT INTO Sudjeluje_u_natjecanju(idtim, idnatjecanje) VALUES($1, $2)` 
        const values = [idtim, idnatjecanje];
        try {
            const result = await db.query(sql, values);
            return result.rows;
        } catch (err) {
            console.log(err);
            throw err
        }
    }
}