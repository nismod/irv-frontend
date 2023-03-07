# Frontend for `infra-risk-vis`

React app served through NGINX.

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
