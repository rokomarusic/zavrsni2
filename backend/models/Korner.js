const db = require('../db')

module.exports = class Korner{

    constructor(dbKorner){
        this.minuta = dbKorner.minuta
        this.rednibrojuutakmici = dbKorner.rednibrojuutakmici
        this.idutakmica = dbKorner.idutakmica
        this.zabijengol = dbKorner.zabijengol
        this.pogodjenokvir = dbKorner.pogodjenokvir
        this.idigrac = dbKorner.idigrac
        this.idgolman = dbKorner.idgolman
        this.idkorner = dbKorner.idpenal
        this.stativa = dbKorner.stativa
        this.golmanizletio = dbKorner.golmanizletio
        this.izborendrugikorner = dbKorner.izborendrugikorner
        this.imeigrac = dbKorner.imeigrac
        this.prezimeigrac = dbKorner.prezimeigrac
        this.nadimakigrac = dbKorner.nadimakigrac
        this.imegolman = dbKorner.imegolman
        this.prezimegolman = dbKorner.prezimegolman
        this.nadimakgolman = dbKorner.nadimakgolman
    }

    static async dodajKorner(korner){
        const sql1 = `INSERT INTO dogadaj(minuta, zabijengol, pogodjenokvir, idigrac, idgolman, idutakmica) VALUES
        ($1, $2, $3, $4, $5,$6);`
        const sql2 = `select max(rednibrojuutakmici) from dogadaj where idutakmica = $1;`
        const sql3 = `INSERT INTO korner(stativa, golmanizletio, izborendrugikorner, idutakmica, rednibrojuutakmici)
        VALUES($1, $2, $3, $4, $5);` 
        const values1 = [korner.minuta, korner.zabijengol, korner.pogodjenokvir, korner.idigrac,
            korner.idgolman, korner.idutakmica];
        const values2 = [korner.idutakmica]
        try {
            const result1 = await db.query(sql1, values1);
            const result2 = await db.query(sql2, values2);
            const values3 = [korner.stativa, korner.golmanizletio, korner.izborendrugikorner, 
                korner.idutakmica, result2.rows[0].max]
            await db.query(sql3, values3)
        } catch (err) {
            console.log(err);
            throw err
        }
    }

    static async dohvatiKornereUUtakmici(idutakmica){
        const sql = `select idutakmica, rednibrojuutakmici, idkorner, stativa, golmanizletio, izborendrugikorner,
        minuta, zabijengol, pogodjenokvir,
        i1.idigrac as idigrac, i1.imeigrac as imeigrac, i1.prezimeigrac as prezimeigrac, i1.nadimakigrac as nadimakigrac,
        i2.idigrac as idgolman, i2.imeigrac as imegolman, i2.prezimeigrac as prezimegolman, i1.nadimakigrac as nadimakgolman
        from korner natural join dogadaj  
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

    static async ukloniKorner(iddogadaj){
        const sql = `DELETE FROM korner WHERE idkorner = $1` 
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