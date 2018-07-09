import 'reflect-metadata'
import { Service } from './service';
import DIContainer from './di-container';

const service: Service = DIContainer.resolve<Service>(Service);

console.log(service.getAllNames());