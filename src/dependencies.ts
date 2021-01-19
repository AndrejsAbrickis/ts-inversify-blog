import { inject, injectable } from "inversify";
import { Named } from "./types";
@injectable()
export class DependencyA implements Named {
  private readonly name: string = "dependencyA";

  public getName(): string {
    return this.name;
  }
}

@injectable()
export class DependencyB implements Named {
  private readonly name: string = "dependencyB";

  public getName(): string {
    return this.name;
  }
}

@injectable()
export class DependencyC implements Named {
  private readonly name: string = "dependencyC";

  constructor(@inject(DependencyB) dependencyB: DependencyB) {
    this.name = dependencyB.getName();
  }

  public getName(): string {
    return this.name;
  }
}
