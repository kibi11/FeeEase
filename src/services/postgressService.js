const {Client} = require('pg');


const dbOperations = async (query , values) => {

        console.log("This is postgresService.js",query,values);

        const client = new Client({
            user: "postgres",
            password: "arpan123",
            host: "localhost",
            database: 'ckgsDB'
        });

        try {
            await client.connect();
            console.log("connection established");
            console.log("The query made is ", query);
            const result = await client.query(query);
            client.end();
            console.log("connection ended");
            console.log("This is service",result);
            return result?.rows;
        } catch (error) {
            console.error('Error:',error);
        }
}

module.exports = {dbOperations};