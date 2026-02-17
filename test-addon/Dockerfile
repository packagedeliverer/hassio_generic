ARG BUILD_FROM
FROM $BUILD_FROM

# Install nginx
RUN apk add --no-cache nginx

# Copy run script
COPY run.sh /
RUN chmod a+x /run.sh

# Copy web content
COPY index.html /var/www/html/

CMD [ "/run.sh" ]