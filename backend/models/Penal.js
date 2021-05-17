const db = require('../db')

module.exports = class Penal{

    constructor(dbPenal){
        this.minuta = dbPenal.minuta
        this.rednibrojuutakmici = dbPenal.rednibrojuutakmici
        this.idutakmica = dbPenal.idutakmica
        this.zabijengol = dbPenal.zabijengol
        this.pogodjenokvir = dbPenal.pogodjenokvir
        this.idigrac = dbPenal.idigrac
        this.idgolman = dbPenal.idgolman
        this.idpenal = dbPenal.idpenal
        this.stranaigracpenal = dbPenal.stranaigracpenal
        this.stranagolmanpenal = dbPenal.stranagolmanpenal
        this.visinaigracpenal = dbPenal.visinaigracpenal
    }

    static async dodajPenal(penal){
        const sql1 = `INSERT INTO dogadaj(minuta, zabijengol, pogodjenokvir, idigrac, idgolman, idutakmica) VALUES
        ($1, $2, $3, $4, $5,$6);`
        const sql2 = `select max(rednibrojuutakmici) from dogadaj where idutakmica = $1;`
        const sql3 = `INSERT INTO penal(stranaigracpenal, visinaigracpenal, stranagolmanpenal, idutakmica, rednibrojuutakmici)
        VALUES($1, $2, $3, $4, $5);` 
        const values1 = [penal.minuta, penal.zabijengol, penal.pogodjenokvir, penal.idigrac,
        penal.idgolman, penal.idutakmica];
        const values2 = [penal.idutakmica]
        try {
            const result1 = await db.query(sql1, values1);
            const result2 = await db.query(sql2, values2);
            const values3 = [penal.stranaigracpenal, penal.visinaigracpenal, penal.stranagolmanpenal, 
            penal.idutakmica, result2.rows[0].max]
            await db.query(sql3, values3)
        } catch (err) {
            console.log(err);
            throw err
        }
    }

}