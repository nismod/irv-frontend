# Frontend for `infra-risk-vis`

React app served through NGINX.

## Installing dependencies for development

This package's dependencies include packages in the `@nismod` scope, which are
published through the GitHub npm package repository.

These packages are publicly available, but require a GitHub Personal Access
Token to install.

In order to install the project's dependencies:

- Create a [GitHub Personal Access Token
   (classic)][https://github.com/settings/tokens/new] with the `read:packages`
   permission selected. It's recommended to set an expiration date for the token
   and repeat this process when the token expires.

If using `npm` natively rather than in a docker container, then:

- Copy the token and instruct npm to [use it when authenticating to the GitHub
   registry][https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry#authenticating-with-a-personal-access-token].
   To do this on Linux:

   1. Create an `.npmrc` file if one doesn't already exist in your home directory (`~/.npmrc`)
   2. Place the following line in the file:

   ```
   //npm.pkg.github.com/:_authToken=TOKENHERE
   ```

- When you run `npm install` to install dependencies, things should already
   work. This repo contains an `.npmrc` file that specifies how packages should
   be accessed for the `@nismod` scope.

## Containers

See `./containers` for Docker configuration.

As described in the section above, the GitHub NPM registry auth token needs to
be available during build so that dependencies from the `@nismod` scope can be
installed.

The `Dockerfiles` are set up to accept a [Docker
secret](https://docs.docker.com/engine/swarm/secrets/) named `GH_TOKEN`. This
can be passed using a path to a local file that contains the token. For steps to
obtain a token, see the previous section.

Note that passing `--secret` during build is a [Docker
BuildKit](https://docs.docker.com/build/buildkit/) feature, hence the need to
install [docker buildx](https://github.com/docker/buildx) for building locally,
and to pass the `DOCKER_BUILDKIT=1` variable before the `docker build` command.

For example, to build and run the container (replace `/PATH/TO/TOKEN`, but not
`GH_TOKEN`):

```bash
DOCKER_BUILDKIT=1 docker build \
   --secret id=GH_TOKEN,src=/PATH/TO/TOKEN \
   -f containers/Dockerfile-dev \
   -t ghcr.io/nismod/irv-frontend:0.20-dev .

docker run -it -p 5173:5173 -v $(pwd)/src:/app/src ghcr.io/nismod/irv-frontend:0.20-dev
```

Then visit http://localhost:5173

N.B. The GitHub action will build images derived from `Dockerfile-prod` for
`main` and `develop` branches.

And to build and push an update to the container registry manually:

- Log in to the container registry, see
  https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry
- Build and push the production container (replace `/PATH/TO/TOKEN`)

```bash
DOCKER_BUILDKIT=1 docker build \
   --secret id=GH_TOKEN,src=/PATH/TO/TOKEN \
   -f containers/Dockerfile-prod \
   -t ghcr.io/nismod/irv-frontend:0.20 .

docker push ghcr.io/nismod/irv-frontend:0.20
```

See https://github.com/nismod/infra-risk-vis/ for `docker-compose.yml` and how
the frontend is composed with other services.

## License

This codebase is made available under the MIT License, copyright (c) 2023 Tom
Russell, Maciej Ziarkowski and contributors. See [./LICENSE](./LICENSE) for
details

## Acknowledgments

See https://github.com/nismod/infra-risk-vis/#acknowledgements
