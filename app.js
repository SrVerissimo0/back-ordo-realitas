const express = require('express')
const cors = require('cors')
const mysql = require('mysql')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const autenticador = require('./Autentica/Autenticador')

const app = express()

app.use(express.json())
app.use(cors())

const conexao = mysql.createConnection({
    host:'bhksst3n2zllwoep0ajq-mysql.services.clever-cloud.com',                           // "localhost" = ip da maquina atual
    user:'usr5pceyd7tdbbqg',                                // "root" = usuario do banco de dados
    password:'bztqpnw8WXScsCB7oPUH',
    database:'bhksst3n2zllwoep0ajq'
})
const PORT = process.env.PORT || 3001;



app.get('/', (req, res) => res.send("Digdin"))

app.get('/autentica', (req,res) => {
    conexao.query(`Select * from visitantes where estado_visitante = "Em Analise"`, (error, results) =>{
        res.json(results)
    })
})

app.get('/ver/recrutamento', (req, res) => {
    conexao.query(`SELECT * FROM recrutamento inner join visitantes on id_visitante_fk = id_visitante`, (error, results) =>{
        res.json(results)
    })
})

app.get('/ver/ajuda', (req, res) => {
    conexao.query(`SELECT * FROM ajuda inner join visitantes on id_visitante_fk = id_visitante`, (error, results) =>{
        res.json(results)
    })
})

app.post('/Atualiza/recrutamento', (req, res) => {
    const { estado, id } = req.body
    conexao.query(`UPDATE recrutamento Set respondido_recrutamento = "${estado}" where id_recrutamento="${id}"`, (error, results) => {
        if(error == null){
            res.json({"Mensagem":"Atualizou"})
        }
    })
})

app.post('/Atualiza/ajuda', (req, res) => {
    const { estado, id } = req.body
    conexao.query(`UPDATE ajuda Set respondido_ajuda = "${estado}" where id_ajuda="${id}"`, (error, results) => {
        if(error == null){
            res.json({"Mensagem":"Atualizou"})
        }
    })
})


app.post('/Atualiza', (req,res) => {
    const {estado, id} = req.body
    conexao.query(`UPDATE visitantes Set estado_visitante = "${estado}" where id_visitante="${id}"`, (error, results)=>{
        if(error == null){
            res.json({"Mensagem":"Atualizou"})
        }
    })
})

app.post('/cadastro', async (req,res) => {
    console.log(req.body)
    let nome = req.body.nome
    let email = req.body.email
    let cpf = req.body.cpf
    let senha = req.body.senha

    const hash = await bcrypt.hash(senha, 10)
    senha = hash
    
    console.log(senha)


    conexao.query(`Select * from visitantes where email_visitante = "${email}"`, (error, results) => {
        console.log(error)
        console.log(results)
        if (results[0] == null){
            conexao.query(`insert into visitantes(nome_visitante,email_visitante,cpf_visitante,senha_visitante) value ("${nome}","${email}","${cpf}","${senha}")`, (error, results) => {
                if (error == null){
                    res.json({"Mensagem": "Em analise"})
                }
            })
        } else {
            res.json({"Mensagem":"email ja cadastrado"})
        }
    })
})

app.post('/login', (req, res) => {
    let email = req.body.email
    let senha = req.body.senha
    
    conexao.query(`Select * from visitantes where email_visitante = "${email}"`, async (error, results) => {
        console.log(results)
        if (results[0] != null){
            if (await bcrypt.compare(senha, results[0].senha_visitante)){
                if (results[0].estado_visitante == "Em Analise"){
                    res.json({"Mensagem": "Em Analise"})
                } else if(results[0].estado_visitante == "Recusado"){
                    res.json({"Mensagem": "Recusado"})
                } else if(results[0].estado_visitante == "Aceito"){
                    delete results[0].senha_visitante
                    delete results[0].cpf_visitante
                    let token = jwt.sign({'user': results[0]}, "Faculdade")

                    res.json({"Mensagem": "Aceito",'token': token})
                }
            } else {
                res.json({"Mensagem": "Senha incorreta"})
            }
        } else {
            res.json({"Mensagem": "Email incorreto"})
        }  
    })
})

app.post('/recrutamento', autenticador, (req, res) =>{
    const { texto } = req.body

    conexao.query(`Insert into recrutamento(texto_recrutamento, id_visitante_fk) values("${texto}","${req.dados.user.id_visitante}")`,(error, results) => {
        if (error == null){
            res.json({"Mensagem": "Enviado"})
        }
    })
})

app.post('/ajuda', autenticador, (req, res) =>{
    const { texto } = req.body

    conexao.query(`Insert into ajuda(texto_ajuda, id_visitante_fk) values("${texto}","${req.dados.user.id_visitante}")`,(error, results) => {
        if (error == null){
            res.json({"Mensagem": "Enviado"})
        }
    })
})

app.listen(PORT , () => console.log("Rodando na porta 3001"))