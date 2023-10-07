# Stage 1
FROM node:18 as node
WORKDIR /app

COPY ./dev /app

RUN npm install
RUN npm run build --prod

# Stage 2
FROM nginx:alpine
RUN rm -rf /usr/share/nginx/html/*
COPY --from=node app/dist/pandemic /usr/share/nginx/html
