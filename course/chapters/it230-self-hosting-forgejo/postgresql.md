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
root@serverb:~# semanage fcontext -l | grep '^/var/lib/pgsql('
/var/lib/pgsql(/.*)?                               all files          system_u:object_r:postgresql_db_t:s0
```

</TerminalWindow>

Data anywhere else needs a rule of its own, and a new file system has no labels

<TerminalWindow title="root@serverb:~">

```bash-session
root@serverb:~# semanage fcontext -a -t postgresql_db_t '/srv/db(/.*)?'
root@serverb:~# restorecon -Rv /srv/db
Relabeled /srv/db from system_u:object_r:unlabeled_t:s0 to system_u:object_r:postgresql_db_t:s0
Relabeled /srv/db/pgsql from unconfined_u:object_r:unlabeled_t:s0 to unconfined_u:object_r:postgresql_db_t:s0
```

</TerminalWindow>

---

# Use a Custom Data Directory

PostgreSQL stores its data in `/var/lib/pgsql/data` by default

```ini [/usr/lib/systemd/system/postgresql.service]
[Service]
Environment=PGDATA=/var/lib/pgsql/data
```

We want to use `/srv/db` because it is on a separate Logical Volume

Setting `PGDATA=/srv/db/pgsql/data` in a systemd <AccentText>drop-in</AccentText> overrides the package default

---

# Easily Create Systemd Drop-In Files

`systemctl edit postgresql` opens a drop-in file in `vim`

<TextExplainer
  size="sm"
  :lines="[
    '### Editing /etc/systemd/system/postgresql.service.d/override.conf',
    '### Anything between here and the comment below will become the contents of the drop-in file',
    '',
    '[Service]',
    'Environment=PGDATA=/srv/db/pgsql/data',
    '### Edits below this comment will be discarded',
  ]"
  :steps="[
    { line: 1, text: '/etc/systemd/system/postgresql.service.d/override.conf', explanation: 'The drop-in that systemctl edit postgresql opens in vim' },
    { line: 4, explanation: 'The section the directive belongs to, as in the unit file' },
    { line: 5, explanation: 'Only the directives to add or override: here, just PGDATA' },
    { line: 6, explanation: 'Below this line: the package unit file, for reference only' },
  ]"
/>

---

# View the Full Systemd Unit

`systemctl cat` shows the full Systemd Unit with any drop-in files

```[systemctl cat postgresql (abridged)] {1,2,5,8-10}
# /usr/lib/systemd/system/postgresql.service
[Service]
User=postgres
Group=postgres
Environment=PGDATA=/var/lib/pgsql/data
...output omitted...

# /etc/systemd/system/postgresql.service.d/override.conf
[Service]
Environment=PGDATA=/srv/db/pgsql/data
```

---
listSpacing: padded
---

# Initialize the Database

**<AccentText>Before starting the service</AccentText>**, you must run `postgresql-setup --initdb`

<TerminalWindow title="root@serverb:~">

```bash-session
root@serverb:~# postgresql-setup --initdb
 * Initializing database in '/srv/db/pgsql/data'
 * Initialized, logs are in /var/lib/pgsql/initdb_postgresql.log
```

</TerminalWindow>

- Reads `PGDATA` from the `postgresql` service, drop-ins included
- Switches to the `postgres` user, which will own the files
- Creates the database files, including configuration files

---

# postgresql.conf

- In the data directory: `/srv/db/pgsql/data/postgresql.conf`
- Holds the server's settings, one `name = value` per line

<TextExplainer
  :lines="[
    'listen_addresses = \'localhost,172.25.250.11\'',
  ]"
  :steps="[
    { text: 'listen_addresses', explanation: 'The addresses PostgreSQL listens on' },
    { text: 'localhost', explanation: 'The default: connections from serverb itself' },
    { text: '172.25.250.11', explanation: 'Also serverb\'s lab address, so servera can reach it' },
  ]"
/>

---

# pg_hba.conf

- Also in the data directory: `/srv/db/pgsql/data/pg_hba.conf`
- Host-based authentication: who may connect, and how they prove it

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
