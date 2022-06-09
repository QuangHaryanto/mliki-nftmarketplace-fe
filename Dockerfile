FROM node:16 as build-deps
WORKDIR /usr/src/app
COPY . ./
RUN yarn
RUN yarn build
FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build-deps /usr/src/app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]