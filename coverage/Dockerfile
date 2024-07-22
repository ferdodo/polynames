FROM polynames-core
RUN npx stryker run

FROM nginx
COPY --from=0 /polynames/core/reports/mutation /usr/share/nginx/html