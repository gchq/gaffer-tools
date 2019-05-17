import { TestBed, async} from '@angular/core/testing';
import { EventsService } from './events.service';
import { CommonService } from './common.service';

class CommonServiceStub {
    arrayContainsObject = () => {

    }
}

describe('EventsService', () => {
    let service: EventsService;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
          providers: [
            EventsService,
            { provide: CommonService, useClass: CommonServiceStub},
          ],
        })
        .compileComponents();

        service = TestBed.get(EventsService);
    }));

    it('should add a callback function not already added', () => {
        let eventName = 'test event name'
        let callback = () => { console.log('test callback function') }; 
        service.events = {};

        service.subscribe(eventName,callback);

        let result = service.events[eventName];
        expect(result).toBeTruthy();
    })

    it('should call all the callbacks of an event', () => {
        let testObject = {
            callback1 : () => { console.log('callback1') },
            callback2 : () => { console.log('callback2') }
        };
        let eventName = 'test event';
        let spy1 = spyOn(testObject, 'callback1')
        let spy2 = spyOn(testObject, 'callback2')
        service.events[eventName] = [testObject.callback1,testObject.callback2];

        service.broadcast(eventName,[]);

        expect(spy1).toHaveBeenCalled();
        expect(spy2).toHaveBeenCalled();
    })

    it('should unsubscribe a callback function from an event', () => {
        let eventName = 'test event';
        let callback = () => { console.log('callback1') }
        service.events[eventName] = [callback];

        service.unsubscribe(eventName, callback);

        let functions = service.events[eventName];
        expect(functions).not.toContain(callback)
    })
});