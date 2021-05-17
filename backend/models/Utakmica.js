const db = require('../db')

module.exports = class Utakmica{

    constructor(dbUtakmica){
        this.idstadion = dbUtakmica.idstadion;
        this.nazivstadion = dbUtakmica.nazivstadion;
        this.idutakmica = dbUtakmica.idutakmica
        this.datumutakmica = dbUtakmica.datumutakmica;
        this.brgolovadomacin = dbUtakmica.brgolovadomacin;
        this.brgolovagost = dbUtakmica.brgolovagost;
        this.nazivdomacin = dbUtakmica.nazivdomacin;
        this.nazivgost = dbUtakmica.nazivgost;
        this.posjecenost = dbUtakmica.posjecenost;
        this.kolo = dbUtakmica.kolo;
        this.fazanatjecanje = dbUtakmica.fazanatjecanje;
        this.idnatjecanje = dbUtakmica.idnatjecanje;
        this.nazivnatjecanje = dbUtakmica.nazivnatjecanje;
        this.godinasezona = dbUtakmica.nazivnatjecanje;
        this.iddomacin = dbUtakmica.iddomacin;
        this.idgost = dbUtakmica.idgost
    }

    static async dohvatiUtakmiceUNatjecanju(idnatjecanje){
        const sql = `select idutakmica, datumutakmica, brgolovadomacin, brgolovagost, t1.nazivtim AS nazivdomacin,
        t2.nazivtim AS nazivgost, posjecenost, kolo, fazanatjecanje, idstadion, nazivstadion,
        idnatjecanje, nazivnatjecanje, godinasezona, iddomacin, idgost
        from utakmica
        JOIN tim t1 ON utakmica.iddomacin = t1.idtim  
        JOIN tim t2 ON utakmica.idgost = t2.idtim
        NATURAL JOIN stadion
        NATURAL JOIN natjecanje
        WHERE idnatjecanje = $1
        ORDER BY datumutakmica DESC` 
        const values = [idnatjecanje];
        var utakmice = [];
        try {
            const result = await db.query(sql, values);
            for(var i = 0; i < result.rows.length; i++){
                utakmice[i] = new Utakmica(result.rows[i]);
            }
            return utakmice;
        } catch (err) {
            console.log(err);
            throw err
        }
    }


    static async dohvatiUtakmicuZaId(idutakmica){
        const sql = `select idutakmica, datumutakmica, brgolovadomacin, brgolovagost, t1.nazivtim AS nazivdomacin,
        t2.nazivtim AS nazivgost, posjecenost, kolo, fazanatjecanje, idstadion, nazivstadion,
        idnatjecanje, nazivnatjecanje, godinasezona, iddomacin, idgost
        from utakmica
        JOIN tim t1 ON utakmica.iddomacin = t1.idtim  
        JOIN tim t2 ON utakmica.idgost = t2.idtim
        NATURAL JOIN stadion
        NATURAL JOIN natjecanje
        WHERE idutakmica = $1` 
        const values = [idutakmica];
        try {
            const result = await db.query(sql, values);
            return result.rows[0];
        } catch (err) {
            console.log(err);
            throw err
        }
    }

    static async dodajUtakmicu(utakmica){
        const sql = `INSERT INTO utakmica(datumutakmica, brgolovadomacin, brgolovagost,
            posjecenost, kolo, fazanatjecanje, idstadion, idnatjecanje,
            iddomacin, idgost) VALUES
($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)` 
        const values = [utakmica.datumutakmica, utakmica.brgolovadomacin, utakmica.brgolovagost,
        utakmica.posjecenost, utakmica.kolo, utakmica.fazanatjecanje, utakmica.idstadion,
        utakmica.idnatjecanje, utakmica.iddomacin, utakmica.idgost];
        try {
            const result = await db.query(sql, values);
        } catch (err) {
            console.log(err);
            throw err
        }
    }

    static async izmjeniUtakmicu(utakmica){
        const sql = `UPDATE utakmica SET(datumutakmica, brgolovadomacin, brgolovagost,
            posjecenost, kolo, fazanatjecanje, idstadion, idnatjecanje,
            iddomacin, idgost) =
($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) WHERE idutakmica = $11` 
        const values = [utakmica.datumutakmica, utakmica.brgolovadomacin, utakmica.brgolovagost,
        utakmica.posjecenost, utakmica.kolo, utakmica.fazanatjecanje, utakmica.idstadion,
        utakmica.idnatjecanje, utakmica.iddomacin, utakmica.idgost, utakmica.idutakmica];
        try {
            const result = await db.query(sql, values);
        } catch (err) {
            console.log(err);
            throw err
        }
    }

    static async ukloniUtakmicu(idutakmica){
        const sql = `DELETE FROM utakmica WHERE idutakmica = $1` 
        const values = [idutakmica];
        try {
            const result = await db.query(sql, values);
        } catch (err) {
            console.log(err);
            throw err
        }
    }
}