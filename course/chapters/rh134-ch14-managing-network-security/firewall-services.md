---
layout: section
routeAlias: firewall-services
topicInfo:
  alignments:
    redHatAcademy:
      - course: RH134
        chapter: "14"
        title: Managing Network Security
    rhcsaCertGuide:
      - chapter: "23"
        title: Configuring a Firewall
  exercises:
    - title: Allow HTTP Traffic Exercise
      source: ./exercises/allow-http-traffic-exercise.html
---

# Open Services

---
layout: two-cols-header
leftWidth: 64
---

# Firewalld Services

A service is a name for the ports one program needs

::left::

<TerminalWindow title="student@servera:~">

```bash-session
student@servera:~$ sudo firewall-cmd --get-services
0-AD RH-Satellite-6 afp amanda-client
amqp audit bacula bgp bitcoin ceph
...output omitted...
student@servera:~$ sudo firewall-cmd --get-services | wc -w
259
```

</TerminalWindow>

::right::

```xml [http.xml]
<service>
  <short>WWW (HTTP)</short>
  <description>HTTP is the
  protocol used to serve
  Web pages. ...</description>
  <port protocol="tcp"
        port="80"/>
</service>
```

::bottom::

Shipped definitions live in `/usr/lib/firewalld/services/`

User-created services go in `/etc/firewalld/services/`

---

# Some Predefined Services

You open a service by name, and `firewalld` knows the ports

| Service         | Ports          | What it is            |
|-----------------|----------------|-----------------------|
| `ssh`           | 22/tcp         | Remote login          |
| `http`          | 80/tcp         | Web server            |
| `https`         | 443/tcp        | Web server, encrypted |
| `cockpit`       | 9090/tcp       | The web console       |
| `dns`           | 53/tcp, 53/udp | Name server           |

The three already open on `servera` are `cockpit`, `dhcpv6-client`, and `ssh`

---
layout: exercise
---

# Allow HTTP Traffic

::goal::

Install a web server on `servera` and let `workstation` reach it

::environment::

**Host:** `servera`, from `workstation`

::workflow::

1. Install `httpd` and write a page
2. Enable and start the service
3. Request the page from `workstation` and watch it fail
4. Inspect what the zone allows
5. Allow the `http` service
6. Request the page again
7. Keep the change with `--runtime-to-permanent`
