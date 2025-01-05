# shortcat

shortcat is a little url shortener with declarative runtime management & rbac. 

i am also testing [elysia](https://elysiajs.com/) with it

## runbook
``` bash
nix develop
bun i
# (optional)
bunx drizzle-kit generate && bun ./src/migrate 
bun run --watch . serve -d meow.db 3000
# (diff terminal)
./shortcat admin -d meow.db | xclip -selection clipboard -in
```

then navigate to [`/swagger`](http://localhost:3000/swagger) to get started.

## todo
- [X] deploy to `pupc.at`
- [ ] test integrating with eden on `mei.puppycat.house`
- [ ] flesh out the group mechanics
- [ ] ~~listen on unix socket, and~~ autocreate & authenticate roles for system users(!!)
- [ ] verify ACL makes sense

## stability guarantees

none. if you depend on this for some reason then poke me and i'll play nice.

## legal

Copyright © 2024 ckie <git-525ff67@ckie.dev>

This work is free. You can redistribute it and/or modify it under the
terms of the Do What The Fuck You Want To Public License, Version 2,
as published by Sam Hocevar. See the `COPYING` file for more details.

