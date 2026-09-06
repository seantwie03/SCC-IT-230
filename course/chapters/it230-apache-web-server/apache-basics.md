---
layout: section
routeAlias: apache-basics
topicInfo:
  alignments:
    rhcsaCertGuide:
      - chapter: "21"
        title: Managing Apache HTTP Services
  exercises:
    - title: Serving a Web Page Exercise
      source: ./exercises/serving-a-web-page-exercise.html
---

# Apache Web Server

## Linux's killer app

---
vertical: center
---

# What a Web Server Does

Apache listens on a port, and hands back files when a browser asks for them

| Component | Value |
| --- | --- |
| Package | `httpd` |
| Service | `httpd.service` |
| Service account | `apache`, the `nologin` account from the cron chapter |
| Configuration | `/etc/httpd/conf/httpd.conf` |
| Content | `/var/www/html/` |
| Logs | `/var/log/httpd/` |

---

# Two Directives Matter Today

```bash [/etc/httpd/conf/httpd.conf]
Listen 80

DocumentRoot "/var/www/html"

<Directory "/var/www">
    AllowOverride None
    Require all granted
</Directory>
```

`Listen` is the port it answers on

`DocumentRoot` is the directory it serves from, and nothing outside it is reachable

---

# URLs Are Paths Under DocumentRoot

| File on disk | URL |
| --- | --- |
| `/var/www/html/index.html` | `http://servera/` |
| `/var/www/html/mission.html` | `http://servera/mission.html` |
| `/var/www/html/about/index.html` | `http://servera/about/` |
| `/var/www/html/about/contact-us.html` | `http://servera/about/contact-us.html` |

A request for a directory gets that directory's `index.html`

---

# Starting It

`httpd` ships <DangerText>disabled</DangerText>, so installing it does not start anything

<TerminalWindow title="root@servera:~" :rows="6">

```bash-session {*}{lines:false}
root@servera:~# systemctl is-enabled httpd
disabled
root@servera:~# systemctl enable --now httpd
Created symlink '/etc/systemd/system/multi-user.target.wants/httpd.service' → '/usr/lib/systemd/system/httpd.service'.
```

</TerminalWindow>

Everything you learned about `systemctl` last week applies unchanged

---

# Two Things Stand Between You and a Page

<TerminalWindow title="student@workstation:~" :rows="6">

```bash-session
student@workstation:~$ curl http://localhost/
<h1>Welcome to servera</h1>
student@workstation:~$ curl http://servera/
curl: (28) Failed to connect to servera port 80: Connection timed out
```

</TerminalWindow>

Locally it works and remotely it does not, because `firewalld` is running

<Callout type="warning">

`firewall-cmd --add-service=http --permanent` then `firewall-cmd --reload` opens port 80. SELinux is the other gatekeeper, and that is next week.

</Callout>

---
layout: exercise
---

# Serving a Web Page

::goal::

Stand up a web server, publish two pages, and reach them from another machine

::environment::

**Hosts:** `servera` and `workstation`

::workflow::

1. Install `httpd` on `servera`
2. Write a home page under the DocumentRoot
3. Enable and start the service, then fetch the page locally
4. Add a page in a subdirectory and fetch it by its URL
5. Open the firewall and fetch both pages from `workstation`
