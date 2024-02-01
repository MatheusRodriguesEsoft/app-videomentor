# Use a imagem Node.js como base
FROM node:18-alpine

# Crie e defina o diretório de trabalho
WORKDIR /app

# Copie os arquivos necessários
COPY package*.json ./

RUN npm install -g npm@latest

# Instale as dependências
RUN yarn install

# Copie todos os arquivos do projeto
COPY . .

# Construa a aplicação Next.js
RUN npm run build

COPY .next ./.next

# Inicie o servidor da aplicação
CMD ["npm", "start"]
