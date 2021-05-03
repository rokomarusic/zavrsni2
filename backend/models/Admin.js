const db = require('../db')

module.exports = class Admin{

    constructor(dbAdmin){
        this.username = dbAdmin.username;
        this.password = dbAdmin.password;
    }

    static async provjeriLogin(username, password){
        const sql = `SELECT password FROM admin WHERE username=$1` 
        const values = [username];
        try {
            const result = await db.query(sql, values);
            if(!result.rows[0]){
                return false;
            }
            let dbPassword = result.rows[0].password;
            return dbPassword === password;
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