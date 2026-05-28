type AppBackHandler = () => boolean;

const handlers: AppBackHandler[] = [];

export function registerAppBackHandler(handler: AppBackHandler) {
  handlers.push(handler);

  return () => {
    const index = handlers.lastIndexOf(handler);
    if (index >= 0) {
      handlers.splice(index, 1);
    }
  };
}

export function consumeAppBackButton() {
  for (let index = handlers.length - 1; index >= 0; index -= 1) {
    if (handlers[index]()) {
      return true;
    }
  }

  return false;
}
