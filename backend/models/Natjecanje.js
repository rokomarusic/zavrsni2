const db = require('../db')

module.exports = class Natjecanje{

    constructor(dbNatjecanje){
        this.idnatjecanje = dbNatjecanje.idnatjecanje
        this.nazivnatjecanje = dbNatjecanje.nazivnatjecanje
        this.brojtimova = dbNatjecanje.brojtimova
        this.godinasezona = dbNatjecanje.godinasezona
        this.iddrzava = dbNatjecanje.iddrzava
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
}