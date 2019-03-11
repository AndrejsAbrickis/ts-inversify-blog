import { Container, injectable } from 'inversify';
import { DependencyA, DependencyB } from '../src/dependencies';
import { Named } from '../src/types';

/** 
 * 
 * Here there are two ways to instruct the DI container to resolve
 * services:
 * either you use a class that implements the Named interface properly -MockA-, and then
 * use the interface as the container identifier:
 * DIContainer.bind<Named>(DependencyA).to(MockA);
 * (you don't actually need the `implements` keyword for this to work! If both the classes adhere
 * to the Named interface, inverisfy and typescript will resolve the dependencies properly :-D )
 * 
 * or you provide a class that actually extends the desired class -DependencyB-, so you can
 * just use the same class as the container identifier:
 * DIContainer.bind<DependencyB>(DependencyB).to(MockB);
 */

@injectable()
class MockA implements Named {
  public getName(): string {
      return 'dependencyA mocked for tests!';
  }
}

@injectable()
class MockB extends DependencyB {
    public getName(): string {
        return 'dependencyB mocked for tests!';
    }
}

var DIContainer = new Container();
DIContainer.bind<Named>(DependencyA).to(MockA);
DIContainer.bind<DependencyB>(DependencyB).to(MockB);

export default DIContainer;