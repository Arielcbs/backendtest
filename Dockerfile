# See the README.md for usage and configuration info

FROM node:16-alpine

WORKDIR /app

RUN addgroup -S testgroup && adduser -S testuser -G testgroup && \
	chown -R testuser:testgroup /app

# Set non-root user
USER testuser


COPY --chown=testuser:testgroup . /app


RUN npm install

# Starts the service
CMD ["npm", "start"]
