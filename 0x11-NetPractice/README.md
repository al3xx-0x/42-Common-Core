# Netpractice

comprehensive networking configuration project focused on **tcp/ip addressing**, **subnetting**, **routing**, and network topology.   10 progressive levels teaching fundamental networking concepts for system administration and network engineering.

## description

hands-on networking training tool where you configure small-scale networks to make them functional.    completed through web-based interface solving networking puzzles by correctly configuring ip addresses, subnet masks, and routing tables.

**teaches**: ipv4 addressing/subnetting, cidr notation, subnet masks, network/host bits, routing tables/default gateways, network segmentation, tcp/ip fundamentals

## features

**10 progressive levels**: basic to advanced networking scenarios, interactive web-based configuration, real-time validation, json-based configs, visual topology diagrams

**concepts covered**:
- **level 1-2**: basic ip configuration (point-to-point, same subnet communication)
- **level 3-4**: subnet masks (network/broadcast addresses, host range calculations)
- **level 5-6**: routing basics (default routes, gateway config, multi-network communication)
- **level 7-8**: complex subnetting (vlsm, network segmentation, efficient ip allocation)
- **level 9-10**: advanced routing (multiple routers, route tables, internet connectivity)

## project structure

```
0x11-netpractice/
├── level1.  json     # basic two-device connection
├── level2. json     # multiple devices same subnet
├── level3.  json     # introduction to subnet masks
├── level4.json     # subnet mask variations
├── level5. json     # basic routing with gateway
├── level6.json     # multiple networks with router
├── level7.json     # advanced subnetting
├── level8.json     # complex network topology
├── level9.json     # multiple routers and routes
└── level10.json    # complete network with internet
```

## getting started

**prerequisites**: web browser, netpractice interface (42 intranet), basic networking knowledge

**how to use**: log in to 42 intranet → launch netpractice → select level → analyze topology → configure ips/masks/routes → click "check" → export json

## key concepts

**ip address structure**: `192.168.1.10` (network part + host part, depends on subnet mask)

**subnet mask**: defines network vs host portion, format: `255.255.255. 0` or `/24` (cidr), and operation with ip gives network address

**cidr notation**:
| cidr | subnet mask | hosts | use case |
|------|-------------|-------|----------|
| /30 | 255.255.255.252 | 2 | point-to-point |
| /29 | 255.255.255.248 | 6 | small group |
| /28 | 255.255.255.240 | 14 | small subnet |
| /27 | 255.255.255.224 | 30 | medium subnet |
| /26 | 255.255.255.192 | 62 | medium subnet |
| /25 | 255. 255.255.128 | 126 | large subnet |
| /24 | 255.255.255.0 | 254 | standard subnet |

**private ip ranges (rfc 1918)**: `10.0.0.0/8`, `172.16.0. 0/12`, `192.168.0.0/16`

**special ips**: `0.0.0.0` (default route), `127.0.0.1` (loopback), `255.255.255.255` (broadcast), network address (first ip), broadcast address (last ip)

**routing table**: destination (target network), gateway (next hop ip), mask (subnet mask), interface (outgoing interface)

**default route**: `route: "default" or "0.0.0.0/0"`, `gate: <gateway ip>` (used when no specific route matches)

## level examples

**level 1 - basic connection**: connect two devices, same subnet, `/24` network
```json
{"a1": {"ip": "104.94.23.1"}, "b1": {"ip": "104. 94.23.2"}}
```

**level 5 - basic routing**: configure default route and gateway
```json
{
  "routes": {"ar1": {"route": "default", "gate": "83.82.92.126"}},
  "ifs": {"a1": {"ip": "83.82.92.125", "mask": "255.255.255. 128"}, "r1": {"ip": "83. 82.92.126"}}
}
```

**level 10 - complete network**: full routing with internet
```json
{
  "routes": {"h3r1": {"gate": "12.0.0.1"}, "r1r1": {"route": "default"}, "ir1": {"route": "153.133.106.0/0"}},
  "ifs": {"h11": {"mask": "255.255.255. 128"}, "h21": {"ip": "153.133.106. 3", "mask": "255.255. 255.128"}, "h31": {"ip": "12.0.0.2", "mask": "/30"}, "r13": {"mask": "255.255.255.252"}, "r22": {"ip": "12.0.0.1", "mask": "/30"}, "r23": {"ip": "153.133.106.129", "mask": "255.255.255.192"}}
}
```

## common configurations

**point-to-point**: device a: `10.0.0.1/30`, device b: `10.0.0.2/30` (2 usable ips)  
**small office**: network: `192.168.1. 0/24`, router: `192.168.1. 1`, hosts: `192.168.1.2-254`  
**segmented network**: vlan1: `192.168.1.0/26`, vlan2: `192. 168.1.64/26`, vlan3: `192.168.1.128/26`, vlan4: `192.168.1.192/26`

## troubleshooting

**ip not in same subnet**: apply mask to both ips, verify same network address, or add router  
**incorrect subnet mask**: verify mask matches required network size (use /30 for point-to-point)  
**missing default route**: add default route pointing to gateway  
**gateway not in same subnet**: gateway must be in same subnet as interface

## subnet calculation

**formula**: total addresses = `2^(32 - prefix)`, usable hosts = `total - 2` (network + broadcast)

**quick reference**: /30 (4 addrs, 2 usable), /29 (8, 6), /28 (16, 14), /27 (32, 30), /26 (64, 62), /25 (128, 126), /24 (256, 254)

**subnet mask to binary**:
```
/24 = 11111111.11111111.11111111.00000000 = 255.255.255.0
/25 = 11111111.11111111.11111111.10000000 = 255.255.255.128
/26 = 11111111. 11111111.11111111. 11000000 = 255. 255.255.192
/30 = 11111111.11111111.11111111.11111100 = 255.255.255.252
```

## validation checklist

- [ ] all interfaces have valid ips
- [ ] ips in same network share same network address
- [ ] no ip conflicts (duplicates)
- [ ] subnet masks correct for each network
- [ ] gateways in same subnet as source
- [ ] default routes point to valid gateways
- [ ] all devices can reach required destinations
- [ ] no network/broadcast addresses assigned to hosts

## pro tips

start with subnet masks first, use /30 for point-to-point (most efficient), reserve network/broadcast addresses, document your subnets, think hierarchically, test incrementally

---

**grade**: validated ✅  
**developed by**: sbouabid
**created**: may 2, 2024
*"master the foundation of the internet!"* 🌐