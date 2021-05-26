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

    static async dohvatiStranaSlobodanUdaracIgraca(idigrac){
        const sql = `select stranaigracslobodni, zabijengol, count(idslobodni) from slobodanudarac natural join dogadaj
        group by stranaigracslobodni, zabijengol, idigrac
        having idigrac = $1
        order by stranaigracslobodni` 
        const values = [idigrac];
        try {
            const result = await db.query(sql, values);
            return result.rows
        } catch (err) {
            console.log(err);
            throw err
        }
    }

    static async dohvatiStranaSlobodanUdaracGolmana(idigrac){
        const sql = `select stranagolmanslobodni, zabijengol, count(idslobodni) from slobodanudarac natural join dogadaj
        group by stranagolmanslobodni, zabijengol, idgolman
        having idgolman = $1
        order by stranagolmanslobodni` 
        const values = [idigrac];
        try {
            const result = await db.query(sql, values);
            return result.rows
        } catch (err) {
            console.log(err);
            throw err
        }
    }

    static async dohvatiPogodioZiviZid(idigrac){
        const sql = `select pogodiozivizid, zabijengol, count(idslobodni) from slobodanudarac natural join dogadaj
        group by pogodiozivizid, zabijengol, idigrac
        having idigrac = $1
        order by pogodiozivizid` 
        const values = [idigrac];
        try {
            const result = await db.query(sql, values);
            return result.rows
        } catch (err) {
            console.log(err);
            throw err
        }
    }

    static async dohvatiBrojIgracaZiviZid(idigrac){
        const sql = `select brojigracazivizid, zabijengol, count(idslobodni) from slobodanudarac natural join dogadaj
        group by brojigracazivizid, zabijengol, idgolman
        having idgolman = $1
        order by brojigracazivizid` 
        const values = [idigrac];
        try {
            const result = await db.query(sql, values);
            return result.rows
        } catch (err) {
            console.log(err);
            throw err
        }
    }

    static async dohvatiIgracAvgUdaljenostSlobodanUdarac(idigrac){
        const sql = `select ROUND(avg(udaljenostslobodni), 2) as avgdist from slobodanudarac
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

    static async dohvatiPreciznostSlobodnihUdaracaIgraca(idigrac){
        const sql = `select CAST ((select count(idslobodni) from slobodanudarac natural join dogadaj where zabijengol = 1
         and idigrac = $1)  AS DOUBLE PRECISION)
        / (select count(idslobodni) from slobodanudarac natural join dogadaj where idigrac = $1) as preciznost
        WHERE EXISTS(select idslobodni from slobodanudarac natural join dogadaj where idigrac = $1);` 
        const values = [idigrac];
        try {
            const result = await db.query(sql, values);
            return result.rows
        } catch (err) {
            console.log(err);
            throw err
        }
    }

    static async dohvatiPostotakObranaSlobodnih(idigrac){
        const sql = `select CAST ((select count(idslobodni) from slobodanudarac natural join dogadaj where zabijengol = 0
         and idgolman = $1)  AS DOUBLE PRECISION)
        / (select count(idslobodni) from slobodanudarac natural join dogadaj where idgolman = $1) as preciznost
        WHERE EXISTS(select idslobodni from slobodanudarac natural join dogadaj where idgolman = $1);` 
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

    static async dohvatiStranaSlobodanUdaracIgracaZaSezonu(idigrac, godinasezona){
        const sql = `select stranaigracslobodni, zabijengol, count(idslobodni) from slobodanudarac natural join dogadaj
        natural join utakmica natural join natjecanje
        group by stranaigracslobodni, zabijengol, idigrac, godinasezona
        having idigrac = $1 and godinasezona = $2
        order by stranaigracslobodni` 
        const values = [idigrac, godinasezona];
        try {
            const result = await db.query(sql, values);
            return result.rows
        } catch (err) {
            console.log(err);
            console.log(6)
            throw err
        }
    }

    static async dohvatiStranaSlobodanUdaracGolmanaZaSezonu(idigrac, godinasezona){
        const sql = `select stranagolmanslobodni, zabijengol, count(idslobodni) from slobodanudarac natural join dogadaj
        natural join utakmica natural join natjecanje
        group by stranagolmanslobodni, zabijengol, idgolman, godinasezona
        having idgolman = $1 and godinasezona = $2
        order by stranagolmanslobodni` 
        const values = [idigrac, godinasezona];
        try {
            const result = await db.query(sql, values);
            return result.rows
        } catch (err) {
            console.log(err);
            console.log(5)
            throw err
        }
    }

    static async dohvatiPogodioZiviZidZaSezonu(idigrac, godinasezona){
        const sql = `select pogodiozivizid, zabijengol, count(idslobodni) from slobodanudarac natural join dogadaj
        natural join utakmica natural join natjecanje
        group by pogodiozivizid, zabijengol, idigrac, godinasezona
        having idigrac = $1 and godinasezona = $2
        order by pogodiozivizid` 
        const values = [idigrac, godinasezona];
        try {
            const result = await db.query(sql, values);
            return result.rows
        } catch (err) {
            console.log(err);
            console.log(4)
            throw err
        }
    }

    static async dohvatiBrojIgracaZiviZidZaSezonu(idigrac, godinasezona){
        const sql = `select brojigracazivizid, zabijengol, count(idslobodni) from slobodanudarac natural join dogadaj
        natural join utakmica natural join natjecanje
        group by brojigracazivizid, zabijengol, idgolman, godinasezona
        having idgolman = $1 and godinasezona = $2
        order by brojigracazivizid` 
        const values = [idigrac, godinasezona];
        try {
            const result = await db.query(sql, values);
            return result.rows
        } catch (err) {
            console.log(err);
            console.log(3)
            throw err
        }
    }

    static async dohvatiIgracAvgUdaljenostSlobodanUdaracZaSezonu(idigrac, godinasezona){
        const sql = `select ROUND(avg(udaljenostslobodni), 2) as avgdist from slobodanudarac
         natural join dogadaj natural join utakmica natural join natjecanje where idigrac = $1  and godinasezona = $2` 
        const values = [idigrac, godinasezona];
        try {
            const result = await db.query(sql, values);
            return result.rows
        } catch (err) {
            console.log(err);
            console.log(2)
            throw err
        }
    }

    static async dohvatiPreciznostSlobodnihUdaracaIgracaZaSezonu(idigrac, godinasezona){
        const sql = `select CAST ((select count(idslobodni) from slobodanudarac natural join dogadaj 
        natural join utakmica natural join natjecanje where zabijengol = 1  and godinasezona = $2
         and idigrac = $1)  AS DOUBLE PRECISION)
        / (select count(idslobodni) from slobodanudarac natural join dogadaj 
        natural join utakmica natural join natjecanje where idigrac = $1  and godinasezona = $2) as preciznost
        WHERE EXISTS(select idslobodni from slobodanudarac natural join dogadaj 
            natural join utakmica natural join natjecanje where idigrac = $1  and godinasezona = $2);` 
        const values = [idigrac, godinasezona];
        try {
            const result = await db.query(sql, values);
            return result.rows
        } catch (err) {
            console.log(err);
            console.log(1)
            throw err
        }
    }

    static async dohvatiPostotakObranaSlobodnihZaSezonu(idigrac, godinasezona){
        const sql = `select CAST ((select count(idslobodni) from slobodanudarac natural join dogadaj 
        natural join utakmica natural join natjecanje where zabijengol = 0  and godinasezona = $2
         and idgolman = $1)  AS DOUBLE PRECISION)
        / (select count(idslobodni) from slobodanudarac natural join dogadaj 
        natural join utakmica natural join natjecanje where idgolman = $1  and godinasezona = $2) as preciznost
        WHERE EXISTS(select idslobodni from slobodanudarac natural join dogadaj 
            natural join utakmica natural join natjecanje where idgolman = $1  and godinasezona = $2);` 
        const values = [idigrac, godinasezona];
        try {
            const result = await db.query(sql, values);
            return result.rows
        } catch (err) {
            console.log(err);
            console.log(1)
            throw err
        }
    }

    static async dohvatiSlobodneUdarceKluba(idklub, idtim, godinasezona){
        const sql = `select * from slobodanudarac natural join dogadaj natural join
         utakmica natural join natjecanje join igra_za_klub on dogadaj.idigrac = igra_za_klub.idigrac
        where idklub = $1 and datumodigrazaklub <= datumutakmica
         AND (datumdoigrazaklub >= datumutakmica OR datumdoigrazaklub IS NULL)
        and(utakmica.iddomacin = $2 OR utakmica.idgost = $2)
        and godinasezona = $3` 
        const values = [idklub, idtim, godinasezona];
        try {
            const result = await db.query(sql, values);
            return result.rows
        } catch (err) {
            console.log(err);
            console.log('dohvatiPreciznostPenalaIgracaZaSezonu')
            throw err
        }
    }

    static async dohvatiSlobodneUdarceDrzave(iddrzava, idtim, godinasezona){
        const sql = `select * from slobodanudarac natural join dogadaj natural join utakmica natural join natjecanje join igrac
        on dogadaj.idigrac = igrac.idigrac
        where igrac.iddrzava = $1 and datumodigrazadrzavu <= datumutakmica
        AND (datumdoigrazadrzavu >= datumutakmica OR datumdoigrazadrzavu IS NULL)
        and(utakmica.iddomacin = $2 OR utakmica.idgost = $2)
        AND godinasezona = $3
        ` 
        const values = [iddrzava, idtim, godinasezona];
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