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
        this.imeigrac = dbUdarac.imeigrac
        this.prezimeigrac = dbUdarac.prezimeigrac
        this.nadimakigrac = dbUdarac.nadimakigrac
        this.imegolman = dbUdarac.imegolman
        this.prezimegolman = dbUdarac.prezimegolman
        this.nadimakgolman = dbUdarac.nadimakgolman
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

    static async dohvatiUdarceUUtakmici(idutakmica){
        const sql = `select idutakmica, rednibrojuutakmici, idudarac, stranaigracudarac, udaljenostudarac, stranagolmanudarac,
        igracpokriven, minuta, zabijengol, pogodjenokvir,
        i1.idigrac as idigrac, i1.imeigrac as imeigrac, i1.prezimeigrac as prezimeigrac, i1.nadimakigrac as nadimakigrac,
        i2.idigrac as idgolman, i2.imeigrac as imegolman, i2.prezimeigrac as prezimegolman, i1.nadimakigrac as nadimakgolman
        from udarac natural join dogadaj  
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

    static async ukloniUdarac(iddogadaj){
        const sql = `DELETE FROM udarac WHERE idudarac = $1` 
        const values = [iddogadaj];
        try {
            const result = await db.query(sql, values);
            return result.rows;
        } catch (err) {
            console.log(err);
            throw err
        }
    }

    static async dohvatiStraneIgracaUdaraca(idigrac){
        const sql = `select stranaigracudarac, zabijengol, count(idudarac) from udarac natural join dogadaj
        group by stranaigracudarac, zabijengol, idigrac
        having idigrac = $1
        order by stranaigracudarac` 
        const values = [idigrac];
        try {
            const result = await db.query(sql, values);
            return result.rows
        } catch (err) {
            console.log(err);
            throw err
        }
    }

    static async dohvatiStraneGolmanaUdaraca(idigrac){
        const sql = `select stranagolmanudarac, zabijengol, count(idudarac) from udarac natural join dogadaj
        group by stranagolmanudarac, zabijengol, idigrac
        having idigrac = $1
        order by stranagolmanudarac` 
        const values = [idigrac];
        try {
            const result = await db.query(sql, values);
            return result.rows
        } catch (err) {
            console.log(err);
            throw err
        }
    }

    static async dohvatiIgracPokrivenUdarac(idigrac){
        const sql = `select igracpokriven, zabijengol,  count(zabijengol) from udarac natural join dogadaj
        group by igracpokriven, zabijengol, idigrac
		having idigrac = $1
        order by igracpokriven` 
        const values = [idigrac];
        try {
            const result = await db.query(sql, values);
            return result.rows
        } catch (err) {
            console.log(err);
            throw err
        }
    }

    static async dohvatiIgracAvgUdaljenostUdarac(idigrac){
        const sql = `select ROUND(avg(udaljenostudarac), 2) as avgdist from udarac
         natural join dogadaj where idigrac = $1` 
        const values = [idigrac];
        try {
            const result = await db.query(sql, values);
            return result.rows
        } catch (err) {
            console.log(err);
            throw err
        }
    }

    static async dohvatiPreciznostUdaracaIgraca(idigrac){
        const sql = `select CAST ((select count(idudarac) from udarac natural join dogadaj where zabijengol = 1
        and idigrac = $1)  AS DOUBLE PRECISION)
       / (select count(idudarac) from udarac natural join dogadaj where idigrac = $1) as preciznost
       WHERE EXISTS(select idudarac from udarac natural join dogadaj where idigrac = $1);` 
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

    static async dohvatiStraneIgracaUdaracaZaSezonu(idigrac, godinasezona){
        const sql = `select stranaigracudarac, zabijengol, count(idudarac) from udarac natural join dogadaj
        natural join utakmica natural join natjecanje
        group by stranaigracudarac, zabijengol, idigrac, godinasezona
        having idigrac = $1 and godinasezona = $2
        order by stranaigracudarac` 
        const values = [idigrac, godinasezona];
        try {
            const result = await db.query(sql, values);
            return result.rows
        } catch (err) {
            console.log(err);
            console.log("AAAAAAAAAAAAAAAAAAAAAAAa")
            throw err
        }
    }

    static async dohvatiStraneGolmanaUdaracaZaSezonu(idigrac, godinasezona){
        const sql = `select stranagolmanudarac, zabijengol, count(idudarac) from udarac natural join dogadaj
        natural join utakmica natural join natjecanje
        group by stranagolmanudarac, zabijengol, idigrac, godinasezona
        having idigrac = $1 and godinasezona = $2
        order by stranagolmanudarac` 
        const values = [idigrac, godinasezona];
        try {
            const result = await db.query(sql, values);
            return result.rows
        } catch (err) {
            console.log(err);
            console.log("AAAAAAAAAAAAAAAAAAAAAAAa")
            throw err
        }
    }

    static async dohvatiIgracPokrivenUdaracZaSezonu(idigrac, godinasezona){
        const sql = `select igracpokriven, zabijengol,  count(zabijengol) from udarac natural join dogadaj
        natural join utakmica natural join natjecanje
        group by igracpokriven, zabijengol, idigrac, godinasezona
		having idigrac = $1 and godinasezona = $2
        order by igracpokriven` 
        const values = [idigrac, godinasezona];
        try {
            const result = await db.query(sql, values);
            return result.rows
        } catch (err) {
            console.log(err);
            console.log("AAAAAAAAAAAAAAAAAAAAAAAa")
            throw err
        }
    }

    static async dohvatiIgracAvgUdaljenostUdaracZaSezonu(idigrac, godinasezona){
        const sql = `select ROUND(avg(udaljenostudarac), 2) as avgdist from udarac
         natural join dogadaj  natural join utakmica natural join natjecanje where idigrac = $1 and godinasezona = $2` 
        const values = [idigrac, godinasezona];
        try {
            const result = await db.query(sql, values);
            return result.rows
        } catch (err) {
            console.log(err);
            console.log("AAAAAAAAAAAAAAAAAAAAAAAa")

            throw err
        }
    }

    static async dohvatiPreciznostUdaracaIgracaZaSezonu(idigrac, godinasezona){
        const sql = `select CAST ((select count(idudarac) from udarac natural join dogadaj 
        natural join utakmica natural join natjecanje where zabijengol = 1
        and idigrac = $1  and godinasezona = $2)  AS DOUBLE PRECISION)
       / (select count(idudarac) from udarac natural join dogadaj 
       natural join utakmica natural join natjecanje where idigrac = $1  and godinasezona = $2) as preciznost
       WHERE EXISTS(select idudarac from udarac natural join dogadaj  natural join utakmica natural join natjecanje where idigrac = $1  and godinasezona = $2);` 
        const values = [idigrac, godinasezona];
        try {
            const result = await db.query(sql, values);
            return result.rows
        } catch (err) {
            console.log(err);
            console.log("AAAAAAAAAAAAAAAAAAAAAAAa")
            throw err
        }
    }

}