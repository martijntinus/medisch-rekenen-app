FROM debian:bookworm-slim
LABEL org.opencontainers.image.title="Medisch Rekenen App" \
      org.opencontainers.image.description="Mobile-first statische HBO-V oefenapp zonder accounts of database" \
      org.opencontainers.image.version="0.2.2"
ENV PORT=8912
RUN apt-get update \
  && apt-get install -y --no-install-recommends busybox-static ca-certificates \
  && rm -rf /var/lib/apt/lists/* \
  && groupadd --system --gid 1001 app \
  && useradd --system --uid 1001 --gid app --home-dir /app --shell /usr/sbin/nologin app
WORKDIR /app
COPY --chown=app:app dist/ ./
USER app
EXPOSE 8912
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 CMD /bin/busybox wget -qO- http://127.0.0.1:8912/ >/dev/null || exit 1
CMD ["/bin/busybox", "httpd", "-f", "-p", "0.0.0.0:8912", "-h", "/app"]
