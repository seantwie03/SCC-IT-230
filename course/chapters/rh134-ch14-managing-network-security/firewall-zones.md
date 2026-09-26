---
layout: section
routeAlias: firewall-zones
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
    - title: Move an Interface to Another Zone Exercise
      source: ./exercises/move-interface-to-another-zone-exercise.html
---

# Assign the Interface to a Zone

---

# Firewalld Predefined Zones

Ten zones ship with `firewalld`, and each one is an allow list you can customize

| Zone | Starts out allowing |
| --- | --- |
| `trusted` | <SuccessText>Everything</SuccessText> |
| `internal` | `ssh`, `mdns`, `samba-client`, `dhcpv6-client` |
| `public` | `ssh`, `dhcpv6-client`, and nothing else |
| `dmz` | `ssh` only |
| `block` | <DangerText>Nothing</DangerText>, and refuses out loud |
| `drop` | <DangerText>Nothing</DangerText>, and stays silent |

`home` and `work` start as near copies of `internal`, and `external` adds masquerading

---

# View the Zones

<TerminalWindow title="student@servera:~" :rows="9">

````md magic-move
```bash-session
#^ 1. Every zone that exists
student@servera:~$ sudo firewall-cmd --get-zones
block dmz drop external home internal nm-shared public trusted work
```
```bash-session
#^ 1. Every zone that exists
student@servera:~$ sudo firewall-cmd --get-zones
block dmz drop external home internal nm-shared public trusted work
#^ 2. The zones actually in use
student@servera:~$ sudo firewall-cmd --get-active-zones
public (default)
  interfaces: enp1s0
```
```bash-session
#^ 1. Every zone that exists
student@servera:~$ sudo firewall-cmd --get-zones
block dmz drop external home internal nm-shared public trusted work
#^ 2. The zones actually in use
student@servera:~$ sudo firewall-cmd --get-active-zones
public (default)
  interfaces: enp1s0
#^ 3. Where an unassigned interface lands
student@servera:~$ sudo firewall-cmd --get-default-zone
public
```
````

</TerminalWindow>

Nobody assigned `enp1s0` to `public`; it is there because `public` is the default

---

# Inspect the Active Configuration

`firewall-cmd --list-all` reports everything one zone allows

<TextExplainer
  size="md"
  :lines="[
    'student@servera:~$ sudo firewall-cmd --list-all',
    'public (default, active)',
    '  interfaces: enp1s0',
    '  services: cockpit dhcpv6-client ssh',
    '  ports:',
  ]"
  :steps="[
    { line: 2, text: 'public (default, active)', explanation: 'The zone, and that something is using it' },
    { line: 3, text: 'enp1s0', explanation: 'What lands in this zone' },
    { line: 4, text: 'cockpit dhcpv6-client ssh', explanation: 'Named services this zone allows' },
    { line: 5, text: 'ports:', explanation: 'Individual ports, empty until you add one' },
  ]"
/>

---

# Move an Interface to Another Zone

<TerminalWindow title="student@servera:~" :rows="13">

````md magic-move
```bash-session
#^ 1. Move it
student@servera:~$ sudo firewall-cmd --zone=dmz --change-interface=enp1s0
success
```
```bash-session
#^ 1. Move it
student@servera:~$ sudo firewall-cmd --zone=dmz --change-interface=enp1s0
success
#^ 2. Two zones are active now
student@servera:~$ sudo firewall-cmd --get-active-zones
dmz
  interfaces: enp1s0
public (default)
```
```bash-session
#^ 1. Move it
student@servera:~$ sudo firewall-cmd --zone=dmz --change-interface=enp1s0
success
#^ 2. Two zones are active now
student@servera:~$ sudo firewall-cmd --get-active-zones
dmz
  interfaces: enp1s0
public (default)
#^ 3. A shorter list of services applies
student@servera:~$ sudo firewall-cmd --list-all --zone=dmz
dmz (active)
  ...output omitted...
  interfaces: enp1s0
  services: ssh
```
````

</TerminalWindow>

`public` allowed `cockpit dhcpv6-client ssh`, and `dmz` allows <AccentText>ssh alone</AccentText>

---
layout: two-cols-header
---

# `firewall-cmd` Options

::left::

| Option | What it does |
| --- | --- |
| `--get-zones` | Every zone that exists |
| `--get-active-zones` | Zones in use |
| `--get-default-zone` | Print the default zone |
| `--set-default-zone=ZONE` | Change it, everywhere |
| `--change-interface=IFACE` | Move an interface |

::right::

| Option | What it does |
| --- | --- |
| `--list-all` | What one zone allows |
| `--add-service=NAME` | Allow a service |
| `--add-port=PORT/PROTO` | Allow one port |
| `--reload` | Reload the permanent config |
| `--runtime-to-permanent` | Keep the runtime config |

---
layout: exercise
---

# Move an Interface to Another Zone

::goal::

Move `servera`'s interface into `dmz`, watch what it allows shrink, then put it back

::environment::

**Host:** `servera`, from `workstation`

::workflow::

1. List the zones that exist, the ones in use, and the default
2. Inspect what the active zone allows
3. Move `enp1s0` into `dmz`
4. Confirm two zones are active and the service list is shorter
5. Run `firewall-cmd --reload`
6. Look again, and see what is left
