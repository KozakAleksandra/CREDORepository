const express = require('express')
const bodyParser = require('body-parser')
const mysql = require('mysql')
const cors = require('cors')
const fetch = require('node-fetch');

const app = express()
const port = 5000

app.use(bodyParser.urlencoded({ extended: false }))

app.use(bodyParser.json())
app.use(cors())

//MySQL
const pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'test',
    password: 'test',
    database: 'test',
})

const fetchFinalClass = (id) => {
    return fetch(`http://localhost:5000/imageFinalClass/${id}`)
        .then((response) => response.json()).then((item) => item?.[0]?.class_name)
        .catch(function (err) {
            console.log("Unable to fetch -", err);
        });
}

//get all images for given user
app.get('/imagesForUser/:userID', (req, res) => {
    const userID = req.params.userID
    pool.getConnection((err, connection) => {
        if (err) throw err
        console.log(`connected 
        as id ${connection.threadId}`)


        let mysql = `SELECT img.frame_content, img.id
        FROM images as img
        WHERE img.user_id='${userID}'`;
        console.log(mysql)

        connection.query(mysql, async (err, rows) => {
            connection.release() // return the connection to pool

            let result = []

            for (let i = 0; i < rows.length; i++)
            {
                const row = rows?.[i]
                result.push({
                    id: row?.id,
                    frame_content: row?.frame_content,
                    final_class_name: await fetchFinalClass(row?.id)
                })
            }

            if (!err)
            {
                res.send(result)
            } else
            {
                console.log(err)
            }

        })
    })
})

//Get image info : classifier name and class name 

app.get('/imageInfo/:imageID', (req, res) => {
    const imageID = req.params.imageID
    pool.getConnection((err, connection) => {
        if (err) throw err
        console.log(`connected as id ${connection.threadId}`)

        //query(sqString, callback)
        //If needed more data just add it here to select
        let mysql = `SELECT clfs.classifier_name, cls.class_name
            FROM classifiers as clfs 
            JOIN classifications as clf ON clf.id_classifier = clfs.id_classifier
            JOIN classes as cls ON cls.id_class = clf.id_class
            WHERE clf.id='${imageID}'`;

        connection.query(mysql, (err, rows) => {
            connection.release() // return the connection to pool

            if (!err)
            {
                res.send(rows)
            } else
            {
                console.log(err)
            }

        })
    })
})

//Get final classfor image 

app.get('/imageFinalClass/:imageID', (req, res) => {
    const imageID = req.params.imageID
    pool.getConnection((err, connection) => {
        if (err) throw err
        console.log(`connected as id ${connection.threadId}`)

        //query(sqString, callback)
        let mysql = `SELECT cls.id_class, cls.class_name, COUNT(*) as class_count
        FROM classifications as clf
        JOIN classes as cls ON cls.id_class = clf.id_class
        WHERE clf.id='${imageID}'
		GROUP BY cls.id_class
        HAVING class_count = (
            SELECT COUNT(*) AS class_count
                FROM classifications as clf
                JOIN classes as cls ON cls.id_class = clf.id_class
                WHERE clf.id='${imageID}'
                GROUP BY cls.id_class
                ORDER BY class_count DESC
                LIMIT 1
        )`;
        connection.query(mysql, (err, rows) => {
            connection.release() // return the connection to pool

            if (!err)
            {
                res.send(rows)
                //res.send(rows)
            } else
            {
                console.log(err)
            }

        })
    })
})

app.get('/images', (req, res) => {

    pool.getConnection((err, connection) => {
        if (err) throw err
        console.log(`connected as id ${connection.threadId}`)

        let mysql = `SELECT id, frame_content FROM images`
        connection.query(mysql, async (err, rows) => {
            connection.release() // return the connection to pool

            let result = []

            for (let i = 0; i < rows.length; i++)
            {
                const row = rows?.[i]
                result.push({
                    id: row?.id,
                    frame_content: row?.frame_content,
                    final_class_name: await fetchFinalClass(row?.id)
                })
            }

            if (!err)
            {
                res.send(result)
            } else
            {
                console.log(err)
            }

        })
    })
})

const sendInternalError = (res) => res.send({ message: "internal server error", error: true })

app.post('/auth', (req, res) => {
    const { username = "", password = "" } = req.body
    console.log("username", username, "password", password)

    if (password !== "gg")
    {
        return res.send({ message: "wrong password", error: true })
    }


    pool.getConnection((err, connection) => {
        if (err)
        {
            sendInternalError(res)
        }

        connection.query(`SELECT user_id FROM users WHERE user_id = ${username}`, (err, rows) => {
            connection.release() // return the connection to pool
            if (!err)
            {
                rows.length ? res.send({ message: "successfully logged in" }) : res.status(404).send({ message: "user not found", error: true })
            } else
            {
                sendInternalError(res)
            }

        })
    })
})


app.listen(port, () => console.log(`Listen on port ${port}`))