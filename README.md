# 🍐 pearing

Looks through the git log and appends possible co-authors as comments to git template.

## prerequisites
Needs nodejs and npm. Only really makes sense if you're using an editor like vim to write git messages.

## setup
```bash
npm i -g pearing
```

## usage
```bash
pearing template
```
To append the five most active contributors to your git template. Just pick and choose by uncommenting. Amount adjustable with `-n` flag, e.g. `pearing t -n 10`.

