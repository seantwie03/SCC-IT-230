---
layout: section
routeAlias: postgresql
topicInfo:
  alignments:
    redHatAcademy:
      - course: RH134
        chapter: "19"
        title: Comprehensive Review
  exercises:
    - title: Build the Data Tier Exercise
      source: ./exercises/build-the-data-tier-exercise.html
---

# PostgreSQL

## The data tier's database

---
vertical: center
---

# PostgreSQL on RHEL

| What    | On RHEL 10                                     |
|---------|------------------------------------------------|
| Package | `postgresql-server` 16.8, from AppStream       |
| Client  | `psql`, in `postgresql`, installed with it     |
| Account | `postgres`, UID 26, home `/var/lib/pgsql`      |
| Service | `postgresql`, not enabled                      |
| Data    | `/var/lib/pgsql/data`, empty until initialized |
| Network | Port 5432, the firewall service `postgresql`   |

---

# SELinux Already Knows PostgreSQL

RHEL's policy has a rule for `/var/lib/pgsql` before PostgreSQL is installed

<TerminalWindow title="root@serverb:~">

```bash-session
root@serverb:~# rpm -q postgresql-server
package postgresql-server is not installed
root@serverb:~# semanage fcontext -l | grep '^/var/lib/pgsql('
/var/lib/pgsql(/.*)?                               all files          system_u:object_r:postgresql_db_t:s0
```

</TerminalWindow>

Data anywhere else needs a rule of its own, and a new file system has no labels

<TerminalWindow title="root@serverb:~">

```bash-session
root@serverb:~# ls -ldZ /srv/db /srv/db/pgsql
drwxr-xr-x. 3 root     root     system_u:object_r:unlabeled_t:s0     19 Nov 21 17:11 /srv/db
drwx------. 2 postgres postgres unconfined_u:object_r:unlabeled_t:s0  6 Nov 21 17:11 /srv/db/pgsql
root@serverb:~# semanage fcontext -a -t postgresql_db_t '/srv/db(/.*)?'
root@serverb:~# restorecon -Rv /srv/db
Relabeled /srv/db from system_u:object_r:unlabeled_t:s0 to system_u:object_r:postgresql_db_t:s0
Relabeled /srv/db/pgsql from unconfined_u:object_r:unlabeled_t:s0 to unconfined_u:object_r:postgresql_db_t:s0
```

</TerminalWindow>

---

# Change a Unit Without Editing It

A package update replaces its unit file, so add a <AccentText>drop-in</AccentText> instead

<TerminalWindow title="root@serverb:~" :rows="16">

````md magic-move
```bash-session
#^ 1. The unit file says not to edit it
root@serverb:~# systemctl cat postgresql | head -6
# /usr/lib/systemd/system/postgresql.service
# It's not recommended to modify this file in-place, because it will be
# overwritten during package upgrades.  It is recommended to use systemd
# "dropin" feature;  i.e. create file with suffix .conf under
# /etc/systemd/system/UNITNAME.service.d directory overriding the
# unit's defaults.  Look at systemd.unit(5) manual page for more info.
```
```bash-session
#^ 1. The unit file says not to edit it
root@serverb:~# systemctl cat postgresql | head -6
# /usr/lib/systemd/system/postgresql.service
# It's not recommended to modify this file in-place, because it will be
# overwritten during package upgrades.  It is recommended to use systemd
# "dropin" feature;  i.e. create file with suffix .conf under
# /etc/systemd/system/UNITNAME.service.d directory overriding the
# unit's defaults.  Look at systemd.unit(5) manual page for more info.
#^ 2. systemctl edit writes a drop-in
root@serverb:~# systemctl edit postgresql
Successfully installed edited file '/etc/systemd/system/postgresql.service.d/override.conf'.
```
```bash-session
#^ 1. The unit file says not to edit it
root@serverb:~# systemctl cat postgresql | head -6
# /usr/lib/systemd/system/postgresql.service
# It's not recommended to modify this file in-place, because it will be
# overwritten during package upgrades.  It is recommended to use systemd
# "dropin" feature;  i.e. create file with suffix .conf under
# /etc/systemd/system/UNITNAME.service.d directory overriding the
# unit's defaults.  Look at systemd.unit(5) manual page for more info.
#^ 2. systemctl edit writes a drop-in
root@serverb:~# systemctl edit postgresql
Successfully installed edited file '/etc/systemd/system/postgresql.service.d/override.conf'.
#^ 3. The drop-in comes last, so its PGDATA wins
root@serverb:~# systemctl cat postgresql | tail -3
# /etc/systemd/system/postgresql.service.d/override.conf
[Service]
Environment=PGDATA=/srv/db/pgsql/data
```
````

</TerminalWindow>

---

# Initialize the Database

<TerminalWindow title="root@serverb:~" :rows="12">

````md magic-move
```bash-session
#^ 1. With no database in PGDATA, the service fails
root@serverb:~# systemctl start postgresql
Job for postgresql.service failed because the control process exited with error code.
See "systemctl status postgresql.service" and "journalctl -xeu postgresql.service" for details.
```
```bash-session
#^ 1. With no database in PGDATA, the service fails
root@serverb:~# systemctl start postgresql
Job for postgresql.service failed because the control process exited with error code.
See "systemctl status postgresql.service" and "journalctl -xeu postgresql.service" for details.
#^ 2. postgresql-setup --initdb creates one
root@serverb:~# postgresql-setup --initdb
 * Initializing database in '/srv/db/pgsql/data'
 * Initialized, logs are in /var/lib/pgsql/initdb_postgresql.log
```
```bash-session
#^ 1. With no database in PGDATA, the service fails
root@serverb:~# systemctl start postgresql
Job for postgresql.service failed because the control process exited with error code.
See "systemctl status postgresql.service" and "journalctl -xeu postgresql.service" for details.
#^ 2. postgresql-setup --initdb creates one
root@serverb:~# postgresql-setup --initdb
 * Initializing database in '/srv/db/pgsql/data'
 * Initialized, logs are in /var/lib/pgsql/initdb_postgresql.log
#^ 3. Now the service starts
root@serverb:~# systemctl start postgresql
root@serverb:~# systemctl is-active postgresql
active
```
````

</TerminalWindow>

The journal says why: `Directory "/srv/db/pgsql/data" is missing or empty.`

The data goes one directory below the mount point, as PostgreSQL recommends

---

# Two Configuration Files

`postgresql.conf` holds the server's settings; `pg_hba.conf` says who may connect

<TerminalWindow title="root@serverb:~" :rows="14">

````md magic-move
```bash-session
#^ 1. By default, PostgreSQL listens only on localhost
root@serverb:~# ss -ltn | grep 5432
LISTEN 0      200        127.0.0.1:5432      0.0.0.0:*
LISTEN 0      200            [::1]:5432         [::]:*
```
```bash-session
#^ 1. By default, PostgreSQL listens only on localhost
root@serverb:~# ss -ltn | grep 5432
LISTEN 0      200        127.0.0.1:5432      0.0.0.0:*
LISTEN 0      200            [::1]:5432         [::]:*
#^ 2. listen_addresses adds serverb's lab address
root@serverb:~# grep -n listen_addresses /srv/db/pgsql/data/postgresql.conf
60:#listen_addresses = 'localhost'		# what IP address(es) to listen on;
61:listen_addresses = 'localhost,172.25.250.11'
```
```bash-session
#^ 1. By default, PostgreSQL listens only on localhost
root@serverb:~# ss -ltn | grep 5432
LISTEN 0      200        127.0.0.1:5432      0.0.0.0:*
LISTEN 0      200            [::1]:5432         [::]:*
#^ 2. listen_addresses adds serverb's lab address
root@serverb:~# grep -n listen_addresses /srv/db/pgsql/data/postgresql.conf
60:#listen_addresses = 'localhost'		# what IP address(es) to listen on;
61:listen_addresses = 'localhost,172.25.250.11'
#^ 3. After a restart, it listens there too
root@serverb:~# systemctl restart postgresql
root@serverb:~# ss -ltn | grep 5432
LISTEN 0      200    172.25.250.11:5432      0.0.0.0:*
LISTEN 0      200        127.0.0.1:5432      0.0.0.0:*
LISTEN 0      200            [::1]:5432         [::]:*
```
````

</TerminalWindow>

Listening is not permission: `pg_hba.conf` and the firewall decide who connects

---
horizontal: center
vertical: center
---

# A pg_hba.conf Line

<TextExplainer
  size="sm"
  :lines="[
    'host    forgejo    forgejo    172.25.250.10/32    scram-sha-256',
  ]"
  :steps="[
    { text: 'host', explanation: 'Connection type: over the network' },
    { text: 'forgejo', occurrence: 1, explanation: 'Database: only the forgejo database' },
    { text: 'forgejo', occurrence: 2, explanation: 'User: only the forgejo user' },
    { text: '172.25.250.10/32', explanation: 'Client address: servera, and only servera' },
    { text: 'scram-sha-256', explanation: 'Method: a password, never sent in the clear' },
  ]"
/>

The default lines allow only connections from `serverb` itself

---

# psql

<TerminalWindow title="root@serverb:~" :rows="15">

````md magic-move
```bash-session
#^ 1. A statement without its ; waits for more
root@serverb:~# su - postgres
postgres@serverb:~$ psql
psql (16.8)
Type "help" for help.

postgres=# SELECT current_user
postgres-#
```
```bash-session
#^ 1. A statement without its ; waits for more
root@serverb:~# su - postgres
postgres@serverb:~$ psql
psql (16.8)
Type "help" for help.

postgres=# SELECT current_user
postgres-# ;
 current_user
--------------
 postgres
(1 row)

postgres=# \q
postgres@serverb:~$
```
````

</TerminalWindow>

As `postgres`, `psql` logs in as the database user of the same name

SQL ends with `;`, but `psql`'s own commands, such as `\q`, do not

---

# A Database and Its Owner

<TerminalWindow title="postgres@serverb:~">

```bash-session
postgres=# CREATE USER forgejo WITH PASSWORD 'redhat';
CREATE ROLE
postgres=# CREATE DATABASE forgejo OWNER forgejo;
CREATE DATABASE
```

</TerminalWindow>

PostgreSQL calls users <AccentText>roles</AccentText>, so `CREATE USER` answers `CREATE ROLE`

The owner may create tables in its database, which Forgejo does when it first starts

---
layout: exercise
---

# Build the Data Tier

::goal::

Hold Forgejo's database and files on `serverb`

::environment::

**Host:** `serverb`

::workflow::

1. Tune `serverb` for throughput performance
2. Install PostgreSQL and the NFS server
3. Create logical volumes for PostgreSQL's data and Forgejo's files
4. Prepare the logical volume for PostgreSQL
5. Initialize PostgreSQL on its logical volume
6. Allow the `forgejo` user to connect to PostgreSQL from `servera`
7. Start PostgreSQL and create the `forgejo` user and database
8. Share Forgejo's logical volume with `servera` over NFS
9. Open the firewall for PostgreSQL and NFS

---
layout: exercise
variant: recording
---

<script setup>
import castUrl from "./exercises/build-the-data-tier-exercise.cast?url";
</script>

# Build the Data Tier

::recording::

<AsciinemaPlayer
    :src="castUrl"
    label="Screen recording of the instructor on serverb setting the throughput-performance tuned profile, installing PostgreSQL and the NFS server, partitioning sdb and creating the logical volumes lv_db and lv_forgejo in vg_data, mounting them at /srv/db and /srv/forgejo through /etc/fstab, labeling /srv/db for PostgreSQL with semanage fcontext and restorecon, pointing PostgreSQL at it with systemctl edit and initializing it, setting listen_addresses and adding a pg_hba.conf line for servera, creating the forgejo user and database in psql, sharing /srv/forgejo with servera over NFS as the forgejo user with UID 2000, and opening the firewall for PostgreSQL and NFS."
/>

::resources::

<a href="../resources/build-the-data-tier-exercise.html" target="_blank" rel="noopener noreferrer" aria-label="Read the written Build the Data Tier exercise in a new tab">Written exercise</a>
