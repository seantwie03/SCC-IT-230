---
layout: section
routeAlias: network-security-practice
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
    - title: Serve a Web Page on a Custom Port Exercise
      source: ./exercises/serve-a-web-page-on-a-custom-port-exercise.html
---

# Network Security Practice

## The whole path in one pass

---
layout: exercise
---

# Serve a Web Page on a Custom Port

::goal::

Serve a page from `workstation` on port 8484 and reach it from `servera`

::environment::

**Host:** `workstation`, from `servera`

::workflow::

1. Install `httpd` and write a page
2. Point Apache's `Listen` line at 8484
3. Open `8484/tcp` in the firewall, permanently
4. Label 8484 for SELinux
5. Start `httpd`
6. Request the page from `servera`
7. Put `workstation` back the way you found it

---
layout: exercise
variant: recording
---

<script setup>
import castUrl from "./exercises/serve-a-web-page-on-a-custom-port-exercise.cast?url";
</script>

# Serve a Web Page on a Custom Port

::recording::

<AsciinemaPlayer
    :src="castUrl"
    label="Screen recording of the instructor connecting from servera to workstation, installing httpd and writing a page, changing Apache's Listen line to 8484 in vim, permanently opening 8484/tcp in the firewall, labeling tcp port 8484 as http_port_t with semanage, enabling and starting httpd, loading the page on port 8484 from servera, then removing the port label, firewall port, Listen change, and package to put workstation back the way it started."
/>

::resources::

<a href="../resources/serve-a-web-page-on-a-custom-port-exercise.html" target="_blank" rel="noopener noreferrer" aria-label="Read the written Serve a Web Page on a Custom Port exercise in a new tab">Written exercise</a>
