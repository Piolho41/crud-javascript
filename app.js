// Importação das dependências necessárias
const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const path = require('path');

// Criação da aplicação Express
const app = express();
const PORT = 3000;

// Configuração da conexão com o banco de dados MySQL
const connection = mysql.createConnection({
    host: 'localhost', // Nome/enderço do servidor do banco de dados MYSQL
    user: 'root', // Usuário do banco de dados MySQL
    password: 'senac123456789', // Altere conforme sua configuração
    database: 'biblioteca' // Nome do banco de dados
});

// Teste da conexão com o banco
connection.connect((err) => {
    if (err) {
        console.error('Erro ao conectar com o banco de dados:', err);
        return;
    }
    console.log('Conectado ao banco de dados MySQL');
});

// Configuração do EJS como mecanismo de template
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middlewares para parsing do body e method override
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

// Middleware para servir arquivos estáticos
app.use(express.static('public'));

// ROTAS DO SISTEMA

// ROTA PRINCIPAL - Página inicial
// Acessa o arquivo index.ejs
// req = requisita recurso ao servidor
// res = resposta do servidor ou usuário
app.get('/', (req, res) => {
    res.render('index');
});

// ROTA PARA LISTAR TODOS OS LIVROS
// app.get('', () => {
//     // Query SQL para buscar todos os livros 
//     const query = 
    
//     // Testar a conexão e executar a operação
//     connection.query(query, (err, results) => {
//         if (err) {
//             // Caso não seja executado o script
//         }
//         // Caso o script seja executado com suceso
// });

// ROTA PARA EXIBIR FORMULÁRIO
// DE CRIAÇÃO DE UM LIVRO
app.get('/criar', (req, res) => {
    res.render('criar')
});

// ROTA PARA CRIAR UM NOVO LIVRO (POST)
app.post('/criar', (req, res) => {

    // CONSTANTE PARA RECEBER OS DADOS DO FORMULÁRIO
    const { titulo, ano_publicacao, editora, isbn } = req.body
    
    // Query SQL para inserir novo livro
    const query = "insert into livro(titulo, ano_publicacao, editora, isbn) values (?, ?, ?, ?)"
    
     // Testar a conexão e executar a operação
    connection.query(query, [titulo, ano_publicacao, editora, isbn], (err, results) => {
        if (err) {
            // Caso não seja executado o script
            console.error("Erro ao criar o livro: ", err)
        }
        // Caso o script seja executado com suceso
        console.log("Livro criado com sucesso")

        // Retornar para a página inicial
        res.redirect('/')

    });
});


// // 4) ROTA PARA LISTAR TODOS OS LIVROS (GET)
app.get('/listar', (req, res) => {

    // Query SQL para selecionar todos os livros
    const query = "SELECT * FROM livro";

    // Testar a conexão e executar a operação
    connection.query(query, (err, results) => {
        if (err) {
            console.error("Erro ao listar os livros: ", err);
        }

        // Exibir os livros na view listar.ejs
        res.render('listar', { livros: results });
    });

});
// 5) ROTA PARA EXIBIR O FORMULÁRIO DE EDIÇÃO (GET)
app.get('/editar/:id', (req, res) => {

    // CONSTANTE PARA RECEBER O ID DO LIVRO
    const { id } = req.params;

    // Query SQL para buscar o livro específico
    const query = "SELECT * FROM livro WHERE id = ?";

    connection.query(query, [id], (err, results) => {
        if (err) {
            console.error("Erro ao buscar o livro: ", err);
        }

        // Renderizar o formulário de edição com os dados do livro
        res.render('editar', { livro: results[0] });
    });
});
// 6) ROTA PARA ATUALIZAR UM LIVRO EXISTENTE (PUT)
app.put('/editar/:id', (req, res) => {

    // CONSTANTES PARA RECEBER OS DADOS DO FORMULÁRIO
    const { id } = req.params;
    const { titulo, ano_publicacao, editora, isbn } = req.body;

    // Query SQL para atualizar o livro
    const query = "UPDATE livro SET titulo = ?, ano_publicacao = ?, editora = ?, isbn = ? WHERE id = ?";

    connection.query(query, [titulo, ano_publicacao, editora, isbn, id], (err, results) => {
        if (err) {
            console.error("Erro ao atualizar o livro: ", err);
        }

        console.log("Livro atualizado com sucesso");
        res.redirect('/listar');
    });
});


// 7) ROTA PARA EXCLUIR UM LIVRO (DELETE)
app.delete('/deletar/:id', (req, res) => {

    // CONSTANTE PARA RECEBER O ID DO LIVRO
    const { id } = req.params;

    // Query SQL para deletar o livro
    const query = "DELETE FROM livro WHERE id = ?";

    connection.query(query, [id], (err, results) => {
        if (err) {
            console.error("Erro ao excluir o livro: ", err);
        }

        console.log("Livro excluído com sucesso");
        res.redirect('/listar');
    });
});

// Inicialização do servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    console.log(`Acesse: http://localhost:${PORT}`);
});

// Comandos de execução
// do servidor no Terminal:

// 1) node app.js
// 2) nodemon app.js