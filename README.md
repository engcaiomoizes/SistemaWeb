# Sistema Web

Este projeto é composto por **5 containers Docker**: aplicação web **Next.js**, servidor web e proxy reverso com **nginx**, back-end **Python** para manipulação de arquivos, banco de dados **MySQL**, e **Adminer**.

Seu objetivo é controlar demandas de uma **Secretaria de Assistência Social**, como **cadastro de funcionários, controle de patrimônios, listagem de ramais telefônicos**, entre outras funcionalidades.

## Aplicação Next.js

O Next.js foi usado neste projeto para criar a **interface do usuário** e o back-end para obtenção dos dados do banco, através de API, utilizando o **Prisma ORM**.
A interface foi desenvolvida com **Tailwind CSS**, para criar um design responsivo as páginas e componentes existentes no projeto.

Além disso, foram utilizadas bibliotecas como:
- Bcrypt
- React Icons
- Ping
- Next Auth
- Next Themes
- JSON Web Token
- Nodemailer
- Embla Carousel React
- ShadCN

## Back-end Python

O Python foi a última implementação do projeto, tendo como função a **manipulação de arquivos e geração de relatórios PDF**.

Conforme eu ia desenvolvendo o projeto, percebi que a implementação desta funcionalidade era muito complexa utilizando somente o Next.js, portanto logo busquei aprender e aplicar o Python para este caso.

Impementei uma API Python para executar as funções necessárias, integrando com o mesmo banco de dados MySQL, utlizando FastAPI.

Dependências utilizadas:
- FastAPI
- Uvicorn
- PyPDF2
- Python-Multipart
- PyMySQL
- ReportLab
- Cryptography
- aiofiles
- PyMuPDF
- dotenv
- cairosvg
- svglib

## Servidor Nginx

O servidor Nginx foi configurado como **proxy reverso** escutando na **porta 81**. Ele encaminha as requisições recebidas para o aplicativo Next.js, que está rodando na **porta 3000**, no container identificado como *nextjs*.

## Como rodar o projeto?

Para rodar o projeto, deve-se primeiramente ter o **Docker** instalado no computador.

Com o Docker instalado, basta executar com comandos abaixo no CMD, dentro da pasta do projeto:
- docker-compose build
- docker-compose up -d

Pronto, o projeto estará rodando em sua máquina! Estas são as portas onde se encontram os containers:
- 81 --> Nginx (http://localhost:81 para acessar o site da aplicação)
- 8080 --> Adminer
- 8000 --> FastAPI Python
- 3307 --> MySQL
- 3000 --> Aplicação Next.js

Para desligar o projeto para modificações, utilize **docker-compose down**.
