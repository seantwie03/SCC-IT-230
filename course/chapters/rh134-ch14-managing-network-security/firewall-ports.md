---
layout: section
routeAlias: firewall-ports
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
    - title: Configure Apache to Listen on 8888 Exercise
      source: ./exercises/configure-apache-to-listen-on-8888-exercise.html
---

# Open Ports

---
listSpacing: padded
---

# Non-standard Ports

- Only one process can listen on a port
- A server running several web services has to move the extras somewhere else

<TerminalWindow title="student@servera:~">

```bash-session
student@servera:~$ sudo firewall-cmd --add-port=8888/tcp
success
student@servera:~$ sudo firewall-cmd --list-all
public (default, active)
  ...output omitted...
  services: cockpit dhcpv6-client http ssh
  ports: 8888/tcp
```

</TerminalWindow>

A port is written `port/protocol`, so `8888/tcp` rather than `8888`

---

# Specifying a Port in a URL

> `http://hostname:port/path`

| Part | Example |
| --- | --- |
| Default | `http://servera` |
| With port | `http://servera:8888` |
| With path | `http://servera:8888/index.html` |

With no port, the browser uses the default for the scheme: <AccentText>80</AccentText> for `http` and <AccentText>443</AccentText> for `https`

---
layout: exercise
---

# Configure Apache to Listen on 8888

::goal::

Move the web server on `servera` to port 8888, and find out what stops it

::environment::

**Host:** `servera`, from `workstation`

**Prerequisite exercise:** Allow HTTP Traffic

::workflow::

1. Allow `8888/tcp` in the firewall, permanently
2. Point Apache's `Listen` line at 8888
3. Restart `httpd` and watch it fail
4. Confirm SELinux is the cause, then put it back
5. Read what `sealert` recommends

---
layout: exercise
variant: recording
---

<script setup>
import castUrl from "./exercises/configure-apache-to-listen-on-8888-exercise.cast?url";
</script>

# Configure Apache to Listen on 8888

::recording::

<AsciinemaPlayer
    :src="castUrl"
    label="Screen recording of the instructor permanently opening 8888/tcp in the firewall, changing Apache's Listen line to 8888 in vim, restarting httpd and reading the permission denied error in its status, switching SELinux to permissive to show httpd starts and back to enforcing, then installing setroubleshoot-server and reading the sealert report that recommends modifying the port type."
/>

::resources::

<a href="../resources/configure-apache-to-listen-on-8888-exercise.html" target="_blank" rel="noopener noreferrer" aria-label="Read the written Configure Apache to Listen on 8888 exercise in a new tab">Written exercise</a>
