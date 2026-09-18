---
layout: section
routeAlias: custom-file-policies
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
    - title: Configure a New DocumentRoot for Apache Exercise
      source: ./exercises/configure-a-new-document-root-exercise.html
---

# Custom File Policies

## Teach the policy about a new location

---
listSpacing: padded
---

# Files Created in the html Directory Have the Correct Context. How?

- **Policies** are applied when the file is **CREATED**
- Most are defined for you
- You can make custom policies
- `semanage` is the command to manage SELinux policies

<!--
This is what the cp against mv step just showed: the copy is a new file, so the policy labels it. The moved file is not new, so it keeps the label it had in /tmp.

A new directory that no rule matches, such as /web, gets default_t, which httpd_t cannot read.
-->

---

# Add a Custom Directory

<TextExplainer
  size="md"
  :lines="[&quot;semanage fcontext -a -t httpd_sys_content_t '/web(/.*)?'&quot;]"
  :steps="[
    { line: 1, text: 'semanage fcontext', explanation: 'Manage file context rules' },
    { line: 1, text: '-a', explanation: 'Add a rule' },
    { line: 1, text: '-t httpd_sys_content_t', explanation: 'The type label it assigns' },
    { line: 1, text: &quot;'/web(/.*)?'&quot;, explanation: '/web and everything beneath it' },
  ]"
/>

Other `semanage fcontext` options

| `-l` | `-l -C` | `-d` |
| :---: | :---: | :---: |
| List rules | List only local customizations | Delete a rule |

<!--
Alternative presentation of the previous slide, part 1 of 2: the command's anatomy, then the remaining options. The next slide shows that the rule changes only the policy. Keep whichever version reads better and delete the other.

The quotes keep the shell from expanding the pattern.
-->

---

# Policy First, Then `restorecon`

The rule changes nothing on disk until `restorecon` applies it

<TerminalWindow title="student@servera:~" :rows="13">

````md magic-move
```bash-session
#^ 1. Add the rule, then list your local rules
student@servera:~$ sudo semanage fcontext -a -t httpd_sys_content_t '/web(/.*)?'
```
```bash-session
#^ 1. Add the rule, then list your local rules
student@servera:~$ sudo semanage fcontext -a -t httpd_sys_content_t '/web(/.*)?'
student@servera:~$ sudo semanage fcontext -l -C
SELinux fcontext                                   type               Context

/web(/.*)?                                         all files          system_u:object_r:httpd_sys_content_t:s0
```
```bash-session
#^ 1. Add the rule, then list your local rules
student@servera:~$ sudo semanage fcontext -a -t httpd_sys_content_t '/web(/.*)?'
student@servera:~$ sudo semanage fcontext -l -C
SELinux fcontext                                   type               Context

/web(/.*)?                                         all files          system_u:object_r:httpd_sys_content_t:s0
#^ 2. The directory still has its old label
student@servera:~$ ls -Zd /web
unconfined_u:object_r:default_t:s0 /web
```
```bash-session
#^ 1. Add the rule, then list your local rules
student@servera:~$ sudo semanage fcontext -a -t httpd_sys_content_t '/web(/.*)?'
student@servera:~$ sudo semanage fcontext -l -C
SELinux fcontext                                   type               Context

/web(/.*)?                                         all files          system_u:object_r:httpd_sys_content_t:s0
#^ 2. The directory still has its old label
student@servera:~$ ls -Zd /web
unconfined_u:object_r:default_t:s0 /web
#^ 3. restorecon applies the rule to the files
student@servera:~$ sudo restorecon -Rv /web
Relabeled /web from unconfined_u:object_r:default_t:s0 to unconfined_u:object_r:httpd_sys_content_t:s0
Relabeled /web/index.html from unconfined_u:object_r:default_t:s0 to unconfined_u:object_r:httpd_sys_content_t:s0
```
````

</TerminalWindow>

<!--
Alternative presentation, part 2 of 2: the same facts shown happening. To remove the rule later: sudo semanage fcontext -d '/web(/.*)?', after which semanage fcontext -l -C prints nothing.
-->

---

# Pointing Apache at the Directory

`/etc/httpd/conf/httpd.conf`

Change `DocumentRoot` and the `<Directory>` block that grants access to it

````md magic-move
```bash {2,4}
...output omitted...
DocumentRoot "/var/www/html"
...output omitted...
<Directory "/var/www/html">
    Options Indexes FollowSymLinks
    AllowOverride None
    Require all granted
</Directory>
```
```bash {2,4}
...output omitted...
DocumentRoot "/web"
...output omitted...
<Directory "/web">
    Options Indexes FollowSymLinks
    AllowOverride None
    Require all granted
</Directory>
```
````

<Callout type="warning">

If you only change the `DocumentRoot` Apache will block the request, before SELinux is ever asked

</Callout>

<!--
Addition, because the exercise edits these two lines and no source slide shows them. The two edits replace /var/www/html. Week 5 introduced DocumentRoot on "Two Directives Matter Today".

Without the Directory change, the error log shows AH01630 "client denied by server configuration", and curl shows the same test page SELinux causes. The log line tells the two apart.
-->

---
layout: exercise
---

# Configure a New DocumentRoot for Apache

::goal::

Configure Apache to serve content from the `/web` directory

::environment::

**Host:** `workstation`

**Prerequisite exercise:** Set Up a Basic Web Server

::workflow::

1. Make a `/web` directory with an HTML file
2. Configure Apache to serve `/web`
3. Test and troubleshoot: switch SELinux to permissive temporarily
4. Troubleshoot: use `sealert`
5. Configure a policy to set `httpd_sys_content_t` on `/web(/.*)?` files
6. Apply the policy to the files
7. Verify the results
