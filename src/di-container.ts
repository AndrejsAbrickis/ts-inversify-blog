import { Container } from "inversify";
import { DependencyA, DependencyB, DependencyC } from "./dependencies";

var DIContainer = new Container();
DIContainer.bind<DependencyA>(DependencyA).toSelf();
DIContainer.bind<DependencyB>(DependencyB).toSelf();
DIContainer.bind<DependencyC>(DependencyC).toSelf();

export default DIContainer;
