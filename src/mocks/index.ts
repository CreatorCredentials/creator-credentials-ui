const IGNORED_PATHS = ['/api', '/_next', '/static'];

async function initMocks() {
  if (typeof window === 'undefined') {
    const { server } = await import('./server');
    server.listen();
  } else {
    const { worker } = await import('./browser');
    worker.start({
      onUnhandledRequest(req, print) {
        if (!IGNORED_PATHS.some((path) => req.url.pathname.includes(path))) {
          print.warning();
        }
      },
    });
  }
}

export { initMocks };
