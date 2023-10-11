# Makefile para gestionar Docker Compose

# Define el archivo docker-compose.yml que se utilizará
PRO_COMPOSE_FILE = docker-compose.yml
DEV_COMPOSE_FILE = dev-compose.yml
SCRIPTS_FOLDER = ./scripts/

# Regla para iniciar los contenedores en segundo plano
up: generate_front_enviroment
	UID=${UID} GID=${GID} docker-compose -f $(PRO_COMPOSE_FILE) up -d
	@echo "lista de servicios levantados"
	docker-compose -f $(DEV_COMPOSE_FILE) ps --services

# Regla para detener y eliminar todos los contenedores
down:
	docker-compose -f $(PRO_COMPOSE_FILE) down

# Regla para ver los registros de un servicio específico
logs:
	docker-compose -f $(PRO_COMPOSE_FILE) logs -f $(service)

# Regla para ejecutar un comando en un servicio específico
exec:
	docker-compose -f $(PRO_COMPOSE_FILE) exec $(service) $(cmd)

# Regla para listar los servicios definidos en el archivo docker-compose.yml
list-services:
	docker-compose -f $(PRO_COMPOSE_FILE) ps --services

dev-list-services:
	docker-compose -f $(DEV_COMPOSE_FILE) ps --services

dev-up:
	UID=${UID} GID=${GID} docker-compose -f $(DEV_COMPOSE_FILE) up -d
	@echo "lista de servicios levantados"
	@docker-compose -f $(DEV_COMPOSE_FILE) ps --services

dev-down:
	docker-compose -f $(DEV_COMPOSE_FILE) down

dev-logs:
	docker-compose -f $(DEV_COMPOSE_FILE) logs -f $(service)

dev-exec:
	docker-compose -f $(DEV_COMPOSE_FILE) exec $(service) $(cmd)

prune: down dev-down
	docker system prune -af
	docker volume prune -f

generate_users:
	bash generate_user.sh $(num)

help:
	@echo "Uso del Makefile para gestionar Docker Compose:"
	@echo "--------------------------------------------"
	@echo "make up             - Inicia los contenedores en segundo plano."
	@echo "make down           - Detiene y elimina todos los contenedores."
	@echo "make logs service=<nombre del servicio> - Muestra los registros de un servicio específico."
	@echo "make exec service=<nombre del servicio> cmd=<comando> - Ejecuta un comando en un servicio específico."
	@echo "make list-services  - Lista los servicios definidos en el archivo docker-compose.yml."
	@echo "--------------DEV---------------------------"
	@echo "make dev-up             - Inicia los contenedores en segundo plano."
	@echo "make dev-down           - Detiene y elimina todos los contenedores."
	@echo "make dev-logs service=<nombre del servicio> - Muestra los registros de un servicio específico."
	@echo "make dev-exec service=<nombre del servicio> cmd=<comando> - Ejecuta un comando en un servicio específico."
	@echo "make dev-list-services  - Lista los servicios definidos en el archivo docker-compose.yml."
	@echo "make help           - Muestra este mensaje de ayuda (por defecto)."
	@echo "make prune 				- Hace prune"
	@echo "--------------OTHERS---------------------------"
	@echo "make generate_users num=<int> 				- Inserta n users"
	@echo "generate_front_enviroment 						- Genera el env para el frontend"

generate_front_enviroment:
	bash generate-environment.sh

.PHONY: up down logs exec list-services dev-up dev-down dev-logs dev-exec dev-list-services \
				help gen_front_env generate_users

