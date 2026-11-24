const express = require("express");
const path = require("path");

const app = express();

// Configuração do template engine EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middlewares para leitura de formulários (POST) e arquivos estáticos
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Banco de dados em memória para armazenar os usuários cadastrados
const usuarios = [
  { nome: "Administrador", usuario: "admin", email: "admin@email.com", senha: "1234" }
];

// 3.b - O endereço padrão ('/') direciona para a página de projetos
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "Projects.html"));
});

// 3.c - Cadastro.html é acessado com a requisição '/cadastra'
app.get("/cadastra", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "Cadastro.html"));
});

// 3.d - Login.html é acessado com a requisição '/login'
app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "Login.html"));
});

// Rota POST para processar o cadastro de usuário
app.post("/cadastra", (req, res) => {
  const { nome, email, usuario, senha } = req.body;

  const usuarioExiste = usuarios.find((u) => u.usuario === usuario || u.email === email);

  if (usuarioExiste) {
    return res.render("resposta", {
      sucesso: false,
      usuario: usuario || email,
      status: "Usuário ou e-mail já cadastrado!"
    });
  }

  usuarios.push({ nome, email, usuario, senha });

  res.render("resposta", {
    sucesso: true,
    usuario: nome || usuario,
    status: "Cadastro realizado com sucesso! Agora você já pode fazer login."
  });
});

// 4.a - Rota POST para processar o login e renderizar resposta.ejs
app.post("/login", (req, res) => {
  const { usuario, senha } = req.body;

  const usuarioValido = usuarios.find(
    (u) => (u.usuario === usuario || u.email === usuario) && u.senha === senha
  );

  if (usuarioValido) {
    res.render("resposta", {
      sucesso: true,
      usuario: usuarioValido.nome || usuarioValido.usuario,
      status: "Login realizado com sucesso!"
    });
  } else {
    res.render("resposta", {
      sucesso: false,
      usuario,
      status: "Usuário ou senha incorretos."
    });
  }
});

// 3.a - O servidor funciona utilizando a porta 80
app.listen(80, () => {
  console.log("Servidor rodando na porta 80 (http://localhost)");
});
