RUN  = docker-compose up --build -d

DOWN = docker-compose down

STOP = docker-compose stop

CLEAN = docker ps -q | xargs -r docker stop && \
        docker ps -a -q | xargs -r docker rm && \
        docker images -q | xargs -r docker rmi && \
        docker volume ls -q | xargs -r docker volume rm

#docker-compose down --rmi all


all:
	sudo mkdir -p /home/sbouabid/data/mariadb /home/sbouabid/data/wordpress
	cd srcs && $(RUN)

down:
	cd srcs && $(DOWN)

stop:
	cd srcs && $(STOP)

clean:
	$(CLEAN)


re:
	make down
	make all