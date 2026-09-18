---
layout: section
routeAlias: selinux-file-policies
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
    - title: Fix SELinux Label on about.html File Exercise
      source: ./exercises/fix-selinux-label-exercise.html
---

# SELinux File Policies

## What decides a file's label

---

# View SELinux File Policies

What determines the context that is applied to a file?

`semanage fcontext -l` shows all SELinux file policies (there are a **LOT**)

```text [semanage fcontext -l (abridged)]
...output omitted...
/etc/httpd(/.*)?                                   all files          system_u:object_r:httpd_config_t:s0
/tmp                                               all files          system_u:object_r:tmp_t:s0
/var/log/httpd(/.*)?                               all files          system_u:object_r:httpd_log_t:s0
/var/www(/.*)?                                     all files          system_u:object_r:httpd_sys_content_t:s0
/var/www/cgi-bin(/.*)?                             all files          system_u:object_r:httpd_sys_script_exec_t:s0
/var/www/git(/.*)?                                 all files          system_u:object_r:git_content_t:s0
/var/www/html(/.*)?/uploads(/.*)?                  all files          system_u:object_r:httpd_sys_rw_content_t:s0
/var/www/html/[^/]*/cgi-bin(/.*)?                  all files          system_u:object_r:httpd_sys_script_exec_t:s0
...output omitted...
```

```text [/var/www/html's Policy]
/var/www(/.*)?                                     all files          system_u:object_r:httpd_sys_content_t:s0
```

---

# Regex Breakdown: `/var/www(/.*)?`

| Component  | Meaning                 | Explanation                                                                 |
|------------|-------------------------|-----------------------------------------------------------------------------|
| `/var/www` | **Literal Characters**  | Fixed text that matches only `/var/www`                                     |
| `(...)`    | **A Group**             | Groups what is inside so a quantifier applies to all of it                  |
| `/`        | **Literal Character**   | The group must start with a forward slash                                   |
| `.`        | **Wildcard Character**  | Any single character except a newline                                       |
| `*`        | **Quantifier**          | The preceding `.` zero or more times, so `.*` is any sequence of characters |
| `?`        | **Optional Quantifier** | The whole group `(/.*)` zero or one time, so the group is optional          |

`/var/www` and any files or directories beneath it


---

# `restorecon`: Apply the Policy to Files

`semanage fcontext` only updates the **policy**

`restorecon` reads the database and **stamps the label onto the files**

<TerminalWindow title="student@servera:~">

```bash-session
student@servera:~$ sudo restorecon -v /var/www/html/about.html
Relabeled /var/www/html/about.html from unconfined_u:object_r:user_tmp_t:s0 to
unconfined_u:object_r:httpd_sys_content_t:s0
```

</TerminalWindow>

| Flag | Meaning |
| --- | --- |
| `-v` | **Verbose**: print each file that is relabeled |
| `-R` | **Recursive**: apply to all files under the given path |

<!--
restorecon changes the type and leaves the SELinux user (unconfined_u) alone. Add -F to force every field to the policy's value.
-->

---

# `chcon` Skips the Policy

`chcon -t` sets a label directly, but the next `restorecon` puts the policy's label back

<TerminalWindow title="student@servera:~" :rows="10">

````md magic-move
```bash-session
student@servera:~$ sudo mkdir /site
student@servera:~$ ls -Zd /site
unconfined_u:object_r:default_t:s0 /site
```
```bash-session
student@servera:~$ sudo mkdir /site
student@servera:~$ ls -Zd /site
unconfined_u:object_r:default_t:s0 /site
student@servera:~$ sudo chcon -t httpd_sys_content_t /site
student@servera:~$ ls -Zd /site
unconfined_u:object_r:httpd_sys_content_t:s0 /site
```
```bash-session
student@servera:~$ sudo mkdir /site
student@servera:~$ ls -Zd /site
unconfined_u:object_r:default_t:s0 /site
student@servera:~$ sudo chcon -t httpd_sys_content_t /site
student@servera:~$ ls -Zd /site
unconfined_u:object_r:httpd_sys_content_t:s0 /site
student@servera:~$ sudo restorecon -v /site
Relabeled /site from unconfined_u:object_r:httpd_sys_content_t:s0 to unconfined_u:object_r:default_t:s0
student@servera:~$ ls -Zd /site
unconfined_u:object_r:default_t:s0 /site
```
````

</TerminalWindow>

<Callout type="danger">

Avoid using `chcon` except during a temporary test

</Callout>

<!--
Addition from RHA chapter 6 section 3 and the cert guide, which tells readers not to use chcon at all. Students will still meet it in older documentation.
-->

---
layout: exercise
---

# Fix SELinux Label on about.html File

::goal::

Apply the correct label to `about.html`

::environment::

**Host:** `workstation`

**Prerequisite exercise:** Add New Web Page

::workflow::

1. Inspect the policy for `/var/www`
2. Use `restorecon` to apply the policy to `/var/www` recursively
3. Verify access to `about.html`
4. Test `cp` vs `mv`: what if we had copied instead?
