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

#### 🗺️ Navegação e Cálculo de Rota
A funcionalidade de criação de caminho é potencializada por um serviço externo para garantir precisão e eficiência. Para calcular a melhor rota a pé dentro do campus, o GeoLoc se integra com a API do **OpenRouteService**, um serviço de roteirização de código aberto mantido pelo **heiGIT** (Heidelberg Institute for Geoinformation Technology).

O fluxo funciona da seguinte maneira:
1.  O frontend envia a localização inicial do usuário e o ID do destino (ex: uma sala) para o backend do GeoLoc.
2.  Nosso backend busca as coordenadas geográficas do destino em seu próprio banco de dados (Supabase).
3.  Com as coordenadas de origem e destino em mãos, o backend consulta a API do OpenRouteService.
4.  O OpenRouteService calcula o caminho otimizado para pedestres e o retorna como uma sequência de coordenadas.
5.  O backend repassa essa rota para o frontend, que a desenha no mapa para o usuário.

Essa abordagem garante rotas precisas, aproveitando os dados do OpenStreetMap, sem a necessidade de manter uma complexa lógica de grafos no próprio backend.

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
* **Serviços Externos / APIs**
    * OpenRouteService (do heiGIT) para cálculo de rotas e navegação.

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
* Chave de API do OpenRouteService.

**Instalação do Backend:**
```bash
# 1. Clone o repositório
git clone [https://github.com/muNeves3/GeoLoc.git](https://github.com/muNeves3/GeoLoc.git)

# 2. Navegue para a pasta do backend
cd GeoLoc/backend

# 3. Configure suas variáveis de ambiente (ex: em um arquivo .env)
# SUPABASE_URL=URL_DO_SEU_PROJETO
# SUPABASE_KEY=CHAVE_DO_SEU_PROJETO
# ORS_API_KEY=SUA_CHAVE_API_DO_OPENROUTESERVICE

# 4. Restaure as dependências
dotnet restore

# 5. Execute a aplicação
dotnet run