const db = require('../db')

module.exports = class Udarac{

    constructor(dbUdarac){
        this.minuta = dbUdarac.minuta
        this.rednibrojuutakmici = dbUdarac.rednibrojuutakmici
        this.idutakmica = dbUdarac.idutakmica
        this.zabijengol = dbUdarac.zabijengol
        this.pogodjenokvir = dbUdarac.pogodjenokvir
        this.idigrac = dbUdarac.idigrac
        this.idgolman = dbUdarac.idgolman
        this.idpenal = dbUdarac.idpenal
        this.stranaigracudarac = dbUdarac.stranaigracudarac
        this.stranagolmanudarac = dbUdarac.stranagolmanudarac
        this.udaljenostudarac = dbUdarac.udaljenostudarac
        this.igracpokriven = dbUdarac.igracpokriven
    }

    static async dodajUdarac(udarac){
        const sql1 = `INSERT INTO dogadaj(minuta, zabijengol, pogodjenokvir, idigrac, idgolman, idutakmica) VALUES
        ($1, $2, $3, $4, $5,$6);`
        const sql2 = `select max(rednibrojuutakmici) from dogadaj where idutakmica = $1;`
        const sql3 = `INSERT INTO udarac(stranaigracudarac, udaljenostudarac, stranagolmanudarac, igracpokriven, idutakmica, rednibrojuutakmici)
        VALUES($1, $2, $3, $4, $5, $6);` 
        const values1 = [udarac.minuta, udarac.zabijengol, udarac.pogodjenokvir, udarac.idigrac,
            udarac.idgolman, udarac.idutakmica];
        const values2 = [udarac.idutakmica]
        try {
            const result1 = await db.query(sql1, values1);
            const result2 = await db.query(sql2, values2);
            const values3 = [udarac.stranaigracudarac, udarac.udaljenostudarac, udarac.stranagolmanudarac, 
                udarac.igracpokriven, udarac.idutakmica, result2.rows[0].max]
            await db.query(sql3, values3)
        } catch (err) {
            console.log(err);
            throw err
        }
    }

}