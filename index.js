let express = require('express');

let port = process.env.PORT || 3000;

let app = express();

app.get('/', (req, res) => {
    res.send('Hello World!')
});

app.listen(port, () => {
    console.log('Example app listening on port 3000!')
});
