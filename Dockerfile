# Use a imagem Node.js como base
FROM node:18-alpine

# Crie e defina o diretório de trabalho
WORKDIR /usr/src/app

# Copie os arquivos necessários
COPY package*.json ./

RUN npm install -g npm@latest


# Instale as dependências
RUN yarn install

# Copie todos os arquivos do projeto
COPY . .

# Construa a aplicação Next.js
RUN npm run build

# Estágio final
FROM node:18-alpine

WORKDIR /usr/src/app

EXPOSE 3000

# Copie os artefatos construídos do estágio anterior
COPY --from=0 /usr/src/app/.next ./.next

# Inicie o servidor da aplicação
CMD ["npm", "start"]
