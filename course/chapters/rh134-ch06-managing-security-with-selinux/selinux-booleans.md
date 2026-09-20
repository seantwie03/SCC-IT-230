---
layout: section
routeAlias: selinux-booleans
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
    - title: Allow Users to Have Personal Web Pages Exercise
      source: ./exercises/allow-personal-web-pages-exercise.html
---

# SELinux Booleans

## Switches for common scenarios

---
layout: two-cols-header
leftWidth: 38
---

# Geocities | Late 1990s-Early 2000s

Allowed anyone to create their own web page

::left::

Before social media, a page you built yourself was how you put yourself on the web

Universities ran the same idea on their own servers, where every student and faculty member got space for a personal page

**<AccentText>Apache UserDir</AccentText>** enabled this explosion of creativity on the web

::right::

![Jane's Place personal recipe website (circa 2000), showing classic Web 1.0 design paradigms: a "Welcome!" banner, a column of recipe category links, and a request to sign the guestbook](./assets/geocities-personal-page.png)

<!--
Jane's Place personal recipe website (circa 2000), showing classic Web 1.0 design paradigms. Free space, a page written by hand, and a guestbook to sign.

Ask the room who has ever had a personal home page. Campus servers did this for years, and the next slide is the Apache feature that made it work.
-->

---
listSpacing: padded
---

# Apache UserDir

- Lets every user on the server publish their own page
- User writes HTML in `~/public_html/`
- Viewable at `http://server/~username/`

## Why Is This Useful?

- Academic environments, where students and faculty publish their own pages, such as `http://cs.university.edu/~jsmith/`
- Multiple developers share one server, each with their own test environment
- Limit access to `/var/www/html`

---

# Configuring Apache UserDir

Edit `/etc/httpd/conf.d/userdir.conf`

````md magic-move
```bash
    UserDir disabled
    #
    # To enable requests to /~user/ to serve the user's public_html
    # directory, remove the "UserDir disabled" line above, and uncomment
    # the following line instead:
    #
    #UserDir public_html
```
```bash
    #UserDir disabled
    #
    # To enable requests to /~user/ to serve the user's public_html
    # directory, remove the "UserDir disabled" line above, and uncomment
    # the following line instead:
    #
    UserDir public_html
```
````

Restart Apache and create the directory

<TerminalWindow title="student@workstation:~" :rows="6">

```bash-session
student@workstation:~$ sudo systemctl restart httpd.service
student@workstation:~$ mkdir ~/public_html
student@workstation:~$ echo "<h1>Hello from student's Space</h1>" > ~/public_html/index.html
student@workstation:~$ echo "<p>My Categorization of boogers by shape, color, and taste.</p>" >> ~/public_html/index.html
student@workstation:~$
```

</TerminalWindow>

---
listSpacing: padded
---

# Allowing UserDir

In addition to being configured for UserDir, Apache must be given access

1. Discretionary Access Control
   - Permissions to traverse home directories
2. Mandatory Access Control
   1. SELinux policy to allow `httpd_t` to access `httpd_user_content_t`
   2. SELinux context on `~/public_html` and everything below it

<!--
Last week ended with "SELinux is the other gatekeeper, and that is next week". Here are both gatekeepers at once.

The label on ~/public_html is httpd_user_content_t, which the policy assigns to public_html directories automatically.
-->

---

# 1. DAC: Permissions

Home directories normally have `700` permissions

Only the user is allowed to traverse (execute bit on directory)

Need to give the home directory `711` permissions

Allows Apache to navigate to `/home/student/public_html`

<TerminalWindow title="student@workstation:~">

```bash-session
student@workstation:~$ chmod 711 /home/student
```

</TerminalWindow>

<Callout title="Notice: no sudo required!">

The `student` has discretion to control the permissions on their home directory

</Callout>

---

# 2.1 MAC: SELinux Policy


- What kind of complex policy modifications will I need to make?
  - **<AccentText>None!</AccentText> Thanks to SELinux Booleans**

Red Hat developers have already written hundreds of policies for common scenarios

You just need to <AccentText>flip the switch</AccentText> to turn them on

> **Set the boolean to allow `httpd_t` to read `httpd_user_content_t` directories and files**

---

# SELinux Booleans

There are hundreds of pre-written boolean policies, and many are specifically for Apache

<TerminalWindow title="student@servera:~">

```bash-session
student@servera:~$ sudo semanage boolean -l | grep httpd
...output omitted...
httpd_can_sendmail             (off  ,  off)  Allow httpd to can sendmail
httpd_enable_cgi               (on   ,   on)  Allow httpd to enable cgi
httpd_enable_homedirs          (off  ,  off)  Allow httpd to enable homedirs
httpd_use_nfs                  (off  ,  off)  Allow httpd to use nfs
...output omitted...
```

</TerminalWindow>

| Boolean | Description |
| --- | --- |
| `httpd_enable_homedirs` | Allow httpd to read user home directories |
| `httpd_can_sendmail` | Allow httpd to send email |
| `httpd_use_nfs` | Allow httpd to serve files from NFS shares |

<!--
The table's descriptions are paraphrased; semanage's own are terser, as the output shows.

Captured on servera, where 45 of the 316 booleans match httpd. The two values are the current setting and the one used at the next boot, which the next slides cover.

Ask what httpd_enable_cgi being on tells them: the policy ships with the common cases already allowed, so the work is finding the switch rather than writing policy.
-->

---
listSpacing: padded
---

# Adjust SELinux Policy with Booleans

Easier configuration of commonly changed SELinux rules

- `semanage boolean -l` to list all booleans
  - `-C` to list only the changed booleans
- `getsebool {NAME}`
  - Get the value of a specific boolean
- `setsebool {NAME} {ON|OFF}`
  - Temporarily write boolean values
  - `-P` permanently write boolean values to policy

---

# Interpreting SELinux Booleans

<TextExplainer
  :lines="['httpd_enable_homedirs   (off   ,   off)   Allow httpd to enable homedirs']"
  :steps="[
    { line: 1, text: 'httpd_enable_homedirs', explanation: 'The boolean' },
    { line: 1, occurrence: 1, text: 'off', explanation: 'Current value' },
    { line: 1, occurrence: 2, text: 'off', explanation: 'Policy value, used at the next boot' },
    { line: 1, text: 'Allow httpd to enable homedirs', explanation: 'The description' },
  ]"
/>

<Callout>

`setsebool httpd_enable_homedirs on` to change the current value

`setsebool -P httpd_enable_homedirs on` to change the default **and** current value

</Callout>

<!--
Addition from RHA chapter 6 section 5 and cert guide exercise 22-6. This line is semanage boolean -l | grep httpd_enable_homedirs, captured after setsebool without -P. After setsebool -P, both columns read on.
-->

---
vertical: center
---

# 2 MAC: SELinux Context

Set the boolean to allow `httpd_t` to read `httpd_user_content_t` directories and files

<TerminalWindow title="student@workstation:~">

```bash-session
student@workstation:~$ sudo setsebool -P httpd_enable_homedirs on
student@workstation:~$ getsebool httpd_enable_homedirs
httpd_enable_homedirs --> on
student@workstation:~$ sudo semanage boolean -l -C
httpd_enable_homedirs              (on  ,  on)  Allow httpd to enable homedirs
```

</TerminalWindow>

---
layout: exercise
---

# Allow Users to Have Personal Web Pages

::goal::

Configure Apache's UserDir feature

::environment::

**Host:** `workstation`

**Prerequisite exercise:** Set Up a Basic Web Server

::workflow::

1. Create a personal web page for the `student` user
2. Enable Apache's UserDir feature
3. Test the configuration
4. Fix permissions (DAC)
5. Test again to observe a different failure
6. Troubleshoot: `sealert` and `getsebool`
7. Turn on the SELinux boolean (MAC)
8. Verify the results

---
layout: exercise
variant: recording
---

<script setup>
import castUrl from "./exercises/allow-personal-web-pages-exercise.cast?url";
</script>

# Allow Users to Have Personal Web Pages

::recording::

<AsciinemaPlayer
    :src="castUrl"
    label="Screen recording of the instructor creating a page in ~/public_html, enabling UserDir in userdir.conf, getting 403 Forbidden and finding the permission denied entry in error_log, opening the home directory with chmod 711, getting 403 Forbidden again, using sealert and getsebool to find the httpd_enable_homedirs boolean, turning it on with setsebool -P, confirming the page loads, then undoing the changes."
/>

::resources::

<a href="../resources/allow-personal-web-pages-exercise.html" target="_blank" rel="noopener noreferrer" aria-label="Read the written Allow Users to Have Personal Web Pages exercise in a new tab">Written exercise</a>
