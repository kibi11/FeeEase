const {Client} = require('pg');

const client = new Client({
    user: "postgres",
    password: "arpan123",
    host: "localhost",
    database: 'ckgsDB'
});

// Connect to the database
    // client
    //     .connect()
    //     .then(() => {
    //             console.log('Connected to PostgreSQL database');

    //             // Execute SQL queries here

    //             client.query('SELECT * FROM student_details', (err, result) => {
    //                 if (err) {
    //                     console.error('Error executing query', err);
    //                 } else {
    //                     console.log('Query result:', result.rows);
    //                 }

                    
    //             });
    //         })
    //         .catch((err) => {
    //             console.error('Error connecting to PostgreSQL database', err);
    //         });
    
    const dbOperations = (command , query , values) => {

        client
            .connect()
            .then(async () => 
            {           
                const result = await client.query(query, values, (err, result) => {
                    if (err) {
                        console.error('Error executing query', err);
                    } else {
                        console.log('Query result:', result.rows);
                    }});
                    
                    // Close the connection when done
                    client
                    .end()
                    .then(() => {
                        console.log('Connection to PostgreSQL closed');
                    })
                    .catch((err) => {
                        console.error('Error closing connection', err);
                    });
                    return result?.rows;

            })
            .catch((err) => {
                console.error('Error:', err);
            })

    }

    export default {dbOperations};