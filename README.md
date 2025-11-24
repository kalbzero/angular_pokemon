# Pokédex (Angular 19)

Uma Pokédex construída com Angular 19 e carregada de referências ao
universo Pokémon!\
Este projeto foi criado para demonstrar conhecimentos em Angular
standalone, componentes reativos, integração com API externa e boas
práticas de arquitetura e UI/UX.

------------------------------------------------------------------------


## 🔰 Badges

![Angular](https://img.shields.io/badge/Angular-19-dd0031?style=for-the-badge&logo=angular)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![License](https://img.shields.io/badge/license-MIT-green?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Active-success?style=for-the-badge)

------------------------------------------------------------------------

## 🚀 Tecnologias

  Tecnologia       Versão
  ---------------- --------
  **Angular**      19.1.5
  **Typescript**   5.x
  **RxJS**         7.x
  **PokéAPI**      v2
  **SCSS**         custom

------------------------------------------------------------------------

## 📦 Como rodar o projeto

### 1️⃣ Instalar as dependências

``` bash
ng install
```

------------------------------------------------------------------------

### 2️⃣ Rodar o servidor de desenvolvimento

``` bash
ng serve
```

Depois, abra no navegador:

    http://localhost:4200/

------------------------------------------------------------------------

## 3️⃣ Gerar build de produção

``` bash
ng build
```

O build ficará em:

    dist/angular-pokedex/

------------------------------------------------------------------------

 ## 4 Rodar os testes

 ```bash
 ng test --watch=false --browsers=ChromeHeadless
 ```

------------------------------------------------------------------------

## 🎨 Por que fiz certas escolhas

### 🔹 **Uso de standalone components**

O Angular 19 incentiva o uso de componentes standalone, eliminando a
necessidade de módulos.\
Isso deixa o projeto mais simples e rápido de navegar.

Escolhi Signals pois:
	•	Eliminam a necessidade de Subjects e BehaviorSubjects
	•	São mais performáticos
	•	Integram melhor com o novo template syntax (@for, @if)
	•	Facilita o rastreio automático de dependências

### 🔹 **Layout inspirado no anime Pokémon**

-   Header com fonte e cores clássicas da série.\
-   Pokébola animada como loading screen.\
-   Estética leve e divertida, mas ainda responsiva.

### 🔹 Evolução dos Pokémon com grid dinâmico

A PokéAPI possui evoluções não-lineares (Eevee, Slowpoke, etc).
Então implementei:
	•	Detecção automática de evoluções paralelas
	•	Grid 2 ou 3 colunas conforme quantidade de filhos
	•	Renderização recursiva com ngTemplateOutlet

### 🔹 **Toast customizado**

Criado sem bibliotecas externas, para manter leveza do projeto e
independência de terceiros.

Feito em CSS + Angular Signals, porque:
	•	Angular Material seria desnecessário para este projeto
	•	Permite animações e layout personalizados
	•	Permite fila de toasts simultâneos

### 🔹 **Loading fullscreen**

Construído com SCSS puro, inspirado no loading do Bootstrap, mas
estilizado com uma Pokébola.

### 🔹 **Uso do Angular Signals**

O projeto utiliza signals no `PokemonStore` para gerenciamento simples
de estado: 

- loading\
- error\
- pokemon\
- type data

Isso reduz a necessidade de serviços complexos ou NgRx para algo
pequeno.

### 🔹 SCSS puro ao invés de Tailwind ou Bootstrap

Motivos:
	•	Projeto pessoal para treinar CSS moderno
	•	Maior controle visual
	•	Menos dependências externas
	•	Build mais leve
------------------------------------------------------------------------

## 📁 Estrutura geral do projeto

    src/
     ├── app/
     │    ├── shared/
     │    │     ├── store/pokemon-store.service.ts
     │    │     └── models/
     │    ├── components/
     │    │     ├── pokemon-card/
     │    │     ├── pokemon-header/
     │    │     ├── pokemon-types-analysis/
     │    │     └── toast/
     │    └── app.component.ts
     ├── assets/
     └── public/ (fonte Pokémon)

------------------------------------------------------------------------

## 🧩 Funcionalidades

- ✔ Busca por nome do Pokémon  
- ✔ Exibição completa de dados (tipos, habilidades, stats, jogos, etc.)  
- ✔ Cadeia de evolução interativa e responsiva  
- ✔ Análise de fraquezas, resistências e imunidades  
- ✔ Toasts de erro personalizados  
- ✔ Loading full-screen com Pokébola animada  
- ✔ Layout inspirado no design da Pokédex clássica  
- ✔ Suporte a mobile e desktop

------------------------------------------------------------------------

## 📸 Preview

> *(prints do projeto)* 

------------------------------------------------------------------------

## 🧪 Próximos passos (possíveis evoluções)

-   Adicionar paginação para listagem de Pokémon.\
-   Criar página de detalhes completa.\
-   Comparar Pokémon lado a lado.\
-   Página de Login para criar o seu time pokémon.\
-   Testes unitários (karma)

------------------------------------------------------------------------

## 🤝 Contribuição

-   Fork o projeto.\
-   Crie sua branch: git checkout -b feature/minha-feature \
-   Commit: git commit -m 'Adiciona minha feature' \
-   Push: git push origin feature/minha-feature \
-   Abra um Pull Request

------------------------------------------------------------------------

## ⚡ Autor

Projeto criado por **Edward Ramos** como demonstração de domínio em
Angular 19, UI/UX e integração com APIs.

------------------------------------------------------------------------

## 📄 Licença

Este projeto está licenciado sob a licença **MIT**.

------------------------------------------------------------------------

Gotta catch 'em all! 🔥🐉
