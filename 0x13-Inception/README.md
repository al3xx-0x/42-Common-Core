# Inception

infrastructure automation project using **docker** and **docker compose** to build a complete web hosting environment.   orchestrates multiple services (nginx, wordpress, mariadb) in isolated containers with custom configurations.

## description

system administration and devops project setting up a small infrastructure composed of different services.    entire project done in vm using **docker compose**, each service in dedicated container built from custom dockerfiles.

**teaches**: docker containerization, docker compose orchestration, service networking, ssl/tls configuration, database management, web server configuration, security (secrets management)

**infrastructure**: nginx (reverse proxy, tlsv1.3 ssl), wordpress (cms, php-fpm), mariadb (database), docker volumes (persistent storage), docker networks (isolated communication), docker secrets (secure credentials)

**security**: tlsv1.3 only, self-signed ssl certificates, docker secrets, isolated bridge network, no default passwords, container restart policies

## project structure

```
0x13-inception/
├── makefile                          # build automation
├── secrets/                          # credentials (not in git)
│   ├── db_password.txt, db_root_password.txt, wordpress_password.txt, wordpress_root_password.txt
└── srcs/
    ├── docker-compose.yml           # service orchestration
    ├── . env                         # environment variables
    └── requirements/
        ├── mariadb/                 # dockerfile, tools/mariadb. sh
        ├── nginx/                   # dockerfile, conf/nginx.conf
        └── wordpress/               # dockerfile, tools/wordpress.sh
```

## getting started

**prerequisites**: docker, docker compose, linux/unix (debian-based), sudo privileges

**installation**:
```bash
# 1. create secrets (replace with secure passwords)
mkdir -p secrets
echo "your_db_password" > secrets/db_password.txt
echo "your_db_root_password" > secrets/db_root_password.txt
echo "your_wp_password" > secrets/wordpress_password.txt
echo "your_wp_admin_password" > secrets/wordpress_root_password.txt
chmod 600 secrets/*

# 2. configure srcs/. env
DOMAIN=sbouabid.42. fr
MARIADB_NM=wordpress_db
MARIADB_USER=wp_user
WEBSITE_NAME=my inception blog
ADMIN_NAME=admin
ADMIN_EMAIL=admin@sbouabid.42.fr
NUSER_NAME=author
NUSER_EMAIL=author@sbouabid.42. fr

# 3. update hosts file
sudo echo "127.0.0.1 sbouabid.42.fr" >> /etc/hosts

# 4. build and start
make          # build and start all services
make stop     # stop services
make down     # stop and remove containers
make clean    # full cleanup (containers, images, volumes)
make re       # rebuild everything
```

## usage

**access services**:
- wordpress: `https://sbouabid.42. fr` (accept self-signed cert warning)
- admin dashboard: `https://sbouabid.42.fr/wp-admin` (username/password from . env and secrets)

**docker commands**:
```bash
docker ps                                    # running containers
docker logs nginx/wordpress/mariadb          # container logs
docker exec -it mariadb mysql -u root -p     # execute in container
docker volume ls                             # view volumes
docker network inspect srcs_my-network       # inspect network
```

## configuration details

**nginx** (`nginx. conf`): listen 443 ssl, tlsv1.3 only, ssl certificate/key, server_name sbouabid.42.fr, root /var/www/wordpress, fastcgi_pass wordpress:9000

**mariadb** (`mariadb. sh`): start mariadb → create database/user → grant privileges → restart with network binding (0.0.0.0)

**wordpress** (`wordpress.sh`): download wp-cli → download wordpress core → create wp-config. php → install with admin user → create author user → configure php-fpm on port 9000

**docker-compose**:
- services: nginx (443:443, depends on wordpress), wordpress (depends on mariadb), mariadb
- volumes: mariadb (/home/sbouabid/data/mariadb), wordpress (/home/sbouabid/data/wordpress)
- secrets: db_user_pass, db_root_pass, wp_admin_pass, wp_user_pass (from ../secrets/*. txt)
- network: my-network (bridge driver)

## service communication flow

```
browser (https) → nginx (443) [ssl/tls termination] → wordpress (9000) [php-fpm] → mariadb (3306) [database]
```

**data persistence**: host `/home/sbouabid/data/*` bind mount to container `/var/lib/mysql` or `/var/www/wordpress`

**secret management**: host `secrets/*. txt` → docker secret → container `/run/secrets/*` → script reads

## testing

**verify containers**: `docker ps` (should show nginx, wordpress, mariadb), `docker inspect <container> | grep status`  
**verify volumes**: `docker volume ls`, `ls -la /home/$user/data/mariadb`, `ls -la /home/$user/data/wordpress`  
**verify network**: `docker network ls | grep my-network`, `docker network inspect srcs_my-network`  
**verify services**:
- nginx: `docker exec nginx netstat -tuln | grep 443`, `openssl s_client -connect sbouabid.42.fr:443 -tls1_3`
- wordpress: `docker exec wordpress ps aux | grep php-fpm`, `docker exec wordpress wp --info --allow-root`
- mariadb: `docker exec -it mariadb mysql -u wp_user -p`, `docker exec mariadb mysql -u root -p -e "show databases;"`

**browser**: navigate to `https://sbouabid.42.fr`, accept cert, verify site loads, login to `/wp-admin`, create test post, verify persistence after `make re`

## troubleshooting

**containers won't start**: check logs (`docker logs <container>`), verify docker-compose config  
**cannot connect to mariadb**: check mariadb running (`docker exec mariadb mysqladmin -u root -p ping`), verify network (`docker exec wordpress ping mariadb`), check credentials  
**wordpress installation fails**: check logs, verify database exists, manual install with wp-cli  
**ssl certificate errors**: regenerate cert (`docker exec nginx openssl req... `), restart nginx  
**permission denied on volumes**: fix permissions (`sudo chown -R $user:$user /home/$user/data/*`), or `make clean && make`

## key concepts

**docker containers**: isolation, portability, resource efficiency, immutability (data persists in volumes)  
**docker compose**: multi-container orchestration, declarative yaml config, dependency management, automatic service discovery  
**docker volumes**: persistence, sharing, backup, better performance than bind mounts  
**docker secrets**: encrypted storage, access control, read-only in containers, centralized management  
**networking**: bridge network, service discovery by name, isolation, port mapping (443 only exposed)

## requirements

**mandatory**: docker/compose, custom debian dockerfiles, tlsv1.3 only, separate volumes, docker network, no infinite loops, restart policy, domain configuration  
**forbidden**: pre-built docker images (except base os), dockerhub images for services, passwords in dockerfiles, `latest` tag, network host/links

**resource usage**: nginx (~10-20 mb ram), wordpress (~50-100 mb ram), mariadb (~100-200 mb ram), images (~500 mb), volumes (~100 mb initial)

**security**: ✅ tlsv1. 3, docker secrets, isolated network, no exposed db port, restricted permissions, restart policies.  **improvements**: valid ssl (let's encrypt), rate limiting, firewall, regular updates, backups, monitoring

---

**grade**: validated ✅  
**developed by**: sbouabid
**created**: february 25, 2025
*"infrastructure automation with docker - the modern way!"* 🐳