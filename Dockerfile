FROM alpine:3.6

ENV NODE_ENV production
WORKDIR /var/www
COPY . /var/www
RUN mkdir /var/www/config
VOLUME /var/www/config

# Install
RUN apk update; apk upgrade
RUN apk add nodejs nodejs-npm git; npm install npm@latest -g --silent; npm install forever -g; npm install --only=prod; npm install --only=dev
RUN apk add dos2unix --update-cache --repository http://dl-3.alpinelinux.org/alpine/edge/community/ --allow-untrusted
# Build
RUN npm run build
RUN dos2unix /var/www/launch.sh
# Clean up
RUN npm prune --production; apk del nodejs-npm git dos2unix
# Permissions
RUN chmod +x /var/www/*.sh

ENV ACTIVITYLOGGER_ROOTSIGNATURE /var/www/config/root-public.key
ENV ACTIVITYLOGGER_ARANGODB http+tcp://127.0.0.1:8529
ENV ACTIVITYLOGGER_PUBLICURL https://allog.zaibot.net
EXPOSE 8080
VOLUME /var/www/config
CMD ["/bin/sh","-c","/var/www/launch.sh"]
