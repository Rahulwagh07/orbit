# WebRTC runtime agent
# Base: chromium runtime image (Xvfb, chromium, fluxbox, ffmpeg, xdotool, node 18)
# Build from repo root: docker build -f runtime/agent/Dockerfile -t orbit-chromium .
FROM orbit-chromium

USER root
WORKDIR /home/orbit

RUN rm -rf node_modules
RUN apt-get update \
  && apt-get install -y --no-install-recommends pulseaudio pulseaudio-utils \
  && rm -rf /var/lib/apt/lists/*

COPY runtime/agent/package.json runtime/agent/tsconfig.json ./
COPY runtime/agent/src ./src
COPY packages/typescript-config ./packages/typescript-config

RUN sed -i 's|"extends": "../../packages/typescript-config/base.json"|"extends": "./packages/typescript-config/base.json"|' tsconfig.json
RUN npm install --no-audit --no-fund
RUN npm run build
RUN rm -rf src packages && chown -R orbit:orbit /home/orbit

USER orbit

EXPOSE 8080

ENV APP_COMMAND=chromium
ENV APP_WINDOW_CLASS=chromium

CMD ["node", "dist/index.js"]
