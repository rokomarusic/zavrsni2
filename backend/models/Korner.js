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

    static async dohvatiStativeNaKorneru(idigrac){
        const sql = `select stativa, zabijengol, count(idkorner) from korner natural join dogadaj 
        group by stativa, zabijengol, idigrac
        having idigrac = $1
        order by stativa` 
        const values = [idigrac];
        try {
            const result = await db.query(sql, values);
            return result.rows
        } catch (err) {
            console.log(err);
            throw err
        }
    }

    static async dohvatiIzborenDrugiKornerNaKorneru(idigrac){
        const sql = `select izborendrugikorner, zabijengol, count(idkorner) from korner natural join dogadaj
        group by izborendrugikorner, zabijengol, idigrac
        having idigrac = $1
        order by izborendrugikorner` 
        const values = [idigrac];
        try {
            const result = await db.query(sql, values);
            return result.rows
        } catch (err) {
            console.log(err);
            throw err
        }
    }

    static async dohvatiGolmanIzletioNaKorneru(idigrac){
        const sql = `select golmanizletio, zabijengol, count(idkorner) from korner natural join dogadaj
        group by golmanizletio, zabijengol, idigrac
        having idigrac = $1
        order by golmanizletio` 
        const values = [idigrac];
        try {
            const result = await db.query(sql, values);
            return result.rows
        } catch (err) {
            console.log(err);
            throw err
        }
    }

    static async dohvatiPreciznostKorneraIgraca(idigrac){
        const sql = `select CAST ((select count(idkorner) from korner natural join dogadaj where zabijengol = 1
         and idigrac = $1)  AS DOUBLE PRECISION)
        / (select count(idkorner) from korner natural join dogadaj where idigrac = $1) as preciznost
        WHERE EXISTS(select idkorner from korner natural join dogadaj where idigrac = $1);` 
        const values = [idigrac];
        try {
            const result = await db.query(sql, values);
            return result.rows
        } catch (err) {
            console.log(err);
            throw err
        }
    }


    //za sezonu

    static async dohvatiStativeNaKorneruZaSezonu(idigrac, godinasezona){
        const sql = `select stativa, zabijengol, count(idkorner) from korner natural join dogadaj
        natural join utakmica natural join natjecanje 
        group by stativa, zabijengol, idigrac, godinasezona
        having idigrac = $1 and godinasezona = $2
        order by stativa` 
        const values = [idigrac, godinasezona];
        try {
            const result = await db.query(sql, values);
            return result.rows
        } catch (err) {
            console.log(err);
            throw err
        }
    }

    static async dohvatiIzborenDrugiKornerNaKorneruZaSezonu(idigrac, godinasezona){
        const sql = `select izborendrugikorner, zabijengol, count(idkorner) from korner natural join dogadaj
        natural join utakmica natural join natjecanje
        group by izborendrugikorner, zabijengol, idigrac, godinasezona
        having idigrac = $1  and godinasezona = $2
        order by izborendrugikorner` 
        const values = [idigrac, godinasezona];
        try {
            const result = await db.query(sql, values);
            return result.rows
        } catch (err) {
            console.log(err);
            throw err
        }
    }

    static async dohvatiGolmanIzletioNaKorneruZaSezonu(idigrac, godinasezona){
        const sql = `select golmanizletio, zabijengol, count(idkorner) from korner natural join dogadaj
        natural join utakmica natural join natjecanje
        group by golmanizletio, zabijengol, idigrac, godinasezona
        having idigrac = $1  and godinasezona = $2
        order by golmanizletio` 
        const values = [idigrac, godinasezona];
        try {
            const result = await db.query(sql, values);
            return result.rows
        } catch (err) {
            console.log(err);
            throw err
        }
    }

    static async dohvatiPreciznostKorneraIgracaZaSezonu(idigrac, godinasezona){
        const sql = `select CAST ((select count(idkorner) from korner natural join dogadaj 
        natural join utakmica natural join natjecanje where zabijengol = 1 and godinasezona = $2
         and idigrac = $1)  AS DOUBLE PRECISION)
        / (select count(idkorner) from korner natural join dogadaj 
        natural join utakmica natural join natjecanje where idigrac = $1  and godinasezona = $2) as preciznost
        WHERE EXISTS(select idkorner from korner natural join dogadaj 
            natural join utakmica natural join natjecanje where idigrac = $1  and godinasezona = $2);` 
        const values = [idigrac, godinasezona];
        try {
            const result = await db.query(sql, values);
            return result.rows
        } catch (err) {
            console.log(err);
            throw err
        }
    }

}