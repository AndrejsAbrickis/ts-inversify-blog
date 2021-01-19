import 'reflect-metadata';
import DIContainer from './di-container';
import { Service } from '../src/service';
import { DependencyC } from '../src/dependencies';

const service: Service = DIContainer.resolve<Service>(Service);

describe('injecting dependencies with inversify', () => {

  it('getAllNames()', () => {
    const names = service.getAllNames();
    expect(names).toEqual(['dependencyA mocked for tests!', 'dependencyB mocked for tests!']);
  })
});

describe('injecting dependency though a constructor of a injectable class', () => {
  const dependencyC: DependencyC = DIContainer.resolve<DependencyC>(DependencyC);

  it("should inject dependency in injectable class", () => {
    expect(dependencyC.getName()).toEqual("dependencyB mocked for tests!");
  });
});