# TECHTRAIN - Plataforma de Cursos Online

Uma plataforma completa, dinâmica e profissional para uma empresa fictícia de cursos online chamada TECHTRAIN, inspirada em grandes plataformas como Udemy, Alura e Coursera.

## Recursos

- **Design Responsivo**: Funciona em desktop, tablet e dispositivos móveis
- **Interface Moderna**: Design limpo e profissional usando Tailwind CSS
- **Catálogo de Cursos**: Navegue e pesquise cursos por categoria, preço e palavra-chave
- **Carrinho de Compras**: Adicione cursos ao carrinho e finalize a compra
- **Painel do Estudante**: Área de login com acompanhamento do progresso dos cursos
- **Formulário de Contato**: Envie mensagens com validação
- **Armazenamento Local**: Armazenamento persistente de dados para carrinho, informações do usuário e mensagens

## Páginas

1. **Página Inicial** (`index.html`)
   - Cabeçalho fixo com navegação
   - Seção hero com chamada para ação
   - Cursos em destaque
   - Seção Por que escolher a TECHTRAIN
   - Depoimentos
   - Rodapé

2. **Página de Cursos** (`courses.html`)
   - Catálogo completo de cursos
   - Recursos de pesquisa e filtragem
   - Cartões de cursos com imagens, descrições e preços

3. **Página de Detalhes do Curso** (`course.html?id=...`)
   - Informações detalhadas do curso
   - Currículo do curso
   - Avaliações de estudantes
   - Funcionalidade de adicionar ao carrinho

4. **Página de Contato** (`contact.html`)
   - Formulário de contato com validação
   - Informações de contato
   - Visualização do mapa

5. **Área do Estudante** (`student.html`)
   - Login necessário
   - Painel com cursos matriculados
   - Acompanhamento do progresso
   - Gerenciamento de perfil

6. **Carrinho de Compras** (`cart.html`)
   - Visualizar cursos adicionados
   - Remover itens
   - Funcionalidade de checkout

7. **Página de Login** (`login.html`)
   - Login do estudante
   - Credenciais de demonstração fornecidas

## Tecnologias Utilizadas

- **HTML5**
- **CSS3** com Tailwind CSS
- **JavaScript** (Vanilla JS)
- **LocalStorage** para persistência de dados
- **Google Fonts** (Poppins)
- **Font Awesome** para ícones
- **Unsplash** para imagens de alta qualidade

## Estrutura de Arquivos

```
.
├── index.html
├── courses.html
├── course.html
├── contact.html
├── student.html
├── login.html
├── cart.html
├── css/
│   └── style.css
├── js/
│   ├── main.js
│   ├── courses.js
│   ├── course.js
│   ├── contact.js
│   ├── login.js
│   └── cart.js
├── data/
│   └── cursos.json
└── img/
    └── (opcional para imagens locais)
```

## Começando

1. Clone ou baixe o repositório
2. Abra `index.html` em um navegador web
3. Navegue pelo site para explorar todos os recursos

## Credenciais de Demonstração

Para a área do estudante, use as seguintes credenciais:
- **Email**: student@example.com
- **Senha**: password123

## Implementação dos Recursos

### Carrinho de Compras
- Adicionar/remover cursos
- Armazenamento persistente usando LocalStorage
- Contagem do carrinho em tempo real no cabeçalho

### Autenticação de Usuário
- Login/logout simulado
- Gerenciamento de perfil
- Persistência de sessão

### Gerenciamento de Cursos
- Dados de cursos baseados em JSON
- Pesquisa e filtragem
- Visualizações detalhadas de cursos

### Formulário de Contato
- Validação no lado do cliente
- Armazenamento de mensagens no LocalStorage

## Implantação

Este projeto está pronto para ser implantado diretamente no GitHub Pages ou em qualquer serviço de hospedagem estática.

## Licença

Este projeto é apenas para fins educacionais.