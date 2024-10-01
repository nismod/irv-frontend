# Frontend for `infra-risk-vis`

React app, frontend for https://global.infrastructureresilience.org/.

## Set up Husky

When running `npm install` in development, the `prepare` script should be run
automatically. This will set up the Husky git hooks. The `pre-commit` hook is
used to run linting and formatting on staged files using `lint-staged`.

## Install dependencies for development

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

  1.  Create an `.npmrc` file if one doesn't already exist in your home directory (`~/.npmrc`)
  2.  Place the following lines in the file:

  ```
  @nismod:registry=https://npm.pkg.github.com
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

For example, to build the container (replace `/PATH/TO/TOKEN`, but not
`GH_TOKEN`):

```bash
DOCKER_BUILDKIT=1 docker build \
   --secret id=GH_TOKEN,src=/PATH/TO/TOKEN \
   -f containers/Dockerfile-dev \
   -t ghcr.io/nismod/irv-frontend:0.27-dev .
```

To run:

```bash
docker run -it -p 5173:5173 -v $(pwd)/src:/app/src ghcr.io/nismod/irv-frontend:0.27-dev
```

Or to run inside an infra-risk-vis network (allowing DNS resolution for
connection to the backend services via the vite reverse proxy):

```bash
docker run -it -p 5173:5173 -v $(pwd)/src:/app/src --network infra-risk-vis_default ghcr.io/nismod/irv-frontend:0.27-dev
```

Then visit http://localhost:5173

## Release an update

The easiest way to make the updated code available is to push/merge to `main`,
then make a GitHub Release with a new tag, which will be used as the version number.

- test changes locally (`npm test`, and manual check)
- push/merge to `main`
- review logs since previous release `git log 0.26..HEAD`
- [Draft a new release](https://github.com/nismod/irv-frontend/releases)
- Choose a tag > create a new tag with new version, e.g. `0.27`
- summarise changes as lists of Features and Fixes
- Publish Release
- Wait for [Actions](https://github.com/nismod/irv-frontend/actions) to complete
- Update container image in [docker-compose.yml](https://github.com/nismod/infra-risk-vis/blob/master/docker-compose-prod-deploy.yaml)
- Restart service `docker compose -f docker-compose-prod-deploy.yaml up web-server -d`

Alternatively, to build and push an update to the container registry manually:

- Log in to the container registry, see
  https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry
- Build and push the production container
  - replace `/PATH/TO/TOKEN` with the path to a file containing GitHub personal
    access token with `write:packages` permissions)
  - replace `0.27` with the latest version number

```bash
DOCKER_BUILDKIT=1 docker build \
   --secret id=GH_TOKEN,src=/PATH/TO/TOKEN \
   -f containers/Dockerfile-prod \
   -t ghcr.io/nismod/irv-frontend:0.27 .

docker push ghcr.io/nismod/irv-frontend:0.27
```

See https://github.com/nismod/infra-risk-vis/ for `docker-compose.yml` and how
the frontend is composed with other services.

## Development

Developer-focussed documentation on the app and potential roadmap:

- [HOWTO](./docs/howto.md) - simple overview of the app structure, main
  concepts and some pointers on how to add new things
- [directions](./docs/directions.md) - detailed overview of the current folder
  hierarchy, and a list of refactoring directions and additions that could be
  made in the future
- [Deck.gl](./docs/deckgl.md) - some rationale and descriptions of the ways in
  which the app extends vanilla deck.gl behavior, especially the prop merging
- [comments](./docs/code-thoughts.md) - comments on what could be improved in
  individual files, if time and resource allow

## License

This codebase is made available under the MIT License, copyright (c) 2023 Tom
Russell, Maciej Ziarkowski and contributors. See [./LICENSE](./LICENSE) for
details

## Acknowledgments

See https://github.com/nismod/infra-risk-vis/#acknowledgements
