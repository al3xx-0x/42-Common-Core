FROM owasp/modsecurity-crs:nginx-alpine

USER root

RUN mkdir -p /etc/nginx/ssl
RUN openssl req -x509 -nodes -keyout /etc/nginx/ssl/nginx-selfsigned.key -out /etc/nginx/ssl/nginx-selfsigned.crt -subj "/CN=e3r1p1.1337.ma" && \
    chmod 644 /etc/nginx/ssl/nginx-selfsigned.crt && \
    chmod 600 /etc/nginx/ssl/nginx-selfsigned.key && \
    chown nginx:nginx /etc/nginx/ssl/nginx-selfsigned.key /etc/nginx/ssl/nginx-selfsigned.crt

# Fix modsecurity being disabled
RUN sed -i 's/modsecurity off;/modsecurity on;/g' /etc/nginx/nginx.conf

# Create log directory
RUN mkdir -p /var/log/modsec && chown nginx:nginx /var/log/modsec

# Disable method enforcement completely
RUN echo 'SecRuleRemoveById 911100' > /etc/modsecurity.d/99-methods.conf

# Copy your configuration
COPY def.conf /etc/nginx/templates/conf.d/default.conf.template
COPY redirect.conf /etc/nginx/templates/conf.d/redirect.conf.template

USER nginx