# 🗺️ Entangle.ts Roadmap

## Our Vision

The goal of `Entangle.ts` is to be the most elegant and intuitive way to organize business logic in complex, distributed Node.js applications. It uses a declarative, physics-inspired API to promote decoupling, clarity, and resilience. This document outlines the general direction of the project.

This is a living document and will be updated as the project evolves and we receive feedback from the community.

---

### Next Release: v0.2.0 (Focus on Robustness)

This phase is focused on making the framework secure and reliable for production use.

- **[ ] Declarative Error Handling:** Introduce a `.catch()` API to the rule chains to handle exceptions gracefully.
- **[ ] Circular Dependency Detection:** Protect the `HiggsField` from infinite loops during dependency injection.
- **[ ] Consistent Lifecycle API:** Finalize the API for persistent vs. single-use rules (e.g., via a `.once()` method).
- **[ ] Test Coverage:** Significantly increase test coverage to ensure the framework functions correctly in all core use cases.

### Near Term: v0.3.0 (Focus on Developer Experience)

After making the framework robust, the focus will shift to making it a joy to use and debug.

- **[ ] Internal Logging & Debug Mode:** Provide a built-in logger that allows developers to "see" `Superposition` in action when a debug mode is enabled.
- **[ ] Unique Keys for Scoped Particles:** Implement a system of `string` or `Symbol` keys for registering particles in temporary scopes, eliminating the risk of collisions.
- **[ ] Complete API Documentation:** Generate a comprehensive API documentation site.
- **[ ] Advanced Usage Examples:** Create a repository of examples that demonstrate how to solve complex problems with the framework.
- **[ ] Recommended Architecture Guidelines:** Create guides and best practices for structuring projects using `Entangle.ts`.
- **[ ] Rule & Event Management API:** Implement an API to list, remove, and perhaps update registered rules dynamically.

### Future / Ideas (Post-v1.0)

This is our wishlist of major features and big ideas to explore in the future.

- **[ ] New Aether Drivers:** Add support for production-grade message brokers like Redis Pub/Sub, RabbitMQ, or Kafka.
- **[ ] Advanced Orchestration:** Support for complex event patterns, such as aggregating multiple events (`upon(['A', 'B'])`).
- **[ ] Advanced Particle Management:** Support for instantiating multiple particles of the same type with different configurations within scopes.
- **[ ] Time-based Events:** Allow rules to be triggered based on time (cron jobs, schedules).
- **[ ] Visualization Tool:** A tool to visualize the entanglement of particles and rules within the system in a graphical format.

---

Feel free to open an [Issue on GitHub](https://github.com/allex6/entangle.ts/issues) to discuss any of these points or to propose new ideas!
