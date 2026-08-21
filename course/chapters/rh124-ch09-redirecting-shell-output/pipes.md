---
layout: section
routeAlias: pipe-operator
topicInfo:
  alignments:
    redHatAcademy:
      - course: RH124
        chapter: "09"
        title: Redirecting Shell Output
    rhcsaCertGuide:
      - chapter: "02"
        title: Using Essential Tools
---

# Pipe Operator

Use output from one command as input to another command

---
vertical: start
---

# `grep` - Global, Regular Expression, Print

Originally created by Ken Thompson in <AccentText>1973</AccentText>.

Used to <AccentText>search text</AccentText> and print matching lines.

<TerminalWindow title="student@workstation:~">

````md magic-move
```bash-session
student@workstation:~$ grep nologin /etc/passwd
```
```bash-session
student@workstation:~$ grep nologin /etc/passwd
bin:x:1:1:bin:/bin:/usr/sbin/nologin
daemon:x:2:2:daemon:/sbin:/usr/sbin/nologin
adm:x:3:4:adm:/var/adm:/usr/sbin/nologin
mail:x:8:12:mail:/var/spool/mail:/usr/sbin/nologin
ftp:x:14:50:FTP User:/var/ftp:/usr/sbin/nologin
nobody:x:65534:65534:Kernel Overflow User:/:/usr/sbin/nologin
dbus:x:81:81:System message bus:/:/sbin/nologin
systemd-oom:x:997:996:systemd Userspace OOM Killer:/:/sbin/nologin
polkitd:x:114:114:User for polkitd:/:/sbin/nologin
sssd:x:996:995:User for sssd:/run/sssd/:/sbin/nologin
sshd:x:74:74:Privilege-separated SSH:/usr/share/empty.sshd:/usr/sbin/nologin
chrony:x:995:994:chrony system user:/var/lib/chrony:/sbin/nologin
systemd-coredump:x:993:993:systemd Core Dumper:/:/usr/sbin/nologin
```
````

</TerminalWindow>

---
vertical: center
---

# `wc` - Word Count

Prints line, word, and byte counts.

The `-l` option prints how many lines.

<TerminalWindow title="student@workstation:~">

````md magic-move
```bash-session
student@workstation:~$ wc -l /etc/passwd
```
```bash-session
student@workstation:~$ wc -l /etc/passwd
55 /etc/passwd
```
````

</TerminalWindow>

---
---

# Use `grep` and `wc` Together with a Pipe

<TerminalWindow title="student@workstation:~">

````md magic-move
```bash-session
student@workstation:~$ grep nologin /etc/passwd | wc -l
```
```bash-session
student@workstation:~$ grep nologin /etc/passwd | wc -l
50
```
````

</TerminalWindow>

---
vertical: start
---

# Pipe Operator

## What will this command output?

<TerminalWindow title="student@workstation:inventories">

````md magic-move
```bash-session
student@workstation:inventories$ ls -l | grep 2023
```
```bash-session
student@workstation:inventories$ ls -l | grep 2023
total 0
-rw-r--r--. 1 sean sean 0 Aug  8 07:33 2023-01-inventory.csv
-rw-r--r--. 1 sean sean 0 Aug  8 07:33 2023-02-inventory.csv
-rw-r--r--. 1 sean sean 0 Aug  8 07:33 2023-03-inventory.csv
-rw-r--r--. 1 sean sean 0 Aug  8 07:33 2023-04-inventory.csv
-rw-r--r--. 1 sean sean 0 Aug  8 07:33 2023-05-inventory.csv
-rw-r--r--. 1 sean sean 0 Aug  8 07:33 2023-06-inventory.csv
-rw-r--r--. 1 sean sean 0 Aug  8 07:33 2023-07-inventory.csv
-rw-r--r--. 1 sean sean 0 Aug  8 07:33 2023-08-inventory.csv
-rw-r--r--. 1 sean sean 0 Aug  8 07:33 2023-09-inventory.csv
-rw-r--r--. 1 sean sean 0 Aug  8 07:33 2023-10-inventory.csv
-rw-r--r--. 1 sean sean 0 Aug  8 07:33 2023-11-inventory.csv
-rw-r--r--. 1 sean sean 0 Aug  8 07:33 2023-12-inventory.csv
```
````

</TerminalWindow>
