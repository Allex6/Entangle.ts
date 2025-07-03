import { Aether } from '../aether';
import { ErrorHandler } from '../errors/ErrorHandler';
import { EventHorizon } from '../event-horizon/EventHorizon';
import { HiggsField } from '../higgs-field/HiggsField';
import { QuantumPointer } from '../quantum-pointer/QuantumPointer';
import { Notation } from '../shared/Notation';
import { CausalityLog, Event } from '../shared/types/Events.types';
import { Interaction } from '../shared/types/Interactions.types';
import {
  Boson,
  Particle,
  ParticleProperties,
} from '../shared/types/Particles.types';
import { MethodKeys } from '../shared/types/Utils.types';
import { GatewayBuilder } from './builders/Gateway.builder';

/**
 * In quantum mechanics, Superposition is the principle that a system can exist in
 * multiple potential states at once, collapsing into a single reality upon observation.
 *
 * In Entangle.ts, the `Superposition` class is the embodiment of this principle.
 * It is the central orchestrator—the "laws of physics" for your application.
 * It listens for events from the Aether, consults the EventHorizon for historical
 * context, and executes rule-based interactions, creating and manipulating
 * particles within the HiggsField and its temporary scopes.
 *
 * @class Superposition
 * @param aether The communication medium, responsible for event transport.
 * @param higgs The foundational field, the main container for service particles.
 * @param horizon The historical record, providing context of all past events.
 */
export class Superposition {
  public readonly particlesContracts = new Map<number, ParticleProperties>();
  public readonly contracts: ParticleProperties<any, any>[] = [];
  public readonly interactions: Interaction<any, any, any>[] = [];

  constructor(
    private readonly aether: Aether,
    private readonly higgs: HiggsField,
    private readonly horizon: EventHorizon,
    private readonly errorHandler?: ErrorHandler
  ) {}

  /**
   * Begins the declarative definition of a rule that is triggered by a specific event.
   * This is the entry point for defining any "law" in the application.
   * @param event The name of the event that triggers the rule.
   * @returns A `GatewayBuilder` instance to continue defining the rule by choosing an
   * action (`.build()` or `.use()`).
   */
  public upon(event: Event): GatewayBuilder {
    return new GatewayBuilder(this, event);
  }

  /**
   * Check if there are any particles that can be created
   */
  private checkForParticlesCreation(event: string, entanglement: string) {
    const filteredContracts = this.contracts.filter(
      (contract) =>
        contract.upon === event && contract.entanglement === entanglement
    );

    for (const contract of filteredContracts) {
      const shouldCreateAParticle = this.canCreateAParticle(contract);

      if (shouldCreateAParticle) {
        this.createAParticle(contract);
      }
    }
  }

  /**
   * Checks if a particle creation rule can be executed based on its `when` clause.
   * @internal
   */
  private canCreateAParticle(contract: ParticleProperties): boolean {
    const { upon, when, is, requirements } = contract;

    // Checks if the 'when' clause is satisfied
    if (typeof when !== 'undefined') {
      const data = this.horizon.query().from(upon).get<CausalityLog<unknown>>();
      const parsedData = Notation.create(when).getData(data);
      if (parsedData !== is) {
        return false;
      }
    }

    // Checks if the requirements are satisfied.
    // If not, nothing happens
    if (requirements?.length) {
      for (const event of requirements) {
        const eventOcurred = this.horizon.query().from(event).get();
        if (eventOcurred === undefined) {
          return false;
        }
      }
    }

    return true;
  }

  /**
   * Creates a particle instance and registers it within the specified scope
   * (or the main HiggsField if no scope is provided), making it available for
   * other interactions.
   * @internal
   */
  private createAParticle(contract: ParticleProperties): void {
    const {
      upon,
      build,
      using,
      then,
      scope,
      emit,
      lifecycle,
      destroyOnInteraction,
      errorHandler,
      entanglement,
    } = contract;
    const context = scope ?? this.higgs;
    const selectedErrorhandler = errorHandler ?? this.errorHandler;

    const parsedArgs = using
      ? using.map((arg) => {
          if (arg instanceof Notation) {
            return arg.getData(this.horizon.query().from(upon).get());
          }

          if (arg instanceof QuantumPointer) {
            return arg.get();
          }

          return arg;
        })
      : [];

    try {
      context.register(build, () => new (build as Particle)(...parsedArgs), {
        destroyOnInteraction,
        lifecycle,
      });

      const particle = new (build as Particle)(...parsedArgs);

      if (then) {
        then(particle);
      }

      if (emit) {
        this.aether.emit(emit, entanglement, particle);
      }
    } catch (err) {
      selectedErrorhandler?.handle(err, {
        rule: contract,
        event: upon,
        eventArgs: parsedArgs,
      });
    }
  }

  /**
   * Registers a particle creation contract, setting up a listener for its trigger event.
   * This method is intended to be called by a builder.
   * @internal
   */
  public addContract<TParticle, TArgs extends any[]>(
    contract: ParticleProperties<TParticle, TArgs>
  ): this {
    const { upon, once } = contract;
    const subscribeMethod = once ? 'once' : 'on';

    this.aether[subscribeMethod](upon, (boson: Boson) => {
      const { payload, entanglement } = boson;
      this.horizon.add(upon, payload);
      this.checkForParticlesCreation(upon, entanglement);
      this.checkForParticlesInteractions(upon, entanglement);
    });

    this.contracts.push(contract);
    return this;
  }

  /**
   * Registers an interaction contract, setting up a listener if it's event-driven.
   * This method is intended to be called by a builder.
   * @internal
   */
  public addInteraction<
    TParticle extends object,
    TArgs extends unknown[],
    TMethodName extends MethodKeys<TParticle>
  >(interaction: Interaction<TParticle, TArgs, TMethodName>): this {
    this.interactions.push(interaction);

    const { upon, once } = interaction;
    const subscribeMethod = once ? 'once' : 'on';

    if (upon) {
      this.aether[subscribeMethod](upon, (boson: Boson) => {
        const { payload, entanglement } = boson;

        this.horizon.add(upon, payload);
        this.checkForParticlesCreation(upon, entanglement);
        this.checkForParticlesInteractions(upon, entanglement);
      });
    }

    return this;
  }

  /**
   * Checks for and executes all interaction rules triggered by a specific event.
   * @internal
   */
  private checkForParticlesInteractions<
    TParticle extends object,
    TArgs extends unknown[],
    TMethodName extends MethodKeys<TParticle>
  >(event: string, entanglement: string) {
    const filteredInteractions = this.interactions.filter(
      (i) => i.upon === event && i.entanglement === entanglement
    );

    for (const interaction of filteredInteractions) {
      const { use: target } = interaction;
      let instance: undefined | TParticle;

      if (target instanceof Notation) {
        instance = this.horizon.query().using(target.get()).get();
      } else if (target instanceof QuantumPointer) {
        instance = target.get();
      } else {
        instance = this.higgs.get<TParticle, unknown[]>(target);
      }

      if (!instance) {
        throw new Error('Instance could not be resolved from target.');
      }

      this.interact<TParticle, TArgs, TMethodName>(interaction, instance);
    }
  }

  private interact<
    TParticle extends object,
    TArgs extends unknown[],
    TMethodName extends MethodKeys<TParticle>
  >(
    interaction: Interaction<TParticle, TArgs, TMethodName>,
    instance: TParticle
  ) {
    const {
      use: target,
      call,
      with: args,
      then,
      emit,
      errorHandler,
      upon,
    } = interaction;
    const selectedErrorhandler = errorHandler ?? this.errorHandler;

    try {
      const _args = [];

      if (args) {
        for (const arg of args) {
          if (arg instanceof Notation) {
            _args.push(arg.getData(this.horizon.query().get()));
            continue;
          }

          _args.push(arg);
        }
      }

      const methodToCall = (instance as any)[call];

      if (typeof methodToCall === 'function') {
        const result = methodToCall.bind(instance)(..._args);

        if (then) {
          Promise.resolve(result).then((res) => then(res));
        }

        if (emit) {
          this.aether.emit(emit, result);
        }
      } else {
        throw new Error(
          `Method "${String(
            call
          )}" does not exist or is not a function on particle "${
            instance.constructor.name
          }".`
        );
      }

      if (
        !this.higgs.getParticleOptions(target as Particle)?.destroyOnInteraction
      ) {
        this.higgs.destroy(target as Particle);
      }
    } catch (err) {
      selectedErrorhandler?.handle(err, {
        rule: interaction,
        event: upon,
        eventArgs: args,
      });
    }
  }
}
