const forexRoutes = (app, fs) => {
    // variables
    const dataPath = './data/forex.json';

    const readFile = (
        callback,
        returnJson = false,
        filePath = dataPath,
        encoding = 'utf8'
    ) => {
        fs.readFile(filePath, encoding, (err, data) => {
            if (err) {
                throw err;
            }

            callback(returnJson ? JSON.parse(data) : data);
        });
    };

    const writeFile = (
        fileData,
        callback,
        filePath = dataPath,
        encoding = 'utf8'
    ) => {
        fs.writeFile(filePath, fileData, encoding, err => {
            if (err) {
                throw err;
            }

            callback();
        });
    };

    // READ
    app.get('/forex', (req, res) => {
        readFile(data => {
            res.send(data);
        }, true);
    });

    // CREATE
    app.post('/forex', (req, res) => {
        readFile(data => {
            // Note: this needs to be more robust for production use.
            // e.g. use a UUID or some kind of GUID for a unique ID value.
            const newUserId = Date.now().toString();

            // add the new user
            data[newUserId] = req.body;

            writeFile(JSON.stringify(data, null, 2), () => {
                res.status(200).send('new user added');
            });
        }, true);
    });

    // UPDATE
    app.put('/forex/:id', (req, res) => {
        readFile(data => {
            // add the new user
            const userId = req.params['id'];
            data[userId] = req.body;

            writeFile(JSON.stringify(data, null, 2), () => {
                res.status(200).send(`users id:${userId} updated`);
            });
        }, true);
    });

    // DELETE
    app.delete('/forex/:id', (req, res) => {
        readFile(data => {
            // delete user
            const userId = req.params['id'];
            delete data[userId];

            writeFile(JSON.stringify(data, null, 2), () => {
                res.status(200).send(`users id:${userId} removed`);
            });
        }, true);
    });
};
module.exports = forexRoutes;
