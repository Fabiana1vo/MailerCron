const express = require('express')
const cron = require('node-cron')
const nodemailer = require('nodemailer')
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cors = require('cors')
const app = express()
const credentials = require('./config/smtp.config.js');

const port = process.env.LISTENER_PORT || 3000;



const pass = credentials.pass;
const user = credentials.user;

// 
let arrDados = []
app.use(cors());


require('dotenv').config()
app.use(bodyParser.json())


app.get('/', (req, res) => {
    res.json({
        message: 'Estou funcionando'
    })
})


app.post('/send', (req, res) => {

    if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).send('Body da solicitação inválido!');
    }

    console.log(`Requisição post recebida`)

    const {
        nome,
        email
    } = req.body

    const dadosRecebidos = req.body

    arrDados.push(dadosRecebidos)


    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        auth: {
            user,
            pass
        }

    });


    transporter.sendMail({
            from: user,
            to: email,
            subject: "Formulario de teste",
            html: `
        Esse é o formulário de teste enviado por ${nome}, cujo e-mail é: ${email}
    `
        })
        .then(
            info => {
                res.send(info)
            }
        )
        .catch(error => {
            console.error(error)
        })

    console.log(arrDados)
})


// Configurando a porta para que o servidor escute

app.listen(port, () => {
    console.log(`Servidor iniciado na porta ${port}`)
});