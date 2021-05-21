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
        this.imeigrac = dbPenal.imeigrac
        this.prezimeigrac = dbPenal.prezimeigrac
        this.nadimakigrac = dbPenal.nadimakigrac
        this.imegolman = dbPenal.imegolman
        this.prezimegolman = dbPenal.prezimegolman
        this.nadimakgolman = dbPenal.nadimakgolman
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

    static async dohvatiPenaleUUtakmici(idutakmica){
        const sql = `select idutakmica, rednibrojuutakmici, idpenal, stranaigracpenal, visinaigracpenal, stranagolmanpenal,
        minuta, zabijengol, pogodjenokvir,
        i1.idigrac as idigrac, i1.imeigrac as imeigrac, i1.prezimeigrac as prezimeigrac, i1.nadimakigrac as nadimakigrac,
        i2.idigrac as idgolman, i2.imeigrac as imegolman, i2.prezimeigrac as prezimegolman, i1.nadimakigrac as nadimakgolman
        from penal natural join dogadaj  
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


    static async ukloniPenal(iddogadaj){
        const sql = `DELETE FROM penal WHERE idpenal = $1` 
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