---
layout: section
routeAlias: selinux-troubleshooting
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
    - title: Add New Web Page Exercise
      source: ./exercises/add-new-web-page-exercise.html
---

# Troubleshooting SELinux

## Why is this not working? SELinux?

---
listSpacing: padded
---

# Troubleshoot SELinux Issues

Manage SELinux mode (temporarily)

Use it <DangerText>for troubleshooting only</DangerText>, since these changes do **not** persist through a reboot

  - `setenforce 0` sets SELinux to `Permissive` mode
    - Logging only
  - `setenforce 1` sets SELinux to `Enforcing` mode
    - Blocking and logging
  - `getenforce` shows the current mode (`Enforcing` or `Permissive`)

<!--
If the problem goes away in permissive mode, SELinux caused it. Switch back to enforcing as soon as you know.
-->

---
layout: two-cols-header
leftWidth: 58
---

# Setting the Mode at Boot


::left::

`/etc/selinux/config` sets the mode at boot

```bash [/etc/selinux/config (abridged)]
# SELINUX= can take one of these three values:
#     enforcing - SELinux security policy is enforced.
#     permissive - SELinux prints warnings instead of enforcing.
SELINUX=enforcing

# SELINUXTYPE= can take one of these three values:
#     targeted - Targeted processes are protected,
#     minimum - Modification of targeted policy. Only selected...
#     mls - Multi Level Security protection.
SELINUXTYPE=targeted
```

::right::

`sestatus` shows detailed information

<TerminalWindow title="student@servera:~">

```bash-session
student@servera:~$ sestatus
SELinux status:                 enabled
SELinuxfs mount:                /sys/fs/selinux
SELinux root directory:         /etc/selinux
Loaded policy name:             targeted
Current mode:                   enforcing
Mode from config file:          enforcing
Policy MLS status:              enabled
Policy deny_unknown status:     allowed
Memory protection checking:     actual (secure)
Max kernel policy version:      33
```

</TerminalWindow>

---

# Troubleshoot SELinux Issues

Log file: `/var/log/audit/audit.log`

<AccentText>Very densely packed information</AccentText>

```text [/var/log/audit/audit.log]
type=AVC msg=audit(1789642643.357:700): avc:  denied  { open } for  pid=2210 comm="httpd" path="/var/www/html/about.html"
dev="dm-0" ino=4204014 scontext=system_u:system_r:httpd_t:s0 tcontext=unconfined_u:object_r:user_tmp_t:s0 tclass=file
permissive=0
```

<!--
The record is a single line in the log; it is wrapped here to fit.
-->

---

# Reading an AVC Denial

<TextExplainer
  :lines="[
    'type=AVC msg=audit(1789642643.357:700): avc:  denied  { open } for',
    'pid=2210 comm=&quot;httpd&quot; path=&quot;/var/www/html/about.html&quot; dev=&quot;dm-0&quot;',
    'ino=4204014 scontext=system_u:system_r:httpd_t:s0',
    'tcontext=unconfined_u:object_r:user_tmp_t:s0 tclass=file permissive=0',
  ]"
  :steps="[
    { line: 1, text: 'denied', explanation: 'SELinux blocked the action' },
    { line: 1, text: '{ open }', explanation: 'The permission the process asked for' },
    { line: 2, text: 'comm=&quot;httpd&quot;', explanation: 'The command that asked' },
    { line: 2, text: 'path=&quot;/var/www/html/about.html&quot;', explanation: 'The file it asked for' },
    { line: 3, text: 'scontext=system_u:system_r:httpd_t:s0', explanation: 'Source context: the label on the process' },
    { line: 4, text: 'tcontext=unconfined_u:object_r:user_tmp_t:s0', explanation: 'Target context: the label on the file, and the problem' },
    { line: 4, text: 'tclass=file', explanation: 'The kind of object' },
    { line: 4, text: 'permissive=0', explanation: 'Enforcing mode, so the action really was blocked' },
  ]"
/>

<!--
Addition. The same record as the previous slide, wrapped at field boundaries.

To find these records: sudo grep AVC /var/log/audit/audit.log, or sudo ausearch -m AVC -ts recent.
-->

---

# Troubleshooting SELinux Issues

There is an easier way: install the `setroubleshoot-server` package and run `sealert`

```text [sealert -a /var/log/audit/audit.log (abridged)]
SELinux is preventing /usr/sbin/httpd from open access on the file /var/www/html/about.html.

*****  Plugin restorecon (92.2 confidence) suggests   ************************

If you want to fix the label.
/var/www/html/about.html default label should be httpd_sys_content_t.
Then you can run restorecon. The access attempt may have been stopped due to
insufficient permissions to access a parent directory in which case try to
change the following command accordingly.
Do
# /sbin/restorecon -v /var/www/html/about.html
...output omitted...
```

<!--
Read the suggestions before running them. The top suggestion is usually right, but RHA warns that a technically correct suggestion can still be wrong for the situation, for example when the real fix is to move a file that is in the wrong place. Further down, sealert also offers a boolean and a custom policy module; neither is the right fix here.
-->

---
hide: true
---

# Following the Alert

Once `setroubleshoot-server` is installed, each new denial also leaves a summary in `/var/log/messages` and the journal

<TerminalWindow title="student@servera:~">

```bash-session
student@servera:~$ sudo grep 'sealert -l' /var/log/messages | tail -n 1
Sep 17 10:57:57 servera setroubleshoot[2661]: SELinux is preventing /usr/sbin/httpd from
open access on the file /var/www/html/about.html. For complete SELinux messages run:
sealert -l 7ec2ddb6-68d3-4aa8-960d-2b3e34c47609
student@servera:~$ sudo sealert -l 7ec2ddb6-68d3-4aa8-960d-2b3e34c47609
```

</TerminalWindow>

<Callout>

Only denials that happen after the package is installed get a summary

</Callout>

<!--
Addition. The assigned RHA lab (chapter 6 section 9) starts from exactly this line: search /var/log/messages for sealert, then run the command it names. The summary is one line in the log; it is wrapped here the way a narrow terminal shows it.
-->

---
layout: exercise
---

# Add New Web Page

::goal::

The developer wants you to add `about.html` to the web site

::environment::

**Host:** `workstation`

**Prerequisite exercise:** Set Up a Basic Web Server

**Simulated:** the developer put the file in `/tmp/about.html`

::workflow::

1. Move `/tmp/about.html` to `/var/www/html/`
2. Attempt to access `http://localhost/about.html`
3. Troubleshoot: switch SELinux to permissive temporarily
4. Troubleshoot: view `/var/log/audit/audit.log`
5. Troubleshoot: use `sealert`
