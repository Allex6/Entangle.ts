# ✨ Entangle.ts

**A declarative, event-driven framework for orchestrating business logic in TypeScript & Node.js applications.**

[![NPM Version](https://img.shields.io/npm/v/entangle.ts.svg)](https://www.npmjs.com/package/entangle.ts)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

<!-- [![Build Status](https://img.shields.io/github/actions/workflow/status/allex6/entangle.ts/main.yml?branch=main)](https://github.com/allex6/entangle.ts/actions) -->

---

## The Philosophy: A Universe in Code

`Entangle.ts` was born from a central idea: what if we could organize the complex logic of an application not as a tangled mess of method calls, but as a universe governed by clear, elegant physical laws?

Modern physics teaches us that reality is fundamentally based on **Fields** and **Interactions**. The particles we see are merely "excitations" or "waves" in these fields, and they interact by exchanging "messenger" particles.

This is the philosophy of `Entangle.ts`. Your business objects are the **Particles**. The events that travel through your application are the messenger **Bosons**. And the rules you define are the **Laws of Physics**, dictating how everything must behave. The result is a decoupled, resilient system with a logic that can be read like a story.

## The Pillars of the `Entangle.ts` Universe

Our universe is supported by a small set of conceptual components, each with a well-defined role.

### ⚛️ Superposition

- **The Analogy:** The principle of Quantum Superposition states that a particle, when unobserved, exists in all its possible states at once. The famous Schrödinger's Cat is simultaneously alive **and** dead until the box is opened. The act of observing ("measurement") forces the universe to "choose" a single reality.
- **The Role:** The `Superposition` class is the **central orchestrator**, the brain that holds all the "possible realities" of your application in the form of rules. When an event occurs (the "measurement"), `Superposition` analyzes the rules and "collapses" the possibilities into a concrete sequence of actions and interactions, setting the rest of our universe in motion.
- **Key Method:** `upon(event)` - Begins the definition of a law of physics that will be triggered by an event.

### ⚡ Aether & Bosons

- **The Analogy:** The `Aether` was the hypothetical medium through which light was once thought to travel. `Bosons`, in modern physics, are the messenger particles that carry forces and enable interactions.
- **The Role:** We merge these concepts. The `Aether` is our **event bus**. Its responsibility is to emit and listen to events. The `Boson` is the **payload object** that each event carries, containing the interaction's data and metadata (like the `entanglementId`).
- **Key Methods:** `emit()`, `on()`, `once()`.

### ⚛️ HiggsField & Scopes

- **The Analogy:** The Higgs Field is what gives fundamental particles their mass, allowing complex matter to form. We extend this to the idea of "bubble universes" from cosmology—temporary, self-contained realities that can "bud" off from our main universe to perform specific processes.
- **The Role:** The `HiggsField` is our **Dependency Injection (DI) container**. It gives "mass" (existence and a lifecycle) to your service particles. This is where you register, retrieve, and manage your long-lived, foundational particles (like singletons). The `.createScope()` method allows you to create a temporary, isolated "bubble universe" (another `HiggsField` instance) to safely assemble complex dependency graphs without polluting the main scope.
- **Key Methods:** `register()`, `get()`, `createScope()`.

### 🌀 EventHorizon & HawkingRadiation

- **The Analogy:** A black hole's Event Horizon is the boundary from which no information can escape. However, Hawking Radiation theorizes that information can, in fact, slowly "leak" out.
- **The Role:** The `EventHorizon` is the **immutable, long-term memory** of the system, recording every event that has ever occurred. `HawkingRadiation` is our query tool, a "lazy pointer" that represents an **intent to search** the `EventHorizon`. It allows us to "extract" information about past events to make decisions in the present.
- **Key Methods:** `add()`, `query()`.

### ⚛️ QuantumPointer & Notation

- **The Analogy:** These are our high-precision instruments. A `QuantumPointer` is a "lazy" reference to a particle that is expected to exist in a specific scope (a "bubble universe"). `Notation` is our tool for navigating the internal structure of data with type-safety.
- **The Role:** They solve the problem of "deferred resolution." When defining a rule, you often need to reference a particle or a piece of data that doesn't exist yet. These classes act as placeholders that are resolved only at execution time, making the API robust and declarative.
- **Key Methods:** `QuantumPointer.create()`, `Notation.create()`.

---

## 🚧 Current Status: A Universe Under Construction

**Important Notice: `Entangle.ts` is currently in an early, experimental phase and is not yet ready for production use.**

This framework was born from a passion for clean, event-driven architectures and is under active and enthusiastic development. We have solidified the core concepts and the main API, creating a functional foundation that proves the model's potential.

However, many features that are critical for a production-ready system are still being built, as outlined in our [**Roadmap**](roadmap.md). This includes, but is not limited to:

- A comprehensive error-handling system.
- Robust circular dependency detection.
- A full suite of automated tests.
- Detailed internal logging for debugging.

### How You Can Help

If you, like me, believe in the potential of this approach and the philosophy behind `Entangle.ts`, your support at this early stage is invaluable.

The best way to show your support right now is to **give this repository a star ⭐!**

A simple star does wonders for an open-source project. It not only motivates the development but also increases the project's visibility, helping to attract new contributors and accelerating our journey toward a stable version 1.0.

Feel free to explore the code, run the examples, and open an [Issue](https://github.com/allex6/entangle.ts/issues) with your feedback, ideas, or bug reports. Welcome to our universe!

---

## Installation

```bash
npm install entangle.ts
```

## Quick Start

```typescript
import { Superposition, InMemoryAether, HiggsField, EventHorizon, Notation } from 'entangle.ts';

// 1. Create the components of your universe
const aether = new InMemoryAether();
const higgs = new HiggsField();
const horizon = new EventHorizon();
const sp = new Superposition(aether, higgs, horizon);

// 2. Define and register your service particles
class Greeter {
  sayHello(name: string) {
    console.log(`Hello, ${name}!`);
  }
}

higgs.register(Greeter, () => new Greeter());

// 3. Define the "laws of physics"
const conversationId = 'welcome-flow';

// 3.1 When this event happens
sp.upon('user.joined')
  // 3.2 Use the already built Greeter service
  .use(Greeter)
  // 3.3 Specify the entanglement ID to group related events
  .entanglement(conversationId)
  // 3.4 Define the action to take
  .call('sayHello')
  // 3.5 Define which data to pass to the action
  .with(
    HawkingRadiation.from(
      horizon
        .query()
        // The first array is the list of events, our history
        // The second one is the list of arguments generated by the event we are looking for
        .using(Notation.create<[[{ name: string }]]>().index(0).index(0).property('name'))
    )
  )
  // 3.6 Finally, save the rule to be executed when needed
  .then();

// 4. Put the universe in motion
aether.emit('user.joined', conversationId, { name: 'Alex' });
// Expected Output: Hello, Alex!
```

## Advanced Usage: Application Bootstrap

This example shows how to use scopes ("bubble universes") and pointers to assemble a complex dependency graph in a decoupled way.

```typescript
// --- 1. Define Particles ---
class Logger {
  info(message: string) {
    console.log(`[INFO] ${message}`);
  }
}
class Database {
  constructor(private connectionString: string) {}
  connect() {
    console.log('DB Connected!');
    return this;
  }
}
class UserRepository {
  constructor(private db: Database) {}
  // ... methods to interact with the database
}

// --- 2. Setup The Universe ---
const mainHiggs = new HiggsField();
mainHiggs.register(Logger, () => new Logger());

const startupScope = mainHiggs.createScope(); // Create our temporary lab
const STARTUP_ID = 'system_startup';

// --- 3. Define Bootstrap Rules ---

// Rule A: On 'app.start', create the DB connection in the temporary scope
sp.upon('app.start')
  .build(Database)
  .entanglement(STARTUP_ID)
  .using('user:pass@host:port')
  .inScope(startupScope)
  .then(() => aether.emit('db.ready', STARTUP_ID));

// Rule B: When the DB is ready, build the Repository
sp.upon('db.ready')
  .build(UserRepository)
  .entanglement(STARTUP_ID)
  .using(
    QuantumPointer.create(Database, startupScope) // Pointer to the particle in the scope
  )
  .then((repo) => {
    // Promote the fully built repository to the main HiggsField as a singleton
    mainHiggs.register(UserRepository, () => repo);
    console.log('Application is ready!');
    aether.emit('app.ready', STARTUP_ID);
  });

// --- 4. Initiate The Process ---
console.log('Starting application...');
aether.emit('app.start', STARTUP_ID);
```

## Roadmap

[🗺️ Entangle.ts Roadmap](https://github.com/Allex6/Entangle.ts/blob/main/roadmap.md)

## Contributing

This is an open-source project, and we would love your help! If you've found a bug, have an idea for a new feature, or want to improve the documentation, please open an Issue on GitHub.

## License

Distributed under the MIT License.
