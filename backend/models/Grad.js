const db = require('../db')

module.exports = class Grad{

    constructor(dbGrad){
        this.idgrad = dbGrad.idgrad
        this.nazivgrad = dbGrad.nazivgrad
        this.iddrzava = dbGrad.iddrzava
    }

    static async dohvatiGradoveUDrzavi(iddrzava){
        const sql = `SELECT * FROM grad WHERE iddrzava = $1 ORDER BY grad.nazivgrad` 
        const values = [iddrzava];
        var gradovi = [];
        try {
            const result = await db.query(sql, values);
            for(var i = 0; i < result.rows.length; i++){
                gradovi[i] = new Grad(result.rows[i]);
            }
            return gradovi;
        } catch (err) {
            console.log(err);
            throw err
        }
    }

    static async dohvatiGradZaId(idgrad){
        const sql = `SELECT * FROM grad WHERE idgrad=$1` 
        const values = [idgrad];
        try {
            const result = await db.query(sql, values);
            let grad = new Grad(result.rows[0])
            return grad;
        } catch (err) {
            console.log(err);
            throw err
        }
    }

    static async dodajGrad(nazivgrad, iddrzava){
        const sql = `INSERT INTO grad(nazivgrad, iddrzava) VALUES($1, $2);` 
        const values = [nazivgrad, iddrzava];
        try {
            await db.query(sql, values);
        } catch (err) {
            console.log(err);
            throw err
        }
    }

    static async izmjeniGrad(novinazivgrad, idgrad){
        const sql = `UPDATE grad SET nazivgrad=$1 WHERE idgrad=$2;` 
        const values = [novinazivgrad, idgrad];
        try {
            if(novinazivgrad){
                await db.query(sql, values);
            }
        } catch (err) {
            console.log(err);
            throw err
        }
    }

    static async ukloniGrad(idgrad){
        const sql = `DELETE FROM grad WHERE idgrad = $1;` 
        const values = [idgrad];
        try {
            await db.query(sql, values);
        } catch (err) {
            console.log(err);
            throw err
        }
    }

    
}