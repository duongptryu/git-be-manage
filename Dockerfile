FROM node:16-alpine
RUN mkdir -p /home/node/app/node_modules
WORKDIR /home/node/app
COPY package*.json ./
RUN npm install
COPY . .
RUN npx prisma generate
# RUN npx prisma db push
EXPOSE 3000
# CMD ["node", "src/index.js" ]