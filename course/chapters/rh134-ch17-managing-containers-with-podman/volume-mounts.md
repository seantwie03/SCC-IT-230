---
layout: section
routeAlias: volume-mounts
topicInfo:
  alignments:
    redHatAcademy:
      - course: RH134
        chapter: "17"
        title: Managing Containers with Podman
  exercises:
    - title: Mount Web Content Exercise
      source: ./exercises/mount-web-content-exercise.html
---

# Volume Mounts

---
layout: two-cols-header
vertical: start
---

# Baked In vs Mounted

::left::

**Baked in with `COPY`**

1. Edit `index.html`
2. `podman build -t img01:1.1 .`
3. `podman stop` and `podman rm` the old container
4. `podman run` a new one from `img01:1.1`

::right::

**Mounted with `-v`**

1. Edit `index.html`

::bottom::

A mounted directory is read live from the host: no rebuild, no new tag, no new container

---
vertical: center
---

# Volume Mounts

<IconGrid>
<IconGridItem icon="locked">

Treat containers as immutable

</IconGridItem>
<IconGridItem icon="folder-move-to">

Mount a host directory into the container

</IconGridItem>
<IconGridItem icon="save">

Back up the data on the host

</IconGridItem>
</IconGrid>

What a container writes inside itself is gone when the container is removed; what it writes to a mounted directory stays on the host

---
vertical: center
---

# Mounting a Host Directory

<TextExplainer
  :lines="['-v ~/html:/var/www/html:Z']"
  :steps="[
    { line: 1, text: '~/html', explanation: 'A directory on the host' },
    { line: 1, text: '/var/www/html', explanation: 'Where it appears inside the container' },
    { line: 1, text: ':Z', explanation: 'Relabel it so SELinux lets this container use it' },
  ]"
/>

```bash
podman run -d --name con01 -p 8000:80 -v ~/html:/var/www/html:Z img01:1.1
```

The mount covers whatever the image has at that path, a copied-in page included. Podman calls it a bind mount

---

# What `:Z` Changes

<TerminalWindow title="student@servera:~">

```bash-session
student@servera:~$ ls -dZ ~/html
unconfined_u:object_r:user_home_t:s0 /home/student/html
student@servera:~$ podman run -d --name con01 -p 8000:80 -v ~/html:/var/www/html:Z img01:1.1
7922d2fa4368399734490388bb9af89bfc55690975ec17bc3f5c9c5c7296e636
student@servera:~$ ls -dZ ~/html
system_u:object_r:container_file_t:s0:c365,c532 /home/student/html
```

</TerminalWindow>

SELinux keeps containers out of `user_home_t` files: without `:Z`, httpd is refused and serves its test page instead

`:Z` relabels the directory `container_file_t`, with two categories, here `c365,c532`, that only this container gets

---
layout: exercise
---

# Mount Web Content

::goal::

Serve a page straight from the host's disk through your own `intranet:1.1` image

::environment::

**Host:** `servera`

**Prerequisite exercise:** Build a Container Image

::workflow::

1. Create a web page in `~/intranet/html`
2. Run `intranet:1.1` with that directory mounted, and test it
3. Find out why the page is not served
4. Run it again with `:Z` and test it
5. Edit the page on the host twice, testing after each edit

---
layout: exercise
variant: recording
---

<script setup>
import castUrl from "./exercises/mount-web-content-exercise.cast?url";
</script>

# Mount Web Content

::recording::

<AsciinemaPlayer
    :src="castUrl"
    label="Screen recording of the instructor creating a page in ~/intranet/html, mounting that directory into an intranet:1.1 container and getting httpd's test page instead, finding with podman exec and ls -dZ that SELinux keeps the container out of the user_home_t files, running it again with :Z so the page is served, editing the page twice on the host with each change served at once, and removing the container, images, and directories."
/>

::resources::

<a href="../resources/mount-web-content-exercise.html" target="_blank" rel="noopener noreferrer" aria-label="Read the written Mount Web Content exercise in a new tab">Written exercise</a>
