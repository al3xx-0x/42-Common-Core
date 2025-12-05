FROM debian:11

RUN apt-get update && apt-get upgrade -y

RUN apt-get install -y nginx openssl

RUN mkdir -p /etc/nginx/ssl

# generate the ssl certificate
RUN openssl req -x509 -nodes -keyout /etc/nginx/ssl/nginx-selfsigned.key -out /etc/nginx/ssl/nginx-selfsigned.crt -subj "/CN=sbouabid.42.fr"
# -x509: Outputs a self-signed certificate instead of a certificate request. / -nodes: Skips the option to encrypt the private key.
#openssl req This starts the process of creating an SSL certificate request
# -x509 creating a Certificate Signing Request this directly generates a self-signed certificate
# -nodes  stands for "No DES encryption" (No DES = No password protection).
# Saves the generated private key to /etc/nginx/ssl/nginx-selfsigned.key.
# Saves the self-signed SSL certificate to /etc/nginx/ssl/nginx-selfsigned.crt
# This sets the Common Name (CN) to sbouabid.42.fr, meaning the certificate is for this domain.

COPY ./conf/nginx.conf /etc/nginx/nginx.conf

RUN chmod 644 /etc/nginx/nginx.conf

ENTRYPOINT ["nginx", "-g", "daemon off;"]