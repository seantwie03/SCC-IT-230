---
layout: section
routeAlias: selinux-practice
topicInfo:
  alignments:
    redHatAcademy:
      - course: RH134
        chapter: "06"
        title: Managing Security with SELinux
    rhcsaCertGuide:
      - chapter: "22"
        title: Managing SELinux
  exercises:
    - title: Configure a New DocumentRoot for Apache on servera Exercise
      source: ./exercises/configure-a-document-root-on-servera-exercise.html
    - title: Allow Apache to Send Email Exercise
      source: ./exercises/allow-apache-to-send-email-exercise.html
---

# SELinux Practice

## The same formulas on `servera`

---
layout: exercise
---

# Configure a New DocumentRoot for Apache on servera

::goal::

Configure Apache to serve content from the `/website` directory

::environment::

**Host:** `servera`

::workflow::

1. Install `httpd` and start its service
2. Make a `/website` directory with an HTML file
3. Configure Apache to serve `/website`
4. Test and troubleshoot: switch SELinux to permissive temporarily
5. Troubleshoot: use `sealert`
6. Configure a policy to set `httpd_sys_content_t` on `/website(/.*)?` files
7. Apply the policy to the files
8. Verify the results

---
layout: exercise
variant: recording
---

<script setup>
import castUrl from "./exercises/configure-a-document-root-on-servera-exercise.cast?url";
</script>

# Configure a New DocumentRoot for Apache on servera

::recording::

<AsciinemaPlayer
    :src="castUrl"
    label="Screen recording of the instructor installing and starting httpd on servera, creating /website with an index.html labeled default_t, pointing DocumentRoot and its Directory block in httpd.conf at /website, seeing Apache return its test page until SELinux is set to permissive, installing setroubleshoot-server and reading the sealert report, adding an httpd_sys_content_t file context rule for /website with semanage fcontext, relabeling with restorecon, confirming Apache serves the new page, then removing the changes and packages."
/>

::resources::

<a href="../resources/configure-a-document-root-on-servera-exercise.html" target="_blank" rel="noopener noreferrer" aria-label="Read the written Configure a New DocumentRoot for Apache on servera exercise in a new tab">Written exercise</a>

---
layout: exercise
---

# Allow Apache to Send Email

::goal::

Allow Apache to send email

::environment::

**Host:** `servera`

::workflow::

1. Find the appropriate SELinux boolean
2. View the current value of the boolean
3. Permanently set the boolean to allow Apache to send mail
4. Verify the boolean is set

---
layout: exercise
variant: recording
---

<script setup>
import castUrl from "./exercises/allow-apache-to-send-email-exercise.cast?url";
</script>

# Allow Apache to Send Email

::recording::

<AsciinemaPlayer
    :src="castUrl"
    label="Screen recording of the instructor installing selinux-policy-doc, finding the httpd_selinux man page and searching it for the mail boolean, checking httpd_can_sendmail with getsebool and semanage boolean -l, permanently turning it on with setsebool -P, verifying the change, then turning it off and removing the package."
/>

::resources::

<a href="../resources/allow-apache-to-send-email-exercise.html" target="_blank" rel="noopener noreferrer" aria-label="Read the written Allow Apache to Send Email exercise in a new tab">Written exercise</a>
