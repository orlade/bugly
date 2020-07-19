const path = require('path');
const Database = require('./db')

const express = require('express');
const expressHandlebars = require('express-handlebars');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

const port = 3001;

// Clear stdout to fix issue with logs not logging.
process.stdout.clearLine();
process.stdout.cursorTo(0);

// Config
const db = new Database()
db.init((err) => {
    if (err) {
        console.error(err);
        throw err;
    }
});

app.use(express.static('dist'));
app.engine('.hbs', expressHandlebars({
    defaultLayout: 'main',
    extname: '.hbs',
    layoutsDir: path.join(__dirname, 'views/layouts'),
}));
app.set('view engine', '.hbs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res) => {
    res.render('content', {content: {}});
});

http.listen(port, (err) => {
    if (err) {
        console.log('error', err);
    }

    console.log(`Listening on port ${port}`);
});

io.on('connection', socket => {
    console.log('a user connected');

    io.emit('connected');

    socket.on('disconnect', () => {
        console.log('a user disconnected');
    });

    socket.on('load', ({name}) => {
        console.log(`Loading ${name}...`)

        db.getWorkspace(name, (err, workspace) => {
            if (workspace) {
                io.emit('loaded', workspace)
            } else {
                io.emit('loaded', {name})
            }
        });
    })
})

console.log("Started")
