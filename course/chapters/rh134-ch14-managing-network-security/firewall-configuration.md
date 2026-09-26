---
layout: section
routeAlias: firewall-configuration
topicInfo:
  alignments:
    redHatAcademy:
      - course: RH134
        chapter: "14"
        title: Managing Network Security
    rhcsaCertGuide:
      - chapter: "23"
        title: Configuring a Firewall
---

# Permanent Config

**vs**

# Runtime Config

---
listSpacing: padded
---

# Where Did the Change Go?

The reload put `enp1s0` back in `public`

- <AccentText>Runtime</AccentText>
  - What the firewall is enforcing right now
  - Gone at the next `--reload` or <AccentText>reboot</AccentText>
- <AccentText>Permanent</AccentText>
  - What the firewall loads when it starts
  - Survives reboots

`--change-interface` wrote to the runtime only, so the reload threw it away

---
layout: two-cols-header
leftWidth: 47
---

# Making Changes Permanent

::left::

## Test, Then Keep

<TerminalWindow title="root@servera:~">

```bash-session
root@servera:~# firewall-cmd --add-service=http
success
root@servera:~# firewall-cmd --runtime-to-permanent
success
```

</TerminalWindow>

- Test change on runtime config
- Then make it permanent
- Safer

::right::

## Write, Then Load

<TerminalWindow title="root@servera:~">

```bash-session
root@servera:~# firewall-cmd --permanent --add-service=http
success
root@servera:~# firewall-cmd --reload
success
```

</TerminalWindow>

- Make the change permanently
- Then load it to running config
- More dangerous

