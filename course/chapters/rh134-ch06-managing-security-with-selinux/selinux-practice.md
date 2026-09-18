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
