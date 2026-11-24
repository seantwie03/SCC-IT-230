# W15 - Port

This week we will review the material we've learned this semester by putting it into action! We will run and operate a self-hosted GitHub alternative called Forgejo (for-JEH-yo).

## Prompt

Plan w15 as something new: put what students learned all semester into action by running a self-hosted web application with a three-tier architecture (database, app server, reverse proxy), installed the RHEL way where that reviews the most, and in a container where w14 prepared for it. The application is Forgejo. This file is a stub: it records the decisions made on 2026-11-15 while w14 was being built and your answers of 2026-11-19. Nothing is built.

## Answer in brief

**Updated 2026-11-24.** Fragments 1 to 4 are built and fragments 5 and 6 are drafted; all four exercises are recorded, and two have their written versions. There is no source deck: w15 is new material, not a port. It takes the place of RH134 chapter 18, *Working with Image-Based RHEL*, which the lesson plan in `~/s/IT-230/w15/` covered; RHA's chapter 19 review labs are the week's homework (Decision 7).

What is settled:

1. **Forgejo** is the application (Decision 1).
2. **Three tiers on two hosts:** PostgreSQL on `serverb`, with its data on a logical volume built on a new partition; Forgejo in a rootless container on `servera`, run as a service of a user of its own, with its files on a second logical volume on `serverb`, shared over NFS and automounted on `servera`, so all of Forgejo's data lives on the data tier; httpd on `servera` as the reverse proxy (Decisions 2, 10, 13, and 26).
3. **Only the app tier is a container.** The database and the proxy are installed with `dnf`, so their installs review packages, systemd, the firewall, and SELinux (Decision 3).
4. **No Compose and no Quadlet.** The slides and exercises do the translation from Forgejo's Compose examples to `podman` commands (Decision 4).
5. **W14 carries the container half.** Its fragment 5, Containers as Services, teaches `podman generate systemd` and lingering, which is how the app tier starts at boot (Decision 5).
6. **The install is the lesson.** Everything happens in class. Using Forgejo, such as cloning over its SSH server, comes only if time allows, which it probably will not (Decisions 9 and 12).
7. **Backups go to `servera`:** a script in `root`'s crontab on `serverb` dumps the database and copies the dump with `rsync` over the SSH keys every lab environment already gives `root` (Decision 11).
8. **One exercise chain, tier by tier.** Each tier opens with the host configuration it needs, and the operating steps come last, where they can be cut on the day (Decisions 16 and 27).
9. **Aligned to RH134 chapter 19,** *Comprehensive Review*, with no Cert Guide chapter (Decision 17).

The week is built in the order under "Build order". Step 1 is done: its three unknowns are answered (Round 5), and the command files are written and verified in chain order (Round 6; see "Exercises"); there are four since Decision 27 dropped the reboot exercise. Decision 26, Forgejo's data on `serverb` over NFS, was accepted on 2026-11-21, and Build the Data Tier and Build the App Tier were rewritten for it (Round 11). All four exercises are recorded (Rounds 15, 16, and 20), Operate Forgejo's with the backup that also takes Forgejo's files (Decision 28). Steps 2 and 3 are done (see "Classification" and "New material"; Decision 29 accepted). Step 4, the slides, is under way: fragments 1 to 4 are built, with 45 slides between them, and fragment 5 is next (see "Slides"). Decisions 1 to 30 are all settled; none awaits your call.

## Scope

The goal is review, not new administration skills: the install itself walks through the semester's weeks once more before the Final. New material is limited to what the application needs: what a three-tier application is, Forgejo's configuration, PostgreSQL's setup (`systemctl edit` to point it at its data, `postgresql-setup --initdb`, `listen_addresses`, a `pg_hba.conf` line, and a database with its user, created in `psql`), and httpd's `ProxyPass`. PostgreSQL gets a short fragment of its own (Decision 24).

Not taught (2026-11-15): Docker Compose files, Quadlet, named volumes, container networks, pods, `podman secret`, `skopeo`, and writing a systemd unit file by hand.

## Build order

Agreed 2026-11-19. W15 has no source deck, so it is built backwards from its commands, and each step can send changes back to the one before it.

1. **Command files** (done 2026-11-19; see "Exercises"). First, test on the lab the three unknowns that could change the design: Forgejo's image on a rootless bind mount (Decision 8), the port its SSH server takes (Decision 9), and how `servera` authenticates to PostgreSQL (Decision 10). Then write one command file per stage, in chain order: data tier, app tier, web tier, and operating it (a reboot test was the fourth until Decision 27). Each is its own exercise, recorded and cut on its own (Decision 16). Estimate each file's time as soon as it exists, from its presses at 3 seconds each plus its pauses, so the scope is settled before any slide is written. No cleanup exercise (Decision 19).
2. **Classify every concept, command, and flag** (done 2026-11-21; see "Classification") the files run, against a fixed baseline: the published w01 to w14 slides and exercises count as taught, and RH124 as prerequisite. Each is tagged **Review**, with the week and fragment that taught it, found by searching the course; **Prerequisite**, for RH124; or **New**.
3. **Decide what each new item gets** (done 2026-11-21, Decision 29; see "New material"). A new concept gets a slide of its own. A new but obvious item, such as a self-explanatory flag, gets a line in a per-tier "New in this tier" table. Review items go in a per-tier table naming the week that taught each one, which is the review itself. Where a new item costs more than it teaches, step 1's command changes to one the course already taught.
4. **Write the slides:** six fragments, each aligned to RH134 chapter 19 (Decision 17) and closing with its exercises and their recordings. The outline is a draft that steps 1 to 3 will change.
   1. **Intro:** self-hosting; home labs; N-tier architecture for web applications; Forgejo; and this week's Forgejo architecture, drawn once as the diagram each later section opens with, its own tier highlighted.
   2. **Data tier:** the purpose it serves and what matters at this tier, such as storage and backups; then the new material step 3 keeps.
   3. **PostgreSQL:** the short fragment of Decision 24, closing with Build the Data Tier (placement proposed in Decision 25).
   4. **App tier:** the same shape as the data tier.
   5. **Web tier:** the same shape. Its theme, from your direction on 2026-11-21: why a reverse proxy at all. An application's built-in web server, like Forgejo's, is made to run the application, not to face the network; dedicated web servers such as Apache httpd and nginx are hardened and full-featured for that job, so they stand in front. In this design Forgejo listens on port 3000 (and its SSH server on 2222) on every address, but `servera`'s firewall opens only `http`, so nobody outside `servera` can reach Forgejo directly; httpd on port 80 forwards each request to `127.0.0.1:3000`. Verified read-only on 2026-11-21, at the end of your app tier recording: `ss` showed `*:3000` and `*:2222`, the firewall listed only `cockpit dhcpv6-client ssh`, `curl` from `workstation` to `servera:3000` failed with "Could not connect to server", and on `servera` it answered 200. A second reason fits the week: a rootless container cannot listen below port 1024 (`/proc/sys/net/ipv4/ip_unprivileged_port_start` is 1024; Round 5 saw Forgejo's SSH server fail to bind port 22), so the app tier cannot serve port 80 itself.
   6. **Operationalize:** running an app in production: backups, logging, and security, the last a recap of what the tiers already did (only the web port open, a rootless container, a dedicated user, SELinux enforcing); then the new material step 3 keeps.

Recordings come last, as in every week.

## Decisions

Decisions 1 to 6 were recorded on 2026-11-15 from your answers while planning. Decisions 7 to 20 were recorded on 2026-11-19 from your answers to Open questions 1 to 7, your guidance the same day, and your acceptance of the proposals that became Decisions 15 to 17. Decisions 21 to 23 are accepted. Decision 24 was recorded on 2026-11-21 from your request, Decision 25, its placement, is proposed, and Decision 26 was proposed and accepted the same day. Decision 30, fragment 2's redraft, was proposed and accepted on 2026-11-22.

1. **Forgejo, not Gitea or Vikunja.** Forgejo is fully open source, with no community and enterprise editions to account for. Vikunja was the other candidate; Forgejo has more review hooks: a service account, log files, and Git over SSH should the class get that far (Decision 9).
2. **Architecture.**
   - **Data tier:** PostgreSQL from RHEL 10's AppStream (`postgresql-server`, 16.8) on `serverb`, a host of its own, so the data tier is visibly separate. It was MariaDB until 2026-11-19 (Decision 10).
   - **App tier:** Forgejo's container image on `servera`, run rootless by a dedicated user with `--network host`, so it reaches `serverb` and is reached by the proxy on `servera` without port mapping.
   - **Web tier:** httpd on `servera` as a reverse proxy, with `ProxyPass` to Forgejo, the only tier the firewall opens to other hosts.
3. **Containers for the app tier only.** You want the week to use what the semester taught, and a container per tier would hide most of it behind a few lines of Compose.
4. **No Compose, no Quadlet.** RHEL 10 has no Compose provider (Round 0). Forgejo documents its container installs as Compose files; the slides and exercises present the equivalent `podman run` with its `-e` settings, so students never read or translate a Compose file.
5. **The app tier becomes a service with w14's method:** `podman generate systemd --new --files --name` with Podman's network-wait options, `systemctl --user enable --now`, and `loginctl enable-linger` for the dedicated user. No unit file is written by hand, which you preferred.
6. **App data on a `:Z` bind mount** (reversed 2026-11-21 by Decision 26: the bind mount's source is now NFS), as w14 teaches, not a named volume, which you judged one storage topic too many. Whether Forgejo's image can write to a bind mount when run rootless is to verify (Decision 8).
7. **Chapter 18 is not taught this semester** (Open question 1). Image mode for RHEL is dropped. In class, w15 puts the semester into practice as its review; RHA's chapter 19 review labs, *Comprehensive Review*, are the homework.
8. **Forgejo's image is whichever works with the fewest concepts the course has not taught** (Open question 2). You have no preference of image, registry, or version. Test the standard image first. It starts as `root` and hands its data directory to its own user, which Round 0 suggests leaves files the service user cannot delete; only the cleanup meets them, and `sudo userdel -r` removes them as `root`. The `-rootless` image may not be able to write to the bind mount at all without `--userns keep-id`, a flag w14 did not teach. Pin the version that passes. **Reversed 2026-11-21 by Decision 26**, which needs the `-rootless` image (`codeberg.org/forgejo/forgejo:15-rootless`) and `keep-id` on NFS. **Resolved 2026-11-19 (Round 5):** the standard image passes, pinned to `codeberg.org/forgejo/forgejo:15`, Forgejo's long-term-support line (15.0.12 when tested; the `15` tag follows its patch releases). The service user cannot delete the data, but `podman unshare rm -rf` and `sudo userdel -r` both can.
9. **The week is the install, not using the app** (Open question 3, and 2026-11-19). Forgejo's SSH server stays on, but the class will probably not get as far as cloning over it. Port 22 belongs to `servera`'s own `sshd`, so with `--network host` Forgejo's SSH server needs another port. Left on 22, it cannot bind and retries every second, filling the container's log. `-e SSH_PORT=2222` moves it, and Forgejo's clone URLs with it (Round 5). Since Decision 26, the `-rootless` image's own SSH server listens on 2222, and `SSH_PORT` is gone. The firewall opens 2222 only if the class gets there.
10. **PostgreSQL, not MariaDB** (Open question 4). You prefer PostgreSQL unless MariaDB is meaningfully simpler, and it is not. PostgreSQL adds three steps: `postgresql-setup --initdb`; `listen_addresses` in `postgresql.conf`, since it listens only on localhost by default; and a `pg_hba.conf` line that allows `servera`. Two of the three are configuration edits followed by a restart, which the semester practiced; only the `pg_hba.conf` line format is new. Both databases need the same SQL. Verified in Round 5: `listen_addresses = '*'`, narrowed on 2026-11-21 to `'localhost,172.25.250.11'`, `serverb`'s own loopback and lab addresses (Round 13), the line `host forgejo forgejo 172.25.250.10/32 scram-sha-256`, and the `postgresql` firewall service (port 5432) let Forgejo on `servera` in.
11. **Backups are copied to `servera` as `root`** (Open question 5, and 2026-11-19). The backup script runs from `root`'s crontab on `serverb`, and `rsync` copies each dump to `servera` over SSH. `root` already reaches every host without a password in every lab environment (`docs/lab-environments.md`, "SSH and keys"), so no key is made, and none is named. `sftp` is dropped: it is interactive.
12. **Everything in class, with no split** (Open question 6). The homework is RHA's chapter 19 labs (Decision 7).
13. **A new partition for the database** (2026-11-19). On one of `serverb`'s blank disks, a partition (w10) becomes the physical volume (w11) for the logical volume that holds PostgreSQL's data, so partitions are reviewed too. Disk names can change between boots, so the exercise starts with `lsblk`; the command file then uses `/dev/sdb`, and the written exercise has students use whichever blank disk `lsblk` shows.
14. **PostgreSQL's data on a volume mounted at `/srv/db`, placed with `systemctl edit`** (accepted 2026-11-19), so the week reviews `semanage fcontext`, which you want reviewed. The steps, run in this order in Round 3: install `postgresql-server`; make `/srv/db/pgsql`, owned by `postgres` with mode `700`; `semanage fcontext -a -t postgresql_db_t '/srv/db(/.*)?'` and `restorecon -Rv /srv/db` (w06); `systemctl edit postgresql` to add `Environment=PGDATA=/srv/db/pgsql/data` under `[Service]` (new: no week teaches drop-ins); `postgresql-setup --initdb`; `systemctl enable --now postgresql`. The rule and the relabel come before `initdb`, so its files are created with the right label. With the data one level below the mount point, `initdb` gives no warning. Without the rule, `initdb` still succeeds, but the service fails with "Permission denied", and the audit log shows why: `postgresql_t` was refused `search` on the volume's top directory, still `unlabeled_t` (Round 3). Considered and set aside: the volume mounted at `/var/lib/pgsql/data` before the install, which needs no relabel because `dnf` labels it, but makes `initdb` warn that a mount point "is usually a bad idea" and reviews no `semanage` (Rounds 1 and 2); and a symbolic link from `/var/lib/pgsql/data` to `/srv/db/pgsql/data` in place of `systemctl edit`, which works with `PGDATA` left at its default and uses only RH124's `ln -s`, but hides where the data lives from `SHOW data_directory` and the unit (Round 4).
15. **The proxy as one drop-in file, without a virtual host** (accepted 2026-11-19): as simple as possible while still a real-world configuration. W05 taught installing httpd, `httpd.conf`, and `DocumentRoot`, but not virtual hosts, and a server with one site does not need one. The file in `/etc/httpd/conf.d/` holds what Forgejo's own reverse-proxy documentation gives for Apache, and nothing more. Verified in Round 6, that is three lines: `ProxyPreserveHost On`, `AllowEncodedSlashes NoDecode` (with `nocanon`, it keeps encoded characters in repository paths intact), and `ProxyPass / http://127.0.0.1:3000/ nocanon`. The documentation's `ProxyRequests off` is Apache's default, and `ProxyPassReverse` is not needed, since Forgejo's redirects already carry `git.lab.example.com`. httpd's proxy modules are loaded by default.
16. **One exercise chain that stops cleanly after each tier** (accepted 2026-11-19). There is no separate host step: each tier opens with the host configuration it needs. In order: the data tier, the app tier, the web tier, then the operating steps (the reboot test that came fourth was dropped by Decision 27). Whenever class time runs out, something works, and the backup, `logrotate`, and log-search steps come last, where they can be cut on the day.
17. **Alignment: RH134 chapter `"19"`, *Comprehensive Review*,** on every fragment (accepted 2026-11-19), since its RHA labs are the week's homework. No Cert Guide chapter.
18. **NFS and autofs are left out** (Open question 7; reversed 2026-11-21 by Decision 26). W13 is the only taught week nothing here uses, and it stays that way.
19. **No cleanup exercise this week** (2026-11-19). The chain ends with the application running; a cleanup may be added later. Until then, the last exercise does not return the lab to the week's start, unlike every earlier week.
20. **"Web tier", not "proxy tier"** (2026-11-19), for httpd on `servera`, the more common name for the tier that faces the browser.

Proposed 2026-11-19 and accepted 2026-11-21, as your recordings use them:

21. **The install runs from the terminal.** Every Forgejo setting goes in as a `podman run -e` option, including the database, `FORGEJO__server__ROOT_URL`, and `FORGEJO__security__INSTALL_LOCK=true`, so Forgejo creates its tables at first start and never shows its install page. The first admin is created with `podman exec -u git forgejo forgejo admin user create` (Round 5). The whole install then fits in a recording, which cannot show a browser. The alternative is Forgejo's install page, filled in from a browser on `workstation`. Either way, the web tier ends with the site open in that browser, outside the recording.
22. **Names and passwords.** The site is `git.lab.example.com`, the name `workstation`'s `/etc/hosts` gives `servera`'s address. The service user on `servera` and the database user on `serverb` are both `forgejo`, with the lab's published password `redhat`. Forgejo's first admin is `student`, password `student`, email `student@lab.example.com`.
23. **Files.** The week's fragments and exercises go in `course/chapters/it230-self-hosting-forgejo/`, following the `it230-` names of the course's own material, such as `it230-apache-web-server`. The exercise stems are `build-the-data-tier`, `build-the-app-tier`, `build-the-web-tier`, and `operate-forgejo`.

Recorded 2026-11-21:

24. **A short PostgreSQL fragment** (your request, after Build the Data Tier played well), so the exercise's PostgreSQL steps are taught before it. Its topics, with what the lab has shown so far:
    - **The package:** `postgresql-server`, from AppStream (16.8 on RHEL 10.0). It requires `postgresql`, which holds the client `psql`, so one `dnf install` brings both (Round 7).
    - **What the install creates:** the `postgres` account, PostgreSQL's administrator (UID 26, home `/var/lib/pgsql`); the `postgresql` service, not yet enabled; and the default data directory, `/var/lib/pgsql/data`, empty until it is initialized (Rounds 2 and 7).
    - **SELinux:** `postgresql_db_t`, and the rule that gives it to `/var/lib/pgsql`, come with RHEL's own policy, the `postgresql` module of `selinux-policy-targeted`, not with the package: `postgresql-server` ships no SELinux files, and the rule was in place on `serverb` before PostgreSQL was installed. Installing the package applies the label to what the package creates. A data directory anywhere else gets no rule, which is why the exercise adds one (Rounds 1 and 7; Decision 14).
    - **Initializing:** `postgresql-setup --initdb` creates the database files in the service's `PGDATA`, and `systemctl edit` points `PGDATA` at the logical volume (Decision 14).
    - **The two configuration files the exercise edits,** both in the data directory beside `pg_ident.conf` and `postgresql.auto.conf`: `postgresql.conf`, the server's settings, where `listen_addresses` defaults to `localhost`; and `pg_hba.conf`, which says who may connect from where and how. Each `pg_hba.conf` line has a connection type, database, user, client address, and authentication method; the defaults allow local connections with `peer` and network ones from this host only, with `ident` (Round 5).
    - **psql:** PostgreSQL's command-line client. As `postgres`, after `su - postgres`, `psql` connects to the server over its local socket, with `peer` authentication matching the Linux user to the database user. An SQL statement ends with `;`. Commands starting with a backslash, such as `\q` to quit, belong to `psql` itself and take none.
    - **The exercise's SQL:** `CREATE USER forgejo WITH PASSWORD 'redhat';` and `CREATE DATABASE forgejo OWNER forgejo;`.
    - **The network:** port 5432 and the firewall service `postgresql` (Round 5).

Proposed 2026-11-21; Decisions 25 and 26 were accepted the same day, and Decision 27 is yours from the same day:

25. **Where the PostgreSQL fragment goes** (accepted 2026-11-21): right after the data tier's fragment, and closing with Build the Data Tier, which moves from the end of the data tier's fragment to the end of this one. The week then has six fragments: Intro, Data tier, PostgreSQL, App tier, Web tier, and Operationalize. The data tier's fragment says what the tier is for and what matters there; the PostgreSQL fragment teaches the tool the exercise uses. The alternative is PostgreSQL's slides inside the data tier's fragment, with no section slide of their own.
26. **Forgejo's data on `serverb`, over NFS** (your idea, 2026-11-21; tested in Rounds 9 and 10; **accepted 2026-11-21** with automount and `--restart-sec 10`, and built in Round 11), so the database and Forgejo's files, its repositories included, both live on the data tier, the app tier holds no state, and w13 is reviewed after all. What works:
    - **`serverb`** exports a logical volume of Forgejo's own: `vg_data` (renamed from `vg_db`) holds a 2 GiB `lv_db` and `lv_forgejo` from the rest of `sdb`, mounted at `/srv/forgejo`, owned by `forgejo`, and relabeled with `restorecon`: `/etc/exports` with `/srv/forgejo servera.lab.example.com(rw)`, `nfs-server`, and the `nfs` firewall service (w13). The UIDs must agree, so `forgejo` is created with UID 2000 on both hosts (`useradd -u 2000`, RH124); on `serverb` it only owns the share.
    - **`servera`** automounts it at `/home/forgejo/data` with an `autofs` direct map, as w13 taught (`/-  /etc/auto.forgejo`, and `/home/forgejo/data  -rw,sync  serverb.lab.example.com:/srv/forgejo`); you want automount practiced, not an `/etc/fstab` NFS mount (2026-11-21). Nothing orders `autofs` before `forgejo`'s lingering service, so the container can start before its data is mounted. It then fails loudly, since the mount point does not exist until `autofs` makes it. `podman generate systemd --restart-sec 10` makes systemd retry every 10 seconds, which never reaches its limit of 5 starts in 10 seconds, so the service starts once the mount is there (Round 10). Without it, systemd retries after 100 ms, gives up within a second, and leaves Forgejo down. An `/etc/fstab` line without `nofail` would order the mount before user sessions instead (Round 9), but it is not automount, and w13 taught `nofail`, which removes that ordering.
    - **The container** changes to Forgejo's `-rootless` image with `--userns keep-id:uid=1000,gid=1000` and `-v ~/data:/var/lib/gitea:Z`. The standard image cannot run on NFS, and the `-rootless` image needs `keep-id`. Its own SSH server listens on 2222, so `-e SSH_PORT` goes. `:Z` does no harm on NFS, and `virt_use_nfs` is already on. Its `podman exec` shell is `git` by default, so the admin step needs no `-u git`.
    - **Backups** can then take Forgejo's files on `serverb` beside the database dump.

    The container's unit gains `--restart-sec 10`, a new option, and the slides gain a lesson: a service that depends on network storage must tolerate it arriving late. It reverses Decision 6 (a local bind mount), Decision 8's choice of the standard image and its reason for avoiding `keep-id`, Decision 9's `SSH_PORT`, and Decision 18 (NFS left out). Build the Data Tier and Build the App Tier change, and the data tier's recording is redone, which you accepted. The alternative keeps today's design, with Forgejo's files on `servera`.
27. **No reboot exercise** (your call, 2026-11-21): Survive a Reboot did not add enough to earn its class time, which is better spent elsewhere. Its command file is deleted, and Operate Forgejo now follows Build the Web Tier. The week loses its review of w12's targets (`systemctl get-default`, `default.target`) and of w05's persistent journal; the app tier still enables every service and lingering, so the application still comes back at boot (Rounds 6 and 11), but no exercise shows it.
28. **The backup takes Forgejo's files too** (your call, 2026-11-21), in the same script, so the database and the files from one moment stay together under one schedule, log, retention rule, and copy. Each run is a dated directory, `/var/backups/forgejo/forgejo_<date>`, holding `database.sql.gz` and `files.tar.gz`, so keeping the seven newest runs keeps seven complete backups. `/var/backups/forgejo` replaces `/var/lib/pgsql/backups`, since the backups are no longer only PostgreSQL's; `mkdir -p` makes it on the first run. The files come from `tar -C /srv -czf "${run_dir}/files.tar.gz" --exclude=forgejo/indexers forgejo`, with `-C` first at your request. The search index is left out because a local read of it on `serverb` can fail while Forgejo holds it open over NFS (Round 18), and Forgejo can rebuild it: its own `forgejo dump` has `--skip-index` ("Skip bleve index data"), and its backup guide says lost indexer data can be rebuilt. The push design, the count-based pruning, and `logrotate` for the log stay (2026-11-21).
29. **What each new item gets** (proposed and accepted 2026-11-21): slides for the new concepts, "New in this tier" lines for the small ones, and no changes of command, as listed under "New material". You agreed the same day that `tail -n +8` takes a table line, where a slide could set `seq 10 | tail -n 8` (3 to 10) beside `seq 10 | tail -n +8` (8 to 10), and `seq 5` beside both (all five, then nothing): with `tail -n 8` the loop would delete every backup until there were more than eight.

Proposed and accepted 2026-11-22:

30. **Fragment 2 teaches the data tier's purpose and design, not the exercise's steps** (your direction, 2026-11-22; accepted and built the same day). It covers what data is, why keeping it in one tier lets the web and app tiers be stateless, and what matters when designing a data tier: backups, resiliency, capacity, performance, and access (see "Fragment 2"). The earlier draft's 2.4 to 2.8 are no longer slides, and their content goes as follows:
    - **2.4 Storage of Its Own:** into 2.6's capacity item and 2.9's capacity row.
    - **2.5 New File Systems Have No Labels:** into 3.3, which then carries the `semanage fcontext` rule for `/srv/db` and `restorecon` itself. `mount -av`'s "does not contain SELinux labels" warning is shown only in the exercise.
    - **2.6 Sharing Files with NFS:** into a row of 2.9. The `/etc/exports` line and `exportfs -v` stay in the exercise, and 4.5 still shows the share arriving on `servera`.
    - **2.7 One UID on Both Hosts:** 4.6 One Process, Three Views already shows `forgejo` as UID 2000 on both hosts. The root-squash line, root on `servera` refused with "Permission denied", is dropped.
    - **2.8 Review in This Tier:** into 2.9, which names the week for each consideration the exercise handles.

    What is lost: no slide walks through the NFS export or the shared UID before students type them in Build the Data Tier. The exercise's step comments and its written version carry them. The fragment grows from eight slides to nine, and RAID and replication come in as ideas only. The alternative is the earlier draft, which reviewed the exercise's steps one slide at a time.

## Exercises

Step 1 of the build order, built 2026-11-19 and verified on the lab in chain order (Round 6). Each is a `kitty-demo` command file in `course/chapters/it230-self-hosting-forgejo/exercises/` (Decision 23). The written HTML versions wait for step 3, which may change commands; Build the Data Tier's was written on 2026-11-22 with fragment 3. Lengths are estimates, from the presses at 3 seconds each plus the pauses; a live dry run will time them.

1. **Build the Data Tier** (`build-the-data-tier-exercise.sh`; `serverb`; 164 presses, about 9 minutes). Rewritten 2026-11-21 for Decision 26 and verified in Round 11. **Recorded 2026-11-21**, last at 11:17 after your edit that opens `postgresql` alone and then `nfs`, `rpc-bind`, and `mountd` together: 10.5 minutes, 10 markers (the title and nine steps), processed and checked (Rounds 14 and 15). Its steps: tune serverb for throughput performance; install PostgreSQL and the NFS server; create logical volumes for PostgreSQL's data and Forgejo's files; prepare the logical volume for PostgreSQL; initialize PostgreSQL on its logical volume; allow the forgejo user to connect to PostgreSQL from servera; start PostgreSQL and create the forgejo user and database; share Forgejo's logical volume with servera over NFS; open the firewall for PostgreSQL and NFS. As root (`sudo -i`): `tuned` installed and set to `throughput-performance` (w05); `postgresql-server` and `nfs-utils`; an lvm partition using all of `/dev/sdb`, `pvcreate`, `vgcreate vg_data`, `lvcreate --name lv_db --size 2G`, and `lvcreate --name lv_forgejo --extents 100%FREE`; `mkfs.xfs` on both, two `/etc/fstab` lines by path, and `mount -av`, which warns twice that a file system "does not contain SELinux labels" (w10, w11); `/srv/db/pgsql` for `postgres`, the `semanage fcontext` rule, and `restorecon`; `systemctl edit postgresql` and `postgresql-setup --initdb`; `listen_addresses = 'localhost,172.25.250.11'` and the `pg_hba.conf` line in vim; `systemctl enable --now postgresql`, then `su - postgres` and `psql` with the two `CREATE` statements; `useradd -u 2000 forgejo`, `chown forgejo:forgejo /srv/forgejo`, `restorecon -Rv /srv/forgejo`, `/srv/forgejo servera.lab.example.com(rw)` typed into `/etc/exports`, `systemctl enable --now nfs-server`, and `exportfs -v` (w13); the `postgresql` and `nfs` firewall services, then `rpc-bind` and `mountd`, which only `showmount` needs (changed 2026-11-21 at your request, Round 13).
2. **Build the App Tier** (`build-the-app-tier-exercise.sh`; `servera`; 104 presses, about 6 minutes). Rewritten 2026-11-21 for Decision 26 and verified in Round 11. **Recorded again 2026-11-21** at 11:25, after the step 3 fix and your edit that puts `-v ~/data:/var/lib/gitea:Z` on its own line: 7.7 minutes, 7 markers, processed and checked (Rounds 14 and 15). The file keeps your earlier changes (no clock and journal step, `podman ps` before the first `curl`, the admin made from a shell inside the container). Its steps: install Podman, autofs, and the NFS client; create the user forgejo, with UID 2000, a password, and lingering; automount Forgejo's files from serverb on forgejo's ~/data; run Forgejo in a container as the forgejo user; create Forgejo's first admin; run the container as a user service that starts at boot. `sudo dnf install -y podman autofs nfs-utils`; `useradd -u 2000 forgejo`, `passwd forgejo`, and `loginctl enable-linger forgejo`; `showmount --exports serverb` (w13; added 2026-11-21, Round 13); `/etc/auto.master.d/forgejo.autofs` with `/-  /etc/auto.forgejo` and `/etc/auto.forgejo` with `/home/forgejo/data  -rw,sync  serverb.lab.example.com:/srv/forgejo`, both typed in vim, `systemctl enable --now autofs`, then w13's check: `mount | grep forgejo` with only the `autofs` trigger, `sudo ls -la /home/forgejo/data` to mount the share, and `mount | grep forgejo` again with the `nfs4` mount below it (fixed 2026-11-21, Round 14); `ssh forgejo@servera`; `podman run -d --name forgejo --network host --userns keep-id:uid=1000,gid=1000 -v ~/data:/var/lib/gitea:Z` with seven `FORGEJO__` settings, one per line after a `\`, and `codeberg.org/forgejo/forgejo:15-rootless`; `podman ps`; `podman exec -it forgejo /bin/bash`, `forgejo admin user create ...`, and `exit`; `podman generate systemd --new --files --name --restart-sec 10` with the network wait, `podman rm -f`, `systemctl --user daemon-reload`, and `enable --now container-forgejo`; `curl` before and after logging out.
3. **Build the Web Tier** (`build-the-web-tier-exercise.sh`; `workstation`, then `servera`; 59 presses, about 4 minutes). Its steps, retitled at your request on 2026-11-21: name servera git.lab.example.com on workstation; install httpd on servera and reverse proxy it to Forgejo; start httpd and open the firewall for http; use sealert to figure out why the reverse proxy fails; let httpd connect to Forgejo and test from workstation. The `git.lab.example.com` name stays, so the app tier's `ROOT_URL` and its recording stand. **Recorded 2026-11-21** at 12:05: 3.9 minutes, 6 markers, processed and checked (Round 16). `172.25.250.10 git.lab.example.com` added to `workstation`'s `/etc/hosts` in vim, and a `curl` that cannot connect; httpd; `/etc/httpd/conf.d/forgejo.conf` with `ProxyPreserveHost On`, `AllowEncodedSlashes NoDecode`, and `ProxyPass / http://127.0.0.1:3000/ nocanon`; `systemctl enable --now httpd`; the `http` firewall service; a `curl` that gets 503; `setroubleshoot-server`, and `sealert -a /var/log/audit/audit.log | less` searched for `port 3000` (w06); `setsebool -P httpd_can_network_connect on`; `curl` from `servera` and from `workstation`. It ends with a note to open the site in Firefox and log in.
4. **Operate Forgejo** (`operate-forgejo-exercise.sh`; `serverb`, then `servera`; 90 presses, about 5 minutes). Its prerequisite is Build the Web Tier since Decision 27. Recorded 2026-11-21 at 12:24 with a database-only backup (Round 17); rewritten the same day so the backup also takes Forgejo's files (Decision 28), and verified in Round 18. **Recorded again 2026-11-21** at 12:45: 6.1 minutes, 7 markers, processed and checked (Round 20). On 2026-11-21 you kept the push design (Decision 11), the dumps in `/var/lib/pgsql/backups`, and the script's count-based pruning rather than `logrotate`. As root: `rsync` installed on both hosts, the second over `ssh servera` (w02); `/usr/local/bin/forgejo_backup.sh` written in vim, in w03's and w04's pattern: `mkdir -p` of a dated run directory in `/var/backups/forgejo`, `su - postgres -c "pg_dump forgejo" | gzip` into its `database.sql.gz`, `tar -C /srv -czf .../files.tar.gz --exclude=forgejo/indexers forgejo` (w06), a `for` loop over `ls -dt ... | tail -n +8` that removes all but the seven newest runs with `rm -r`, and `rsync -av --delete` of the directory to `servera:forgejo-backups/`, checked with `ssh servera ls -lR forgejo-backups`; one run by hand under `nice -n 10`, appending to `/var/log/forgejo_backup.log`; `/etc/cron.d/forgejo_backup`, copied from `/etc/crontab`, with `0 2 * * * root nice -n 10 ...`; `/etc/logrotate.d/forgejo_backup` (`weekly`, `rotate 4`, `compress`, `missingok`) and `logrotate --force`; on `servera`, `sudo grep -E '" 5[0-9]{2} '`, and `grep -oE '" [0-9]{3} ' | sort | uniq -c`, on `/var/log/httpd/access_log`.

About 24 minutes recorded in all, with the data and app tiers at their Decision 26 lengths.

Found while verifying, and changed from the shape this section first proposed:

- `tuned` is installed on neither server, so the data tier installs it, as w05's exercise did. RHEL 10's `postgresql` profile (package `tuned-profiles-postgresql`) is broken: it sets `dirty_bytes` while its parent, `throughput-performance`, sets `dirty_ratio`, tuned logs "Conflicting options", and `tuned-adm verify` fails even after a restart. `throughput-performance` verifies.
- The volume is mounted by its `/dev/vg_db/lv_db` path, as w11 mounted logical volumes, rather than by UUID.
- `setroubleshoot-server` is not installed, so the web tier installs it for `sealert`, as w06's exercises did.
- `rsync` is installed on neither server, so the operating exercise installs it on both, as w02's did.

Left out as forced: swap, root password reset, GRUB, Flatpak, `at`, and password aging. Dropped in your 2026-11-19 edits: systemd timers, a restore test, and a `sudo` drop-in for an operator group. Dropped 2026-11-21: the reboot test, with w12's targets and w05's persistent journal (Decision 27). NFS and autofs, left out at first (Decision 18), are back (Decision 26).

## Classification (step 2)

Done 2026-11-21 (Round 19). Every concept, command, and flag the four exercises use, tagged against the baseline the build order sets: **Review** names the published week and fragment that taught it, found by searching every published fragment and exercise file; **Prerequisite** is RH124 material no published week teaches; **New** is taught nowhere before this week.

##### Build the Data Tier

- **Review:**
  - w01 `sudo`: `sudo -i`, `su - postgres`.
  - w04 `systemd-services`: `systemctl enable --now`, `systemctl daemon-reload`, `systemctl cat`.
  - w05 `tuning-profiles`: `dnf install tuned`, `tuned-adm active`, `tuned-adm profile`, `tuned-adm verify`, and the `throughput-performance` profile.
  - w06 `custom-file-policies`: `ls -ldZ`, `semanage fcontext -a -t`, `restorecon -Rv`.
  - w07 `firewall-configuration` and `firewall-services`: `firewall-cmd --permanent --add-service`, `--reload`, and `--list-services`.
  - w10 `partitions`, `file-systems`, and `mounting-file-systems`: `lsblk`, `parted ... mklabel gpt` and `mkpart`, `udevadm settle`, `mkfs.xfs`, `/etc/fstab`, `mount -av` with its "does not contain SELinux labels" warning, and `df -h`.
  - w11 `physical-volumes`, `volume-groups`, `logical-volumes`, and `lvm-practice`: `parted ... set 1 lvm on`, `pvcreate`, `vgcreate`, `lvcreate --name` with `--size` and with `--extents 100%FREE`, `lvs`, and an `/etc/fstab` line by the volume's path.
  - w13 `nfs-server` and `nfs-permissions`: `dnf install nfs-utils`, an `/etc/exports` line, `systemctl enable --now nfs-server`, `exportfs -v`, `useradd -u`, `chown`, `chmod`, and the `nfs`, `rpc-bind`, and `mountd` firewall services.
- **Prerequisite:** `mkdir`; vim's `/` search, `G`, `o`, and `i`; `| tail -3`; `exit`.
- **New:** `postgresql-server` and what its install creates; `systemctl edit` and systemd drop-ins; `postgresql-setup --initdb`; `postgresql.conf` and `listen_addresses`; `pg_hba.conf` and its line format; `psql`, statements ending in `;`, and `\q`; `CREATE USER ... WITH PASSWORD` and `CREATE DATABASE ... OWNER`; the `postgresql` firewall service.

##### Build the App Tier

- **Review:**
  - w13 `automounting-with-autofs` and `nfs-permissions`: `dnf install autofs nfs-utils`, `useradd -u`, `showmount --exports`, a direct map (`/-` in a file in `/etc/auto.master.d/` and its map file), `systemctl enable --now autofs`, and `mount | grep` before and after the mount point is used.
  - w14 `why-containers`, `running-containers`, `volume-mounts`, and `container-services`: `dnf install podman`, `passwd`, `loginctl enable-linger`, `loginctl list-users`, logging in as the service user with `ssh`, `podman run -d --name`, `-v ...:Z`, `-e`, `podman ps`, `curl -s ... | grep`, `podman exec -it ... /bin/bash`, `podman generate systemd --new --files --name` with `--wants` and `--after podman-user-wait-network-online.service`, `podman rm -f`, and `systemctl --user daemon-reload` and `enable --now`.
- **Prerequisite:** `sudo ls -la`, `mkdir -p`, `cd`.
- **New:** `--network host`; `--userns keep-id:uid=1000,gid=1000`; Forgejo's `-rootless` image from `codeberg.org`; Forgejo's settings as `FORGEJO__section__KEY` variables (`ROOT_URL`, `INSTALL_LOCK`, and the five database settings); `forgejo admin user create`; `--restart-sec`.

##### Build the Web Tier

- **Review:**
  - w05 `apache-basics`: `dnf install httpd`, `systemctl enable --now httpd`, `curl`.
  - w06 `selinux-booleans`, `selinux-practice`, and `selinux-troubleshooting`: a file in `/etc/httpd/conf.d/`, `setroubleshoot-server`, `sealert -a /var/log/audit/audit.log | less` and its search, `setsebool -P`.
  - w07 `firewall-services`: `firewall-cmd --permanent --add-service=http` and `--reload`.
  - w14 `running-containers`: `curl -s ... | grep '<title>'`.
- **Prerequisite:** editing `/etc/hosts`; `ssh servera`.
- **New:** a reverse proxy, and its three directives, `ProxyPreserveHost On`, `AllowEncodedSlashes NoDecode`, and `ProxyPass ... nocanon`; the boolean `httpd_can_network_connect` (finding and setting a boolean is w06's).

##### Operate Forgejo

- **Review:**
  - w02 `rsync`, `shell-expansions`, and `ranges-and-quantifiers`: `dnf install rsync`, `rsync -av`, a glob (`ls /var/log/forgejo_backup*`), `grep -E` with a range and `{2}`, and `grep -oE ... | sort | uniq -c`.
  - w03 `bash-scripts`, `script-input`, and `for-loops`: a script with `#!/bin/bash`, variables, `$(...)`, a `for` loop, `chmod a+x`, and `mkdir -p`.
  - w04 `system-cron-jobs` and `systemd-services`: `$(date --iso-8601=minutes)`, `cp /etc/crontab /etc/cron.d/...`, a cron line with a user field, `rsync --delete` (the robust sync exercise), `ssh` with a command, and `ls -lR`.
  - w05 `logrotate` and `process-priority`: `nice -n 10`; a file in `/etc/logrotate.d/` with `weekly`, `rotate`, `compress`, and `missingok`; `logrotate --force`.
  - w06 `compression`: `tar -czf` (w06 showed `tar -czvf`) and `gzip`.
- **Prerequisite:** `su - postgres -c`; `rm -r`; `cat`; `tail -1`; `exit`.
- **New:** `pg_dump`; `tar -C`; `tar --exclude`; `ls -t` (w02 taught no time order, and `ls -d` appears only with `-l`); `tail -n +8`; `2>&1` (w01 taught `>` and `>>` only).

## New material (step 3)

Proposed 2026-11-21 as Decision 29 and accepted the same day. Each new item gets a slide, a line in its tier's "New in this tier" table, or a change of command.

- **A slide each:**
  - **PostgreSQL fragment** (Decision 24): what `postgresql-server` installs, its account, and `postgresql_db_t`; `systemctl edit` and drop-ins; `postgresql-setup --initdb`; `listen_addresses` against `pg_hba.conf` and the firewall; the `pg_hba.conf` line, field by field; `psql`, `;`, and `\q`; the two `CREATE` statements.
  - **App tier:** Forgejo's `-rootless` image and why the standard image cannot run on NFS; `--userns keep-id` and the one UID shared by the container, `servera`, and `serverb`; `--network host` against w14's `-p`; Forgejo's `FORGEJO__` settings; the first admin with `forgejo admin user create`, stored in PostgreSQL on `serverb`; `--restart-sec` and the boot race with `autofs`.
  - **Web tier:** why a reverse proxy, with port 3000 closed (your theme); the three directives, line by line.
  - **Operationalize:** `pg_dump`, on the slide that says what to back up.
- **A line in the tier's "New in this tier" table:** the `postgresql` firewall service; `httpd_can_network_connect`, which `sealert` names; `tar -C`; `tar --exclude`; `ls -t`; `tail -n +8`; `2>&1`.
- **A change of command:** none proposed. `cd /srv` before `tar` would avoid `-C`, but you chose `-C`; `&>>` would replace `>> ... 2>&1` with another new form; age-based pruning would replace `ls -t` and `tail -n +8` with `find -mtime`, which you set aside for count-based pruning.
- **Prerequisite items** get no slide; the review tables can list them as RH124.

## Slides (step 4, draft)

Drafted 2026-11-21. Fragments 1 to 4 are built, and their entries describe the slides as they stand on 2026-11-24, after your revisions; fragments 5 and 6 are still the draft. Six fragments in `course/chapters/it230-self-hosting-forgejo/` (Decisions 23 and 25), each aligned to RH134 chapter 19 (Decision 17) and opening with a `section` slide that carries its `routeAlias` and `topicInfo`. Transcripts come from your four recordings (the casts) or from Round 21, with prompts rewritten to the theme's `student@servera:~$` form. No presenter notes. Each tier's fragment opens with the week's architecture diagram, its own tier highlighted, and ends with its exercise and recording slides. Cut candidates are listed at the end.

**The weekly entry, `course/w15-draft.md`** (built 2026-11-22, with fragments 1 to 4 so far): a cover titled "Self-Hosting Forgejo", accent `orange`, your change from `green` (w14 was `teal`; the guide prefers cool accents for Bash-heavy decks), with a six-line agenda (Self-Hosting Forgejo, The Data Tier, PostgreSQL, The App Tier, The Web Tier, Operating Forgejo) and the summary from your opening paragraph; then the VM reminder, "Start `workstation`, `servera`, and `serverb` on your VDI"; then one `src:` import per fragment.

#### Fragment 1: Self-Hosting Forgejo (`self-hosting.md`), built 2026-11-22

Eleven slides as of 2026-11-24, after your revisions: 1.2 became two slides (1.2 and 1.2a), and 1.5, 1.5a, 1.6, 1.6a, and 1.7 changed wording or layout. The tiers keep one hue each through the week, named in words every time, as `docs/design-system.md` asks of a hue key: web blue, app purple, data pink, none of them the deck's orange accent.

##### 1.1 Final Review

`section`, with `routeAlias: self-hosting-forgejo` and `topicInfo` (RH134 chapter 19, *Comprehensive Review*, no exercise). Its heading is "Final Review" and its subtitle "Self-Hosting Forgejo"; the drafted heading was "Self-Hosting Forgejo", with the subtitle "Putting the semester into practice".

##### 1.2 What Is Self-Hosting?

`center`, a title and a subtitle: "Running applications <AccentText>yourself</AccentText> instead of using <DangerText>hosted services</DangerText>". It took 1.2's title when you split the slide; the comparison moved to 1.2a.

##### 1.2a Self-Hosted vs Company Hosted

The drafted 1.2's comparison, retitled. `two-cols-header`, centered both ways, with `listSpacing: padded`. Each column is headed by a one-item `IconGrid` (`cloud`, "**Hosted service**, such as <AccentText>GitHub</AccentText>"; `home`, "**Self-hosted**, such as <AccentText>Forgejo</AccentText>") over three bullets, each opening with its subject in bold: "**Someone else** runs it", "**They** keep your data", and "**They** set the rules"; "**You** run it on your own servers", "**You** keep your data", and "**You** do the administration". No closing line.

##### 1.3 Home Labs

`IconGrid` of five, centered, in rows of three and two: `virtual-machine`, spare hardware or virtual machines; `application`, services you run for yourself; `debug`, a safe place to break things; `education`, skills that carry over to work; `view-off`, keeps your data private. No closing line, as you edited.

##### 1.4 N-Tier Architecture

A Mermaid `flowchart` at scale 1: a `user-multiple` icon for the users, then three boxes in the tier hues, "Web tier / faces the users", "App tier / runs the code", "Data tier / keeps the data". Line under it: "Each tier talks only to its neighbors".

##### 1.5 Why Separate the Tiers

`IconGrid` of four: `security`, "Only the web tier accepts user connections" (drafted as "only the web tier faces the network"); `locked`, "Each tier is secured for its own job"; `renew`, "Update or replace one tier at a time"; `search`, "A failure stays in its own tier".

##### 1.5a Stateless and Stateful Tiers

Moved here from fragment 2 (its 2.5) on 2026-11-22, at your direction, so it comes where the tiers are introduced. It expands 1.5's "update or replace one tier at a time": that is cheap for two tiers and not the third. `two-cols-header`, each column headed by a one-item `IconGrid`. Under the title, a line added in the move: "An application's **state** is the data it stores persistently". Without it, "stateless" would appear before 2.3 defines the idea. Left, `renew`, "**Web and app tiers** are stateless": rebuilt by installing them again; replaced to upgrade or recover; copied to serve more users. Right, `data-base`, "**The data tier** is stateful": backed up; protected from failure; grown as the data grows. `::bottom::`, your two lines: "Lose the web or app tier and you can reinstall it" and "Lose the data tier and it's gone, unless you have a backup". The slide is centered both ways, with `listSpacing: padded`.

Two notes that stay off the slide unless you want them. First, copying a tier to serve more users is the pattern's general benefit. This week does not show it, and the slide does not claim it for Forgejo. Second, each tier still writes logs on its own host, such as httpd's access log on `servera`, which Operate Forgejo reads. Losing those loses history, not users' work.

##### 1.6 What Is Forgejo?

Default layout, `horizontal: center`: your screenshot of Forgejo's product page (`assets/forgejo-product-page.png`, 1073x699) alone, "Forge great software with Forgejo" over its six features, among them "Self-hosted alternative to GitHub" and "Guaranteed 100% Free Software" (it replaced a screenshot of Forgejo's README on 2026-11-22). Its alt text gives the heading, the tagline, and all six features. One line under it: "Pronounced <AccentText>for-JEH-yo</AccentText>, from the Esperanto word for forge". The drafted `two-cols-header` with three bullets beside the screenshot is gone, and with it "a GitHub alternative you run yourself" and "a community project, fully open source, with no enterprise edition"; the screenshot's own features cover the first. The `IconGrid` of repositories, issues, and pull requests went when 1.6a began showing them for real (2026-11-22).

##### 1.6a Forgejo in Use

Added 2026-11-22 for two of your screenshots. `two-cols-header`, `vertical: center`: left, Forgejo's own repository on Codeberg (`assets/forgejo-codeberg-repo.png`, 1170x413), with its Code, Issues, and Pull requests tabs, captioned "Codeberg is a non-profit that hosts a Forgejo instance for public use"; right, Fedora Forge's welcome page (`assets/fedora-forgejo.png`, 1170x486), "a git forge built on Forgejo", with your highlight on Forgejo, captioned "The Fedora Community hosts a Forgejo instance for their developers".

**The three screenshots** are yours, taken 2026-11-22, so they carry no credit line, and they are stored as PNG as w12's GNOME Software screenshots were, each with alt text that describes it. `fedora-forgejo.png`'s top bar carries the Fedora logo, whose trademark Red Hat holds; `AGENTS.md` admits Red Hat's logos only with explicit authorization, which this request is taken as, and the logo is left as captured. Cropping off the top bar would remove it.

##### 1.7 This Week's Architecture

The week's Mermaid `flowchart LR` at scale 0.83, with your labels, reused in 2.2 and to be reused in 4.2 and 5.2: Carbon icon nodes for "User's Workstation" (`laptop`, white), then the `servera` box with "Web Tier / httpd" (`application-web`, blue) and "App Tier / Forgejo" (`container-software`, purple), then the `serverb` box with "Data Tier / PostgreSQL (DB)" (`data-base`) stacked above "Data Tier / Files (NFS)" (`folder-shared`), both pink. Edges: "Port 80 (HTTP)" from the workstation to httpd, "Port 3000 (HTTP)" from httpd to Forgejo, and "Port 5432 (PostgreSQL)" and "Port 2049 (NFS)" from Forgejo to the two `serverb` nodes. Two bullets under it: "Users reach Forgejo only through the web tier; port 3000 stays closed" and "Forgejo keeps its data on `serverb`: in PostgreSQL and on an NFS share". At scale 0.9 with longer labels the diagram ran off the slide's right edge, which `check:slides` did not report; `serverb` needs `direction LR` to stack its two nodes, since in a top-to-bottom box two nodes of one rank sit side by side.

##### 1.8 Built in Four Exercises

A table of the four exercises, their hosts, and the weeks each reviews (from "Classification"): Build the Data Tier, `serverb`, 1, 4 to 7, 10, 11, and 13; Build the App Tier, `servera`, 13 and 14; Build the Web Tier, `workstation` and `servera`, 5 to 7 and 14; Operate Forgejo, `serverb` and `servera`, 2 to 6. Line under it: "Each one starts where the last one ended".

#### Fragment 2: The Data Tier (`data-tier.md`), built 2026-11-22

Redrafted 2026-11-22 at your direction and built the same day (Decision 30). The fragment teaches what data is and what matters when designing a data tier; why a tier of its own lets the web and app tiers be stateless is now 1.5a's job. The earlier draft walked through Build the Data Tier's steps instead. Fragment 3 still teaches PostgreSQL and closes with the exercise. The earlier draft's 2.4 to 2.8 are no longer slides; Decision 30 says where their content goes. The stateless and stateful slide, built as 2.5, moved to fragment 1 as 1.5a the same day, which leaves eight slides. `check:slides` passes, and every slide was looked at in the review browser at 1920x1080.

##### 2.1 The Data Tier

`section`, with `routeAlias: data-tier` and `topicInfo` (RH134 chapter 19, no exercise: Build the Data Tier closes fragment 3), and the subtitle "Where an application keeps what it cannot lose".

##### 2.2 The Data Tier in the Architecture

1.7's diagram as it now stands (your labels, scale 0.83), with the data tier highlighted. Its two nodes keep their pink fill with a 2px stroke, and the `serverb` box takes a 3px pink border. Every other node, and the `servera` box, is white with a grey stroke. The labels still name every tier, so the highlight does not rely on color alone. Line under it: "The database and Forgejo's files, both on `serverb`".

##### 2.3 What Is Data?

New. `center`, a title and a subtitle, like fragment 1's "What Is Self-Hosting?": "What Is Data?" over your definition (2026-11-22), "Everything the application stores persistently after installation". It replaced the planned "Everything an application remembers that you cannot download again", and an interim version that used the word "data" to define data. "The application" is the subject, so system configuration on `servera`, such as httpd's `forgejo.conf` and the container's service, does not count. It is written again from the exercise's steps, which keeps 1.5a's claim that the web and app tiers are stateless. Forgejo's own settings do count: they live in `app.ini`, among its files on `serverb` (Round 18). The line under the subtitle, "An application's data is also called its <AccentText>state</AccentText>", now repeats 1.5a's definition.

##### 2.4 Forgejo Stores Data in Two Places

The earlier draft's 2.3 (Option A, your choice 2026-11-22), retitled by you from "The Data Tier Holds Your Users' Work", as the example that makes 2.3 concrete. `two-cols-header`: what Forgejo stores, by where it lives, each column headed by a one-item `IconGrid` (`data-base` and `folder`). Left, **In the database**, your bullets: "User Accounts", "Admin and User Settings", and "Issues, pull requests, and comments". Right, **In the files**: "Repositories: the code and its history", "Uploaded attachments", and "Avatars". Both columns have three bullets, so their headers line up. No `::bottom::` band: its "lose this" line moved, reworded, to 1.5a's.

##### 2.5 Stateless and Stateful Tiers

Moved to fragment 1 as 1.5a on 2026-11-22. Its first built bottom line, "Build the App Tier deletes Forgejo's container; its service makes a new one, and nothing is lost", rested on Round 21 and was replaced by your two lines before the move.

##### 2.6 Designing a Data Tier

New. `IconGrid` of five, centered, in rows of three and two like 1.3, each caption led by the consideration's name in bold: `data-backup`, **Backups** you can restore; `replicate`, **Resiliency** when hardware fails; `growth`, **Capacity** for the data to grow; `meter`, **Performance** under load; `locked`, **Access** for the app tier only. Two captions were shortened from the plan ("when a disk or server fails", "under the application's load"), since each wrapped and left one word on its second line.

##### 2.7 What Makes a Backup Useful

New, titled "Backups" in the plan. `IconGrid` of four, what makes a backup useful: `send-alt`, "Kept off the host it protects"; `time`, "Taken automatically on a schedule"; `version`, "Several versions kept" (the reason, that the newest copy may already hold a mistake, is not on the slide); `task-complete`, "Tested by restoring it". Line under it: "Operate Forgejo does the first three, in the last section". It does not say what is left out. No exercise restores a backup. The copy goes to `servera`, which is off the data host but in the same lab, and a real site also keeps a copy off-site.

##### 2.8 Resiliency

New. `two-cols-header`, with the line "Keeping the data available when hardware fails" under the title, and each column headed by a one-item `IconGrid` (`vmdk-disk` and `bare-metal-server`). Left, **When a disk fails**: "**RAID 1** mirrors the data on two disks" and "The other disk keeps working". W11 mentions a RAID device as one kind of physical volume, and nothing more. Right, **When a server fails**: "**Replication** copies to a standby server" and "The standby is ready to take over". "Keeps a standby server up to date" wrapped and put the headers out of line. `::bottom::` line: "Neither is a backup: a deleted repository is deleted on every copy at once". RAID and replication are named as ideas, with no commands, since the course teaches neither.

##### 2.9 This Week's Data Tier

New. It takes over the earlier draft's review table (2.8) and the substance of that draft's 2.4 to 2.7: how Build the Data Tier answers each consideration in 2.6, and the week that taught each part. A narrow table with three columns: the consideration, what the exercise does, and the weeks.

As built, seven rows, with the "Weeks" column worded like 1.8's table:

- **Capacity:** a partition and two logical volumes (10 and 11).
- **Performance:** the `throughput-performance` profile (5).
- **Access**, three rows: the firewall opens PostgreSQL and NFS (7); only `servera` may connect or mount (13 and 15, since `pg_hba.conf` is taught in fragment 3); SELinux labels on the new volumes (6).
- **Backups:** in Operate Forgejo, nightly to `servera` (2 to 6, 1.8's range for that exercise).
- **Resiliency:** "None: a single point of failure" (not taught).

The planned closing line, "A single point of failure: fine for a lab, not for your users' work", overflowed the footer by 16px together with the table. It is folded into the Resiliency row, and "fine for a lab" is lost. The exercise's steps and its written version still cover the other items the earlier draft's 2.8 listed: `/etc/fstab`, services, and `useradd -u`.

#### Fragment 3: PostgreSQL (`postgresql.md`), built 2026-11-22

Built 2026-11-22 with its written exercise, as the week-porting skill requires of a fragment that closes with an exercise, then reworked 2026-11-23 at your direction: the drop-in slide became three (3.4, 3.4a, and 3.4b), 3.5 was reframed around `postgresql-setup --initdb`, and the two configuration files got a slide each (3.6 and 3.7). Thirteen slides. Transcripts and file contents come from Build the Data Tier's recording, from Round 23, or from Round 24 on the chain's `serverb`, with prompts in the theme's `root@serverb:~#` form. `check:entry` and `check:exercises` passed at the build; `check:slides` passes on the reworked fragment, and every changed slide was looked at in a capture at 1920x1080.

##### 3.1 PostgreSQL

`section`, with `routeAlias: postgresql` and `topicInfo` (RH134 chapter 19) declaring Build the Data Tier Exercise, and the subtitle "The data tier's database".

##### 3.2 PostgreSQL on RHEL

A narrow two-column table, "What" and "On RHEL 10": package `postgresql-server` 16.8, from AppStream; client `psql`, in `postgresql`, installed with it; account `postgres`, UID 26, home `/var/lib/pgsql`; service `postgresql`, not enabled; data `/var/lib/pgsql/data`, empty until initialized; network port 5432, the firewall service `postgresql`. Sources: the recording (16.8, `dvd-appstream`), Round 7, and Round 23 (`getent passwd postgres`, `systemctl is-enabled` printing `disabled`, and an empty `ls -A`).

##### 3.3 SELinux Already Knows PostgreSQL

Two fixed `TerminalWindow`s, each under a line. First, "RHEL's policy has a rule for `/var/lib/pgsql` before PostgreSQL is installed", over Round 23's `semanage fcontext -l | grep '^/var/lib/pgsql('`, which prints the `postgresql_db_t` rule. Second, "Data anywhere else needs a rule of its own, and a new file system has no labels", over the recording's step 4: `semanage fcontext -a` and `restorecon -Rv`, whose two `Relabeled` lines show `/srv/db` and `/srv/db/pgsql` leaving `unlabeled_t`. You removed `rpm -q postgresql-server` from the first and `ls -ldZ /srv/db /srv/db/pgsql` from the second, so "before PostgreSQL is installed" now rests on Round 23 rather than on the transcript. This takes over the earlier fragment 2 draft's 2.5 (Decision 30). `/srv/forgejo` taking `var_t` is left to the exercise, since this slide is about PostgreSQL.

##### 3.4 Use a Custom Data Directory

New, replacing "Change a Unit Without Editing It" on 2026-11-23, whose 16-line transcript was too much text. Default layout. Line: "PostgreSQL stores its data in `/var/lib/pgsql/data` by default", over an `ini` block titled `/usr/lib/systemd/system/postgresql.service` holding `[Service]` and `Environment=PGDATA=/var/lib/pgsql/data`. It is an excerpt: in the unit, `Type=notify`, `User`, `Group`, and the OOM settings come between the two lines (Round 24). Then two lines: "We want to use `/srv/db` because it is on a separate Logical Volume" and "Setting `PGDATA=/srv/db/pgsql/data` in a systemd <AccentText>drop-in</AccentText> overrides the package default".

No slide now says why the unit file is not edited in place, since a package update replaces it, and the unit's own header comment saying so is no longer shown. The written exercise still gives the reason.

##### 3.4a Easily Create Systemd Drop-In Files

New, 2026-11-23. Line: "`systemctl edit postgresql` opens a drop-in file in `vim`", over a `TextExplainer` (`size="sm"`) of the editor's first six lines as the recording shows them once the two lines are typed: `### Editing /etc/systemd/system/postgresql.service.d/override.conf`, `### Anything between here and the comment below will become the contents of the drop-in file`, a blank line, `[Service]`, `Environment=PGDATA=/srv/db/pgsql/data`, and `### Edits below this comment will be discarded`. The screen was read from the cast. Four steps: the path, "The drop-in that systemctl edit postgresql opens in vim"; `[Service]`, "The section the directive belongs to, as in the unit file"; the `PGDATA` line, "Only the directives to add or override: here, just PGDATA"; the last marker, "Below this line: the package unit file, for reference only".

On the instructor lab `systemctl edit` opens `vim` because no editor variable is set and neither `editor` nor `nano` is installed (Round 24). The SCC lab is not checked: if it has `nano`, students get `nano` instead. The written exercise makes the same claim.

##### 3.4b View the Full Systemd Unit

New, 2026-11-23. Line: "`systemctl cat` shows the full Systemd Unit with any drop-in files", over a plain block titled `systemctl cat postgresql (abridged)`, with lines 1, 2, 5, and 8 to 10 highlighted: the unit's path, `[Service]`, `User=postgres`, `Group=postgres`, `Environment=PGDATA=/var/lib/pgsql/data`, `...output omitted...`, a blank line, then the drop-in's path, `[Service]`, and `Environment=PGDATA=/srv/db/pgsql/data`. Every line is in Round 24's full output, in this order. "Abridged" covers the lines dropped without a marker: the header comment, the `[Unit]` section, `Type=notify`, and the lines between `Group` and `Environment`. The exercise pipes the command through `tail -3`, which no slide shows; both are review (w04 and RH124).

##### 3.5 Initialize the Database

Reframed 2026-11-23: run it before the first start, rather than watch the service fail without it. `listSpacing: padded`. Line: "**Before starting the service**, you must run `postgresql-setup --initdb`", its lead in bold `AccentText`. A fixed `TerminalWindow` of the recording's `postgresql-setup --initdb` and its two lines, " * Initializing database in '/srv/db/pgsql/data'" and " * Initialized, logs are in /var/lib/pgsql/initdb_postgresql.log". Three bullets, all from Round 24's reading of `/usr/bin/postgresql-setup`: "Reads `PGDATA` from the `postgresql` service, drop-ins included"; "Switches to the `postgres` user, which will own the files"; "Creates the database files, including configuration files". New.

Dropped: the failing `systemctl start` and its journal line, `Directory "/srv/db/pgsql/data" is missing or empty.` (Round 23), the start that then succeeds, and "The data goes one directory below the mount point, as PostgreSQL recommends", which no slide now says.

##### 3.6 postgresql.conf

Split from "Two Configuration Files" on 2026-11-23, at your direction: one slide per file, with bullets for where it is and what it is for, then the line the exercise adds. Default layout. Two bullets: "In the data directory: `/srv/db/pgsql/data/postgresql.conf`" and "Holds the server's settings, one `name = value` per line". A `TextExplainer` (automatic size) of `listen_addresses = 'localhost,172.25.250.11'` in three steps: the name, "The addresses PostgreSQL listens on"; `localhost`, "The default: connections from serverb itself"; `172.25.250.11`, "Also serverb's lab address, so servera can reach it". The line and the default's comment, "defaults to 'localhost'", are from Round 24. New.

Dropped: Round 23's Magic Move of `ss -ltn | grep 5432` (listening on `127.0.0.1` and `[::1]` only, then on `172.25.250.11` too after a restart), and "Listening is not permission: `pg_hba.conf` and the firewall decide who connects". No restart is needed in the exercise, since both files are edited before the first start.

##### 3.7 pg_hba.conf

Retitled from "A pg_hba.conf Line" on 2026-11-23 and given 3.6's shape. Default layout. Two bullets: "Also in the data directory: `/srv/db/pgsql/data/pg_hba.conf`" and "Host-based authentication: who may connect, and how they prove it", which the file's header bears out (Round 24). The `TextExplainer` is unchanged: `size="sm"` (the automatic `md` ran 15px off the slide's right edge), over `host    forgejo    forgejo    172.25.250.10/32    scram-sha-256`, in five steps: connection type, over the network; database, only `forgejo`; user, only `forgejo`; client address, `servera` and only `servera`; method, a password never sent in the clear. New.

Dropped: "The default lines allow only connections from `serverb` itself", which Round 23's six default lines bore out.

##### 3.8 psql

A Magic Move `TerminalWindow` (`rows` 15) in one banner, "A statement without its ; waits for more": `su - postgres` and `psql`, with its "psql (16.8)" greeting, as in the recording; then Round 23's `SELECT current_user` without `;` and the `postgres-#` prompt that waits, then the `;`, its one-row result, and `\q`. Two lines: "As `postgres`, `psql` logs in as the database user of the same name" and "SQL ends with `;`, but `psql`'s own commands, such as `\q`, do not". New.

##### 3.9 A Database and Its Owner

A fixed `TerminalWindow` of the recording's two statements and their replies, `CREATE ROLE` and `CREATE DATABASE`. Two lines: "PostgreSQL calls users <AccentText>roles</AccentText>, so `CREATE USER` answers `CREATE ROLE`" and "The owner may create tables in its database, which Forgejo does when it first starts" (Decision 21; Round 5 found 128 tables owned by `forgejo`). New.

##### 3.10 Exercise: Build the Data Tier

`exercise`: goal "Hold Forgejo's database and files on `serverb`", host `serverb`, no prerequisite, and the command file's nine steps.

The written version, `exercises/build-the-data-tier-exercise.html`, was built the same day. It follows the command file step by step, and its output comes from the recording. It tells students to check `lsblk` first, since disk names can change between boots, and to use any blank 5 GB disk in place of `sdb`. It notes that their optical drives and `mount -av`'s first lines may differ. It ends by telling them to leave `serverb` for Build the App Tier. It has no cleanup (Decision 19).

##### 3.10a Recording: Build the Data Tier

`exercise`, `variant: recording`, with the cast (10.5 minutes, 10 markers) and the written exercise. The player loads in the review browser.

#### Fragment 4: The App Tier (`app-tier.md`), built 2026-11-24

Redrafted and built 2026-11-24, with its written exercise. It keeps the 2026-11-21 draft's thirteen slides and their numbers, but takes the shape fragments 1 to 3 took as you revised them. The tier's design comes first, as an `IconGrid` like 2.6. Each new item then gets a slide of its own (Decision 29): a framing line over a `TextExplainer`, a narrow table, or two columns, rather than a transcript. A closing table maps the design to the exercise and the weeks it reviews, as 2.9 does, so review items get a row there rather than a slide; the automount map in 4.5 is the one review slide. Facts come from Rounds 5, 9 to 11, 14, 15, 21, and 25, and from the recording. Like fragment 3, it closes with its exercise, and its written version was built with it. `check:entry`, `check:slides`, `check:exercises`, and `check:format` pass, and every slide and click state was looked at in a capture at 1920x1080. Five things changed in the build, each noted at its slide: 4.3's third caption, 4.7's left header and a right bullet, 4.8's title, 4.9's command, split over two lines, and 4.11's week entries.

Changed from the 2026-11-21 draft: 4.3 became "Designing an App Tier", an `IconGrid` that 4.11 answers; 4.5's `mount | grep` transcript became w13's two map files; 4.6 gained the reason for `keep-id`; 4.7 became two columns against w14's `-p`; 4.9's `TerminalWindow` became a `TextExplainer`, since the container's prompt is not one the theme recognizes; 4.10 became two columns; and 4.11's two tables, one reviewed and one new, became one table in 2.9's shape, retitled "This Week's App Tier".

##### 4.1 The App Tier

`section`, with `routeAlias: app-tier` and `topicInfo` (RH134 chapter 19) declaring Build the App Tier Exercise (`./exercises/build-the-app-tier-exercise.html`), and the subtitle "Where the application's code runs", after 2.1's "Where an application keeps what it cannot lose".

##### 4.2 The App Tier in the Architecture

1.7's diagram as built, highlighted the way 2.2 highlights the data tier: the Forgejo node keeps its purple fill with a 2px stroke, and every other node is white with a grey stroke. Unlike `serverb` in 2.2, the `servera` box keeps its grey border, since it also holds the web tier. The labels still name every tier, so the highlight does not rely on color alone. Line under it: "Forgejo, in a container on `servera`, with its data on `serverb`".

##### 4.3 Designing an App Tier

Retitled from "What the App Tier Does". `IconGrid` of five, centered, in rows of three and two like 2.6, each caption led by the consideration's name in bold: `renew`, "**Stateless**, so it can be replaced"; `locked`, "**Least privilege** for its process"; `power`, "**Availability** across reboots" (planned as "at boot and after failures", which wrapped and left "failures" alone on its line); `settings`, "**Configuration** passed in at start"; `data-connected`, "**Connections** to the data tier". 1.5a already says the web and app tiers are stateless; this slide adds what else an app tier needs. Every icon name is in the Carbon set. New.

##### 4.4 Forgejo's Image

`TextExplainer` (automatic size; at 40 columns it is `lg`) over `codeberg.org/forgejo/forgejo:15-rootless`, in four steps: `codeberg.org`, "The registry: Codeberg, where Forgejo is developed"; `forgejo/forgejo`, "Forgejo's own image"; `15`, "Version 15, Forgejo's long-term-support line"; `rootless`, "Runs Forgejo as a regular user, UID 1000, from the start". Line under it: "The standard image changes its files' owner as it starts, which NFS refuses". W14 taught an image's registry, name, and tag; the version line and the variant are new.

Sources: Decision 8 and Round 5 for the long-term-support line (15.0.12 when tested; the `15` tag follows its patch releases), and Round 9 for both variants. The standard image logged "chown: /data/gitea: Operation not permitted" and stopped when it could not save `app.ini`; the `-rootless` image runs as 1000:1000 and keeps everything, `app.ini` included, in `/var/lib/gitea`. New.

##### 4.5 Automounting Forgejo's Data

Review (w13), laid out like w13's "Direct Maps" slide so that it reads as review: two `text` blocks titled with their files, `/etc/auto.master.d/forgejo.autofs` holding `/-  /etc/auto.forgejo`, and `/etc/auto.forgejo` holding `/home/forgejo/data  -rw,sync  serverb.lab.example.com:/srv/forgejo`. Line under them: "Forgejo's data appears on `servera` the first time something looks inside `~/data`". The exercise still runs w13's check, `mount | grep forgejo` before and after `sudo ls -la`, which the earlier draft showed as a transcript (Round 15); `ls -ld` reads only the mount point and does not trigger the mount (Round 14).

##### 4.6 One Process, Three Views

A narrow two-column table, "Where" and "Forgejo is": inside the container, `git`, UID 1000 (Round 11's `id`); on `servera`, `forgejo`, UID 2000 (Round 25's `ps`); its files on `serverb`, `forgejo`, UID 2000 (Round 21's `ls -ln /srv/forgejo`). Under it, a `TextExplainer` (`size="md"`) of `--userns keep-id:uid=1000,gid=1000` in three steps: `--userns`, "How users inside the container match users on servera"; `keep-id`, "Keep the ID of the user running Podman: forgejo, UID 2000"; `uid=1000,gid=1000`, "Inside, that ID is UID 1000, the git user that runs Forgejo". It replaced the built line "`--userns keep-id:uid=1000,gid=1000` makes the container's UID 1000 the `forgejo` user's own UID" on 2026-11-24, which you found unclear: w14 never taught how a rootless container's UIDs relate to the host's, so the line leaned on an idea students do not have. The automatic `lg` overflowed the footer by 7px, hence `md`. Podman's documentation for `keep-id` bears out the steps: it maps the running user's UID into the container, and `uid=` picks the UID it takes there. Then the line "Without it, Forgejo cannot write its own files on the share", which Round 9 bears out: without `keep-id`, the image exited with "mkdir: can't create directory '/var/lib/gitea/git': Permission denied". New.

Not on the slide: `ps` names the process `gitea`, the program Forgejo was forked from, so a student who looks for `forgejo` in `ps` finds only the user.

##### 4.7 Host Networking

`two-cols-header`, each column headed by a one-item `IconGrid`, like 1.2a. Left, `network-3`, "**Published port**, `-p 8000:8080`", w14's example (planned with "such as", which wrapped the header and put the columns out of line): "The container has a network of its own" and "Podman forwards a host port into it". Right, `network-4`, "**Host network**, `--network host`": "The container uses `servera`'s network" and "Forgejo listens on ports 3000 and 2222" (planned with "`servera`'s", which wrapped; the first bullet already names the host). `::bottom::`: "Either way, the firewall decides who connects, and port 3000 stays closed". New.

Sources: Decision 2 (no port mapping, either for the proxy on `servera` or for the connection to `serverb`); Decision 9 (port 2222, since `servera`'s `sshd` holds 22); Round 5 (PostgreSQL saw `forgejo` connect from 172.25.250.10, `servera`'s own address, which 3.7's `pg_hba.conf` line allows); and Round 21 (`ss` showed `*:3000` and `*:2222`, and port 3000 refused `workstation`).

##### 4.8 Configuring Forgejo with -e

Titled "Configuring Forgejo with `-e`". Line: "Forgejo reads `FORGEJO__section__KEY` variables into `app.ini`, its configuration file", over a `TextExplainer` (`size="sm"`) of the exercise's seven `-e` lines, verbatim with their trailing `\`. Five steps: on line 1, `FORGEJO__server__ROOT_URL`, "ROOT_URL in the [server] section of app.ini"; the URL, "The address Forgejo puts in its own links"; on line 2, `INSTALL_LOCK=true`, "Skips the install page, since everything is set here"; on line 4, `serverb.lab.example.com:5432`, "The [database] lines: PostgreSQL on serverb"; on line 7, `PASSWD=redhat`, "The password from CREATE USER in Build the Data Tier". W14 taught `-e`; the names are new.

Sources: Round 25 read the result in `app.ini`, with `ROOT_URL` under `[server]`, `INSTALL_LOCK = true` under `[security]`, and the database lines under `[database]`; Round 5 found that without `ROOT_URL`, Forgejo calls itself `http://localhost:3000/`.

##### 4.9 The First Admin

Line: "`INSTALL_LOCK` skipped the install page, so make the first admin from a shell inside the container", over a `TextExplainer` (`size="sm"`) of the command, `forgejo admin user create --admin --username student --password student --email student@lab.example.com`. At 98 columns it ran 112px off the slide's right edge even at `sm`, so it is split after `--admin` with a `\`, as the `-e` lines are; the exercise types it on one line. Four steps: `forgejo admin user create`, "Forgejo's own command-line tool"; `--admin`, "An administrator, who can manage the site"; `--username student`, "The name it signs in with"; `--password student`, "Its password". Line under it: "The account is a row in PostgreSQL on `serverb`, like every account", which 2.4 lists and Round 21's `SELECT name, is_admin FROM "user";` (`student | t`) bears out. New.

The exercise opens the shell with `podman exec -it forgejo /bin/bash` (w14), and the recording prints "New user 'student' has been successfully created!". A `TerminalWindow` is set aside: the container's prompt, `servera:/var/lib/gitea$` (Round 11), is not a form the theme's `bash-session` recognizes, so it would render as output, and the command line wraps.

##### 4.10 When the Data Arrives Late

Line: "At boot, nothing makes `autofs` mount `~/data` before `forgejo`'s service starts". `two-cols-header`, each column headed by a one-item `IconGrid`. Left, `close-outline`, "**Without `--restart-sec`**": "Retries after 100 ms", "Gives up after 5 tries in 10 seconds", and "Forgejo stays down". Right, `checkmark-outline`, "**With `--restart-sec 10`**": "Retries every 10 seconds", "Never reaches that limit", and "Starts once the data is there". `::bottom::`: "A service that needs network storage must tolerate it arriving late". The option rides on w14's `podman generate systemd` line, whose other options are review. New.

Sources: Round 10, with `autofs` held back 30 seconds. With `RestartSec=10`, the unit failed with "Error: statfs /home/fjtest/data: no such file or directory" at 5.5, 15.8, and 26.0 seconds and started at 36.5; without it, it logged "Start request repeated too quickly" by 6.5 seconds and never started. Round 25 read the exercise's unit: `RestartUSec=10s`, `StartLimitBurst=5`, and `StartLimitIntervalUSec=10s`. Not on the slide: in every real reboot `autofs` won the race by about 0.2 seconds (Rounds 9 and 11), so the option is insurance against a slow boot.

##### 4.11 This Week's App Tier

Retitled from "Review and New in This Tier". 2.9's shape: a narrow table with three columns, the consideration from 4.3, what Build the App Tier does, and the weeks, worded like 2.9's. Seven rows:

- **Stateless:** its files and database on `serverb` (13 and 15). This week is written "15", as 2.9 writes it.
- **Least privilege**, two rows: a rootless container (14); its own user, `forgejo`, UID 2000 (13 and 14: w13 taught `useradd -u`, and w14 a service user of its own).
- **Availability**, two rows: a user service with lingering (14); retries until its data arrives (15).
- **Configuration:** settings passed with `-e` (14 and 15).
- **Connections:** host networking to PostgreSQL (15).

The commands behind the rows, such as `showmount`, `passwd`, `loginctl`, `ssh` as the service user, `podman ps`, `podman exec`, `podman rm -f`, `systemctl --user`, and `curl`, are w13's and w14's, as "Classification" lists. The earlier draft's table of new items is gone, since each has its own slide, 4.4 to 4.10.

##### 4.12 Exercise: Build the App Tier

`exercise`: goal "Run Forgejo in a container on `servera`, with its data on `serverb`", host `servera`, prerequisite exercise Build the Data Tier, and the command file's six steps: install Podman, autofs, and the NFS client; create the user `forgejo`, with UID 2000, a password, and lingering; automount Forgejo's files from `serverb` on `forgejo`'s `~/data`; run Forgejo in a container as the `forgejo` user; create Forgejo's first admin; run the container as a user service that starts at boot.

The written version, `exercises/build-the-app-tier-exercise.html`, was built with the fragment, as 3.10's was. It follows the command file step by step, with output from the recording. It notes that `passwd` warns "BAD PASSWORD: The password is shorter than 8 characters" and sets the password anyway, and that the first `ssh` as `forgejo` may ask to trust `servera`'s host key, as w14's written exercise says. It explains each of `podman run`'s options and `--restart-sec`, warns to log in as `forgejo` with SSH rather than `su`, and says to run `curl` again if Forgejo is still starting. It ends by telling students to leave `servera` for Build the Web Tier. It has no cleanup (Decision 19).

##### 4.12a Recording: Build the App Tier

`exercise`, `variant: recording`, with the cast (7.7 minutes, 7 markers; Rounds 14 and 15) and the written exercise. The player's label describes the recorded workflow: installing Podman, `autofs`, and `nfs-utils` on `servera`; creating `forgejo` with UID 2000, a password, and lingering; listing `serverb`'s exports and automounting `/srv/forgejo` on `forgejo`'s `~/data` with a direct map; running Forgejo's `-rootless` image with host networking, `keep-id`, and its settings; creating the first admin inside the container; and generating a user service with `--restart-sec 10` that keeps running after `forgejo` logs out.

#### Fragment 5: The Web Tier (`web-tier.md`)

##### 5.1 The Web Tier

`section`, with `routeAlias: web-tier` and `topicInfo` declaring Build the Web Tier.

##### 5.2 The Web Tier in the Architecture

1.7's diagram, the web tier highlighted.

##### 5.3 Why a Reverse Proxy

Your theme: an application's built-in web server is made to run the application, not to face the network; Apache httpd and nginx are hardened and full-featured for that job (encryption, many sites on one port, logging, limits), so they stand in front. `IconGrid` of those features.

##### 5.4 Only Port 80 Is Open

`TerminalWindow` from Round 21: `ss` with 80, 2222, and 3000 listening on `servera`, the firewall listing only `http`, and from `workstation`, port 3000 refused ("Could not connect to server") while port 80 serves the page. One line: a rootless container cannot listen below port 1024 anyway.

##### 5.5 The Proxy Configuration

`TextExplainer` over `/etc/httpd/conf.d/forgejo.conf`: `ProxyPreserveHost On` passes the name the browser asked for; `AllowEncodedSlashes NoDecode` and `nocanon` keep encoded characters in paths intact; `ProxyPass / http://127.0.0.1:3000/` forwards every request to Forgejo. One line: the three lines come from Forgejo's documentation. New.

##### 5.6 SELinux Blocks the Proxy

`TerminalWindow` from the recording: `503 Service Unavailable`, then `sealert`'s "SELinux is preventing /usr/sbin/httpd from name_connect access on the tcp_socket port 3000." and its advice to enable `httpd_can_network_connect`. Review of w06's method; the boolean is new.

##### 5.7 Review and New in This Tier

Two narrow tables: reviewed (w05 httpd, w06 `sealert` and booleans, w07 the firewall, RH124 `/etc/hosts`) and new (`ProxyPass` and its partners, `httpd_can_network_connect`).

##### 5.8 Exercise: Build the Web Tier

`exercise`: its goal, `workstation` and `servera`, and its five steps.

##### 5.8a Recording: Build the Web Tier

`exercise`, `variant: recording`.

#### Fragment 6: Operating Forgejo (`operating-forgejo.md`)

##### 6.1 Operating Forgejo

`section`, with `routeAlias: operating-forgejo` and `topicInfo` declaring Operate Forgejo.

##### 6.2 Running an App in Production

`IconGrid` of what this section covers: backups, getting them off the host, scheduling and logs, reading the logs, and security.

##### 6.3 What to Back Up

The database and the files, from the same moment. `pg_dump` (new) copies a running database consistently; `tar` copies the files, minus the search index, which Forgejo can rebuild (its own `forgejo dump` has `--skip-index`). One honest line: `tar` reads files while Forgejo may write them, so the two halves are close to, not exactly, one moment. Another: the files also hold `app.ini`, whose secrets Forgejo wrote at its first start, such as the key that encrypts users' two-factor secrets, so a backup without it would lock those users out; that is why the files, not only the database, are backed up (kept off 2.4, which stays about user data).

##### 6.4 The Backup Script

The 11-line script in a code block, its lines highlighted in steps: the dated run directory, the dump, the archive, the pruning loop, the copy.

##### 6.5 Keeping the Seven Newest

`TerminalWindow` from Round 21: `seq 10 | tail -n 8` (3 to 10) beside `seq 10 | tail -n +8` (8 to 10). Lines: `ls -dt` lists newest first, so `tail -n +8` is everything after the seventh; counting, not age, keeps the last seven good backups even if backups stop working.

##### 6.6 Getting Backups Off the Host

`rsync -av --delete` to `servera` (w02, w04), with `ssh servera ls -lR forgejo-backups` from the recording. One line: here the data host pushes; many sites have the backup host pull instead, so the data host holds no key to its own backups.

##### 6.7 Every Night, Quietly

The `/etc/cron.d` line (w04), its `nice -n 10` (w05), and `>> ... 2>&1` (new: errors go to the same log); the `logrotate.d` file (w05).

##### 6.8 Reading the Access Log

One access log line from the recording, its status after the quoted request; `grep -E '" 5[0-9]{2} '` with the quote anchoring the match, and the `uniq -c` counts. Review of w02.

##### 6.9 Security, Tier by Tier

A recap: the web tier is the only one other hosts reach, on port 80; Forgejo runs rootless as its own user with no open port; PostgreSQL listens on one address and admits one user from one host; NFS shares one directory with one host; SELinux enforces throughout.

##### 6.10 Review and New in This Tier

Two narrow tables: reviewed (w02, w03, w04, w05, w06) and new (`pg_dump`, `tar -C` and `--exclude`, `ls -t`, `tail -n +8`, `2>&1`).

##### 6.11 Exercise: Operate Forgejo

`exercise`: its goal, `serverb` and `servera`, and its six steps.

##### 6.11a Recording: Operate Forgejo

`exercise`, `variant: recording`.

#### Size and cut candidates

66 slides across the six fragments, plus the cover and the VM reminder: fragment 1 at eleven (with 1.2a, 1.5a, and 1.6a), fragment 2 at eight, fragment 3 at thirteen (with 3.4a and 3.4b), and fragments 4 to 6 as drafted, at thirteen, nine, and twelve. With about 28 minutes of recorded exercises, longer typed live, that is likely too much for 2.5 hours. Candidates, in the order I would cut: merge 1.3 into 1.2a and 1.5 into 1.4; fold 2.3 into 2.4 as its opening line; drop 2.6, since 2.9 names the same five considerations; merge each later tier's review and new tables (4.11, 5.7, 6.10) into the exercise slide's environment notes or drop them for a single closing review map; drop 6.2. That brings it to about 58.

## Verification

**Round 0, 2026-11-15**, done while planning w14; details in `w14-porting.md`, Round 8. Every side test was restored.

- RHEL 10's repositories have `mariadb-server` 10.11.11, `postgresql-server` 16.8, `httpd` 2.4.63, `nginx` 1.26.3, and `git` 2.47.1, and no `podman-compose` or `docker-compose`; `podman compose` fails with "looking up compose provider failed".
- A rootless container with `--network host` reached a server on its host's `127.0.0.1:3306` with SELinux enforcing, and a server on another host's port 3306 once that host's firewall allowed `mysql`. The other host saw the connection come from the container's host address, so the database must allow `servera`'s address, 172.25.250.10: for PostgreSQL, in the `pg_hba.conf` line.
- `podman generate systemd --new` with `--wants` and `--after podman-user-wait-network-online.service`, plus `loginctl enable-linger`, brought a rootless container's service back after a reboot with nobody logged in. Without the two options, the container started before the network and its published port gave empty replies; `--network host` was not tested across a reboot.
- On a `:Z` bind mount from a home directory, Docker Hub's `postgres:16`, whose entry point starts as `root`, initialized its data but left the directory owned by a subordinate UID that the user could not list or delete without `podman unshare`. A container running as a regular user from the start could not write to such a mount at all.

**Round 1, 2026-11-19, a new filesystem's label** (Decision 14). On `serverb`, a 300 MB XFS filesystem in an image file in `/tmp` was mounted on a new `/mnt/fresh`. The mount point read `mnt_t` before mounting and `unlabeled_t` after, and a file created inside it was `unlabeled_t` too. `matchpathcon /var/lib/pgsql/data` gives `postgresql_db_t`. The filesystem was unmounted and the image file and `/mnt/fresh` were removed, so nothing remains.

**Round 2, 2026-11-19, mounting before the install** (Decision 14). On `serverb`, with SELinux enforcing and no PostgreSQL installed, a 500 MB XFS filesystem in an image file in `/tmp` stood in for the logical volume. It was mounted on a new `/var/lib/pgsql/data`, which then read `root root 755 unlabeled_t`. After `dnf install -y postgresql-server`, the same directory read `postgres postgres 700 postgresql_db_t`, and `/var/lib/pgsql` became `postgres`'s too. `postgresql-setup --initdb` exited 0 after its mount-point warning, its files were `postgresql_db_t` (`log` is `postgresql_log_t`), `systemctl start postgresql` left it active, and `ausearch` found no AVC denial. Restored the same session: the service stopped, the filesystem unmounted, `postgresql-server` removed with its dependencies (the installed package list then matched the one saved before the test), the `postgres` user and group deleted, and `/var/lib/pgsql`, `/run/postgresql`, and the image file removed.

**Round 3, 2026-11-19, the data on `/srv/db`** (Decision 14). On `serverb`, a 500 MB XFS filesystem in an image file stood in for the logical volume, mounted on a new `/srv/db`; the policy gives `/srv/db` no rule of its own (`matchpathcon` says `var_t`). A first run put the `semanage` rule after `initdb`. `initdb` succeeded and left its files `var_t`. `systemctl start postgresql` failed with "could not access directory "/srv/db/pgsql/data": Permission denied", and the audit log had `denied { search }` for `postgresql_t` on the volume's top directory, `unlabeled_t`. The service started in permissive mode. After the rule and a full `restorecon -Rv`, it started enforcing. Everything was then removed, and Decision 14's steps were run once from scratch, in order: no `initdb` warning, all 1000 files and directories under `/srv/db` `postgresql_db_t`, the service active and enabled, `SHOW data_directory` giving `/srv/db/pgsql/data`, and no denial. `systemctl edit` was given its lines with `--stdin`; typed in its editor, they make the same `/etc/systemd/system/postgresql.service.d/override.conf`. Restored the same session: the service disabled and stopped, the filesystem unmounted, the drop-in and the `semanage` rule deleted, `postgresql-server` removed (the package list then matched the one saved before), the `postgres` user and group deleted, and `/var/lib/pgsql`, `/run/postgresql`, `/srv/db`, and the image file removed. The dontaudit rules were switched off once with `semodule -DB` while looking for the denial and restored with `semodule -B`. Through `pnpm lab`, `ausearch` needs `--input-logs`: with no terminal on its standard input, it reads that instead of the audit log and reports `<no matches>`.

**Round 4, 2026-11-19, other ways to place the data** (Decision 14). On `serverb`, with `postgresql-server` installed:

- The unit sets `Environment=PGDATA=/var/lib/pgsql/data` and starts `postgres -D ${PGDATA}`.
- `postgresql-setup --help` lists `--datadir` as "Dropped with --new-systemd-unit", which was "dropped for security reasons" and replaced by `/usr/sbin/postgresql-new-systemd-unit --unit postgresql@NAME --datadir DIR`. That script writes `/etc/systemd/system/postgresql@NAME.service.d/30-postgresql-setup.conf` with the same `Environment=PGDATA=` line `systemctl edit` adds, for a second service; it is the drop-in again, plus an instance unit.
- `/var/lib/pgsql/.bash_profile` exports `PGDATA=/var/lib/pgsql/data` for the `postgres` user's login shells only; the service does not read it.
- A symbolic link: on a fresh image-file volume at `/srv/db`, `/srv/db/pgsql/data` was made and given to `postgres` with mode `700`, the `semanage` rule and `restorecon` applied, then `/var/lib/pgsql/data` removed with `rmdir` and replaced with `ln -s /srv/db/pgsql/data /var/lib/pgsql/data`. The link took `postgresql_db_t` from the existing rule for `/var/lib/pgsql`. `postgresql-setup --initdb` initialized "/var/lib/pgsql/data", writing to the volume (all files `postgresql_db_t`), the service started enabled and active, `SHOW data_directory` gave `/var/lib/pgsql/data`, no denial was logged, and `sudo rpm -V postgresql-server` reported nothing.

Restored the same session as in Round 3; the package list matched the one saved before.

**Round 5, 2026-11-19, step 1's three unknowns** (Decisions 8 to 10). All three hosts were first checked at the week's start.

- **`servera`, as a test user `forgejo`** reached over SSH with the lab's key, so it had a login session: `sudo dnf install -y podman` took 23 seconds. `codeberg.org/forgejo/forgejo:15` (15.0.12, 190 MB) took 16 seconds to pull. It runs as `root` inside, under the s6 supervisor, which starts Forgejo and an OpenSSH server; it exposes 22 and 3000, with its data in `/data`. Run with `--network host` and `-v ~/data:/data:Z`, it served its install page on port 3000 at once. Its OpenSSH logged "Bind to port 22 on 0.0.0.0 failed: Permission denied" over and over. In `~/data`, `git` and `gitea` belong to subordinate UID 590823 (container UID 1000, Forgejo's `git` user) and `ssh` to `forgejo` itself; `rm -rf ~/data` failed with "Permission denied", and `podman unshare rm -rf ~/data` worked. Before lingering was enabled, the container died soon after the SSH session that started it ended, as w14 teaches.
- **The SSH port:** the image's `/etc/s6/openssh/setup` and `/etc/s6/gitea/setup` read `SSH_PORT` (default 22) and `SSH_LISTEN_PORT` (default `SSH_PORT`) into `sshd_config` and `app.ini`, which are written at the first start only. With `-e SSH_PORT=2222` on fresh data, OpenSSH listened on 2222 and `app.ini` had `SSH_PORT = 2222` and `SSH_LISTEN_PORT = 2222`.
- **`serverb`:** after `postgresql-setup --initdb`, `postgresql.conf` has `#listen_addresses = 'localhost'` and `#password_encryption = scram-sha-256`, and `pg_hba.conf` allows network connections only from `127.0.0.1/32` and `::1/128`, with `ident`. With `listen_addresses = '*'`, the line `host forgejo forgejo 172.25.250.10/32 scram-sha-256` appended, `systemctl enable --now postgresql`, `CREATE USER forgejo WITH PASSWORD 'redhat'`, `CREATE DATABASE forgejo OWNER forgejo`, and `firewall-cmd --permanent --add-service=postgresql` (5432/tcp), it listened on every address. `sudo -u postgres psql` warns when the current directory is one `postgres` cannot read, such as `student`'s home.
- **Together:** Forgejo restarted on fresh data with `-e SSH_PORT=2222`, `FORGEJO__database__DB_TYPE=postgres`, `HOST=serverb.lab.example.com:5432`, `NAME`, `USER`, and `PASSWD`, `FORGEJO__server__ROOT_URL=http://git.lab.example.com/`, and `FORGEJO__security__INSTALL_LOCK=true`. It started in about 15 seconds and served its home page, not the install page. `podman exec -u git forgejo forgejo admin user create --admin --username student --password student --email student@lab.example.com` printed "New user 'student' has been successfully created!". On `serverb`, `pg_stat_activity` showed `forgejo` connected from 172.25.250.10, the database held 128 tables owned by `forgejo`, and its `user` table held `student` as an admin. Without `ROOT_URL`, Forgejo calls itself `http://localhost:3000/`.

Restored the same session. On `servera`: the container removed, lingering disabled, `sudo userdel -r forgejo` (it removed the home directory, the subordinate-UID files included, and `forgejo`'s `/etc/subuid` line), Podman removed, and the `localhost` host key that the test's SSH logins added to `student`'s `known_hosts` removed, with the `known_hosts.old` backup that left. On `serverb`: PostgreSQL disabled and removed, the `postgresql` firewall service removed, the `postgres` user and group and `/var/lib/pgsql` deleted; the package list then matched the one saved before.

**Round 6, 2026-11-19, the five command files** ("Exercises"). Each command was run through `pnpm lab` in chain order, from the week's start, before it went into a file; every file passes `kitty-demo --check`. Vim keystrokes were replayed with `vim -s` from a file of the same keys, for the drop-in, `postgresql.conf`, and `pg_hba.conf`. `forgejo`'s SSH logins used the lab key, where students type its password.

- **Data tier:** the partition, volume, and `/etc/fstab` mount worked as in w10 and w11 (`parted` prints "Information: You may need to update /etc/fstab." for each step). `dnf install -y tuned` took 3 seconds; `tuned-adm active` said `virtual-guest`, whose `tuned.conf` has `include=throughput-performance`. `systemctl edit postgresql` with no terminal says "Cannot edit units interactively if not on a tty."; with one, it opens the editor on its marker template with `+4`, the blank line between the markers. After `enable --now`, PostgreSQL listened on port 5432 on every address, from `/srv/db/pgsql/data`, with no denial.
- **App tier:** `servera`'s clock was synchronized by `chronyd`, and its journal was in memory until `/var/log/journal` was made. Right after `journalctl --flush`, `student` cannot read the persistent journal ("No journal files were opened due to insufficient permissions."); after the next boot it can. `passwd` as root warns "BAD PASSWORD: The password is shorter than 8 characters" and sets it. `ssh forgejo@servera` from `servera` does not ask about the host key. The pull and Forgejo's start took 16 seconds; `podman rm -f forgejo` took 1, and the service served the page 2 seconds after `enable --now`. After `forgejo` logged out, `loginctl list-users` showed it `lingering` and the page still answered.
- **Web tier:** `workstation` finds `servera` through DNS, not `/etc/hosts`. Before httpd, `curl git.lab.example.com` fails with "Could not connect to server". `servera` labels port 3000 `ntop_port_t`, and httpd answered 503, with `denied { name_connect }` for `httpd_t` on it. `sealert` printed "SELinux is preventing /usr/sbin/httpd from name_connect access on the tcp_socket port 3000." and "Then you must tell SELinux about this by enabling the 'httpd_can_network_connect' boolean.", after an older, unrelated denial already in the lab's audit log. With the boolean on, the site answered from `servera` and, by name, from `workstation`; a redirect from `/explore` went to `http://git.lab.example.com/explore/repos`; and `student` authenticated as an admin through the proxy.
- **Reboot test:** `serverb` rebooted, and came back with `/srv/db` mounted, PostgreSQL active from it, `throughput-performance` still active, and no denial. Forgejo answered throughout, its database-backed pages included, and reconnected on its own. `servera`'s site answered again about 10 seconds after its reboot command, with nobody logged in; `journalctl --list-boots` as `student` then listed two boots, and `journalctl -b -1 -u httpd` showed httpd's stop.
- **Operating it:** `rsync` is installed on neither server at the week's start. Root on `serverb` reached `servera` with no prompt; the lab's SSH settings accept a new host key and print "Warning: Permanently added". With eight older dumps seeded for the test, the script kept the seven newest, and `rsync` created `forgejo-backups` in root's home on `servera` and mirrored them. The 28 KB dump held 128 `CREATE TABLE` statements. An every-minute version of the cron line ran once under cron (`/var/log/cron` shows `CMD` and `CMDEND`) before it was set to 2 a.m. `logrotate --force` on the drop-in alone wrote `forgejo_backup.log.1.gz`: run alone, it does not read `/etc/logrotate.conf`'s `dateext` and `create`, which the nightly timer's run does. The access log held one 503, from the web tier's first `curl`.

Restored with `start-latest-snapshot -a`, which reverted every host to the week's start, since the verification also added things no exercise does (the lab key in `forgejo`'s account, the seeded dumps, and host keys from test logins). Afterwards no host had Podman, PostgreSQL, httpd, or the `forgejo` and `postgres` users, `servera` and `serverb` had neither `rsync` nor `tuned`, every firewall allowed only `cockpit`, `dhcpv6-client`, and `ssh`, and `workstation`'s `/etc/hosts` had no `git.lab` line.

**Round 7, 2026-11-21, PostgreSQL's package and policy** (Decision 24). Read-only, on `serverb` as your dry run of Build the Data Tier left it. `/usr/bin/psql` belongs to `postgresql`, which `postgresql-server` requires. `semodule -l` lists a `postgresql` module, which belongs to `selinux-policy-targeted`, and `rpm -ql postgresql-server` lists no SELinux files. `semanage fcontext -l` gives `/var/lib/pgsql(/.*)?` the type `postgresql_db_t`, and `/var/lib/pgsql/data/log(/.*)?` `postgresql_log_t`. `postgres` is UID 26, with home `/var/lib/pgsql` and shell `/bin/bash`. The data directory holds `pg_hba.conf`, `pg_ident.conf`, `postgresql.auto.conf`, and `postgresql.conf`. Nothing was changed.

**Round 8, 2026-11-21, a shell inside Forgejo's container** (the app tier's step 4). On `workstation`, which has Podman at the week's start, as `student`, in a throwaway container run from `codeberg.org/forgejo/forgejo:15` with `--network host`. The image has `/bin/bash`; its `/bin/sh` and `/bin/ash` are BusyBox. `podman exec` runs as `root` by default, and `forgejo` as `root` stops with "Forgejo is not supposed to be run as root. Sorry.". The `git` user is UID 1000, with home `/data/git` and shell `/bin/bash`, and `forgejo` (`/usr/local/bin/forgejo`, a link to `gitea`) is on its `PATH`. With `--network host`, the container has the host's hostname, so `podman exec -it -u git ... /bin/bash` gave the prompt `workstation:/$` (on `servera`, `servera:/$`), in `/`, with `id` showing `git`. Restored the same session: the container and image removed, leaving `student` with no images or containers, as before.

**Round 9, 2026-11-21, Forgejo's data over NFS** (Decision 26). Away from the recording chain: `workstation` played `serverb`, with `nfs-utils` installed and `/srv/forgejo` (owned by UID 1001) exported to `serverc` with `rw`; `serverc` played `servera`, with Podman, `autofs`, `nfs-utils`, and a user `fjtest` (UID 1001, lingering).

- **The mount:** a direct map (`/-  /etc/auto.forgejo`, and `/home/fjtest/data  -rw,sync  workstation.lab.example.com:/srv/forgejo`) mounted the export over NFS 4.2 on first use; a file `fjtest` made there was UID 1001 on both hosts. The mount reads `nfs_t`, and `virt_use_nfs` is on by default.
- **The standard image** (`forgejo:15`, `-v ~/data:/data:Z`) started without complaint from `:Z`, but its entrypoint logged "chown: /data/gitea: Operation not permitted" for every directory. With `INSTALL_LOCK=true`, Forgejo then stopped with `failed to save "/data/gitea/conf/app.ini": open /data/gitea/conf/app.ini: permission denied`: its `git` user is a subordinate UID on the client, and NFS will not let it write files owned by 1001.
- **The `-rootless` image** (`forgejo:15-rootless`, 183 MB, 6-second pull) runs as 1000:1000, keeps everything, `app.ini` included (`GITEA_APP_INI=/var/lib/gitea/custom/conf/app.ini`), in its one volume, `/var/lib/gitea`, and exposes 2222 and 3000. Without `keep-id`, it exited with "mkdir: can't create directory '/var/lib/gitea/git': Permission denied". With `--userns keep-id:uid=1000,gid=1000` and `-v ~/data:/var/lib/gitea:Z`, it served its home page, its built-in SSH server listened on 2222, `forgejo admin user create` worked, and every file on both hosts belonged to 1001. On fresh data its first start took over 20 seconds; later starts were quicker.
- **At boot, with `autofs`:** as a generated, lingering user service, it came back with the container on `nfs` in three reboots, the page answering about 16 to 18 seconds after the reboot command. But `autofs.service` is ordered only after `network-online.target` and `remote-fs.target`, and the user's manager only after `systemd-user-sessions.service`, so nothing orders them; `autofs` became active 0.2 seconds before `user@1001.service` each time. With `autofs` stopped, `/home/fjtest/data` does not exist, so a lost race fails loudly ("Error: statfs /home/fjtest/nonexistent: no such file or directory", exit 125), but the unit retries after 100 ms and stops after 5 failures in 10 seconds (`StartLimitBurst=5`), which could leave Forgejo down.
- **At boot, with `/etc/fstab`:** with `rw,sync,nofail`, the generated `home-fjtest-data.mount` is only wanted by `remote-fs.target` and not ordered before it. With `rw,sync`, it is required by and ordered before it, and `systemd-analyze critical-chain user@1001.service` showed `user@1001.service` after `systemd-user-sessions.service`, after `remote-fs.target`, after `home-fjtest-data.mount`. Two reboots: the page answered about 16 seconds after the reboot command, with the container on `nfs`.
- **An NFS server outage:** with `nfs-server` stopped for 10 seconds and restarted (its NFSv4 grace time is 90 seconds), `/explore/repos` answered 200 every 2 seconds throughout. Right after another restart, creating a repository through the API took 1.3 seconds and the next 1.1; both landed in `/srv/forgejo/git/repositories/student` on the server, owned by 1001.

Restored the same session: `serverc` reverted with `start-latest-snapshot serverc`; on `workstation`, `nfs-server` disabled and stopped, the `nfs` firewall service removed, `/etc/exports` emptied as before, `/srv/forgejo` deleted, and `nfs-utils` removed, with `libnfsidmap` and `sssd-nfs-idmap`, which its install had added; the package list then matched the one saved before. `sssd` is enabled and inactive there, as on `servera`.

**Round 10, 2026-11-21, automount with `--restart-sec`** (Decision 26). The Round 9 setup was rebuilt: `workstation` exporting `/srv/forgejo` (UID 1001) to `serverc`, and on `serverc` the direct map, `fjtest` (UID 1001, lingering), and the `-rootless` image with `--userns keep-id:uid=1000,gid=1000` on `~/data`. Its first start on empty data took about 32 seconds. The unit was generated with `--restart-sec 10` and the network wait; it reads `Restart=on-failure` and `RestartSec=10`, with systemd's defaults of `StartLimitBurst=5` in `StartLimitIntervalUSec=10s`.

- **The race, lost on purpose:** a temporary drop-in, `/etc/systemd/system/autofs.service.d/w15-test-delay.conf` with `ExecStartPre=/usr/bin/sleep 30`, held `autofs` back until 35.0 seconds after boot, while `user@1001.service` was active at 5.2. The service failed at 5.5, 15.8, and 26.0 seconds, each time with "Error: statfs /home/fjtest/data: no such file or directory" and status 125, logged "Scheduled restart job, restart counter is at 1" to 3, and started at 36.5 seconds, 1.5 seconds after `autofs`. The page answered about 49 seconds after the reboot command, with the container on `nfs`.
- **The control:** with the unit's `RestartSec=10` line removed (`RestartUSec=100ms`), the same delayed boot reached "restart counter is at 5" and "Start request repeated too quickly" by 6.5 seconds and never started; 75 seconds after the reboot command the page did not answer, though `autofs` had been up since 35.0 seconds.

Restored the same session: `serverc` reverted with `start-latest-snapshot serverc`, which also removed the delay drop-in; on `workstation`, `nfs-server` disabled and stopped, the `nfs` firewall service removed, `/etc/exports` emptied, `/srv/forgejo` deleted, and `nfs-utils`, `libnfsidmap`, and `sssd-nfs-idmap` removed, after which the package list matched the one saved before.

**Round 11, 2026-11-21, the data and app tiers rebuilt for Decision 26.** From the week's start: `serverb` was reverted with `start-latest-snapshot serverb`, which discarded the recorded data tier, and `servera` and `workstation` were already there. UID 2000 was free on all three hosts.

- **Data tier:** `dnf install -y postgresql-server nfs-utils` took 3 seconds (it added `gssproxy`, `libnfsidmap`, `libtirpc`, and others). `lvs vg_data` showed `lv_db` at 2.00g and `lv_forgejo` at <3.00g, mounted at `/srv/db` (2.0G) and `/srv/forgejo` (3.0G). The PostgreSQL steps behaved as in Round 6. After `useradd -u 2000 forgejo` and `chown`, `/srv/forgejo` read `forgejo forgejo` and `unlabeled_t`; `restorecon -Rv` relabeled it `var_t`. `/etc/exports` was empty before its line; `exportfs -v` showed `/srv/forgejo servera.lab.example.com(sync,wdelay,hide,no_subtree_check,sec=sys,rw,secure,root_squash,no_all_squash)`, and the firewall listed `nfs` and `postgresql`. W10's recording shows what `mount -av` prints for each new file system: "mount: /records does not contain SELinux labels." and four more lines.
- **App tier:** `dnf install -y podman autofs` (23 seconds) did not install `nfs-utils`, and without it there is no `/usr/sbin/mount.nfs`, so the exercise installs all three. The direct map mounted `serverb.lab.example.com:/srv/forgejo` over NFS 4.2 at `/home/forgejo/data`, where a file `forgejo` made was UID 2000; `serverb` logged no denial, before or after `restorecon`. `sudo ls -ld /home/forgejo/data` reads `forgejo forgejo`, and `mount | grep forgejo` shows the `autofs` trigger and the `nfs4` mount. `podman run` with the `-rootless` image returned in 9 seconds and the page was up at 17; `podman ps` shows the image, `Up`, and `2222/tcp, 3000/tcp`; Forgejo's own SSH server started on 2222. Inside, `id` is `uid=1000(git)`, `/bin/bash` exists, and the prompt is `servera:/var/lib/gitea$`; with it, the `forgejo admin user create` line is 127 characters, so it wraps once at 120 columns. The admin was created, and on `serverb` the `user` table held `student` as an admin and every file in `/srv/forgejo` belonged to UID 2000. The unit had `Restart=on-failure` and `RestartSec=10`; the page answered 1 second after `enable --now`, and after `forgejo` logged out, `loginctl` showed it `lingering`. After one reboot of `servera`, the page answered about 16 seconds after the reboot command, with no restarts needed (`autofs` active at 5.0 seconds, `user@2000.service` at 5.2).

Restored with `start-latest-snapshot` on `servera` and `serverb`, since the verification also added the lab key to `forgejo`'s account and host keys from test logins. Afterwards neither had Podman, PostgreSQL, `nfs-utils`, `autofs`, a `forgejo` user, or a partition on `sdb`, and every firewall allowed only `cockpit`, `dhcpv6-client`, and `ssh`.

**Round 12, 2026-11-21, a test run against the recorded data tier by mistake.** To try a specific `listen_addresses` and the `rpc-bind` and `mountd` firewall services, a script rebuilt the data tier on `serverb` without first looking at it, but you had just recorded the data tier there (the cast was saved at 10:01). Most of it failed because everything existed. What it changed: two duplicate lines appended to `/etc/fstab`; `listen_addresses = 'localhost,172.25.250.11'` added above your `'*'`; a duplicate `forgejo` line appended to `pg_hba.conf`; `/etc/exports`, the `postgresql` drop-in, and the `semanage` rule rewritten with the same content; `rpc-bind` and `mountd` added to the firewall; and `parted -s /dev/sdb mklabel gpt` on the in-use disk, which left an empty partition table on disk while the kernel kept using the old partition, so the next boot would have lost `vg_data`. PostgreSQL was not restarted. All of it was put back in the same session: partition 1 recreated with the kernel's exact sectors (2048 to 10483711, named `primary`, flag `lvm`), after which `blkid -p` at sector 2048 found the `LVM2_member` whose UUID matches the PV and LVM's devices file still names the disk by WWID and partition number; the duplicate lines and the extra `listen_addresses` line removed after checking each was the duplicate; and `rpc-bind` and `mountd` removed from the firewall. Only the partition's GUID differs from your recording, and nothing refers to it. `servera` was not touched. No reboot has confirmed the partition table yet.

**Round 13, 2026-11-21, `showmount` and a narrower `listen_addresses`** (your requests). Checked read-only first: no recording running, `servera` at the week's start, `serverb` as your data tier recording left it, which you had asked to have reverted afterwards. On `servera`, with `nfs-utils` installed: before `serverb` opened them, `showmount --exports serverb` failed at once with "clnt_create: RPC: Unable to receive" (exit 1); after `firewall-cmd --permanent --add-service=rpc-bind --add-service=mountd` and a reload, it printed "Export list for serverb:" and `/srv/forgejo servera.lab.example.com`. On `serverb`, whose only addresses are the loopback and `172.25.250.11/24` on `enp0s8`, `listen_addresses = '*'` bound `0.0.0.0:5432` and `[::]:5432`; `'localhost,172.25.250.11'`, after a restart, bound `172.25.250.11:5432`, `127.0.0.1:5432`, and `[::1]:5432`, and `servera` still connected to port 5432. Three reboots of `serverb`: each time PostgreSQL was active on those three addresses with no bind error in its journal, both volumes were mounted (which also confirmed Round 12's repaired partition table), and `servera` connected and listed the export. The order is guaranteed: `postgresql.service` is ordered after `network-online.target`, which `NetworkManager-wait-online.service` (enabled) holds until the network is up. The combined firewall line, with the root prompt, would be 121 characters, so the exercise opens the services in two commands. Restored by reverting `serverb` and `servera` with `start-latest-snapshot`; both are at the week's start.

**Round 14, 2026-11-21, the data and app tier recordings.** Both casts processed with `pnpm run casts` and checked; neither holds an identity string. Read back as text:

- **Build the Data Tier:** 10.5 minutes, 10 markers in order. Every command ran at its prompt in the file's order, both installs printed `Complete!` before their `clear`, and the outputs match Round 11, with `listen_addresses = 'localhost,172.25.250.11'`, `exportfs -v` showing the export, and the firewall listing `mountd nfs postgresql rpc-bind`. Each vim edit saved exactly the typed text: `/etc/fstab` 15 to 17 lines and 98 bytes added, `postgresql.conf` 821 lines and 45 bytes, `pg_hba.conf` 123 lines and 64 bytes, and `/etc/exports` 1 line of 41 bytes. Error-like lines: `dnf`'s "Unable to read consumer identity"; the two expected "does not contain SELinux labels" warnings from `mount -av`; and, twice during the `nfs-utils` install, "Warning: The unit file, source configuration file or drop-ins of gssproxy.service changed on disk. Run 'systemctl daemon-reload' to reload units.", which `nfs-utils`' install scriptlet causes and which two of w13's casts also show.
- **Build the App Tier:** 7.5 minutes, 7 markers in order, every command at its prompt, the three lines inside the container at `servera:/var/lib/gitea$`. `showmount --exports serverb` listed the export; `passwd` printed "BAD PASSWORD: The password is shorter than 8 characters" and "passwd: password updated successfully"; `podman ps` showed the container up for 19 seconds when the 25-second pause ended; the admin was created; the page answered before and after `forgejo` logged out. But step 3's `sudo ls -ld /home/forgejo/data` printed `root root 0` and `mount | grep forgejo` showed only the `autofs` line: `ls -ld` reads the mount point itself, which does not trigger the mount, so the recording shows the share unmounted until `podman run` mounted it. On `serverc`, serving a share to itself and then reverted, `sudo ls -ld` likewise left only the trigger, while `sudo ls -la` mounted the share, with `.` owned by the share's owner (a local bind mount there, since the server was the host itself). Step 3 now follows w13's direct map exercise: `mount | grep`, `sudo ls -la`, `mount | grep`. Cosmetic: `podman ps` prints 124- and 126-character lines, and the `forgejo admin user create` line is 127 with its prompt, so each wraps once at 120 columns. The same error-like lines as the data tier appear, plus "Warning: Permanently added 'servera'" from the first SSH login as `forgejo`.

**Round 15, 2026-11-21, the second data and app tier recordings.** You reverted the lab and recorded both again, after editing both command files: the data tier now opens `postgresql` in one `firewall-cmd` and `nfs`, `rpc-bind`, and `mountd` in the next, and the app tier's `podman run` has `-v ~/data:/var/lib/gitea:Z` on a line of its own. Both casts processed and checked, with no identity string. Read back as text, the commands in each, 54 and 28 at their prompts, are the files' commands in the files' order. The data tier's outputs and vim saves match Round 14 to the byte, and its firewall lists `cockpit dhcpv6-client mountd nfs postgresql rpc-bind ssh`. The app tier's step 3 now shows the `autofs` trigger alone, then `sudo ls -la /home/forgejo/data` with `.` owned by `forgejo`, then the trigger with the `nfs4` mount from `serverb` below it; `podman ps` showed the container up for 20 seconds after the pause, the admin was created, and the page answered three times. Error-like lines are only the known ones: `dnf`'s consumer identity notice, `nfs-utils`' `gssproxy` warnings, the data tier's two expected SELinux label warnings, and the app tier's first `ssh` host key notice. The lab is now at the end of Build the App Tier.

**Round 16, 2026-11-21, the web tier recording.** Processed and checked: 3.9 minutes, 6 markers (the title and five steps), no identity string. Read back as text, its 15 commands ran at their prompts in the file's order, both installs printed `Complete!`, `/etc/hosts` went from 7 lines and 384 bytes to 8 and 418 (the typed line and its newline), and the new `forgejo.conf` was 3 lines of 93 bytes, the three typed directives. Step 1's `curl` failed with "Could not connect to server" as intended; on `servera`, `curl` got `503 Service Unavailable` before the boolean and Forgejo's title after it, as did `workstation` by name. After the search for `port 3000`, the `sealert` screen showed "SELinux is preventing /usr/sbin/httpd from name_connect access on the tcp_socket port 3000." and, below it, "Then you must tell SELinux about this by enabling the 'httpd_can_network_connect' boolean." and `setsebool -P httpd_can_network_connect 1`. Other error-like lines: `dnf`'s consumer identity notice and the first `ssh servera` host key notice. While this recording ran, a read-only check (`ss`, `firewall-cmd --list-services`, and `curl` to port 3000 from `servera` and `workstation`) touched neither its terminal nor httpd's access log; its results are in the build order's web tier outline. The lab is now at the end of Build the Web Tier.

**Round 17, 2026-11-21, the Operate Forgejo recording.** Processed and checked: 5.8 minutes, 7 markers (the title and six steps), no identity string. Read back as text, its 19 commands ran at their prompts in the file's order, from `sudo -i` on `serverb` to the two `grep` commands on `servera`. Every file it wrote matches the typed text exactly: `/usr/local/bin/forgejo_backup.sh` new at 9 lines and 375 bytes, `/etc/cron.d/forgejo_backup` from 15 lines and 451 bytes to 16 and 546 (the 95-byte cron line), and `/etc/logrotate.d/forgejo_backup` new at 6 lines and 83 bytes. The backup's log shows `rsync` creating `forgejo-backups` and copying `forgejo_2026-11-21T18:20+00:00.sql.gz` (27,537 bytes), which `ssh servera ls -l forgejo-backups` then lists; `tail -1` shows the `0 2 * * *` line; `logrotate --force` left `/var/log/forgejo_backup.log.1.gz`. On `servera`, the first `grep` found the web tier's `503` from `::1`, and the counts were two `200`s and one `503`. Error-like lines: `dnf`'s consumer identity notice, two first-`ssh` host key notices, and the step title's own word "errors". All four exercises are now recorded, and the lab is at the end of the chain.

**Round 18, 2026-11-21, the backup with Forgejo's files** (Decision 28). Checked read-only first: no recording running, the lab at the end of your Operate Forgejo recording. On `serverb`, the new script was written over the old one, eight older run directories were seeded, and it was run under `nice` into the log. Retention kept the seven newest runs on both hosts, the dump held 128 `CREATE TABLE` statements, and `/var/backups` and `/var/backups/forgejo` were made with `var_t`, the policy's label for that path. But `tar` failed on one file: "tar: forgejo/indexers/issues.bleve/store/root.bolt: Cannot open: Resource temporarily unavailable" and "tar: Exiting with failure status due to previous errors". That is the search index's database, which Forgejo on `servera` holds open over NFS, with the `queues/common` files; the likely cause is a lease the NFS server must recall before a local read. Three more `tar` runs straight after, and plain `tar` after two restarts of Forgejo's service, all exited 0, so the failure depends on timing and cannot be reproduced on demand. With `--exclude=forgejo/indexers`, the script ran cleanly: the archive holds 35 entries, among them `app.ini` and the queue, and no index. The typed script in the command file is 11 lines and 465 bytes, the same as the verified one. Then the lab was reset to the end of Build the Web Tier: the script, the `cron.d` and `logrotate.d` files, the backup's log and its line in `/var/lib/logrotate/logrotate.status`, `/var/backups`, the recording's dump in `/var/lib/pgsql/backups`, root's `known_hosts` and `known_hosts.old` and `student`'s `known_hosts` on `serverb` (all three made by the recording's `ssh` logins), and `/root/forgejo-backups` on `servera` removed; `rsync` removed from both with `dnf history undo` of the transactions that installed it alone. Afterwards PostgreSQL and the NFS server were active on `serverb` with both volumes mounted, and httpd and Forgejo answered on `servera`.

**Round 19, 2026-11-21, the classification** (step 2). No lab access: every published fragment and exercise file under `course/chapters/` was searched for each command, option, and form the four exercises use, and each hit mapped to its week through the weekly entries' imports. Checked by hand where a pattern misled: `tar` in w06 (`-cvf`, `-xf`, `-tf`, and `-czvf` in `compression`), command substitution in w03 (`script-input`, `aliases`), `rsync -a --delete` in w04's robust sync exercise, `useradd -u` in w13's `nfs-permissions`, `systemctl cat` in w04's `systemd-services`, and `ls -la` with `--sort time` only in RH124 `command-syntax`, which no published week imports. Nothing before w15 has `2>&1`, `su ... -c`, `tar -C` or `--exclude`, `ls -t`, `tail -n +`, `systemctl edit`, `--network host`, `keep-id`, `--restart-sec`, `ProxyPass`, `httpd_can_network_connect`, or anything of PostgreSQL's.

**Round 20, 2026-11-21, the second Operate Forgejo recording.** Processed and checked: 6.1 minutes, 7 markers (the title and six steps), no identity string. Read back as text, its commands ran at their prompts in the file's order. The script was saved new at 11 lines and 465 bytes, exactly the typed text, the cron file went from 15 lines and 451 bytes to 16 and 546, and the logrotate file was saved new at 6 lines and 83 bytes. The backup's log shows no `tar` error: `rsync` created `forgejo-backups` and copied `forgejo_2026-11-21T18:41+00:00/` with `database.sql.gz` and `files.tar.gz`, and `ssh servera ls -lR forgejo-backups` listed that directory with both files (27,537 and 8,789 bytes). `tail -1` showed the `0 2 * * *` line, `logrotate --force` left `/var/log/forgejo_backup.log.1.gz`, and on `servera` the access log search found the web tier's `503` and counted two `200`s and one `503`. Error-like lines: `dnf`'s consumer identity notice and two first-`ssh` host key notices. The lab is at the end of the chain.

**Round 21, 2026-11-21, slide transcripts.** Checked read-only first: no recording running, the lab at the end of the chain, `serverc` at its snapshot. Read-only on `servera`, `serverb`, and `workstation`:

- **`psql` on `serverb`**, through a terminal as `postgres`: `postgres=# SELECT current_user` then `postgres-# ;`, which printed ` current_user` / `postgres` / `(1 row)`; `\c forgejo` printed `You are now connected to database "forgejo" as user "postgres".`; `SELECT name, is_admin FROM "user";` printed `student | t`; `\q` quit.
- **`serverb`:** `postgresql.conf` lines 60 and 61, `#listen_addresses = 'localhost'` and `listen_addresses = 'localhost,172.25.250.11'`; `pg_hba.conf`'s six default lines (`local ... peer`, `host ... 127.0.0.1/32 ident`, `host ... ::1/128 ident`, and the same three for `replication`) and the `forgejo` line; `systemctl cat postgresql`'s header, "It's not recommended to modify this file in-place, because it will be overwritten during package upgrades.  It is recommended to use systemd "dropin" feature;"; `ls -ld /srv/forgejo` with `forgejo forgejo`, and its entries as `2000 2000` under `ls -ln` and `forgejo forgejo` under `ls -l`.
- **`servera`:** `ps -o user,uid,comm -C gitea` printed `forgejo 2000 gitea`; `ss` showed `*:80` (httpd), `*:2222` and `*:3000` (gitea); the firewall listed `cockpit dhcpv6-client http ssh`; `mount | grep forgejo` showed the `autofs` trigger and the `nfs4` mount; as root, `ls -ln /home/forgejo/data` showed `2000 2000` entries and "Permission denied" for the private directories `git`, `custom`, and `indexers`, since root is squashed on the share. `seq 10 | tail -n 8` printed 3 to 10 and `seq 10 | tail -n +8` printed 8 to 10.
- **`workstation`:** `curl git.lab.example.com:3000` failed with "curl: (7) Failed to connect to git.lab.example.com port 3000 after 0 ms: Could not connect to server" (exit 7), and `curl -s git.lab.example.com | grep '<title>'` printed Forgejo's title.
- **`serverc`**, for the error before initializing: after `dnf install -y postgresql-server`, `systemctl start postgresql` failed ("Job for postgresql.service failed because the control process exited with error code."), and the journal read "Directory "/var/lib/pgsql/data" is missing or empty.", "Use "/usr/bin/postgresql-setup --initdb"", "to initialize the database cluster.", and "See /usr/share/doc/postgresql16/README.rpm-dist for more information."; `/var/lib/pgsql/data` was empty. `serverc` was reverted with `start-latest-snapshot serverc`.

Nothing on the chain's hosts was changed. To-verify item 8 is answered by the first and last of these.

**To verify before building:**

1. Forgejo's standard image on a rootless bind mount: answered in Round 5 (Decision 8).
2. Forgejo's SSH port under `--network host`: answered in Round 5 (Decision 9).
3. PostgreSQL reached from `servera`: answered in Round 5 (Decision 10).
4. The data on `/srv/db`: answered in Round 6, with the real logical volume, its `/etc/fstab` line, `systemctl edit`'s keystrokes replayed in vim, and a reboot (Decision 14).
5. `rsync` as `root` from `serverb` to `servera` with no prompt: answered in Round 6 (Decision 11).
6. Forgejo's proxy drop-in, and `--network host` across a reboot: answered in Round 6 (Decisions 15 and 16).
7. The time: estimated under "Exercises"; a live dry run will time it (Decision 16).
8. Answered in Round 21. For the PostgreSQL fragment, from a transcript at step 4: what `psql` shows when a statement lacks its `;`, `\q`'s exit, and what the service says when started before `postgresql-setup --initdb` (Decision 24).
9. For slide 6.3: that `app.ini` holds secrets Forgejo generated at its first start (`SECRET_KEY`, `INTERNAL_TOKEN`), and that losing `SECRET_KEY` breaks users' two-factor logins, from Forgejo's documentation or a test on `serverc`.

**Round 22, 2026-11-22, fragment 2.** Fragment 2 shows no command or output, so it had nothing to capture. Its one claim about the lab, 2.5's first bottom line, rested on Round 21: the first admin was still in PostgreSQL after Build the App Tier's step 6 deleted the container. That line has since been replaced, and the slide moved to fragment 1 as 1.5a. This session ran on a machine whose lab has not run the exercise chain, so a read-only check found no `forgejo` user on `servera` and no `postgres` account on `serverb`. Nothing was changed on that lab.

**Round 23, 2026-11-22, fragment 3's transcripts.** This machine's lab was at its snapshot, with no PostgreSQL on `serverb`. As root on `serverb`, in exercise order but with `/srv/db/pgsql` as a plain directory instead of a logical volume, since no transcript here shows the volume:

- **Before the install:** `rpm -q postgresql-server` printed "package postgresql-server is not installed", and `semanage fcontext -l | grep '^/var/lib/pgsql('` printed the `postgresql_db_t` rule, so the rule comes with RHEL's policy.
- **After `dnf install -y postgresql-server`:** `postgres` is UID 26 with home `/var/lib/pgsql` and shell `/bin/bash`. `systemctl is-enabled postgresql` printed `disabled`, and `/var/lib/pgsql/data` was empty. `systemctl cat postgresql | head -6` printed the unit's path and its five-line comment against editing it in place.
- **The drop-in:** written as `override.conf` with `[Service]` and `Environment=PGDATA=/srv/db/pgsql/data`, then `daemon-reload`. `systemctl cat postgresql | tail -3` matched the recording.
- **Before initializing:** `systemctl start postgresql` failed (exit 1) with "Job for postgresql.service failed because the control process exited with error code.". The journal read `Directory "/srv/db/pgsql/data" is missing or empty.`, then `Use "/usr/bin/postgresql-setup --initdb"`. Earlier the same day, with the default `PGDATA`, it named `/var/lib/pgsql/data` instead.
- **Initializing:** `postgresql-setup --initdb` printed the two lines the recording shows, and then `systemctl start` succeeded and `is-active` printed `active`.
- **Listening:** `ss -ltn | grep 5432` showed `127.0.0.1` and `[::1]`. With `listen_addresses = 'localhost,172.25.250.11'` inserted below line 60's commented default, so as line 61, and a restart, it added `172.25.250.11`.
- **`pg_hba.conf`:** its six default lines are `local ... peer` and `host` from `127.0.0.1/32` and `::1/128` with `ident`, each for `all` and for `replication`.
- **`psql`:** run under `script` as `postgres`, so it had a terminal. `SELECT current_user` without its `;` left the `postgres-#` prompt, and `;` then printed ` current_user` / `postgres` / `(1 row)`.

`serverb` was reverted with `start-latest-snapshot serverb` twice, after each capture batch. Each time, `postgresql-server` was gone, along with `/srv/db` and the drop-in directory, and the clock was set to the host's. One earlier attempt, piping keystrokes into `pnpm lab -- --tty`, hung and was stopped.

**Round 24, 2026-11-23, fragment 3's rework.** Read-only, on `serverb` with the data tier built: `postgresql-server-16.8-1.el10_0` installed, the service active, and the drop-in in place. Nothing was changed.

- **`systemctl cat postgresql`:** the unit's path, its five-line comment against editing it in place, and a blank line; `[Unit]` with `Description=PostgreSQL database server`, a comment, and `After=network-online.target`; `[Service]` with `Type=notify`, then `User=postgres` and `Group=postgres`, the `OOMScoreAdjust` and `PG_OOM_ADJUST_*` settings, `Environment=PGDATA=/var/lib/pgsql/data`, `ExecStartPre=/usr/libexec/postgresql-check-db-dir %N`, `ExecStart=/usr/bin/postgres -D ${PGDATA}`, and the rest; `[Install]`; then, after a blank line, the drop-in's path and its two lines. `systemctl cat postgres` printed "No files found for postgres.service." and exited 1.
- **The editor `systemctl edit` opens:** `EDITOR`, `VISUAL`, and `SYSTEMD_EDITOR` are unset, `editor` and `nano` are not installed, and `vim` and `vi` are. `systemctl` tries `editor`, `nano`, `vim`, then `vi`, so it opens `vim`.
- **`/usr/bin/postgresql-setup`** (8.9, built against 16.8): run as root, it runs itself again as `postgres` with `runuser`. It takes `PGDATA` from `systemctl show -p Environment postgresql.service`, so a drop-in's value counts, and refuses a directory that already holds `PG_VERSION` with "Data directory ... is not empty!". It then runs `initdb --pgdata=... --auth=ident`, logging to `/var/lib/pgsql/initdb_postgresql.log`, and makes `log` in the data directory. Its `--help` calls `--initdb` "usually the first action you perform after PostgreSQL server installation".
- **`/srv/db/pgsql/data`:** `postgres:postgres`, mode `700`, holding `postgresql.conf`, `pg_hba.conf`, `pg_ident.conf`, `postgresql.auto.conf`, `PG_VERSION`, `base`, `global`, `pg_wal`, and the other subdirectories, plus the running server's `postmaster.pid`.
- **`postgresql.conf`:** line 60 is the commented default, `#listen_addresses = 'localhost'`, with "what IP address(es) to listen on;", and line 61 the exercise's `listen_addresses = 'localhost,172.25.250.11'`; the comment goes on "comma-separated list of addresses;" and "defaults to 'localhost'; use '*' for all".
- **`pg_hba.conf`:** its header says "This file controls: which hosts are allowed to connect, how clients are authenticated, which PostgreSQL user names they can use, which databases they can access." The six default lines come first and the exercise's `host` line last.

**Round 25, 2026-11-24, fragment 4's redraft.** Read-only, on `servera` with the app tier built: `forgejo` is UID 2000 and lingering, Podman and `autofs` are installed, and `autofs` is active. Nothing was changed.

- **`app.ini`**, read as `forgejo`, since root is squashed on the share, and only for these keys: `ROOT_URL = http://git.lab.example.com/` under `[server]`; `DB_TYPE = postgres`, `HOST = serverb.lab.example.com:5432`, `NAME = forgejo`, and `USER = forgejo` under `[database]`; `INSTALL_LOCK = true` under `[security]`.
- **`ps -o user,uid,comm -C gitea`:** `forgejo 2000 gitea`.
- **The user service:** `systemctl --user show container-forgejo` gave `Restart=on-failure`, `RestartUSec=10s`, `StartLimitBurst=5`, and `StartLimitIntervalUSec=10s`.
- **The recording**, read as text: `podman ps` showed the container `Up 20 seconds` with `2222/tcp, 3000/tcp`, and at `servera:/var/lib/gitea$` the admin step printed "New user 'student' has been successfully created!".
- **Icons:** every Carbon name 4.3, 4.7, and 4.10 use is in the installed set.

## Open questions

Questions 1 to 7 were answered on 2026-11-19; see Decisions 7 to 12 and 18. None is open.
