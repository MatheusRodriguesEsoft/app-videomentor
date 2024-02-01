# Use a imagem Node.js como base
FROM node:18-alpine

# Crie e defina o diretório de trabalho
WORKDIR /usr/src/app

# Copie os arquivos necessários
COPY package*.json ./

# Instale as dependências
RUN npm install

# Copie todos os arquivos do projeto
COPY . .

# Construa a aplicação Next.js
RUN npm run build

# Exponha a porta onde a aplicação Next.js estará executando
EXPOSE 3000

# Inicie o servidor da aplicação
CMD ["npm", "start"]
