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
}