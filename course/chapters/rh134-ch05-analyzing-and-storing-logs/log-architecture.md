---
layout: section
routeAlias: log-architecture
topicInfo:
  alignments:
    redHatAcademy:
      - course: RH134
        chapter: "05"
        title: Analyzing and Storing Logs
    rhcsaCertGuide:
      - chapter: "13"
        title: Configuring Logging
---

# Analyzing and Storing Logs

## Where the answers are when something goes wrong

---
vertical: center
---

# Why Look at Logs?

<div v-click>

## Security

Who accessed what, when, and were they allowed to?

</div>

<div v-click>

## Troubleshooting

What went wrong, and why?

</div>

---
layout: center
---

# Logs are your best hope of answering either question

## Usually your only hope

---
layout: two-cols-header
vertical: center
---

# Two Mechanisms, Mostly the Same Messages

Some applications also write their own files, such as `httpd` to `/var/log/httpd/`

::left::

## `journald`

Part of systemd, so it knows about units

Writes a binary journal, read with `journalctl`

Not kept across reboots by default

::right::

## `rsyslog`

Older, and still doing work systemd does not

Writes plain text under `/var/log/`

Kept across reboots, and can ship logs to a central server

---

# Common Log Files

| File | What lands there |
| --- | --- |
| `/var/log/messages` | Most syslog messages |
| `/var/log/secure` | Security and authentication events |
| `/var/log/maillog` | Mail server messages |
| `/var/log/cron` | Scheduled job execution |
| `/var/log/boot.log` | Console messages from system startup |

Every one of these is written by `rsyslog`, following rules you can read and change
