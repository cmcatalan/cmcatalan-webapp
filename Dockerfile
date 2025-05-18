FROM node:22.15.1-alpine3.20 AS builder
WORKDIR /app
COPY . .
WORKDIR /app/cmcatalan-webapp
RUN npm install
RUN npm run build

FROM node:22.15.1-alpine3.20
WORKDIR /app
COPY --from=builder /app/cmcatalan-webapp ./
ENV NODE_ENV=production
EXPOSE 3000
CMD ["npm", "start"]