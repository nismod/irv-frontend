# Frontend for `infra-risk-vis`

React app served through NGINX.

## Installing dependencies

This package's dependencies include packages in the `@nismod` scope, which are published through the GitHub npm package repository.

These packages are publicly available, but require a GitHub Personal Access Token to install.

In order to install the project's dependencies:

1. Create a [GitHub Personal Access Token (classic)](https://github.com/settings/tokens/new) with the `read:packages` permission selected. It's recommended to set an expiration date for the token and repeat this process when the token expires.
2. Copy the token and instruct npm to [use it when authenticating to the GitHub registry](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry#authenticating-with-a-personal-access-token). To do this on Linux:

   1. Create an `.npmrc` file if one doesn't already exist in your home directory (`~/.npmrc`)
   2. Place the following line in the file:

   ```
   //npm.pkg.github.com/:_authToken=TOKENHERE
   ```

3. When you run `npm install` to install dependencies, things should already work. This repo contains an `.npmrc` file that specifies how packages should be accessed for the `@nismod` scope.

## Containers

See `./containers` for Docker configuration.

For example, to build and run the container :

```bash
docker build -f containers/Dockerfile-dev -t ghcr.io/nismod/gri-web-server:0.19-dev .
docker run -p 8080:80 ghcr.io/nismod/gri-web-server:0.19-dev
```

Then visit http://localhost:8080

And to build and push an update to the container registry manually:

- Log in to the container registry, see https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry
- Build and push the production container

```bash
docker build -f containers/Dockerfile-prod -t ghcr.io/nismod/gri-web-server:0.19 .
docker push ghcr.io/nismod/gri-web-server:0.19
```

See https://github.com/nismod/infra-risk-vis/ for `docker-compose.yml` and how the frontend
is composed with other services.

## License

This codebase is made available under the MIT License, copyright (c) 2023 Tom
Russell, Maciej Ziarkowski and contributors. See [./LICENSE](./LICENSE) for details

## Acknowledgments

See https://github.com/nismod/infra-risk-vis/#acknowledgements
