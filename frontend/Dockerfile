# Build dependencies

FROM node:10-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm install --production
RUN npm run postinstall

# Real image building

FROM nginx:1.15.8

# Install curl for healthcheck
RUN apt-get update
RUN apt-get install curl -y

# Clean the image
RUN apt-get clean autoclean
RUN apt-get autoremove --yes
RUN rm -rf /var/lib/{apt,dpkg,cache,log}/
RUN rm -rf /var/lib/apt/lists/*

COPY . /usr/share/nginx/html
COPY --from=builder /app/static /usr/share/nginx/html/static

ARG BACKENDHOST="http://localhost:8081"
ARG ENABLE_NEWS="true"
ARG ENABLE_FILE_UPLOAD="true"
ARG ENABLE_GUESS_FILE="true"
ARG ENABLE_SHARE_CONF="true"

RUN sed -i '1s!.*!const api_url="'$BACKENDHOST'";!' /usr/share/nginx/html/js/main.js
RUN sed -i '2s/.*/const enable_news = '$ENABLE_NEWS';/' /usr/share/nginx/html/js/main.js
RUN sed -i '3s/.*/const enable_file_upload = '$ENABLE_FILE_UPLOAD';/' /usr/share/nginx/html/js/main.js
RUN sed -i '4s/.*/const enable_guess_file = '$ENABLE_GUESS_FILE';/' /usr/share/nginx/html/js/main.js
RUN sed -i '5s/.*/const enable_share_conf = '$ENABLE_SHARE_CONF';/' /usr/share/nginx/html/js/main.js

HEALTHCHECK --interval=30s --timeout=3s CMD curl -f http://localhost/ || exit 1