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

# Some Predefined Services

Firewalld has `services` so you don't have to memorize ports

| Service         | Ports          | What it is            |
|-----------------|----------------|-----------------------|
| `ssh`           | 22/tcp         | Remote login          |
| `http`          | 80/tcp         | Web server            |
| `https`         | 443/tcp        | Web server, encrypted |
| `cockpit`       | 9090/tcp       | The web console       |
| `dns`           | 53/tcp, 53/udp | Name server           |

The three already open on `servera` are `cockpit`, `dhcpv6-client`, and `ssh`

---

# Firewalld Services

A service is a name for the ports one program needs

<TerminalWindow title="student@servera:~">

```bash-session
student@servera:~$ sudo firewall-cmd --get-services
cockpit dhcp dhcpv6-client dns dns-over-tls docker-registry factorio ftp git grafana http http3 https imap libvirt mosh
minecraft mountd mqtt mysql nfs nfs3 ntp opentelemetry pop3 rpc-bind samba smtp ssh syncthing syslog telnet vnc-server
...output omitted...
```

</TerminalWindow>

Builtin definitions live in `/usr/lib/firewalld/services/`

```xml [/usr/lib/firewalld/services/http.xml]
<service>
  <short>WWW (HTTP)</short>
  <description>HTTP is the protocol used to serve Web pages. ...</description>
  <port protocol="tcp" port="80"/>
</service>
```


User-created services go in `/etc/firewalld/services/`

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

---
layout: exercise
variant: recording
---

<script setup>
import castUrl from "./exercises/allow-http-traffic-exercise.cast?url";
</script>

# Allow HTTP Traffic

::recording::

<AsciinemaPlayer
    :src="castUrl"
    label="Screen recording of the instructor installing httpd on servera and writing a page, enabling and starting the service, getting connection refused from curl on workstation, listing the zone's services and finding no http, adding the http service, loading the page from workstation, then keeping the change with --runtime-to-permanent."
/>

::resources::

<a href="../resources/allow-http-traffic-exercise.html" target="_blank" rel="noopener noreferrer" aria-label="Read the written Allow HTTP Traffic exercise in a new tab">Written exercise</a>
