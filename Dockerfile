FROM node:18-alpine3.16

WORKDIR /home/node

COPY . .

RUN npm ci \
    && npm run build \
    && npm prune --production

EXPOSE 3000

CMD ["npm", "run", "start:prod"]