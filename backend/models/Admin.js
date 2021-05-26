const db = require('../db')

module.exports = class Admin{

    constructor(dbAdmin){
        this.username = dbAdmin.username;
        this.password = dbAdmin.password;
        this.authlevel = dbAdmin.authlevel
    }

    static async provjeriLogin(username){
        const sql = `SELECT password FROM admin WHERE username=$1` 
        const values = [username];
        try {
            const result = await db.query(sql, values);
            if(!result.rows[0]){
                return null;
            }
            let dbPassword = result.rows[0].password;
            return dbPassword
        } catch (err) {
            console.log(err);
            throw err
        }
    }

    static async napraviLogin(username){
        const sql = `SELECT * FROM admin WHERE username=$1` 
        const values = [username];
        try {
            const result = await db.query(sql, values);
            let admin = new Admin(result.rows[0]);
            return admin;
        } catch (err) {
            console.log(err);
            throw err
        }
    }
}