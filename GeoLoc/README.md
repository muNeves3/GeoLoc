# GeoLoc - Mapa Interativo da UEL

![Status do Projeto](https://img.shields.io/badge/status-em_desenvolvimento-yellow)
![Licença](https://img.shields.io/badge/license-MIT-blue.svg)

GeoLoc é um projeto de mapa interativo de código aberto, projetado para facilitar a localização e navegação no campus da Universidade Estadual de Londrina (UEL). A plataforma permite que usuários encontrem salas, centros de estudo e outros locais de interesse, além de traçar rotas partindo de sua localização atual.

---

### 📖 Tabela de Conteúdos
* [Sobre o Projeto](#-sobre-o-projeto)
* [Funcionalidades](#-funcionalidades)
* [Tecnologias Utilizadas](#-tecnologias-utilizadas)
* [Arquitetura](#️-arquitetura)
* [Como Começar](#-como-começar)
* [Documentação da API](#-documentação-da-api)
* [Como Contribuir](#-como-contribuir)
* [Licença](#-licença)

---

### 🎯 Sobre o Projeto
Navegar por um campus universitário grande como o da UEL pode ser um desafio, especialmente para novos estudantes e visitantes. O GeoLoc nasceu com o objetivo de resolver esse problema, oferecendo uma plataforma centralizada onde é possível visualizar o mapa do campus, filtrar locais por categorias e gerar rotas otimizadas para chegar ao destino desejado.

O projeto foi dividido em duas frentes principais: um painel para administradores gerenciarem os locais cadastrados e uma interface para o usuário final consultar o mapa.

### ✨ Funcionalidades

#### 👤 Para Usuários
* Visualização de todos os locais cadastrados no mapa do campus.
* Filtro de locais por parâmetros como Centro de Estudo ou número da sala.
* Criação de um caminho (rota) a partir da localização do usuário até uma sala ou local específico.

#### 🛠️ Para Administradores
* Autenticação segura para acesso a funcionalidades restritas.
* Cadastro de novos lugares no mapa utilizando coordenadas geográficas.
* Alteração de informações de locais já existentes.
* Visualização geral do mapa com todos os pontos cadastrados.

#### ⚙️ Funcionalidades Técnicas
* **Arquitetura:** O projeto segue os princípios de Domain-Driven Design (DDD) e Clean Architecture para garantir um código desacoplado, testável e de fácil manutenção.
* **Autenticação:** Diferenciação de permissões entre usuários comuns e administradores, com autenticação baseada em JWT (JSON Web Token).
* **Performance:** Uso de estratégias de caching para otimizar o tempo de resposta das requisições.
* **DevOps:** Planejamento para integração e entrega contínua (CI/CD) para automação de builds e deploys.
* **Documentação:** A API do backend é documentada com Swagger para facilitar o entendimento e o consumo dos endpoints.

### 🚀 Tecnologias Utilizadas
A stack do projeto foi escolhida para ser moderna, robusta e escalável.

* **Backend**
    * C# & .NET Core 
    * Supabase (Banco de Dados e Autenticação) 
* **Frontend**
    * React 
    * TypeScript 
    * Leaflet ou React-google-maps para a renderização dos mapas [cite: 1, 2]

### 🏛️ Arquitetura
O backend do projeto foi estruturado seguindo os princípios da **Clean Architecture**, conforme definido nos requisitos não funcionais. Essa abordagem separa o software em camadas independentes:

* **Domain (Domínio):** Contém a lógica de negócio principal e as entidades (Lugares, Usuários, etc.), completamente independente de tecnologias externas.
* **Application (Aplicação):** Orquestra os casos de uso do sistema (Cadastrar Lugar, Criar Caminho), conectando o domínio à camada de infraestrutura.
* **Infrastructure (Infraestrutura):** Lida com detalhes externos como banco de dados (Supabase), frameworks web (.NET) e outras ferramentas.

Essa estrutura promove um baixo acoplamento e alta coesão, facilitando testes, manutenção e a evolução do projeto.

### 🏁 Como Começar
Para executar o projeto localmente, siga os passos abaixo.

**Pré-requisitos:**
* .NET SDK
* Node.js e npm
* Conta no Supabase e as credenciais do seu projeto.

**Instalação do Backend:**
```bash
# 1. Clone o repositório
git clone [https://github.com/muNeves3/GeoLoc.git](https://github.com/muNeves3/GeoLoc.git)

# 2. Navegue para a pasta do backend
# (substitua pelo nome real da pasta)
cd GeoLoc/backend-folder-name 

# 3. Configure suas variáveis de ambiente (ex: em um arquivo .env)
# SUPABASE_URL=URL_DO_SEU_PROJETO
# SUPABASE_KEY=CHAVE_DO_SEU_PROJETO

# 4. Restaure as dependências
dotnet restore

# 5. Execute a aplicação
dotnet run

📖 Documentação da API
A documentação completa dos endpoints da API está disponível via Swagger, conforme planejado nos requisitos não funcionais. Após iniciar o backend, acesse o seguinte endereço no seu navegador:

http://localhost:8080/swagger

🤝 Como Contribuir
Contribuições são o que tornam a comunidade de código aberto um lugar incrível para aprender, inspirar e criar. Qualquer contribuição que você fizer será muito apreciada.

Faça um Fork do projeto

Crie uma Branch para sua nova funcionalidade (git checkout -b feature/AmazingFeature)

Faça o Commit de suas mudanças (git commit -m 'Add some AmazingFeature')

Faça o Push para a Branch (git push origin feature/AmazingFeature)

Abra um Pull Request