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
        this.imeigrac = dbSlobodni.imeigrac
        this.prezimeigrac = dbSlobodni.prezimeigrac
        this.nadimakigrac = dbSlobodni.nadimakigrac
        this.imegolman = dbSlobodni.imegolman
        this.prezimegolman = dbSlobodni.prezimegolman
        this.nadimakgolman = dbSlobodni.nadimakgolman
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

    static async dohvatiSlobodneUdarceUUtakmici(idutakmica){
        const sql = `select idutakmica, rednibrojuutakmici, idslobodni, stranaigracslobodni, udaljenostslobodni, stranagolmanslobodni,
        pogodiozivizid, brojigracazivizid, minuta, zabijengol, pogodjenokvir,
        i1.idigrac as idigrac, i1.imeigrac as imeigrac, i1.prezimeigrac as prezimeigrac, i1.nadimakigrac as nadimakigrac,
        i2.idigrac as idgolman, i2.imeigrac as imegolman, i2.prezimeigrac as prezimegolman, i1.nadimakigrac as nadimakgolman
        from slobodanudarac natural join dogadaj  
        join igrac i1 on dogadaj.idigrac = i1.idigrac 
        join igrac i2 on dogadaj.idgolman = i2.idigrac
        WHERE idutakmica = $1
        ORDER BY minuta` 
        const values = [idutakmica];
        try {
            const result = await db.query(sql, values);
            return result.rows;
        } catch (err) {
            console.log(err);
            throw err
        }
    }

    static async ukloniSlobodni(iddogadaj){
        const sql = `DELETE FROM slobodanudarac WHERE idslobodni = $1` 
        const values = [iddogadaj];
        try {
            const result = await db.query(sql, values);
            return result.rows;
        } catch (err) {
            console.log(err);
            throw err
        }
    }

}