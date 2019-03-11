*Published 2018-07-09 on [Medium@andrejsAbrickis](https://medium.com/@andrejsabrickis/typescript-dependency-injection-setting-up-inversifyjs-ioc-for-a-ts-project-f25d48799d70)*

<hr>

# Typescript dependency injection: setting up InversifyJS IoC for a TS project

Rather than dealing with the manual creation of class dependencies each time we want to utilize a particular class. We could set up a mechanism which could create them for us and automatically provide the dependencies to the class. Such a mechanism is called an Inversion of Control (IoC) container and in this post, I would like to show how can you improve your TypeScript code by setting up a dependency container using InversifyJS.

## Project setup before the use of the dependency injection (DI)

I'm going to show you an example based on a node demo project which consists of a service class depending on two other classes, and the main TypeScript file which is utilizing this service. The structure of the project is like

```
src/
  dependencies.ts
  service.ts
  main.ts
``` 

And you can also see it on GitHub https://github.com/AndrejsAbrickis/ts-inversify-blog

### dependencies.ts
This TypeScript files exports two classes which behave the same. Both of them has a private field `name` representing the name of the class. And both has private method `getName()` which returns the name of the class.

![](https://raw.githubusercontent.com/AndrejsAbrickis/ts-inversify/master/images/dependencies-before-DI.png)

### service.ts
All that the service class is doing is returning an array of the dependencies names it is using. As we cannot directly access the readonly name field of the classes, we have to use the instance method `getName`. And to use the method, first we must instantiate the class classes using `new` keyword

![](https://raw.githubusercontent.com/AndrejsAbrickis/ts-inversify/master/images/service-before-DI.png)

### main.ts
When executed, the main file is 'new-up-ing' (manually creating a new instanceof a class) the service class, calling it's `getAllNames` method and logging the result of the method

![](https://raw.githubusercontent.com/AndrejsAbrickis/ts-inversify/master/images/main-before-DI.png)

As you saw, during the development we have used the `new` keyword for a few times. And this is just a trivial example of a service and two dependencies. Imagine to do this in a real life project with tens and hundreds of classes.

## Add inversify to the project
To implement DI in the project I'm going to use InversifyJS as the IoC (inversion of the control) container.

First we need to install `inversify` and `reflect-metadata` to the project
```
yarn add -D inversify reflect-metadata
```

Second: update the `tsconfig.json` by adding extra settings to `compilerOptions` section

![](https://raw.githubusercontent.com/AndrejsAbrickis/ts-inversify/master/images/tsconfig-after-DI.png)



## Project setup after the use of the dependency injection (DI)
After the InversifyJS is installed and TypeScript compiler is configured to support InversifyJS we can update our code.

### di-container.ts
Before we can enjoy the sweet fruits of dependency injection we have to configure our inversion of control (IoC) container. So the classes can resolve the their own dependencies from centralized container. 

We do this by creating a new inversify Container and providing it with the bindings of the classes. The bindings allows the container to map requested dependency with an instance of it. 

In this example we're using the `toSelf()` binding for classes `DependencyA` and `DependencyA`. Which tells the container that whenever a particular class is injected it should return an instance of requested class.

![](https://raw.githubusercontent.com/AndrejsAbrickis/ts-inversify/master/images/di-container.png)

### dependencies.ts
After the container is set up we can make our dependencies injectable by importing `injectable` decorator from inversify, and decorating classes with `@injectable` decorators. This decorator will be handled and applied to the JavaScript output using `reflect-metadata` package during TypeScript compilation.

![](https://raw.githubusercontent.com/AndrejsAbrickis/ts-inversify/master/images/dependencies-after-DI.png)

### service.ts
In the service class we can now get rid of the `new` keyword and inject the dependencies straight in class constructor by using `@inject` decorator.

![](https://raw.githubusercontent.com/AndrejsAbrickis/ts-inversify/master/images/service-after-DI.png)


```
@inject(DependencyA) dependencyA: DependencyA
```
The line above will retrieve the instance of DependencyA class from the IoC container and pass it to constructor's parameter `dependencyA`

### main.ts
First we have to add `import 'reflect-metadata'` which is required by inversify to apply `@inject()` and `@injectable()` decorators to the compiled output of the application.

After that we can import the container for our application, and the `new` keyword can be removed from the main.ts file by changing the `service` declaration to

```
const service: Service = DIContainer.resolve<Service>(Service);
```

After this we're no longer required to manually create `Service` class dependencies. The Container will do it for us when we will ask it to resolve the `Service`.

![](https://raw.githubusercontent.com/AndrejsAbrickis/ts-inversify/master/images/main-after-DI.png)

## Conclusion
Dependency injection is a pattern which removes the responsibility of manually creating class dependencies each time we want to use a particular class. Instead, we configure the Inversion of Control (IoC) container to do this for us. 

The main benefits I see in this pattern is that we can mock and substitute the concrete instance of dependency. Thus we can make it easier to write tests for our class behavior without the need to manually create all the dependencies. And by utilizing interfaces and IoC container we can make our code to be more extensible.

You can see both of the implementations befora DI and after DI on Github https://github.com/AndrejsAbrickis/ts-inversify-blog. To see the compiled TypeScript, clone the repo, run

```
yarn && yarn build
```

or

```
npm install && npm build
```

and see the ./dist directory for the output.

Cheers!

<hr>

## Updates
### Using mock implementations in tests

One of the more common uses for DI Containers is the ability to setup mocks in your test code. Maybe your service under test has a dependency on a module that performs HTTP request or do costly computation, so you need to instruct your test to use a double instead of the real service.

The idea is to declare another `Container` instance to be used in your tests, and there setup it in such a way that, instead of using the real services, we use the mocks as implementations for `DependencyA` and `DependencyB`:

```typescript
import { Container, injectable } from 'inversify';
import { DependencyA, DependencyB } from '../src/dependencies';
import { Named } from '../src/types';

/** 
 * 
 * Here there are two ways to instruct the DI container to resolve
 * services:
 * either you use a class that implements Named properly -MockA-, and then
 * use the interface as the container identifier:
 * DIContainer.bind<Named>(DependencyA).to(MockA);
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
```

Then, in the test code, we use the tests DIContainer to instantiate our `service` with the mocked dependencies, like:

```typescript
import 'reflect-metadata';
import DIContainer from './di-container';
import { Service } from '../src/service';

const service: Service = DIContainer.resolve<Service>(Service);

describe('injecting dependencies with inversify', () => {

  it('getAllNames()', () => {
    const names = service.getAllNames();
    expect(names).toEqual(['dependencyA mocked for tests!', 'dependencyB mocked for tests!']);
  })
});
```

To execute the tests, run the npm script:

`$ yarn test`