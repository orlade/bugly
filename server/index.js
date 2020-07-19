const path = require('path');

const express = require('express');
const expressHandlebars = require('express-handlebars');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

const port = 3001;

// Config
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
        console.log('loaded')
        io.emit('loaded', {
            name,
            nodes: [
                { key: 0, name: 'Alpha', loc: '0 0' },
                { key: 1, name: 'Beta', loc: '150 0' },
                { key: 2, name: 'Gamma', loc: '0 150' },
                { key: 3, name: 'Delta', loc: '150 150' }
            ],
            links: [
                { key: -1, from: 0, to: 1 },
                { key: -2, from: 0, to: 2 },
                { key: -3, from: 1, to: 1 },
                { key: -4, from: 2, to: 3 },
            ],
        })
    })
})

console.log("Started")
