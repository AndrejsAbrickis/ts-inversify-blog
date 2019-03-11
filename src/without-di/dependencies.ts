export class DependencyA {
  private readonly name: string = "dependencyA";

  public getName(): string {
    return this.name;
  }
}

export class DependencyB {
  private readonly name: string = "dependencyB";

  public getName(): string {
    return this.name;
  }
}
