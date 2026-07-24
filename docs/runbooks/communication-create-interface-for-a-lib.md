[🔙](../../README.md#runbooks)

# Communication: Create interface for a lib

Some '_ui_', '_feature_', or '_page_' libs prefer to have indirect communication via the Communication Service (a service in `shared-util-ng-services` lib), which is a lib that emits events for building communication between different components. The Communication Service can emit `any` type events (or store `any` type data), but it's always the best to specify the event/data interface when you wanna use it! So if your lib is going to initialize the Communication Service to whether emit an event (e.g., `this.cs.emitChange(payload);`), subscribe to an event (e.g., `this.cs.changeEmitted$.subscribe({value} => {};`), or store some small data (e.g., `this.cs.storedData = {...this.cs.storedData, extra};`), it should also create its own interface. Here are the steps to do so:

- Update `shared-util-ng-bases` lib:
  - Create your own lib's interface file beside `communication.interfaces.ts` file.  
    e.g., `communication-lib-auth.interfaces.ts`.  
    **Tip!** To name your lib's communication interface name, use `V{x}Communication_{Event,Data}_{YourLibType}_V{yourlibversionnum}_{YourLibName}` schema. For example, `V1Communication_Event_Page_V1_Auth`.
  - Update `communication.interfaces.ts` file to update the Event interface `value` property, or the Data interface `extra` property, according to your lib's newly added interface.

[🔙](../../README.md#runbooks)
