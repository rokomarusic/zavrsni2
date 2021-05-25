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

    static async dohvatiStraneIgracaPenala(idigrac){
        const sql = `select stranaigracpenal, zabijengol, count(idpenal) from penal natural join dogadaj
        group by stranaigracpenal, zabijengol, idigrac
        having idigrac = $1
        order by stranaigracpenal` 
        const values = [idigrac];
        try {
            const result = await db.query(sql, values);
            return result.rows
        } catch (err) {
            console.log(err);
            throw err
        }
    }

    static async dohvatiVisineIgracaPenala(idigrac){
        const sql = `select visinaigracpenal, zabijengol, count(idpenal) from penal natural join dogadaj
        group by visinaigracpenal, zabijengol, idigrac
        having idigrac = $1
        order by visinaigracpenal` 
        const values = [idigrac];
        try {
            const result = await db.query(sql, values);
            return result.rows
        } catch (err) {
            console.log(err);
            throw err
        }
    }

    static async dohvatiStraneGolmanaPenala(idigrac){
        const sql = `select stranagolmanpenal, zabijengol, count(idpenal) from penal natural join dogadaj
        group by stranagolmanpenal, zabijengol, idgolman
        having idgolman = $1
        order by stranagolmanpenal` 
        const values = [idigrac];
        try {
            const result = await db.query(sql, values);
            return result.rows
        } catch (err) {
            console.log(err);
            throw err
        }
    }

    static async dohvatiPreciznostPenalaIgraca(idigrac){
        const sql = `select CAST ((select count(idpenal) from penal natural join dogadaj where zabijengol = 1
         and idigrac = $1)  AS DOUBLE PRECISION)
        / (select count(idpenal) from penal natural join dogadaj where idigrac = $1) as preciznost
        WHERE EXISTS(select idpenal from penal natural join dogadaj where idigrac = $1);` 
        const values = [idigrac];
        try {
            const result = await db.query(sql, values);
            return result.rows
        } catch (err) {
            console.log(err);
            throw err
        }
    }

    static async dohvatiPostotakObranaPenala(idigrac){
        const sql = `select CAST ((select count(idpenal) from penal natural join dogadaj where zabijengol = 0
         and idgolman = $1)  AS DOUBLE PRECISION)
        / (select count(idpenal) from penal natural join dogadaj where idgolman = $1) as preciznost
        WHERE EXISTS(select idpenal from penal natural join dogadaj where idgolman = $1);` 
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


    static async dohvatiStraneIgracaPenalaZaSezonu(idigrac, godinasezona){
        const sql = `select stranaigracpenal, zabijengol, count(idpenal) from penal natural join dogadaj
        natural join utakmica natural join natjecanje
        group by stranaigracpenal, zabijengol, idigrac, godinasezona
        having idigrac = $1 and godinasezona = $2
        order by stranaigracpenal` 
        const values = [idigrac, godinasezona];
        try {
            const result = await db.query(sql, values);
            return result.rows
        } catch (err) {
            console.log(err);
            console.log('dohvatiStraneIgracaPenalaZaSezonu')
            throw err
        }
    }

    static async dohvatiVisineIgracaPenalaZaSezonu(idigrac, godinasezona){
        const sql = `select visinaigracpenal, zabijengol, count(idpenal) from penal natural join dogadaj
        natural join utakmica natural join natjecanje
        group by visinaigracpenal, zabijengol, idigrac, godinasezona
        having idigrac = $1  and godinasezona = $2
        order by visinaigracpenal` 
        const values = [idigrac, godinasezona];
        try {
            const result = await db.query(sql, values);
            return result.rows
        } catch (err) {
            console.log(err);
            console.log('dohvatiVisineIgracaPenalaZaSezonu')
            throw err
        }
    }

    static async dohvatiStraneGolmanaPenalaZaSezonu(idigrac, godinasezona){
        const sql = `select stranagolmanpenal, zabijengol, count(idpenal) from penal natural join dogadaj
        natural join utakmica natural join natjecanje
        group by stranagolmanpenal, zabijengol, idgolman, godinasezona
        having idgolman = $1 and godinasezona = $2
        order by stranagolmanpenal` 
        const values = [idigrac, godinasezona];
        try {
            const result = await db.query(sql, values);
            return result.rows
        } catch (err) {
            console.log(err);
            console.log('dohvatiStraneGolmanaPenalaZaSezonu')
            throw err
        }
    }

    static async dohvatiPreciznostPenalaIgracaZaSezonu(idigrac, godinasezona){
        const sql = `select CAST ((select count(idpenal) from penal natural join dogadaj 
        natural join utakmica natural join natjecanje where zabijengol = 1
         and idigrac = $1  and godinasezona = $2)  AS DOUBLE PRECISION)
        / (select count(idpenal) from penal natural join dogadaj 
        natural join utakmica natural join natjecanje where idigrac = $1  and godinasezona = $2) as preciznost
        WHERE EXISTS(select idpenal from penal natural join dogadaj 
            natural join utakmica natural join natjecanje where idigrac = $1  and godinasezona = $2);` 
        const values = [idigrac, godinasezona];
        try {
            const result = await db.query(sql, values);
            return result.rows
        } catch (err) {
            console.log(err);
            console.log('dohvatiPreciznostPenalaIgracaZaSezonu')
            throw err
        }
    }

    static async dohvatiPostotakObranaPenalaZaSezonu(idigrac, godinasezona){
        const sql = `select CAST ((select count(idpenal) from penal natural join dogadaj 
        natural join utakmica natural join natjecanje where zabijengol = 0
         and idgolman = $1  and godinasezona = $2)  AS DOUBLE PRECISION)
        / (select count(idpenal) from penal natural join dogadaj 
        natural join utakmica natural join natjecanje where idgolman = $1  and godinasezona = $2) as preciznost
        WHERE EXISTS(select idpenal from penal natural join dogadaj 
            natural join utakmica natural join natjecanje where idgolman = $1  and godinasezona = $2);` 
        const values = [idigrac, godinasezona];
        try {
            const result = await db.query(sql, values);
            return result.rows
        } catch (err) {
            console.log(err);
            console.log('dohvatiPreciznostPenalaIgracaZaSezonu')
            throw err
        }
    }
}