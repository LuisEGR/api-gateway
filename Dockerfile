FROM node:8.15.0-alpine
ADD . .
EXPOSE 4000
ENV FORCE_COLOR 1
ENV PORT 4000
ENTRYPOINT ["node", "dist/index.js"]