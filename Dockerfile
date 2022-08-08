# See the README.md for usage and configuration info

FROM node:16-alpine

WORKDIR /app

RUN addgroup -S stridergroup && adduser -S strideruser -G stridergroup && \
	chown -R strideruser:stridergroup /app

# Set non-root user
USER strideruser


COPY --chown=strideruser:stridergroup . /app


RUN npm install

# Starts the service
CMD ["npm", "start"]
