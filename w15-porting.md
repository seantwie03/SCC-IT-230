# W15 - Port

## Prompt

Plan w15 as something new: put what students learned all semester into action by running a self-hosted web application with a three-tier architecture (database, app server, reverse proxy), installed the RHEL way where that reviews the most, and in a container where w14 prepared for it. The application is Forgejo. This file is a stub that records the decisions made on 2026-11-15 while w14 was being built; nothing is built.

## Answer in brief

**Stub, 2026-11-15.** No slides, exercises, or fragments yet, and no source deck: w15 is new material, not a port. The lesson plan in `~/s/IT-230/w15/` covers RH134 chapter 18, *Working with Image-Based RHEL*, and the chapter 19 comprehensive review; whether this week replaces chapter 18 is Open question 1.

What is settled:

1. **Forgejo** is the application (Decision 1).
2. **Three tiers on two hosts:** MariaDB on `serverb`; Forgejo in a rootless container on `servera`, run as a service of a user of its own; httpd on `servera` as the reverse proxy (Decision 2).
3. **Only the app tier is a container.** The database and the proxy are installed with `dnf`, so their installs review packages, systemd, the firewall, and SELinux (Decision 3).
4. **No Compose and no Quadlet.** The slides and exercises do the translation from Forgejo's Compose examples to `podman` commands (Decision 4).
5. **W14 carries the container half.** Its fragment 5, Containers as Services, teaches `podman generate systemd` and lingering, which is how the app tier starts at boot (Decision 5).

## Scope

The goal is review, not new administration skills: the install itself walks through the semester's weeks once more before the Final. New material is limited to what the application needs: what a three-tier application is, Forgejo's configuration, MariaDB's database and user creation, and httpd's `ProxyPass`.

Not taught (2026-11-15): Docker Compose files, Quadlet, named volumes, container networks, pods, `podman secret`, `skopeo`, and writing a systemd unit file by hand.

## Decisions

Recorded 2026-11-15 from your answers while planning.

1. **Forgejo, not Gitea or Vikunja.** Forgejo is fully open source, with no community and enterprise editions to account for. Vikunja was the other candidate; Forgejo has more review hooks (a `git` service account, SSH keys, log files).
2. **Architecture.**
   - **Data tier:** MariaDB from RHEL 10's AppStream (`mariadb-server`, 10.11.11) on `serverb`, a host of its own, so the data tier is visibly separate.
   - **App tier:** Forgejo's container image on `servera`, run rootless by a dedicated user with `--network host`, so it reaches `serverb` and is reached by the proxy on `servera` without port mapping.
   - **Proxy tier:** httpd on `servera` with `ProxyPass` to Forgejo, the only tier the firewall opens to other hosts.
3. **Containers for the app tier only.** You want the week to use what the semester taught, and a container per tier would hide most of it behind a few lines of Compose.
4. **No Compose, no Quadlet.** RHEL 10 has no Compose provider (Round 0). Forgejo documents its container installs as Compose files; the slides and exercises present the equivalent `podman run` with its `-e` settings, so students never read or translate a Compose file.
5. **The app tier becomes a service with w14's method:** `podman generate systemd --new --files --name` with Podman's network-wait options, `systemctl --user enable --now`, and `loginctl enable-linger` for the dedicated user. No unit file is written by hand, which you preferred.
6. **App data on a `:Z` bind mount**, as w14 teaches, not a named volume, which you judged one storage topic too many. Whether Forgejo's image can write to a bind mount when run rootless is Open question 2.

## Proposed shape

Not yet decided; carried from the 2026-11-15 discussion.

- **In class, about 75 minutes:** the three tiers in order (database, app, proxy), then a reboot that everything must survive.
- **As the week's assignment:** operating it, from the list below.

Each step and the week that taught it:

- **Hosts:** a logical volume for MariaDB's data on `serverb`, mounted by UUID in `/etc/fstab` (w10, w11), and relabeled for SELinux (w06); a `tuned` profile (w05); time synchronization with `chronyd`, which Forgejo's two-factor codes depend on (w05); a persistent journal (w05); a name for the site in `workstation`'s `/etc/hosts` (RH124).
- **Data tier:** `dnf install mariadb-server` and `systemctl enable --now` (w04); a database and a user allowed from `servera`'s address; `firewall-cmd --permanent --add-service=mysql` on `serverb` (w07).
- **App tier:** a user and password for the service (RH124); logging in as that user with SSH (w14); `podman run` with `-e` settings, `--network host`, and a `:Z` mount (w14); `generate systemd` and lingering (w14).
- **Proxy tier:** a virtual host with `ProxyPass` (w05); `setsebool -P httpd_can_network_connect on` after finding the denial (w06); `firewall-cmd --permanent --add-service=http` (w07).
- **Operating it:** a backup script that dumps the database to a dated, compressed file and keeps the last seven (w03, w06), run under `nice` (w05) from a systemd timer or cron (w04); copying the dump to another host with `rsync` or `sftp` over SSH keys (w02); a restore test; a `logrotate` drop-in for the backup's log (w05); a `sudo` drop-in that lets an operator group restart the services (w01); `grep` and regular expressions on the proxy's access log (w02); the reboot test, with `multi-user.target` and the user's `default.target` (w12).

Left out as forced: partitions and swap, root password reset, GRUB, Flatpak, `at`, and password aging.

## Verification

**Round 0, 2026-11-15**, done while planning w14; details in `w14-porting.md`, Round 8. Every side test was restored.

- RHEL 10's repositories have `mariadb-server` 10.11.11, `postgresql-server` 16.8, `httpd` 2.4.63, `nginx` 1.26.3, and `git` 2.47.1, and no `podman-compose` or `docker-compose`; `podman compose` fails with "looking up compose provider failed".
- A rootless container with `--network host` reached a server on its host's `127.0.0.1:3306` with SELinux enforcing, and a server on another host's port 3306 once that host's firewall allowed `mysql`. The other host saw the connection come from the container's host address, so the MariaDB user must be allowed from `servera`'s address, 172.25.250.10.
- `podman generate systemd --new` with `--wants` and `--after podman-user-wait-network-online.service`, plus `loginctl enable-linger`, brought a rootless container's service back after a reboot with nobody logged in. Without the two options, the container started before the network and its published port gave empty replies; `--network host` was not tested across a reboot.
- On a `:Z` bind mount from a home directory, Docker Hub's `postgres:16`, whose entry point starts as `root`, initialized its data but left the directory owned by a subordinate UID that the user could not list or delete without `podman unshare`. A container running as a regular user from the start could not write to such a mount at all.

## Open questions

1. **Chapter 18.** Does the application replace image mode for RHEL (RH134 chapter 18) this year, and do the chapter 19 review labs stay as the week's RHA assignment?
2. **Forgejo's image and its data.** Which image, from which registry, at which pinned version, and does it run rootless with its data on a `:Z` bind mount? An image that starts as `root` and changes ownership should run but leave a directory the service user cannot clean up; one that runs as a regular user may not start at all (Round 0). To verify before anything is planned around it.
3. **Git over SSH.** Forgejo's SSH clone is the week's hook for SSH keys, but `servera`'s own `sshd` holds port 22, and with `--network host` the container's SSH server needs another port, opened in the firewall. Keep it, or clone over HTTP only?
4. **MariaDB or PostgreSQL.** MariaDB is assumed because its users and passwords are set up in SQL alone; PostgreSQL on RHEL also needs `postgresql-setup --initdb` and a `pg_hba.conf` edit, to verify.
5. **Where backups go,** and with `rsync` or `sftp`.
6. **The in-class and assignment split,** and whether the SCC lab assignment for w15 changes with it.
