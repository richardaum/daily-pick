ARG GOLDEN_IMG_TAG
ARG GOLDEN_IMG_NODE_VERSION
ARG CI_REGISTRY

# Build -----------------------------------------------------------------------
FROM node:${GOLDEN_IMG_NODE_VERSION}-alpine AS builder

WORKDIR /app

# Install dependencies to build
COPY package.json yarn.lock .yarnrc.yml .
COPY .yarn .yarn
RUN yarn --immutable

# Build with all source files
COPY . .
RUN npm run build

# Pre production ---------------------------------------------------------------
FROM node:${GOLDEN_IMG_NODE_VERSION}-alpine AS safe

WORKDIR /app

# Install dependencies to production
COPY package.json yarn.lock .yarnrc.yml . .
COPY .yarn .yarn
RUN yarn workspaces focus --production

# Production ------------------------------------------------------------------
FROM ${CI_REGISTRY}/ifood/docker-images/golden/nodejs/${GOLDEN_IMG_NODE_VERSION}:${GOLDEN_IMG_TAG} AS production
# FROM node:${GOLDEN_IMG_NODE_VERSION}-alpine AS production
ARG NODE_ENV
ENV NODE_ENV $NODE_ENV

WORKDIR /app/app

COPY --from=safe /app/node_modules ./node_modules
COPY --from=builder /app/build ./build
# COPY --from=builder /app/packages ./packages
# COPY --from=builder /app/start.sh .

EXPOSE 3000

ENTRYPOINT ["/executor", "NODE_ENV=production node build/main/index.js"]
# ENTRYPOINT ["sh", "-c", "node dist/slack-bot --cwd dist/slack-bot"]
# ENTRYPOINT ["./start.sh"]
