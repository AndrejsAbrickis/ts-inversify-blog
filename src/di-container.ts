import { Container } from "inversify";
import { DependencyA, DependencyB } from "./dependencies";

var DIContainer = new Container();
DIContainer.bind<DependencyA>(DependencyA).toSelf();
DIContainer.bind<DependencyB>(DependencyB).toSelf();

export default DIContainer;
