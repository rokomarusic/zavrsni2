const db = require('../db')

module.exports = class SlobodanUdarac{

    constructor(dbSlobodni){
        this.minuta = dbSlobodni.minuta
        this.rednibrojuutakmici = dbSlobodni.rednibrojuutakmici
        this.idutakmica = dbSlobodni.idutakmica
        this.zabijengol = dbSlobodni.zabijengol
        this.pogodjenokvir = dbSlobodni.pogodjenokvir
        this.idigrac = dbSlobodni.idigrac
        this.idgolman = dbSlobodni.idgolman
        this.idpenal = dbSlobodni.idpenal
        this.stranaigracslobodni = dbSlobodni.stranaigracudarac
        this.stranagolmanslobodni = dbSlobodni.stranagolmanslobodni
        this.udaljenostudarac = dbSlobodni.udaljenostudarac
        this.pogodiozivizid = dbSlobodni.pogodiozivizid
        this.brojigracazivizid = dbSlobodni.brojigracazivizid
    }

    static async dodajSlobodanUdarac(udarac){
        const sql1 = `INSERT INTO dogadaj(minuta, zabijengol, pogodjenokvir, idigrac, idgolman, idutakmica) VALUES
        ($1, $2, $3, $4, $5,$6);`
        const sql2 = `select max(rednibrojuutakmici) from dogadaj where idutakmica = $1;`
        const sql3 = `INSERT INTO slobodanudarac(stranaigracslobodni, udaljenostslobodni, stranagolmanslobodni, pogodiozivizid, brojigracazivizid, idutakmica, rednibrojuutakmici)
        VALUES($1, $2, $3, $4, $5, $6, $7);` 
        const values1 = [udarac.minuta, udarac.zabijengol, udarac.pogodjenokvir, udarac.idigrac,
            udarac.idgolman, udarac.idutakmica];
        const values2 = [udarac.idutakmica]
        try {
            const result1 = await db.query(sql1, values1);
            const result2 = await db.query(sql2, values2);
            const values3 = [udarac.stranaigracslobodni, udarac.udaljenostslobodni, udarac.stranagolmanslobodni, 
                udarac.pogodiozivizid, udarac.brojigracazivizid, udarac.idutakmica, result2.rows[0].max]
            await db.query(sql3, values3)
        } catch (err) {
            console.log(err);
            throw err
        }
    }

}