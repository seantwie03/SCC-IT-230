---
layout: section
routeAlias: container-services
topicInfo:
  alignments:
    redHatAcademy:
      - course: RH134
        chapter: "17"
        title: Managing Containers with Podman
  exercises:
    - title: Run a Container as a Service Exercise
      source: ./exercises/run-a-container-as-a-service-exercise.html
---

# Containers as Services

---
vertical: center
---

# Run Containers with Systemd

<TextExplainer
  :lines="[
    'podman generate systemd --new --files --name \\',
    '  --wants podman-user-wait-network-online.service \\',
    '  --after podman-user-wait-network-online.service con01',
  ]"
  :steps="[
    { line: 1, text: 'generate systemd', explanation: 'Write a systemd unit that runs a container' },
    { line: 1, text: '--new', explanation: 'Each start creates a fresh container, and each stop removes it' },
    { line: 1, text: '--files', explanation: 'Save the unit in the current directory instead of printing it' },
    { line: 1, text: '--name', explanation: 'Name the unit after the container, not its ID' },
    { line: 2, text: '--wants', explanation: 'Also start the unit that waits for the host network' },
    { line: 3, text: '--after', explanation: 'Start only once the network is up, so the published port works after a reboot' },
    { line: 3, text: 'con01', explanation: 'The running container whose podman run command the unit copies' },
  ]"
/>

Podman 5 marks `generate systemd` deprecated in favor of Quadlet, but it still works on RHEL 10, and it is how RHEL 9 teaches containers as services

---

# Generating a Unit

<TerminalWindow title="student@servera:~">

```bash-session
student@servera:~$ mkdir -p ~/.config/systemd/user
student@servera:~$ cd ~/.config/systemd/user
student@servera:~/.config/systemd/user$ podman generate systemd --new --files --name \
> --wants podman-user-wait-network-online.service \
> --after podman-user-wait-network-online.service con01

DEPRECATED command:
It is recommended to use Quadlets for running containers and pods under systemd.

Please refer to podman-systemd.unit(5) for details.
/home/student/.config/systemd/user/container-con01.service
student@servera:~/.config/systemd/user$ podman rm -f con01
con01
```

</TerminalWindow>

A user's own units live in `~/.config/systemd/user`, and the deprecation warning is expected

With `--new`, the unit runs its own copy of the `podman run` command, so remove the container you started by hand

---
vertical: center
---

# Managing a User Service

| Command                                          | Does                                          |
|--------------------------------------------------|-----------------------------------------------|
| `systemctl --user daemon-reload`                 | Read new and changed unit files               |
| `systemctl --user enable --now container-con01`  | Start it now and each time you log in         |
| `systemctl --user status container-con01`        | Show whether it is running                    |
| `systemctl --user stop container-con01`          | Stop it; `--new` removes the container too    |
| `systemctl --user start container-con01`         | Start it again, in a fresh container          |
| `systemctl --user disable --now container-con01` | Stop it, and stop starting it when you log in |

`--user` manages your own services, so no `sudo`; otherwise these are the `systemctl` commands from week 4

---
vertical: center
---

# Run Containers as a Regular User

<IconGrid>
<IconGridItem v-click icon="user">

Each user has their own images, containers, and services

</IconGridItem>
<IconGridItem v-click icon="login">

Log in as that user with SSH, not `su -` or `sudo -iu`

</IconGridItem>
<IconGridItem v-click icon="power">

`loginctl enable-linger` starts them at boot and keeps them after logout

</IconGridItem>
</IconGrid>

<v-click>

Without a login session, `systemctl --user` fails: "Failed to connect to user scope bus via local transport"

A mounted directory still needs `:Z`, as in Volume Mounts

</v-click>

---

# Lingering

<TerminalWindow title="student@servera:~">

```bash-session
student@servera:~$ loginctl enable-linger
student@servera:~$ loginctl list-users
 UID USER    LINGER STATE
1000 student yes    active

1 users listed.
```

</TerminalWindow>

Without lingering, systemd stops a user's services about 10 seconds after their last session ends, and starts them again only at their next login

For another user: `sudo loginctl enable-linger USERNAME`, and `disable-linger` undoes it

---
layout: exercise
---

# Run a Container as a Service

::goal::

Serve a page from a container that starts at boot, as a service of a user of its own

::environment::

**Host:** `servera`

**Prerequisite exercise:** Mount Web Content

::workflow::

1. Create the user `webapp` with a password
2. Log in as `webapp` with SSH and run a web container on host port 8083
3. Generate a unit for the container and start it as a service
4. Log out and test the page
5. Enable lingering for `webapp` and test again
6. Reboot `servera` and test again

---
layout: exercise
variant: recording
---

<script setup>
import castUrl from "./exercises/run-a-container-as-a-service-exercise.cast?url";
</script>

# Run a Container as a Service

::recording::

<AsciinemaPlayer
    :src="castUrl"
    label="Screen recording of the instructor creating the user webapp, logging in as webapp with SSH and running an httpd container on host port 8083 with its page mounted with :Z, generating a unit with podman generate systemd and starting it with systemctl --user, logging out and watching the page stop, enabling lingering with loginctl and watching it come back, rebooting servera and finding it served again, and removing the user and Podman."
/>

::resources::

<a href="../resources/run-a-container-as-a-service-exercise.html" target="_blank" rel="noopener noreferrer" aria-label="Read the written Run a Container as a Service exercise in a new tab">Written exercise</a>
