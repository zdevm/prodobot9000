# Prodobot 9000

## License
Prodobot9000 code is released under MIT license.

## Providers & Extensions

For Prodobot to be functional, it must be connected to various price providers. This is accomplished by the extensions feature.

A price provider is nothing more than an http server that implements specified routes.

Extensions are json file that include information for providers.

**example-provider.json**
```
{
    "name": "Test Eshop Provider",
    "description": "Provides prices from 'Test Eshop'",
    "endpoint": "https://example.com:3000",
    "slug": "test-eshop-provider"
}
```

*More info about providers and extensions will be provided soon.*