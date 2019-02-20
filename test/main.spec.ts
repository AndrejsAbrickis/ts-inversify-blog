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