
type GenericArgs<
 AStrigType extends string, 
 ANumberType extends number, 
 ABooleanType extends boolean> = {
    aStringType: AStrigType, 
    aNumberType: ANumberType
    aBooleanType: ABooleanType
}

const aGenericFunction = <
  T extends string, 
  U extends number, 
  B extends boolean
 >(args: GenericArgs<T, U, B>): [T, U, B] => {
    return [args.aStringType, args.aNumberType, args.aBooleanType] as const
}

class Greeter {
    greeting: string
    
    constructor (val: string) {
        this.greeting = val
    }

    showGreeting() {
        console.log(this.greeting)
    }
}

class SpecialGreeter extends Greeter {
    constructor() {
        super("Very special greetings");
    }
}


// Example -----------------------------

const myGreeter = new Greeter("hello, world");
myGreeter.greeting = "howdy";
myGreeter.showGreeting();

// Tests -----------------------------

declare namespace GreetingLib {
    interface LogOptions {
        verbose?: boolean;
    }
    interface AlertOptions {
        modal: boolean;
        title?: string;
        color?: string;
    }
}
