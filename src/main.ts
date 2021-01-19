import "reflect-metadata";
import { Service } from "./service";
import DIContainer from "./di-container";
import { DependencyC } from "./dependencies";

const service: Service = DIContainer.resolve<Service>(Service);
const instanceOfC: DependencyC = DIContainer.resolve<DependencyC>(DependencyC);

console.log(service.getAllNames());
console.log(instanceOfC.getName());
