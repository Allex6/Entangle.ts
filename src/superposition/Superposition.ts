import { Aether } from '../aether';
import { ErrorHandler } from '../errors/ErrorHandler';
import { EventHorizon } from '../event-horizon/EventHorizon';
import { HawkingRadiation } from '../hawking-radiation/HawkingRadiation';
import { HiggsField } from '../higgs-field/HiggsField';
import { ConsoleLogger } from '../logging/ConsoleLogger';
import { Logging } from '../logging/Logging';
import { QuantumPointer } from '../quantum-pointer/QuantumPointer';
import { Notation } from '../shared/Notation';
import { CausalityLog, Event } from '../shared/types/Events.types';
import { Interaction } from '../shared/types/Interactions.types';
import { ELogType } from '../shared/types/Logging.types';
import { Boson, Particle, ParticleProperties } from '../shared/types/Particles.types';
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public readonly contracts: ParticleProperties<any, any>[] = [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public readonly interactions: Interaction<any, any, any>[] = [];
  private readonly logger = new Logging('custom', new ConsoleLogger());

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
      (contract) => contract.upon === event && contract.entanglement === entanglement
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
      const notation = Notation.create(when);
      const data = this.horizon.query().from(upon).using(notation).get<CausalityLog<unknown>>();
      const parsedData = notation.getData(data);
      if (parsedData !== is) {
        this.logger.log({
          type: ELogType.CREATION,
          message: `Condition not met for particle creation: expected '${is}', got '${parsedData}'`,
        });

        return false;
      }
    }

    // Checks if the requirements are satisfied.
    // If not, nothing happens
    if (requirements?.length) {
      for (const event of requirements) {
        const eventOcurred = this.horizon.query().from(event).using(Notation.create()).get();
        if (eventOcurred === undefined) {
          this.logger.log({
            type: ELogType.CREATION,
            message: `Requirement not met for particle creation: event '${event}' has not occurred`,
          });

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

          if (arg instanceof HawkingRadiation) {
            return arg.get();
          }

          return arg;
        })
      : [];

    try {
      this.logger.log({
        type: ELogType.CREATION,
        message: `Creating particle ${build.name} with arguments [${parsedArgs.join(',')}]`,
      });

      context.register(build, () => new (build as Particle)(...parsedArgs), {
        destroyOnInteraction,
        lifecycle,
      });

      const particle = new (build as Particle)(...parsedArgs);

      this.logger.log({
        message: `Particle ${build.name} were built with arguments [${parsedArgs.join(',')}]`,
        type: ELogType.CREATION,
      });

      if (then) {
        this.logger.log({
          message: `Executing 'then' callback for particle ${build.name}`,
          type: ELogType.INTERACTION,
        });

        Promise.resolve(particle).then((res) => then(res));
      }

      if (emit) {
        this.logger.log({
          message: `Emitting event '${emit}' with entanglement '${entanglement}' for particle ${build.name}`,
          type: ELogType.INTERACTION,
        });

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
  public addContract<TParticle, TArgs extends unknown[]>(
    contract: ParticleProperties<TParticle, TArgs>
  ): this {
    const { upon, once } = contract;
    const subscribeMethod = once ? 'once' : 'on';

    this.aether[subscribeMethod](upon, (boson: Boson) => {
      const { payload, entanglement } = boson;

      this.logger.log({
        type: ELogType.CREATION,
        message: `Event '${upon}' entangled to '${entanglement}' received payload: ${JSON.stringify(payload)}`,
      });

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
    TMethodName extends MethodKeys<TParticle>,
  >(interaction: Interaction<TParticle, TArgs, TMethodName>): this {
    this.interactions.push(interaction);

    const { upon, once } = interaction;
    const subscribeMethod = once ? 'once' : 'on';

    if (upon) {
      this.aether[subscribeMethod](upon, (boson: Boson) => {
        const { payload, entanglement } = boson;

        this.logger.log({
          type: ELogType.INTERACTION,
          message: `Event '${upon}' entangled to '${entanglement}' received payload: ${JSON.stringify(payload)}`,
        });

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
    TMethodName extends MethodKeys<TParticle>,
  >(event: string, entanglement: string) {
    const filteredInteractions = this.interactions.filter(
      (i) => i.upon === event && i.entanglement === entanglement
    );

    for (const interaction of filteredInteractions) {
      const { use: target } = interaction;
      let instance: undefined | TParticle;

      if (target instanceof Notation) {
        instance = this.horizon.query().using(target).get();
      } else if (target instanceof QuantumPointer) {
        instance = target.get();
      } else {
        instance = this.higgs.get<TParticle, unknown[]>(target);
      }

      if (!instance) {
        this.logger.log({
          type: ELogType.ERROR,
          message: `Could not resolve instance for target: ${JSON.stringify(target)}`,
        });
        throw new Error('Instance could not be resolved from target.');
      }

      this.interact<TParticle, TArgs, TMethodName>(interaction, instance);
    }
  }

  private interact<
    TParticle extends object,
    TArgs extends unknown[],
    TMethodName extends MethodKeys<TParticle>,
  >(interaction: Interaction<TParticle, TArgs, TMethodName>, instance: TParticle) {
    const {
      use: target,
      call,
      with: args,
      then,
      emit,
      errorHandler,
      upon,
      entanglement,
    } = interaction;
    const selectedErrorhandler = errorHandler ?? this.errorHandler;

    try {
      const _args: unknown[] = [];

      if (args) {
        for (const arg of args) {
          if (arg instanceof Notation) {
            _args.push(arg.getData(this.horizon.query().get()));
            continue;
          }

          if (arg instanceof HawkingRadiation) {
            _args.push(arg.get());
          }

          _args.push(arg);
        }
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const methodToCall = (instance as any)[call];

      if (typeof methodToCall === 'function') {
        this.logger.log({
          type: ELogType.INTERACTION,
          message: `Executing method '${String(call)}' on particle ${instance.constructor.name} with arguments [${_args.join(',')}]`,
        });

        const result = Promise.resolve(methodToCall.bind(instance)(..._args));

        this.logger.log({
          message: `Executed method '${String(call)}' on particle ${instance.constructor.name} with arguments [${_args.join(',')}]`,
          type: ELogType.INTERACTION,
        });

        result
          .then((res) => {
            if (then) {
              this.logger.log({
                message: `Executing 'then' callback for particle ${instance.constructor.name}`,
                type: ELogType.INTERACTION,
              });

              then(res);
            }
          })
          .catch((err) => {
            selectedErrorhandler?.handle(err, {
              rule: interaction,
              event: upon,
              eventArgs: _args,
            });
          });

        if (emit) {
          this.logger.log({
            message: `Emitting event '${emit}' with entanglement '${entanglement}' for particle ${instance.constructor.name}`,
            type: ELogType.INTERACTION,
          });

          this.aether.emit(emit, entanglement, result);
        }
      } else {
        const errDesc = `Method "${String(call)}" does not exist or is not a function on particle "${instance.constructor.name}".`;

        this.logger.log({
          type: ELogType.ERROR,
          message: errDesc,
        });

        throw new Error(errDesc);
      }

      if (!this.higgs.getParticleOptions(target as Particle)?.destroyOnInteraction) {
        this.higgs.destroy(target as Particle);

        this.logger.log({
          message: `Particle ${instance.constructor.name} destroyed`,
          type: ELogType.DESTRUCTION,
        });
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
