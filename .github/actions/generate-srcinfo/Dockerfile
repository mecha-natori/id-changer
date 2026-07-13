FROM archlinux:latest
RUN pacman -Syu --noconfirm --needed base-devel
RUN useradd builder -m \
    && echo "builder ALL=(ALL) NOPASSWD: ALL" >>/etc/sudoers
COPY ./entrypoint.sh /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]
