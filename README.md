# use-timed-flow

A tiny React hook to manage timed UI flows: auto-advance, pause, resume, reset, and loop — without timeout spaghetti.

# Documentation

[View the full documentation](https://saviee-libraries.onrender.com/libraries/use-timed-flow)

## Install

```bash
npm install use-timed-flow
# or
yarn add use-timed-flow
```

## Quick example

```tsx
import React from "react";
import { useTimedFlow } from "use-timed-flow";

function Carousel({ items }: { items: string[] }) {
  const { current, pause, resume, next } = useTimedFlow({
    steps: items.length,
    delay: 2000,
    loop: true,
  });

  return (
    <div onMouseEnter={pause} onMouseLeave={resume}>
      <img src={items[current]} alt="slide" />
      <button onClick={next}>Next</button>
    </div>
  );
}
```

## API

See `src/types.d.ts` for the typed API.

## License

MIT
