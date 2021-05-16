const db = require('../db')

module.exports = class Sezona{
    
    constructor(dbSezona){
        this.godinasezona = dbSezona.godinasezona
        this.datumpocetaksezona = dbSezona.datumpocetaksezona
        this.datumkrajsezona = dbSezona.datumkrajsezona
    }

    static async dohvatiSveSezone(){
        const sql = `SELECT * FROM sezona ORDER BY godinasezona DESC` 
        const values = [];
        var sezone = [];
        try {
            const result = await db.query(sql, values);
            for(var i = 0; i < result.rows.length; i++){
                sezone[i] = new Sezona(result.rows[i]);
            }
            return sezone;
        } catch (err) {
            console.log(err);
            throw err
        }
    }
}